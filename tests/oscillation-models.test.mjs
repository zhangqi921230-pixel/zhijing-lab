import { it, expect } from "vitest";
import { lissajousPoint, standingState } from "../src/oscillationModels.mjs";
it("same phase is a line and quadrature with equal amplitudes is a circle", () => {
  for (let t = 0; t <= 6; t += 0.037) {
    const a = lissajousPoint({ fx: 1, fy: 1, phase: 0, height: 0.5 }, t);
    expect(a.y).toBeCloseTo(a.x * 0.5, 10);
    const b = lissajousPoint({ fx: 1, fy: 1, phase: 90, height: 1 }, t);
    expect(b.x * b.x + b.y * b.y).toBeCloseTo(1, 10);
  }
});
it("all integer-frequency trajectories close and remain inside their amplitude bounds", () => {
  for (let fx = 1; fx <= 4; fx++)
    for (let fy = 1; fy <= 4; fy++)
      for (const phase of [0, 30, 90, 180]) {
        const p = { fx, fy, phase, height: 0.4 },
          a = lissajousPoint(p, 0),
          b = lissajousPoint(p, 6);
        expect(b.x).toBeCloseTo(a.x, 10);
        expect(b.y).toBeCloseTo(a.y, 10);
        for (let t = 0; t < 6; t += 0.11) {
          const q = lissajousPoint(p, t);
          expect(Math.abs(q.x)).toBeLessThanOrEqual(1);
          expect(Math.abs(q.y)).toBeLessThanOrEqual(0.4);
        }
      }
});
it("standing waves obey fixed boundaries, stationary nodes and the analytic superposition", () => {
  for (let mode = 1; mode <= 5; mode++)
    for (const tension of [16, 36, 144])
      for (const time of [0, 0.27, 1.2, 6]) {
        const p = { mode, tension, amplitude: 20, probe: 25 };
        for (let i = 0; i <= mode; i++)
          expect(standingState(p, time, i / mode).y).toBeCloseTo(0, 10);
        for (const x of [0.1, 0.25, 0.5, 0.87]) {
          const q = standingState(p, time, x);
          expect(q.y).toBeCloseTo(
            20 *
              Math.sin(mode * Math.PI * x) *
              Math.cos((2 * Math.PI * q.frequency * time) / 60),
            10,
          );
          expect(q.frequency * q.wavelength).toBeCloseTo(q.speed, 10);
          expect(Math.abs(q.y)).toBeLessThanOrEqual(20 + 1e-10);
        }
      }
});
it("quadrupling tension doubles frequency without moving nodes", () => {
  const p = { mode: 3, tension: 36, amplitude: 12, probe: 50 };
  const a = standingState(p, 0),
    b = standingState({ ...p, tension: 144 }, 0);
  expect(b.frequency).toBe(2 * a.frequency);
  expect(b.wavelength).toBe(a.wavelength);
  expect(b.nodes).toBe(4);
});
