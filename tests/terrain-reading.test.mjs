import { it, expect } from "vitest";
import { terrainReadingAt, terrainTriangles } from "../src/models.mjs";
import { TERRAIN_SCALE } from "../src/terrainWorld.mjs";
it("map height and slope match independent facet normals across the terrain", () => {
  for (let i = 0; i < terrainTriangles.length; i += 97) {
    const [a, b, c] = terrainTriangles[i];
    const x = (a[0] + b[0] + c[0]) / 3,
      z = (a[2] + b[2] + c[2]) / 3;
    const u = [b[0] - a[0], (b[1] - a[1]) / TERRAIN_SCALE, b[2] - a[2]];
    const v = [c[0] - a[0], (c[1] - a[1]) / TERRAIN_SCALE, c[2] - a[2]];
    const normal = [
      u[1] * v[2] - u[2] * v[1],
      u[2] * v[0] - u[0] * v[2],
      u[0] * v[1] - u[1] * v[0],
    ];
    const slope =
      (Math.acos(Math.abs(normal[1]) / Math.hypot(...normal)) * 180) / Math.PI;
    const reading = terrainReadingAt(x, z);
    expect(reading.height).toBeCloseTo((a[1] + b[1] + c[1]) / 3, 6);
    expect(reading.slope).toBeCloseTo(slope, 6);
  }
});
it("map samples clamp to terrain edges and remain finite", () => {
  for (const x of [-10, 0, 10])
    for (const z of [-10, 0, 10]) {
      const p = terrainReadingAt(x, z);
      expect(Math.abs(p.x)).toBeLessThanOrEqual(3);
      expect(Math.abs(p.z)).toBeLessThanOrEqual(3);
      expect(Number.isFinite(p.height)).toBe(true);
      expect(p.slope).toBeGreaterThanOrEqual(0);
      expect(p.slope).toBeLessThan(90);
    }
});
