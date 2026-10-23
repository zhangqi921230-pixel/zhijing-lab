import { it, expect } from "vitest";
import { forestSites } from "../src/TerrainEcology.js";
it("forest spacing prevents coincident crowns and preserves deterministic mixed woodland", () => {
  const sites = forestSites(),
    cells = new Map(),
    size = 0.045;
  expect(forestSites()).toEqual(sites);
  let broad = 0;
  for (const s of sites) {
    const x = Math.floor(s.x / size),
      z = Math.floor(s.z / size);
    for (let i = x - 1; i <= x + 1; i++)
      for (let j = z - 1; j <= z + 1; j++)
        for (const n of cells.get(`${i},${j}`) ?? [])
          expect(Math.hypot(s.x - n.x, s.z - n.z)).toBeGreaterThanOrEqual(
            s.radius + n.radius,
          );
    const key = `${x},${z}`;
    if (!cells.has(key)) cells.set(key, []);
    cells.get(key).push(s);
    if (s.broad) broad++;
  }
  expect(broad / sites.length).toBeGreaterThan(0.1);
  expect(broad / sites.length).toBeLessThan(0.5);
});
