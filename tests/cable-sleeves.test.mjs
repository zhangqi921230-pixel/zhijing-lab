import { it, expect } from "vitest";
import * as THREE from "three";
import { addCableSleeves } from "../src/CableSleeves.js";
it("merges both sleeves around existing cable endpoints and tapers to cable radius", () => {
  const root = new THREE.Group(),
    curve = new THREE.LineCurve3(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(2, 0, 0),
    );
  const wire = new THREE.Mesh(
    new THREE.TubeGeometry(curve, 16, 0.032, 8),
    new THREE.MeshStandardMaterial(),
  );
  wire.userData.originalColor = new THREE.Color("#cc4433");
  const sleeve = addCableSleeves(root, [wire]),
    positions = sleeve.geometry.attributes.position;
  expect(sleeve.userData.sleeveCount).toBe(2);
  expect(root.children).toHaveLength(1);
  let tipVertices = 0;
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    expect(
      (x >= -1e-6 && x <= 0.180001) || (x >= 1.819999 && x <= 2.000001),
    ).toBe(true);
    const radius = Math.hypot(positions.getY(i), positions.getZ(i));
    expect(radius).toBeLessThan(0.067);
    expect(radius).toBeGreaterThan(0.031);
    if (Math.abs(x - 0.18) < 1e-6 || Math.abs(x - 1.82) < 1e-6) {
      expect(radius).toBeCloseTo(0.032, 5);
      tipVertices++;
    }
  }
  expect(tipVertices).toBeGreaterThan(0);
  expect(sleeve.geometry.groups).toHaveLength(0);
  expect(wire.geometry.parameters.path).toBe(curve);
});
