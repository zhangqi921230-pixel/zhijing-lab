import { it, expect } from "vitest";
import { distillationEnergy } from "../src/distillationEnergy.mjs";
it("heating allocation sums to input throughout supported controls", () => {
  for (let power = 200; power <= 800; power += 50)
    for (let time = 0; time <= 240; time += 3)
      for (const cooling of [true, false]) {
        const q = distillationEnergy({ power, cooling }, time);
        expect(q.warming + q.vaporizing).toBeCloseTo(q.input, 8);
        expect(q.condensing).toBe(cooling ? q.vaporizing : 0);
      }
});
it("same evaporated mass requires the same latent heat regardless of power", () => {
  for (const power of [400, 600, 800]) {
    const time = (200 * 4.18 * 80 + 10 * 2257) / power,
      q = distillationEnergy({ power, cooling: true }, time);
    expect(q.warming).toBeCloseTo(66880);
    expect(q.vaporizing).toBeCloseTo(22570);
    expect(q.input).toBeCloseTo(89450);
  }
});
