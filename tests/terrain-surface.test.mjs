import { TERRAIN_SCALE } from "../src/terrainWorld.mjs";
import { describe, it, expect } from "vitest";
import { terrainTriangles, terrainHeightAt } from "../src/models.mjs";
import { terrainGeometry, terrainWallGeometry } from "../src/TerrainSurface.js";

describe("terrain surface and closed cutaway", () => {
  it("renders exactly the contour model with shared smooth normals", () => {
    const mesh = terrainGeometry(),
      p = mesh.getAttribute("position"),
      n = mesh.getAttribute("normal");
    expect(mesh.index.count).toBe(terrainTriangles.length * 3);
    let maxPositionError = 0,
      maxNormalError = 0,
      minUpNormal = 1;
    terrainTriangles.flat().forEach(([x, y, z], i) => {
      const index = mesh.index.getX(i);
      maxPositionError = Math.max(
        maxPositionError,
        Math.abs(p.getX(index) - x),
        Math.abs(p.getY(index) - y / TERRAIN_SCALE),
        Math.abs(p.getZ(index) - z),
      );
      maxNormalError = Math.max(
        maxNormalError,
        Math.abs(Math.hypot(n.getX(index), n.getY(index), n.getZ(index)) - 1),
      );
      minUpNormal = Math.min(minUpNormal, n.getY(index));
    });
    expect(maxPositionError).toBeLessThan(1e-5);
    expect(maxNormalError).toBeLessThan(1e-5);
    expect(minUpNormal).toBeGreaterThan(0);
    mesh.dispose();
  });
  it("cutaway walls touch every perimeter vertex and share a level base", () => {
    const wall = terrainWallGeometry(),
      p = wall.getAttribute("position");
    const top = new Set();
    for (let i = 0; i < p.count; i++) {
      expect(Math.abs(p.getX(i)) === 3 || Math.abs(p.getZ(i)) === 3).toBe(true);
      if (p.getY(i) < 0) expect(p.getY(i)).toBeCloseTo(-0.56, 5);
      else
        top.add(
          [p.getX(i), p.getY(i), p.getZ(i)].map((v) => v.toFixed(4)).join(","),
        );
    }
    for (const [x, h, z] of terrainTriangles.flat())
      if (Math.abs(x) === 3 || Math.abs(z) === 3)
        expect(
          top.has([x, h / TERRAIN_SCALE, z].map((v) => v.toFixed(4)).join(",")),
        ).toBe(true);
    wall.dispose();
  });
  it("soil depth follows the actual boundary surface without changing wall vertices", () => {
    const wall = terrainWallGeometry(),
      p = wall.getAttribute("position"),
      depth = wall.getAttribute("soilDepth");
    expect(depth.count).toBe(p.count);
    for (let i = 0; i < p.count; i++) {
      const expected =
        terrainHeightAt(p.getX(i), p.getZ(i)) / TERRAIN_SCALE - p.getY(i);
      expect(depth.getX(i)).toBeCloseTo(expected, 5);
      expect(depth.getX(i)).toBeGreaterThanOrEqual(0);
    }
    wall.dispose();
  });
});
