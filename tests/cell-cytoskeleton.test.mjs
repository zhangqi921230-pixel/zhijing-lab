import { it, expect } from "vitest";
import * as T from "three";
import { buildCell } from "../src/CellModel.js";
import { corticalPaths } from "../src/CellCytoskeleton.js";
import { disposeSceneResources } from "../src/disposeSceneResources.mjs";
import { cellObservation } from "../src/cellNavigation.mjs";
it("keeps cortical fibres out of the vacuole and reuses two merged meshes through inspection changes", () => {
  for (const kind of ["microtubules", "actin"])
    for (const path of corticalPaths(kind))
      for (const p of path) {
        const vac =
          ((p.x - 0.55) / 1.224) ** 2 +
          ((p.y + 0.12) / 0.7446) ** 2 +
          (p.z / 1.02) ** 2;
        expect(vac).toBeGreaterThan(1.05);
        expect(p.y).toBeLessThan(0);
      }
  const root = new T.Group();
  buildCell(root, { part: 0, cut: 100, cytoskeleton: 0 });
  const group = root.getObjectByName("cell-cytoskeleton");
  const geometry = group.children.map((o) => o.geometry);
  try {
    for (const mode of [1, 2, 3, 0]) {
      root.userData.update({ part: 0, cut: 100, cytoskeleton: mode });
      expect(group.visible).toBe(mode > 0);
      expect(group.children[0].visible).toBe(mode === 1 || mode === 3);
      expect(group.children[1].visible).toBe(mode === 2 || mode === 3);
      expect(group.children.map((o) => o.geometry)).toEqual(geometry);
    }
    root.userData.update({ part: 0, cut: 100, cytoskeleton: 3 });
    root.userData.setInspection(1);
    expect(group.visible).toBe(false);
    root.userData.setInspection(0);
    expect(group.visible).toBe(true);
    expect(cellObservation({ chapter: 7, view: "perspective" }, 0)).toEqual({
      chapter: 7,
      view: "perspective",
    });
  } finally {
    disposeSceneResources(root);
  }
});
