import { it, expect } from "vitest";
import { waveFrame } from "../src/waveFrame.mjs";
import { waveState } from "../src/visualPhysics.mjs";
it("adaptive samples share exact marker values and preserve model across supported extremes", () => {
  for (const mode of [0, 1, 2])
    for (const frequency of [0.2, 0.5, 1])
      for (const speed of [1, 2, 4])
        for (const t of [0, 0.3, 1.1]) {
          const p = { mode, frequency, speed, phase: 150, amplitude: 0.8 };
          const f = waveFrame(p, t);
          expect(f.samples.length).toBeGreaterThanOrEqual(145);
          expect(f.samples.length).toBeLessThanOrEqual(385);
          expect(
            f.segments / (12 / (speed / frequency)),
          ).toBeGreaterThanOrEqual(32);
          f.markers.forEach((point, i) => {
            expect(point.x).toBeCloseTo(i / 4);
            expect(point).toBe(f.samples[(i * f.segments) / 48]);
            expect(point.total).toBeCloseTo(waveState(p, i / 4, t).total);
          });
        }
});
it("shortest waves have bounded linear interpolation error below half a display pixel", () => {
  const p = { mode: 1, frequency: 1, speed: 1, phase: 0, amplitude: 0.8 };
  const f = waveFrame(p, 0.123);
  for (let i = 0; i < f.segments; i++) {
    const a = f.samples[i],
      b = f.samples[i + 1];
    const actual = waveState(p, (a.x + b.x) / 2, 0.123).total;
    expect(Math.abs((a.total + b.total) / 2 - actual) * 60).toBeLessThan(0.5);
  }
});
