import { it, expect } from "vitest";
import { extensionState as state } from "../src/natureExtension.mjs";
it("evaporation conserves solute and cannot exceed saturation capacity", () => {
  for (const salt of [10, 20, 36])
    for (const evaporation of [0, 20, 80])
      for (let t = 0; t <= 6; t += 0.1) {
        const q = state("crystallization", { salt, evaporation }, t);
        expect(q.dissolved + q.crystal).toBeCloseTo(salt);
        expect(q.dissolved).toBeLessThanOrEqual(0.36 * q.water);
        expect(q.crystal).toBeGreaterThanOrEqual(0);
      }
  expect(
    state("crystallization", { salt: 36, evaporation: 80 }, 6).crystal,
  ).toBeCloseTo(28.8);
});
it("rust requires both reactants in contact with bare iron", () => {
  for (const water of [0, 1])
    for (const oxygen of [0, 1])
      for (const coating of [0, 1])
        expect(state("rusting", { water, oxygen, coating }, 6).rust).toBe(
          water && oxygen && !coating ? 1 : 0,
        );
});
it("transpiration decreases with humidity and vanishes at closed stomata", () => {
  expect(state("transpiration", { opening: 0, humidity: 20 }).flux).toBe(0);
  expect(state("transpiration", { opening: 100, humidity: 100 }).flux).toBe(0);
  expect(
    state("transpiration", { opening: 70, humidity: 40 }).flux,
  ).toBeGreaterThan(state("transpiration", { opening: 70, humidity: 90 }).flux);
});
it("pollen arrival alone cannot yield fruit and tube growth precedes fruit", () => {
  expect(state("pollination", { pollen: 1, compatible: 0 }, 6).fruit).toBe(
    false,
  );
  expect(state("pollination", { pollen: 0, compatible: 1 }, 6).tube).toBe(0);
  expect(
    state("pollination", { pollen: 1, compatible: 1 }, 3).tube,
  ).toBeLessThan(1);
  expect(state("pollination", { pollen: 1, compatible: 1 }, 6).fruit).toBe(
    true,
  );
});
it("rain needs sufficient lift and reversing wind preserves the comparative amount", () => {
  expect(
    state("rain-shadow", { height: 750, cloudbase: 1000, wind: 1 }).rain,
  ).toBe(0);
  expect(
    state("rain-shadow", { height: 2500, cloudbase: 1000, wind: 0 }).rain,
  ).toBe(state("rain-shadow", { height: 2500, cloudbase: 1000, wind: 1 }).rain);
});
