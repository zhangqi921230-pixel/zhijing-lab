import { it, expect } from "vitest";
import { forestImpostorGeometry } from "../src/ForestImpostor.js";
it("low detail crowns retain projected area from above and from the sides within the triangle budget", () => {
  const geometry = forestImpostorGeometry(),
    p = geometry.getAttribute("position"),
    area = [0, 0, 0];
  expect(p.count / 3).toBeLessThanOrEqual(10);
  for (let i = 0; i < p.count; i += 3) {
    const a = [p.getX(i), p.getY(i), p.getZ(i)],
      b = [p.getX(i + 1), p.getY(i + 1), p.getZ(i + 1)],
      c = [p.getX(i + 2), p.getY(i + 2), p.getZ(i + 2)];
    const u = b.map((v, j) => v - a[j]),
      v = c.map((n, j) => n - a[j]);
    [
      u[1] * v[2] - u[2] * v[1],
      u[2] * v[0] - u[0] * v[2],
      u[0] * v[1] - u[1] * v[0],
    ].forEach((n, j) => (area[j] += Math.abs(n) / 2));
  }
  area.forEach((a) => expect(a).toBeGreaterThan(0.2));
  geometry.computeBoundingBox();
  expect(geometry.boundingBox.min.y).toBeCloseTo(-0.45, 5);
  expect(geometry.boundingBox.max.y).toBeCloseTo(0.45, 5);
  geometry.dispose();
});

it("keeps roots grounded after species-specific silhouette calibration", async () => {
  const { forestImpostorDimensions } = await import("../src/ForestImpostor.js");
  for (const height of [0.038, 0.065, 0.094])
    for (const broad of [false, true]) {
      const { scale, centerY } = forestImpostorDimensions(height, broad);
      expect(centerY - 0.45 * scale[1]).toBeCloseTo(0, 12);
      const top = centerY + 0.45 * scale[1];
      // Detailed pine apex is .96h; deciduous clusters reach approximately 1.05h.
      expect(top / height).toBeCloseTo(broad ? 1.062 : 0.954, 3);
      expect(scale[0]).toBe(scale[2]);
    }
});
