import { expect, it } from "vitest";
import * as THREE from "three";
import { addTitrationDrops } from "../src/TitrationDrops.js";

it("reuses a bounded drop pool and drains to rest without crossing the surface", () => {
  const root = new THREE.Group(),
    flow = addTitrationDrops(root);
  const mesh = root.getObjectByName("titration-drops"),
    geometry = mesh.geometry;
  const matrix = new THREE.Matrix4();
  flow.setState(true, 0.8);
  for (let now = 0; now < 2000; now += 16) {
    expect(flow.animate(now)).toBe(true);
    expect(mesh.count).toBeLessThanOrEqual(9);
    for (let i = 0; i < mesh.count; i++) {
      mesh.getMatrixAt(i, matrix);
      expect(matrix.elements[13] - 0.045).toBeGreaterThan(0.8);
      expect(matrix.elements[13]).toBeLessThanOrEqual(2.18 + 1e-6);
    }
  }
  flow.setState(false, 0.8);
  for (let now = 2000; now < 3000; now += 16) flow.animate(now);
  expect(flow.animate(3000)).toBe(false);
  expect(mesh.count).toBe(0);
  expect(mesh.geometry).toBe(geometry);
  const version = mesh.instanceMatrix.version;
  flow.animate(3016);
  expect(mesh.instanceMatrix.version).toBe(version);
});

it("suppresses decorative motion for reduced motion and at an empty burette", async () => {
  const root = new THREE.Group(),
    flow = addTitrationDrops(root);
  flow.setState(true, 0);
  flow.animate(0);
  expect(flow.animate(16, true)).toBe(false);
  expect(root.getObjectByName("titration-drops").count).toBe(0);
  const { buildTitrationLab } = await import("../src/TitrationLab.js");
  const lab = new THREE.Group();
  buildTitrationLab(lab, { acid: 50, base: 100, c: 0.1, dosing: true });
  expect(lab.userData.animate(0)).toBe(false);
  expect(lab.getObjectByName("titration-drops").count).toBe(0);
});

it("grows a pendant at the nozzle before detaching without allocating another draw", () => {
  const root = new THREE.Group(),
    flow = addTitrationDrops(root);
  const mesh = root.getObjectByName("titration-drops");
  const matrix = new THREE.Matrix4(),
    scale = new THREE.Vector3();
  flow.setState(true, 0.8);
  flow.animate(0);
  expect(mesh.count).toBe(0);
  for (const now of [25, 50, 75]) {
    flow.animate(now);
    expect(mesh.count).toBe(1);
    mesh.getMatrixAt(0, matrix);
    scale.setFromMatrixScale(matrix);
    expect(scale.x ** 3).toBeCloseTo(now / 100, 6);
    expect(matrix.elements[13] + 0.034 * scale.y).toBeCloseTo(2.18, 6);
  }
  flow.animate(100);
  expect(mesh.count).toBe(1);
  mesh.getMatrixAt(0, matrix);
  scale.setFromMatrixScale(matrix);
  expect(scale.x).toBeCloseTo(1);
  expect(matrix.elements[13] + 0.034 * scale.y).toBeCloseTo(2.18, 6);
  flow.animate(125);
  expect(mesh.count).toBe(2);
  mesh.getMatrixAt(0, matrix);
  expect(matrix.elements[13] + 0.034 * scale.y).toBeLessThan(2.18);
  expect(root.children.filter((o) => o.isMesh)).toHaveLength(1);
});
