import { expect, it } from "vitest";
import * as THREE from "three";
import { conicSectionTriangles } from "../src/conicSectionFill.mjs";
import { conicSegments, conicState } from "../src/conicGeometry.mjs";
import { buildConicBench } from "../src/ConicBench.js";
it("fills complete circle and ellipse in their actual plane with the expected area", () => {
  for (const tilt of [0, 25, 35]) {
    const p = { alpha: 30, tilt, offset: 0.45 },
      q = conicState(p);
    const vertices = conicSectionTriangles(p, conicSegments(p));
    expect(vertices.length).toBe(2048 * 9);
    let area = 0;
    for (let i = 0; i < vertices.length; i += 9) {
      const a = new THREE.Vector3().fromArray(vertices, i),
        b = new THREE.Vector3().fromArray(vertices, i + 3),
        c = new THREE.Vector3().fromArray(vertices, i + 6);
      for (const v of [a, b, c]) {
        expect(q.c * v.y - q.s * v.x).toBeCloseTo(p.offset, 10);
        expect(v.x * v.x + v.z * v.z - q.k * q.k * v.y * v.y).toBeLessThan(
          1e-9,
        );
      }
      area += b.sub(a).cross(c.sub(a)).length() / 2;
    }
    const A = q.c * q.c - q.k * q.k * q.s * q.s;
    const expected = (Math.PI * p.offset ** 2 * q.k ** 2) / A ** 1.5;
    expect(Math.abs(area / expected - 1)).toBeLessThan(0.00001);
  }
});
it("never closes a clipped, open or degenerate intersection and reuses its buffer", () => {
  const p = { alpha: 30, tilt: 35, offset: 0.45 };
  for (const q of [
    { ...p, tilt: 60 },
    { ...p, tilt: 90 },
    { ...p, offset: 0 },
    { ...p, tilt: 55, offset: 1.2 },
  ])
    expect(conicSectionTriangles(q, conicSegments(q))).toEqual([]);
  const root = new THREE.Group();
  buildConicBench(root, p);
  const fill = root.getObjectByName("conic-section-fill"),
    buffer = fill.geometry.attributes.position.array;
  expect(fill.geometry.drawRange.count).toBe(6144);
  root.userData.update({ ...p, showFill: 0 });
  expect(fill.visible).toBe(false);
  root.userData.update({ ...p, tilt: 75 });
  expect(fill.geometry.drawRange.count).toBe(0);
  root.userData.update({ ...p, tilt: 0 });
  expect(fill.geometry.attributes.position.array).toBe(buffer);
  expect(fill.visible).toBe(true);
});
