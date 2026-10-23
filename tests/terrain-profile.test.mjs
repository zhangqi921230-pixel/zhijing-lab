import { it, expect } from "vitest";
import {
  terrainHeightAt,
  terrainSection,
  terrainTriangles,
} from "../src/models.mjs";

it("interpolates independently constructed barycentric points on both triangles", () => {
  for (let i = 0; i < terrainTriangles.length; i += 137) {
    const tri = terrainTriangles[i];
    for (const w of [
      [0.2, 0.3, 0.5],
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ]) {
      const point = [0, 1, 2].map((k) =>
        tri.reduce((sum, v, j) => sum + v[k] * w[j], 0),
      );
      expect(terrainHeightAt(point[0], point[2])).toBeCloseTo(point[1], 7);
    }
  }
});
it("sections reproduce the surface between every breakpoint, including both edges", () => {
  for (let section = 0; section <= 100; section += 5) {
    const points = terrainSection(section);
    expect(points[0][0]).toBe(-3);
    expect(points.at(-1)[0]).toBe(3);
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1],
        b = points[i];
      expect(b[0]).toBeGreaterThanOrEqual(a[0]);
      expect(terrainHeightAt((a[0] + b[0]) / 2, a[2])).toBeCloseTo(
        (a[1] + b[1]) / 2,
        7,
      );
    }
  }
});
