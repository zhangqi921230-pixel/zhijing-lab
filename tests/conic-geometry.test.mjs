import { threeIds } from "../src/sceneCatalog.mjs";
import { expect, it } from "vitest";
import * as THREE from "three";
import {
  conicSegments,
  conicState,
  conicPlanePoint,
  CONIC_HEIGHT,
} from "../src/conicGeometry.mjs";
import { buildConicBench } from "../src/ConicBench.js";
it("satisfies cone and plane equations, preserves in-plane distances, and separates nappes", () => {
  for (const alpha of [20, 30, 45])
    for (const tilt of [0, 35, 90 - alpha, 75, 90])
      for (const offset of [0, 0.2, 0.7, 1.2]) {
        const p = { alpha, tilt, offset },
          q = conicState(p);
        for (const [a, b] of conicSegments(p)) {
          for (const [x, y, z] of [a, b]) {
            expect(x * x + z * z - q.k * q.k * y * y).toBeCloseTo(0, 9);
            expect(q.c * y - q.s * x).toBeCloseTo(offset, 9);
            expect(Math.abs(y)).toBeLessThanOrEqual(CONIC_HEIGHT + 1e-8);
          }
          if (offset) expect(a[1] * b[1]).toBeGreaterThan(0);
          const aa = conicPlanePoint(p, a),
            bb = conicPlanePoint(p, b);
          expect(Math.hypot(aa[0] - bb[0], aa[1] - bb[1])).toBeCloseTo(
            Math.hypot(...a.map((v, i) => v - b[i])),
            10,
          );
        }
      }
});
it("classifies critical and degenerate sections and renders both hyperbola branches", () => {
  const p = { alpha: 30, offset: 0.2 };
  expect(
    [0, 35, 60, 75].map((tilt) => conicState({ ...p, tilt }).kind),
  ).toEqual(["圆", "椭圆", "抛物线", "双曲线"]);
  expect(
    [35, 60, 75].map((tilt) => conicState({ ...p, offset: 0, tilt }).kind),
  ).toEqual(["一个点", "一条直线", "两条相交直线"]);
  const segments = conicSegments({ ...p, tilt: 75 });
  expect(segments.some((s) => s[0][1] > 0)).toBe(true);
  expect(segments.some((s) => s[0][1] < 0)).toBe(true);
});
it("reuses intersection GPU storage across section changes", () => {
  expect(threeIds).toContain("conics");
  const root = new THREE.Group();
  buildConicBench(root, { alpha: 30, tilt: 35, offset: 0.45 });
  const geometry = root.getObjectByName("conic-intersection").geometry;
  const buffer = geometry.attributes.instanceStart.data.array;
  for (const tilt of [0, 60, 75, 90]) {
    root.userData.update({ alpha: 30, tilt, offset: 0.2 });
    expect(geometry.attributes.instanceStart.data.array).toBe(buffer);
    expect(geometry.instanceCount).toBeGreaterThan(0);
    expect(geometry.instanceCount).toBeLessThanOrEqual(buffer.length / 6);
  }
});

it("toggles construction layers without rebuilding or changing the intersection", () => {
  const root = new THREE.Group();
  const p = { alpha: 30, tilt: 35, offset: 0.7 };
  buildConicBench(root, p);
  const line = root.getObjectByName("conic-intersection");
  const version = line.geometry.attributes.instanceStart.data.version;
  root.userData.update({ ...p, showPlane: 0, showShell: 0, showGuides: 0 });
  for (const name of [
    "conic-cutting-plane",
    "conic-shell-0",
    "conic-shell-1",
    "conic-construction-lines",
  ])
    expect(root.getObjectByName(name).visible).toBe(false);
  expect(line.visible).toBe(true);
  expect(line.geometry.attributes.instanceStart.data.version).toBe(version);
  root.userData.update(p);
  expect(root.getObjectByName("conic-cutting-plane").visible).toBe(true);
});
