import { expect, it } from "vitest";
import { saturationTemperature } from "../src/solubilityThreshold.mjs";
import { solubility } from "../src/models.mjs";

it("inverts the full piecewise solubility curve without rounding the equilibrium", () => {
  for (const water of [50, 100, 200]) {
    for (const temp of [0, 10, 20, 31.39318885449, 40, 55, 60, 75, 80]) {
      const mass = (solubility(temp) * water) / 100;
      const result = saturationTemperature(mass, water);
      expect(result).toBeCloseTo(temp, 10);
      expect((solubility(result) * water) / 100).toBeCloseTo(mass, 10);
    }
  }
});

it("does not invent a saturation point outside the supported range", () => {
  for (const [mass, water] of [
    [0, 100],
    [10, 100],
    [180, 100],
    [-1, 100],
    [50, 0],
    [NaN, 100],
    [50, Infinity],
  ]) {
    expect(saturationTemperature(mass, water)).toBeNull();
  }
});
