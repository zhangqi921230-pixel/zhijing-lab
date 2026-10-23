// @vitest-environment jsdom
import { expect, it, vi } from "vitest";
import * as T from "three";
import { buildCell } from "../src/CellModel.js";
import { cellCameraFov, cellCloseupCamera } from "../src/cellCamera.mjs";
import { fitCellCamera } from "../src/CellFraming.js";
import { cellViews } from "../src/cellNavigation.mjs";
import { disposeSceneResources } from "../src/disposeSceneResources.mjs";

it("细胞器预设在窄舞台和宽屏均容纳结构标签", () => {
  const context = new Proxy({}, { get: () => () => {}, set: () => true });
  const spy = vi
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockReturnValue(context);
  const root = new T.Group();
  try {
    buildCell(root, { part: 0, cut: 100 });
    for (let part = 1; part < cellViews.length; part++) {
      for (const angle of [0, 1, 2]) {
        root.userData.update({ part, cut: 100, cellAngle: angle });
        root.userData.setInspection(part);
        root.updateMatrixWorld(true);
        const preset = cellCloseupCamera(cellViews[part], angle);
        for (const aspect of [0.6, 1, 1.5, 2]) {
          const camera = new T.PerspectiveCamera(
            cellCameraFov(28, aspect),
            aspect,
            0.01,
            100,
          );
          camera.position.set(...preset.position);
          camera.lookAt(...preset.target);
          camera.updateMatrixWorld();
          fitCellCamera(camera, root);
          root.traverseVisible((o) => {
            if (!o.isSprite) return;
            const center = o
              .getWorldPosition(new T.Vector3())
              .applyMatrix4(camera.matrixWorldInverse);
            const size = o.getWorldScale(new T.Vector3());
            for (const dx of [-0.5, 0.5])
              for (const dy of [-0.5, 0.5]) {
                const point = center
                  .clone()
                  .add(new T.Vector3(dx * size.x, dy * size.y, 0))
                  .applyMatrix4(camera.projectionMatrix);
                expect(
                  Math.abs(point.x),
                  `${cellViews[part]} ${angle} ${aspect} ${o.name} x`,
                ).toBeLessThan(0.98);
                expect(
                  Math.abs(point.y),
                  `${cellViews[part]} ${angle} ${aspect} ${o.name} y`,
                ).toBeLessThan(0.98);
              }
          });
        }
      }
    }
  } finally {
    disposeSceneResources(root);
    spy.mockRestore();
  }
});
