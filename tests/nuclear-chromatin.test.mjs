import { it, expect } from "vitest";
import * as T from "three";
import {
  buildNuclearChromatin,
  nucleusCenter,
  nucleolusCenter,
} from "../src/NuclearChromatin.js";
it("confines folded chromatin within the nucleus and outside the nucleolus, using one draw object", () => {
  const mesh = buildNuclearChromatin(),
    positions = mesh.geometry.attributes.position;
  expect(mesh.isMesh).toBe(true);
  expect(mesh.children).toHaveLength(0);
  const p = new T.Vector3();
  for (let i = 0; i < positions.count; i++) {
    p.fromBufferAttribute(positions, i);
    expect(
      ((p.x - nucleusCenter.x) / 0.55) ** 2 +
        ((p.y - nucleusCenter.y) / 0.506) ** 2 +
        ((p.z - nucleusCenter.z) / 0.55) ** 2,
    ).toBeLessThan(1);
    expect(p.distanceTo(nucleolusCenter)).toBeGreaterThan(0.135);
  }
  expect(mesh.geometry.index.count / 3).toBeLessThan(40000);
});

it("models nuclear pores as open membrane geometry rather than painted beads", async () => {
  const { buildCell } = await import("../src/CellModel.js");
  const root = new T.Group();
  buildCell(root, { cut: 100, part: 1 });
  root.updateMatrixWorld(true);
  const membrane = root.getObjectByName("cell-nucleus"),
    pores = root.getObjectByName("nuclear-pores");
  const matrix = new T.Matrix4(),
    center = new T.Vector3(),
    normal = new T.Vector3();
  for (let i = 0; i < pores.count; i++) {
    pores.getMatrixAt(i, matrix);
    center.setFromMatrixPosition(matrix);
    normal.setFromMatrixColumn(matrix, 2).normalize();
    const origin = center.clone().addScaledVector(normal, 0.15);
    const hits = new T.Raycaster(
      origin,
      normal.clone().negate(),
      0,
      0.19,
    ).intersectObject(membrane);
    expect(hits).toHaveLength(0);
  }
});

it("reuses nuclear annotations across inspection changes and hides them in overview", async () => {
  const { buildCell } = await import("../src/CellModel.js");
  const root = new T.Group();
  buildCell(root, { cut: 100, part: 1 });
  const labels = root.getObjectByName("nucleus-labels");
  const geometry = labels.children[0].geometry;
  expect(labels.children.map((child) => child.name)).toEqual([
    "核膜",
    "核孔",
    "染色质",
    "核仁",
  ]);
  expect(labels.visible).toBe(false);
  root.userData.setInspection(1);
  expect(labels.visible).toBe(true);
  root.userData.setInspection(3);
  expect(labels.visible).toBe(false);
  root.userData.setInspection(0);
  expect(labels.visible).toBe(false);
  root.userData.setInspection(1);
  expect(labels.children[0].geometry).toBe(geometry);
  expect(labels.visible).toBe(true);
});
