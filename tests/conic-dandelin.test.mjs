import { it, expect } from "vitest";
import * as THREE from "three";
import {
  conicState,
  conicSegments,
  CONIC_HEIGHT,
} from "../src/conicGeometry.mjs";
import { dandelinSpheres, dandelinTangents } from "../src/conicDandelin.mjs";
import { buildConicBench } from "../src/ConicBench.js";
it("spheres are tangent to the plane and cone, and tangent segments have equal length", () => {
  for (const alpha of [20, 30, 45])
    for (const tilt of [0, 25, 90 - alpha, 75, 90]) {
      const p = { alpha, tilt, offset: 0.3 },
        q = conicState(p);
      for (const sphere of dandelinSpheres(p)) {
        expect(Math.abs(q.c * sphere.y - p.offset)).toBeCloseTo(
          sphere.radius,
          10,
        );
        expect(q.c * sphere.focus[1] - q.s * sphere.focus[0]).toBeCloseTo(
          p.offset,
          10,
        );
        expect(
          Math.hypot(sphere.focus[0], sphere.focus[1] - sphere.y),
        ).toBeCloseTo(sphere.radius, 10);
        expect(sphere.ringRadius ** 2).toBeCloseTo(
          q.k * q.k * sphere.ringY ** 2,
          10,
        );
        expect(
          sphere.ringRadius ** 2 + (sphere.ringY - sphere.y) ** 2,
        ).toBeCloseTo(sphere.radius ** 2, 10);
        for (const [point] of conicSegments(p, 64)) {
          const t = dandelinTangents(sphere, point);
          expect(t.toFocus).toBeCloseTo(t.toCone, 9);
        }
        if (sphere.visible)
          expect(Math.abs(sphere.y) + sphere.radius).toBeLessThanOrEqual(
            CONIC_HEIGHT + 1e-9,
          );
      }
    }
  expect(dandelinSpheres({ alpha: 30, tilt: 60, offset: 0.3 })).toHaveLength(1);
  expect(dandelinSpheres({ alpha: 30, tilt: 35, offset: 0 })).toHaveLength(0);
});
it("shows bounded spheres only on request and hides a sphere that exceeds the finite model", () => {
  const root = new THREE.Group(),
    p = { alpha: 30, tilt: 25, offset: 0.45, showSpheres: 1, probe: 25 };
  buildConicBench(root, p);
  const first = root.getObjectByName("dandelin-sphere-0"),
    second = root.getObjectByName("dandelin-sphere-1");
  expect(first.visible).toBe(true);
  expect(second.visible).toBe(true);
  root.userData.update({ ...p, tilt: 59 });
  expect(second.visible).toBe(false);
  root.userData.update({ ...p, showSpheres: 0 });
  expect(first.visible).toBe(false);
  expect(second.visible).toBe(false);
});

it("labels follow actual tangent points and hide with the construction", () => {
  const root = new THREE.Group(),
    p = { alpha: 30, tilt: 25, offset: 0.45, showSpheres: 1, probe: 25 };
  buildConicBench(root, p);
  const f = root.getObjectByName("conic-label-F1"),
    point = root.getObjectByName("conic-probe");
  expect(
    f.position.distanceTo(root.getObjectByName("conic-focus-0").position),
  ).toBeLessThan(1e-10);
  expect(
    root.getObjectByName("conic-label-P").position.distanceTo(point.position),
  ).toBeLessThan(1e-10);
  const sphere = dandelinSpheres(p)[0],
    proof = dandelinTangents(sphere, [
      point.position.x,
      point.position.y - 1.1,
      point.position.z,
    ]);
  expect(
    root
      .getObjectByName("conic-label-T1")
      .position.distanceTo(
        new THREE.Vector3(
          proof.tangent[0],
          proof.tangent[1] + 1.1,
          proof.tangent[2],
        ),
      ),
  ).toBeLessThan(1e-10);
  root.userData.update({ ...p, showFocus: 0 });
  expect(f.visible).toBe(false);
  expect(root.getObjectByName("conic-label-P").visible).toBe(false);
  expect(root.getObjectByName("conic-label-T1").visible).toBe(false);
});
