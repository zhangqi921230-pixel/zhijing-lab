import { expect, it } from "vitest";
import * as THREE from "three";
import {
  crystalHull,
  verticalContact,
  settleCrystal,
} from "../src/CrystalContact.js";
import { addSolutionCrystals } from "../src/SolutionCrystals.js";

it("matches the analytic vertical contact interval for two cubes", () => {
  const geometry = new THREE.BoxGeometry(2, 2, 2).toNonIndexed();
  const a = crystalHull(geometry, new THREE.Matrix4());
  const b = crystalHull(geometry, new THREE.Matrix4().makeTranslation(0, 3, 0));
  expect(verticalContact(a, b)).toEqual({ low: 1, high: 5 });
  expect(
    verticalContact(
      a,
      crystalHull(geometry, new THREE.Matrix4().makeTranslation(3, 0, 0)),
    ),
  ).toBeNull();
  const matrix = new THREE.Matrix4();
  settleCrystal(geometry, matrix, [b]);
  expect(matrix.elements[13]).toBe(5);
  geometry.dispose();
});

it("every packed crystal rests on the floor or an earlier solid without intersecting it", () => {
  const root = new THREE.Group(),
    update = addSolutionCrystals(root);
  const mesh = root.getObjectByName("solubility-crystals");
  for (const mass of [180, 72.15]) {
    update(mass);
    const hulls = [];
    for (let i = 0; i < mesh.count; i++) {
      const matrix = new THREE.Matrix4();
      mesh.getMatrixAt(i, matrix);
      const hull = crystalHull(mesh.geometry, matrix);
      let supported = Math.abs(hull.bounds.min.y - 0.074) < 1e-6;
      for (const previous of hulls) {
        const contact = verticalContact(hull, previous);
        if (!contact) continue;
        expect(contact.low > -1e-6 || contact.high < 1e-6).toBe(true);
        if (Math.abs(contact.high) < 1e-6) supported = true;
      }
      expect(supported).toBe(true);
      hulls.push(hull);
    }
    expect(Math.max(...hulls.map((h) => h.bounds.max.y))).toBeLessThan(1.6);
  }
  mesh.geometry.dispose();
  mesh.material.dispose();
});
