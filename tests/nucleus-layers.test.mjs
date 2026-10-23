// @vitest-environment jsdom
import { expect, it, vi } from "vitest";
import * as T from "three";
import { buildCell } from "../src/CellModel.js";
import { disposeSceneResources } from "../src/disposeSceneResources.mjs";

it("switches nuclear layers and their text/leader pairs without rebuilding or affecting overview", () => {
  const context = new Proxy(
    {},
    { get: (o, k) => o[k] ?? (() => {}), set: (o, k, v) => ((o[k] = v), true) },
  );
  const mock = vi
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockReturnValue(context);
  const root = new T.Group();
  try {
    buildCell(root, { part: 1, cut: 100, labels: 1 });
    root.userData.setInspection(1);
    const names = [
      "cell-nucleus",
      "nuclear-pores",
      "cell-nucleolus",
      "cell-chromatin",
    ];
    const objects = names.map((n) => root.getObjectByName(n));
    for (const mode of [1, 2, 0, 2]) {
      root.userData.update({ part: 1, cut: 100, labels: 1, nucleusMode: mode });
      names.forEach((name, i) => {
        expect(root.getObjectByName(name)).toBe(objects[i]);
        expect(objects[i].visible).toBe(
          mode === 0 || (mode === 1 ? i < 2 : i >= 2),
        );
      });
      for (const label of root.getObjectByName("nucleus-labels").children) {
        const membrane = ["核膜", "核孔"].includes(label.name);
        expect(label.visible).toBe(
          mode === 0 || (mode === 1 ? membrane : !membrane),
        );
      }
    }
    root.userData.update({ part: 1, cut: 100, labels: 0, nucleusMode: 2 });
    expect(root.getObjectByName("nucleus-labels").visible).toBe(false);
    root.userData.setInspection(0);
    expect(objects.every((o) => o.visible)).toBe(true);
    disposeSceneResources(root);
  } finally {
    mock.mockRestore();
  }
});
