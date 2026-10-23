import { expect, it } from "vitest";
import * as T from "three";
import { synthaseSites } from "../src/MitochondrialSynthase.js";
import { buildCell } from "../src/CellModel.js";

it("keeps paired membrane anchors and matrix-facing heads within the cutaway", () => {
  const sites = synthaseSites();
  expect(sites).toHaveLength(42);
  for (const { point, normal } of sites) {
    expect(normal.length()).toBeCloseTo(1);
    expect(normal.y).toBeGreaterThan(0);
    const head = point.clone().addScaledVector(normal, 0.0075);
    expect(head.y + 0.0034).toBeLessThan(0);
    expect(
      (head.x / 0.252) ** 2 + (head.y / 0.098) ** 2 + (head.z / 0.127) ** 2,
    ).toBeLessThan(1);
  }
});

it("shows complexes with cristae only in closeup and reuses the instance buffers", () => {
  const root = new T.Group();
  buildCell(root, { part: 4, cut: 100 });
  const group = root.getObjectByName("mitochondrion-atp-synthase");
  const buffers = group.children.map((o) => o.instanceMatrix);
  expect(group.visible).toBe(false);
  root.userData.setInspection(4);
  expect(group.visible).toBe(true);
  for (const mode of [2, 1, 3, 0]) {
    root.userData.update({ part: 4, cut: 100, mitochondrionMode: mode });
    expect(group.visible).toBe(mode !== 2 && mode !== 3);
    expect(group.children.map((o) => o.instanceMatrix)).toEqual(buffers);
  }
  root.userData.setInspection(0);
  expect(group.visible).toBe(false);
});
