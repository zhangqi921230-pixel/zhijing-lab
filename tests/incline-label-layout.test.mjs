import { expect, it, vi } from "vitest";
import * as T from "three";
import { addInclineForceLabels } from "../src/InclineForceLabels.js";

it("packs rotating force labels while retaining tip anchors and sleeping on an unchanged view", () => {
  vi.stubGlobal("document", {
    createElement: () => ({
      width: 0,
      height: 0,
      getContext: () => ({ fillRect() {}, fillText() {} }),
    }),
  });
  try {
    const root = new T.Group(),
      update = addInclineForceLabels(root);
    const arrows = Array.from({ length: 4 }, (_, i) => {
      const a = new T.Group();
      a.position.set(0, 0, 0.49);
      a.scale.y = 0.2 + i * 0.1;
      a.quaternion.setFromUnitVectors(
        new T.Vector3(0, 1, 0),
        new T.Vector3(-1, 0.5, 0).normalize(),
      );
      return a;
    });
    update(arrows);
    const camera = new T.PerspectiveCamera(40, 1.6, 0.1, 100);
    for (const angle of [0, 0.7, 1.5, 2.4, 0]) {
      camera.position.set(Math.sin(angle) * 6, 2, Math.cos(angle) * 6);
      camera.lookAt(0, 0, 0);
      root.userData.beforeRender(camera);
      root.updateMatrixWorld(true);
      const projected = [];
      root.children.forEach((g, i) => {
        const line = g.children.find((o) => o.isLine),
          sprite = g.children.find((o) => o.isSprite);
        const start = new T.Vector3().fromBufferAttribute(
          line.geometry.attributes.position,
          0,
        );
        const expected = new T.Vector3(0, arrows[i].scale.y, 0).applyQuaternion(
          arrows[i].quaternion,
        );
        expect(start.distanceTo(expected)).toBeLessThan(1e-6);
        const world = sprite.getWorldPosition(new T.Vector3());
        const depth = -world.clone().applyMatrix4(camera.matrixWorldInverse).z;
        const ndc = world.project(camera),
          factor = camera.projectionMatrix.elements[5] / depth;
        projected.push({
          x: ndc.x,
          y: ndc.y,
          w: (sprite.scale.x * factor) / camera.aspect,
          h: sprite.scale.y * factor,
        });
        expect(sprite.scale.y * factor).toBeLessThanOrEqual(0.080001);
        const version = line.geometry.attributes.position.version;
        root.userData.beforeRender(camera);
        expect(line.geometry.attributes.position.version).toBe(version);
      });
      for (let i = 0; i < 4; i++)
        for (let j = i + 1; j < 4; j++) {
          const a = projected[i],
            b = projected[j];
          expect(
            Math.abs(a.x - b.x) >= (a.w + b.w) / 2 ||
              Math.abs(a.y - b.y) >= (a.h + b.h) / 2,
          ).toBe(true);
        }
    }
  } finally {
    vi.unstubAllGlobals();
  }
});
