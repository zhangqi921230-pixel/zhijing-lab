import { expect, it } from "vitest";
import * as THREE from "three";
import {
  cellBoundaryStrip,
  envelopePoint,
  cellCytoplasmFrontGeometry,
  cellEnvelopeGeometry,
} from "../src/CellEnvelope.js";
import { buildCell } from "../src/CellModel.js";

it("toggles every inspection label without hiding anatomy or rebuilding meshes", () => {
  const root = new THREE.Group();
  buildCell(root, { cut: 100, part: 0, labels: 1 });
  const names = [
    "cell-boundary-labels",
    "nucleus-labels",
    "vacuole-labels",
    "chloroplast-labels",
    "mitochondrion-labels",
    "golgi-labels",
    "er-labels",
  ];
  const membrane = root.getObjectByName("cell-membrane-cut-edge");
  for (let part = 0; part <= 6; part++) {
    root.userData.setInspection(part);
    root.userData.update({ cut: 100, part, labels: 1 });
    const label = root.getObjectByName(names[part]);
    expect(label.visible).toBe(true);
    const visibleMeshes = [];
    root.traverse((o) => {
      if (o.isMesh && !o.isSprite && o.visible) visibleMeshes.push(o);
    });
    root.userData.update({ cut: 100, part, labels: 0 });
    for (const name of names)
      expect(root.getObjectByName(name).visible).toBe(false);
    for (const mesh of visibleMeshes) expect(mesh.visible).toBe(true);
    root.userData.update({ cut: 100, part, labels: 1 });
    expect(label.visible).toBe(true);
  }
  expect(root.getObjectByName("cell-membrane-cut-edge")).toBe(membrane);
});

it("joins cut bands to the exact envelope curve with nested layers and finite normals", () => {
  const geometry = cellBoundaryStrip(1, 0.981);
  const p = geometry.attributes.position;
  for (let i = 0; i <= 80; i++) {
    const phi = Math.PI + (i * Math.PI) / 80;
    const expected = envelopePoint(-Math.cos(phi), 0, Math.sin(phi));
    for (let axis = 0; axis < 3; axis++)
      expect(p.array[i * 6 + axis]).toBeCloseTo(expected[axis], 5);
    expect(Math.hypot(p.getX(i * 2), p.getZ(i * 2))).toBeGreaterThan(
      Math.hypot(p.getX(i * 2 + 1), p.getZ(i * 2 + 1)),
    );
  }
  expect([...geometry.attributes.normal.array].every(Number.isFinite)).toBe(
    true,
  );
});

it("shows boundary annotations only in an open cell overview and reuses geometry", () => {
  const root = new THREE.Group();
  buildCell(root, { cut: 100, part: 0 });
  const layers = root.getObjectByName("cell-boundary-layers");
  const geometry = root.getObjectByName("cell-membrane-cut-edge").geometry;
  expect(layers.visible).toBe(true);
  root.userData.setInspection(3);
  expect(layers.visible).toBe(false);
  root.userData.setInspection(0);
  expect(layers.visible).toBe(true);
  root.userData.update({ cut: 0, part: 0 });
  expect(layers.visible).toBe(false);
  root.userData.update({ cut: 100, part: 1 });
  expect(layers.visible).toBe(false);
  expect(root.getObjectByName("cell-membrane-cut-edge").geometry).toBe(
    geometry,
  );
});

it("joins the lowered front cutaway to both rear seams without a silhouette step", () => {
  const front = cellCytoplasmFrontGeometry();
  const rear = cellEnvelopeGeometry(
    Math.PI,
    Math.PI,
    Math.PI / 2,
    Math.PI / 2,
    0.965,
  );
  const a = front.attributes.position,
    b = rear.attributes.position;
  for (let row = 0; row < 36; row++) {
    for (const [frontColumn, rearColumn] of [
      [0, 80],
      [80, 0],
    ]) {
      const p = new THREE.Vector3().fromBufferAttribute(
        a,
        row * 81 + frontColumn,
      );
      const q = new THREE.Vector3().fromBufferAttribute(
        b,
        row * 81 + rearColumn,
      );
      expect(p.distanceTo(q)).toBeLessThan(1e-5);
    }
  }
  expect(a.getY(40)).toBeLessThan(a.getY(0));
  expect([...front.attributes.normal.array].every(Number.isFinite)).toBe(true);
  front.dispose();
  rear.dispose();
});
