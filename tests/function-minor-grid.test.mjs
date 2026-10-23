import { expect, it } from "vitest";
import { functionMinorGrid } from "../src/functionMinorGrid.mjs";
import { functionAxisTicks } from "../src/functionAxisTicks.mjs";

it("subdivides major intervals without duplicating axes or labelled grid lines", () => {
  for (const radians of [false, true]) {
    const ticks = functionAxisTicks(6, 1, radians);
    const values = functionMinorGrid(ticks, 6, 60);
    expect(values.length).toBeGreaterThan(0);
    for (const value of values) {
      expect(Math.abs(value)).toBeLessThanOrEqual(6);
      expect(ticks.every((t) => Math.abs(t.value - value) > 1e-8)).toBe(true);
      expect(values.some((v) => Math.abs(v + value) < 1e-8)).toBe(true);
    }
  }
});
it("reduces detail with screen spacing and bounds pathological wide layouts", () => {
  const ticks = functionAxisTicks(6, 1);
  expect(functionMinorGrid(ticks, 6, 60)).toHaveLength(48);
  expect(functionMinorGrid(ticks, 6, 30)).toHaveLength(12);
  expect(functionMinorGrid(ticks, 6, 20)).toEqual([]);
  expect(functionMinorGrid(ticks, 1000, 60)).toEqual([]);
});
