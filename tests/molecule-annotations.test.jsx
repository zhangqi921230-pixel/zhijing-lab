import { it, expect } from "vitest";
import * as THREE from "three";
import { bondAngleGeometry } from "../src/MoleculeAnnotations.js";
import { buildScene } from "../src/ThreeScene.jsx";
import { moleculeGeometry, molecules } from "../src/moleculeGeometry.mjs";
it("constructs equal ammonia bonds and all three measured H-N-H angles", () => {
  for (const spread of [0.8, 1, 1.4]) {
    const { points } = moleculeGeometry(3, spread);
    for (let i = 1; i < 4; i++) {
      expect(new THREE.Vector3(...points[i]).length()).toBeCloseTo(
        1.7 * spread,
        10,
      );
      for (let j = i + 1; j < 4; j++) {
        expect(
          bondAngleGeometry([points[0], points[i], points[j]], 0.72).degrees,
        ).toBeCloseTo(107.3, 10);
      }
    }
    expect(points[1][1]).toBeLessThan(points[0][1]);
    expect(points[1][1]).toBe(points[2][1]);
    expect(points[2][1]).toBe(points[3][1]);
  }
  for (let type = 0; type < 4; type++) {
    const { points } = moleculeGeometry(type);
    expect(bondAngleGeometry(points, 0.72).degrees).toBeCloseTo(
      molecules[type].angle,
      10,
    );
  }
});
it("switches geometric guides without rebuilding and hides them in ensembles", () => {
  const root = new THREE.Group();
  const p = { type: 3, spread: 1, ensemble: 0, scaffold: 1, annotations: 1 };
  buildScene(root, "molecule", p);
  const scaffold = root.getObjectByName("molecule-scaffold");
  const geometry = scaffold.children[0].geometry;
  expect(scaffold.visible).toBe(true);
  root.userData.update({ ...p, scaffold: 0 });
  expect(scaffold.visible).toBe(false);
  root.userData.update({ ...p, ensemble: 1 });
  expect(scaffold.visible).toBe(false);
  root.userData.update(p);
  expect(scaffold.visible).toBe(true);
  expect(scaffold.children[0].geometry).toBe(geometry);
});
it("measures bond angles from the actual three-dimensional vectors", () => {
  const a = (104.5 * Math.PI) / 360;
  for (const [points, angle] of [
    [
      [
        [0, 0, 0],
        [Math.sin(a), Math.cos(a), 0],
        [-Math.sin(a), Math.cos(a), 0],
      ],
      104.5,
    ],
    [
      [
        [0, 0, 0],
        [-2, 0, 0],
        [2, 0, 0],
      ],
      180,
    ],
    [
      [
        [0, 0, 0],
        [1, 1, 1],
        [-1, -1, 1],
      ],
      (Math.acos(-1 / 3) * 180) / Math.PI,
    ],
  ]) {
    const result = bondAngleGeometry(points, 0.72);
    expect(result.degrees).toBeCloseTo(angle, 10);
    for (const p of result.points) expect(p.length()).toBeCloseTo(0.72, 10);
    expect(
      result.points[0]
        .clone()
        .normalize()
        .dot(new THREE.Vector3(...points[1]).normalize()),
    ).toBeCloseTo(1, 10);
    expect(
      result.points
        .at(-1)
        .clone()
        .normalize()
        .dot(new THREE.Vector3(...points[2]).normalize()),
    ).toBeCloseTo(1, 10);
  }
});
it("hides single-molecule annotations in ensembles without rebuilding the model", () => {
  const root = new THREE.Group(),
    p = { type: 0, spread: 1, ensemble: 0, annotations: 1, time: 0 };
  buildScene(root, "molecule", p);
  const group = root.getObjectByName("molecule-annotations");
  root.userData.update({ ...p, ensemble: 1 });
  expect(group.visible).toBe(false);
  root.userData.update({ ...p, annotations: 0 });
  expect(group.visible).toBe(false);
  root.userData.update({ ...p, time: 4 });
  expect(group.visible).toBe(true);
  expect(root.getObjectByName("molecule-annotations")).toBe(group);
});
