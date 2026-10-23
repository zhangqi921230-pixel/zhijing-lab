import { it, expect } from "vitest";
import * as THREE from "three";
import { conicSegments } from "../src/conicGeometry.mjs";
import { conicProbe } from "../src/conicProbe.mjs";
import { buildConicBench } from "../src/ConicBench.js";
it("measures the same conic invariant at many sampled locations", () => {
  for (const tilt of [0, 35, 60, 90]) {
    const p = { alpha: 30, tilt, offset: 0.3 },
      segments = conicSegments(p);
    let first;
    for (const probe of [0, 10, 25, 50, 70, 90, 100]) {
      const q = conicProbe({ ...p, probe }, segments);
      if (tilt === 60) expect(q.value).toBeCloseTo(q.distances[0], 10);
      else {
        first ??= q.value;
        expect(q.value).toBeCloseTo(first, 10);
      }
      expect(q.point.every(Number.isFinite)).toBe(true);
    }
  }
  expect(conicProbe({ alpha: 30, tilt: 35, offset: 0 }, [])).toBeNull();
});
it("moves the scene marker without rebuilding the intersection", () => {
  const p = { alpha: 30, tilt: 35, offset: 0.7, probe: 0 },
    root = new THREE.Group();
  buildConicBench(root, p);
  const line = root.getObjectByName("conic-intersection"),
    version = line.geometry.attributes.instanceStart.data.version;
  const old = root.getObjectByName("conic-probe").position.clone();
  root.userData.update({ ...p, probe: 50 });
  const probe = conicProbe({ ...p, probe: 50 }, conicSegments(p));
  expect(
    root
      .getObjectByName("conic-probe")
      .position.distanceTo(
        new THREE.Vector3(probe.point[0], probe.point[1] + 1.1, probe.point[2]),
      ),
  ).toBeLessThan(1e-10);
  expect(
    root.getObjectByName("conic-probe").position.distanceTo(old),
  ).toBeGreaterThan(0.1);
  expect(line.geometry.attributes.instanceStart.data.version).toBe(version);
  root.userData.update({ ...p, showFocus: 0 });
  expect(root.getObjectByName("conic-probe").visible).toBe(false);
});
