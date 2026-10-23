import { it, expect } from "vitest";
import { switchRCMode } from "../src/rcTransition.mjs";
import { rc } from "../src/advancedModels.mjs";
it("keeps charge and voltage through repeated physical switch operations", () => {
  let p = {
    u: 6,
    r: 500,
    c: 4,
    mode: 0,
    initialRatio: 100,
    chargeInitialRatio: 0,
  };
  for (const t of [1, 2, 0, 4, 0.5, 7]) {
    const before = rc(p, t),
      next = switchRCMode(p, t, 1 - p.mode),
      after = rc(next, 0);
    expect(after.voltage).toBeCloseTo(before.voltage, 12);
    expect(after.charge).toBeCloseTo(before.charge, 12);
    expect(after.energy).toBeCloseTo(before.energy, 12);
    expect(after.current).toBeCloseTo(
      ((next.mode ? 0 : next.u) - before.voltage) / next.r,
      12,
    );
    p = next;
  }
  expect(switchRCMode(p, 2, p.mode)).toBe(p);
});
