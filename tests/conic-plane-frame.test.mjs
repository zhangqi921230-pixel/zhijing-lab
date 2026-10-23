import { it, expect } from "vitest";
import * as THREE from "three";
import { buildConicBench } from "../src/ConicBench.js";
import { conicSegments, conicState } from "../src/conicGeometry.mjs";

it("keeps every visible intersection inside the resized plane without changing the plane equation", () => {
  const root = new THREE.Group();
  buildConicBench(root, { alpha: 30, tilt: 0, offset: 1.05 });
  const plane = root.getObjectByName("conic-cutting-plane");
  const geometry = plane.geometry;
  for (const alpha of [15, 30, 55])
    for (const tilt of [0, 35, 90 - alpha, 75, 90])
      for (const offset of [0, 0.2, 1.2]) {
        const p = { alpha, tilt, offset };
        root.userData.update(p);
        root.updateMatrixWorld(true);
        const state = conicState(p);
        expect(
          state.c * (plane.position.y - 1.1) - state.s * plane.position.x,
        ).toBeCloseTo(offset, 10);
        let maxX = 0,
          maxY = 0,
          maxZ = 0;
        for (const segment of conicSegments(p))
          for (const point of segment) {
            const local = plane.worldToLocal(
              new THREE.Vector3(point[0], point[1] + 1.1, point[2]),
            );
            maxX = Math.max(maxX, Math.abs(local.x));
            maxY = Math.max(maxY, Math.abs(local.y));
            maxZ = Math.max(maxZ, Math.abs(local.z));
          }
        expect(maxX).toBeLessThan(0.5);
        expect(maxY).toBeLessThan(0.5);
        expect(maxZ).toBeLessThan(1e-10);
        expect(plane.geometry).toBe(geometry);
      }
  for (const name of ["conic-intersection", "conic-focus-0", "conic-probe"]) {
    const object = root.getObjectByName(name);
    expect(object.material.transparent).toBe(true);
    expect(object.renderOrder).toBeGreaterThan(
      root.getObjectByName("conic-section-fill").renderOrder,
    );
  }
});
