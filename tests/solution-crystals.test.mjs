import { expect, it } from "vitest";
import * as THREE from "three";
import { addSolutionCrystals } from "../src/SolutionCrystals.js";

it("keeps crystals inside the vessel and first-layer bottoms above the glass", () => {
  const parent = new THREE.Group(),
    update = addSolutionCrystals(parent);
  update(180);
  const mesh = parent.getObjectByName("solubility-crystals"),
    matrix = new THREE.Matrix4(),
    point = new THREE.Vector3(),
    vertices = mesh.geometry.getAttribute("position");
  let minY = Infinity,
    maxRadius = 0;
  for (let i = 0; i < mesh.count; i++) {
    mesh.getMatrixAt(i, matrix);
    for (let v = 0; v < vertices.count; v++) {
      point.fromBufferAttribute(vertices, v).applyMatrix4(matrix);
      minY = Math.min(minY, point.y);
      maxRadius = Math.max(maxRadius, Math.hypot(point.x, point.z));
    }
  }
  expect(minY).toBeGreaterThan(0.07);
  expect(maxRadius).toBeLessThan(0.79);
});
it("scales a fractional final crystal continuously and restores it without rebuilding", () => {
  const parent = new THREE.Group(),
    update = addSolutionCrystals(parent),
    matrix = new THREE.Matrix4();
  const mesh = parent.getObjectByName("solubility-crystals"),
    geometry = mesh.geometry;
  update(0.45);
  mesh.getMatrixAt(0, matrix);
  const full = matrix.determinant();
  update(0.225);
  mesh.getMatrixAt(0, matrix);
  expect(mesh.count).toBe(1);
  expect(matrix.determinant() / full).toBeCloseTo(0.5);
  update(0.9);
  mesh.getMatrixAt(0, matrix);
  expect(matrix.determinant()).toBeCloseTo(full);
  expect(mesh.count).toBe(2);
  expect(mesh.geometry).toBe(geometry);
  update(0);
  expect(mesh.count).toBe(0);
  const version = mesh.instanceMatrix.version;
  update(0);
  expect(mesh.instanceMatrix.version).toBe(version);
});
