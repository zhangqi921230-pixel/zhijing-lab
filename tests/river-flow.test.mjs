import { it, expect } from "vitest";
import { riverArrow } from "../src/RiverFlow.js";
import { terrainHeightAt } from "../src/models.mjs";
import { riverHeight } from "../src/terrainWorld.mjs";
it("flow arrows follow the downhill river and never run across the lake interior", () => {
  let count = 0;
  for (let z = -2.95; z < 2.85; z += 0.017) {
    const arrow = riverArrow(z);
    if (!arrow) continue;
    count++;
    expect(arrow[5]).toBeGreaterThan(arrow[2]);
    expect(riverHeight(arrow[5])).toBeLessThanOrEqual(riverHeight(arrow[2]));
    for (let i = 0; i < arrow.length; i += 3) {
      expect(riverHeight(arrow[i + 2])).toBeGreaterThan(
        terrainHeightAt(arrow[i], arrow[i + 2]),
      );
    }
  }
  expect(count).toBeGreaterThan(100);
  expect(riverArrow(1.5)).toBeNull();
  expect(riverArrow(-3)).toBeNull();
});
