import { it, expect } from "vitest";
import * as T from "three";
import { buildCell } from "../src/CellModel.js";
import { disposeSceneResources } from "../src/disposeSceneResources.mjs";

it("叶绿体从完整包膜进入代表剖面及分层，再恢复原有共享外形", () => {
  const root = new T.Group();
  buildCell(root, { part: 0, cut: 100 });
  try {
    const bodies = root.children.filter(
      (o) => o.name === "chloroplast-cutaway",
    );
    const first = bodies[0];
    const closed = first.getObjectByName("chloroplast-envelope").geometry;
    expect(closed.parameters.thetaLength).toBe(Math.PI);
    for (const body of bodies) {
      expect(body.children.filter((o) => o.visible).map((o) => o.name)).toEqual(
        ["chloroplast-envelope"],
      );
      expect(body.getObjectByName("chloroplast-envelope").geometry).toBe(
        closed,
      );
    }
    root.userData.update({ part: 3, cut: 100 });
    expect(first.getObjectByName("chloroplast-thylakoids").visible).toBe(true);
    for (const body of bodies.slice(1))
      expect(body.children.filter((o) => o.visible).map((o) => o.name)).toEqual(
        ["chloroplast-envelope"],
      );
    root.userData.setInspection(3);
    for (const mode of [1, 2, 0]) {
      root.userData.update({ part: 3, cut: 100, chloroplastMode: mode });
      expect(first.getObjectByName("chloroplast-envelope").visible).toBe(
        mode !== 1,
      );
      expect(first.getObjectByName("chloroplast-thylakoids").visible).toBe(
        mode !== 2,
      );
    }
    root.userData.setInspection(0);
    root.userData.update({ part: 0, cut: 100 });
    expect(first.getObjectByName("chloroplast-envelope").geometry).toBe(closed);
    expect(first.children.filter((o) => o.visible).map((o) => o.name)).toEqual([
      "chloroplast-envelope",
    ]);
  } finally {
    disposeSceneResources(root);
  }
});
