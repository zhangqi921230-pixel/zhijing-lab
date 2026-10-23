import { expect, it } from "vitest";
import { rc } from "../src/advancedModels.mjs";

it("conserves energy at initial, intermediate and limiting times for both RC modes", () => {
  for (const mode of [0, 1])
    for (const u of [1, 6, 12])
      for (const r of [100, 1000, 2000])
        for (const c of [1, 4, 10]) {
          const p = { mode, u, r, c },
            tau = (r * c) / 1000;
          for (const n of [0, 1e-10, 0.1, 1, 5, 40]) {
            const q = rc(p, n * tau);
            expect(q.initialEnergy + q.sourceWork).toBeCloseTo(
              q.energy + q.heat,
              12,
            );
            expect(q.heat).toBeGreaterThanOrEqual(0);
            expect(q.energy).toBeGreaterThanOrEqual(0);
          }
          const initial = rc(p, 0),
            end = rc(p, 40 * tau),
            halfCU2 = ((0.5 * c) / 1000) * u * u;
          expect(initial.heat).toBe(0);
          expect(initial.energy).toBeCloseTo(mode ? halfCU2 : 0, 12);
          expect(end.heat).toBeCloseTo(halfCU2, 12);
          expect(end.energy).toBeCloseTo(mode ? 0 : halfCU2, 12);
          expect(end.sourceWork).toBeCloseTo(mode ? 0 : 2 * halfCU2, 12);
        }
});

it("matches the rate of dissipated energy to Joule power", () => {
  for (const mode of [0, 1]) {
    const p = { mode, u: 6, r: 500, c: 4 },
      dt = 1e-5;
    for (const t of [0.1, 1, 4, 10]) {
      const q = rc(p, t),
        derivative = (rc(p, t + dt).heat - rc(p, t - dt).heat) / (2 * dt);
      expect(derivative).toBeCloseTo(q.current ** 2 * p.r, 10);
      expect(q.resistorPower).toBeCloseTo(derivative, 10);
    }
  }
});

it("preserves voltage and energy when a partially charged capacitor starts discharging", () => {
  const charging = { u: 6, r: 500, c: 4, mode: 0 };
  for (const duration of [0, 0.2, 2, 6, 10]) {
    const before = rc(charging, duration);
    const discharge = {
      ...charging,
      mode: 1,
      initialRatio: (before.voltage / charging.u) * 100,
    };
    const after = rc(discharge, 0);
    expect(after.voltage).toBeCloseTo(before.voltage, 12);
    expect(after.energy).toBeCloseTo(before.energy, 12);
    expect(after.current).toBeCloseTo(-before.voltage / charging.r, 12);
    for (const t of [0, 1, 3, 10]) {
      const q = rc(discharge, t);
      expect(q.initialEnergy).toBeCloseTo(q.energy + q.heat, 12);
      expect(q.sourceWork).toBe(0);
      expect(q.voltage).toBeLessThanOrEqual(before.voltage + 1e-12);
    }
  }
});

it("recharges from residual voltage with continuous energy and correct source work", () => {
  const p = { u: 6, r: 500, c: 4, mode: 1, initialRatio: 70 };
  for (const time of [0, 0.2, 2, 10]) {
    const before = rc(p, time),
      next = {
        ...p,
        mode: 0,
        chargeInitialRatio: (before.voltage / p.u) * 100,
      };
    expect(rc(next, 0).voltage).toBeCloseTo(before.voltage, 12);
    expect(rc(next, 0).energy).toBeCloseTo(before.energy, 12);
    for (const t of [0, 0.1, 2, 10, 100]) {
      const q = rc(next, t);
      expect(q.initialEnergy + q.sourceWork).toBeCloseTo(q.energy + q.heat, 12);
      expect(q.current).toBeGreaterThanOrEqual(0);
      expect(q.voltage).toBeGreaterThanOrEqual(before.voltage - 1e-12);
      expect(q.voltage).toBeLessThanOrEqual(p.u);
      expect(q.sourceWork).toBeCloseTo(
        ((p.u * p.c) / 1000) * (q.voltage - before.voltage),
        12,
      );
    }
  }
  const full = rc({ ...p, mode: 0, chargeInitialRatio: 100 }, 2);
  expect(full.current).toBe(0);
  expect(full.heat).toBe(0);
  expect(full.sourceWork).toBe(0);
});
