import { it, expect } from "vitest";
import * as T from "three";
import { buildCell } from "../src/CellModel.js";
import { disposeSceneResources } from "../src/disposeSceneResources.mjs";
it("shares cached low-detail pores in overview and restores detailed inner and outer rings", () => {
  const root = new T.Group();
  buildCell(root, { part: 0, cut: 100 });
  const outer = root.getObjectByName("nuclear-pores"),
    inner = root.getObjectByName("nuclear-inner-pore-rims");
  const low = outer.geometry;
  expect(inner.geometry).toBe(low);
  root.userData.setInspection(1);
  const high = outer.geometry;
  expect(high.index.count).toBe(low.index.count * 3);
  expect(inner.geometry).toBe(high);
  for (let i = 0; i < 3; i++) {
    root.userData.setInspection(0);
    expect(outer.geometry).toBe(low);
    expect(inner.geometry).toBe(low);
    root.userData.setInspection(1);
    expect(outer.geometry).toBe(high);
    expect(inner.geometry).toBe(high);
  }
  disposeSceneResources(root);
});
