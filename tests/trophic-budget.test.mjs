import { it, expect } from "vitest";
import { trophicBudget } from "../src/trophicBudget.mjs";
it("partitions initial energy without double counting intermediate levels", () => {
  for (let energy = 1000; energy <= 10000; energy += 100)
    for (let eff = 10; eff <= 20; eff++) {
      const b = trophicBudget(energy, eff);
      expect(b.diverted[0] + b.diverted[1] + b.retained).toBeCloseTo(energy, 8);
      expect(b.levels[2] / energy).toBeCloseTo((eff / 100) ** 2, 10);
    }
});
it("doubling the shared efficiency quadruples the third level", () => {
  expect(
    trophicBudget(5000, 20).retained / trophicBudget(5000, 10).retained,
  ).toBe(4);
});
