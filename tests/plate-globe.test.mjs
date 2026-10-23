import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import { globePoint, boundarySegments } from "../src/plateGlobeGeometry.mjs";
import * as THREE from "three";

const data = JSON.parse(
  readFileSync(
    new URL("../public/data/tectonics/PB2002_boundaries.json", import.meta.url),
  ),
);
it("places east to the screen right with north up and closes the date-line seam", () => {
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 30);
  camera.position.set(5.6, 0, 0);
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld();
  expect(
    new THREE.Vector3(...globePoint(20, 0)).project(camera).x,
  ).toBeGreaterThan(0);
  expect(
    new THREE.Vector3(...globePoint(-20, 0)).project(camera).x,
  ).toBeLessThan(0);
  expect(
    new THREE.Vector3(...globePoint(0, 20)).project(camera).y,
  ).toBeGreaterThan(0);
  expect(
    new THREE.Vector3(...globePoint(180, 0)).distanceTo(
      new THREE.Vector3(...globePoint(-180, 0)),
    ),
  ).toBeLessThan(1e-12);
});
it("preserves all downloaded PB2002 segments with finite surface coordinates", () => {
  expect(data.features).toHaveLength(241);
  const groups = boundarySegments(data);
  expect(groups.subduction.length).toBeGreaterThan(0);
  expect(groups.other.length).toBeGreaterThan(0);
  expect(groups.subduction.length + groups.other.length).toBe(
    data.features.reduce(
      (n, f) => n + (f.geometry.coordinates.length - 1) * 6,
      0,
    ),
  );
  for (const points of Object.values(groups))
    for (let i = 0; i < points.length; i += 3) {
      expect(Math.hypot(...points.slice(i, i + 3))).toBeCloseTo(1.813, 10);
      expect(points.slice(i, i + 3).every(Number.isFinite)).toBe(true);
    }
});
