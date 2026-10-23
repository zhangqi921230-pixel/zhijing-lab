import { describe, it, expect } from "vitest";
import { shorelineWater, terrainHeightAt } from "../src/models.mjs";
import { riverHeight, riverCenter } from "../src/terrainWorld.mjs";
import { forestSites } from "../src/TerrainEcology.js";

describe("terrain river, shoreline and forest placement", () => {
  it("water triangles sit above the same terrain and shoreline vertices touch it", () => {
    let maxDepthError = 0,
      minDepth = Infinity,
      shoreCount = 0;
    for (const tri of shorelineWater) {
      for (const p of tri) {
        const depth = p.y - terrainHeightAt(p.x, p.z);
        maxDepthError = Math.max(maxDepthError, Math.abs(depth - p.depth));
        minDepth = Math.min(minDepth, depth);
        if (p.depth === 0) shoreCount++;
      }
      const center = tri.reduce(
        (a, p) => ({ x: a.x + p.x / 3, z: a.z + p.z / 3, y: a.y + p.y / 3 }),
        { x: 0, y: 0, z: 0 },
      );
      minDepth = Math.min(
        minDepth,
        center.y - terrainHeightAt(center.x, center.z),
      );
    }
    expect(shoreCount).toBeGreaterThan(500);
    expect(maxDepthError).toBeLessThan(1e-7);
    expect(minDepth).toBeGreaterThan(-1e-7);
  });
  it("the source-to-outlet profile never rises and distant banks stay dry", () => {
    let previous = Infinity;
    for (let z = -3; z <= 3; z += 0.025) {
      expect(riverHeight(z)).toBeLessThanOrEqual(previous + 1e-9);
      previous = riverHeight(z);
      for (const x of [-2.8, 2.8])
        expect(terrainHeightAt(x, z)).toBeGreaterThan(riverHeight(z));
      // The sampled central river bed remains under the water level.
      expect(terrainHeightAt(riverCenter(z), z)).toBeLessThan(riverHeight(z));
    }
    expect(riverHeight(1)).toBe(riverHeight(2));
  });
  it("forest roots use the rendered mesh and stay above the waterline", () => {
    const sites = forestSites();
    expect(sites.length).toBeGreaterThan(4000);
    let maxRootError = 0,
      minWaterGap = Infinity;
    for (const s of sites) {
      maxRootError = Math.max(
        maxRootError,
        Math.abs(s.h - terrainHeightAt(s.x, s.z)),
      );
      minWaterGap = Math.min(minWaterGap, s.h - riverHeight(s.z));
    }
    expect(maxRootError).toBe(0);
    expect(minWaterGap).toBeGreaterThanOrEqual(22);
  });
});
