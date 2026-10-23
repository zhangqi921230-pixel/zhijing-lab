import { it, expect } from "vitest";
import { mechanismLessons, mechanismState } from "../src/mechanismLessons.mjs";
it("gear speeds preserve equal pitch-line speeds for every tooth combination", () => {
  for (let driver = 12; driver <= 36; driver++)
    for (let driven = 12; driven <= 36; driven++) {
      const q = mechanismState("gear-drive", { driver, driven, rpm: 20 }, 3);
      expect(q.input * driver).toBeCloseTo(q.output * driven);
      expect(q.angle).toBeCloseTo(2 * Math.PI);
    }
});
it("buoyancy tracks displacement and stops increasing once submerged", () => {
  const p = { volume: 300, bodyDensity: 2000, liquidDensity: 1000 };
  const air = mechanismState("buoyancy-lift", p, 0),
    half = mechanismState("buoyancy-lift", p, 3),
    full = mechanismState("buoyancy-lift", p, 4),
    deep = mechanismState("buoyancy-lift", p, 6);
  expect(air.buoyancy).toBe(0);
  expect(half.displaced).toBe(150);
  expect(half.buoyancy * 2).toBeCloseTo(full.buoyancy);
  expect(deep).toEqual(full);
  for (const t of [0, 2, 3, 4, 6])
    for (const volume of [100, 500])
      for (const bodyDensity of [1500, 3000])
        for (const liquidDensity of [800, 1200]) {
          const q = mechanismState(
            "buoyancy-lift",
            { volume, bodyDensity, liquidDensity },
            t,
          );
          expect(q.tension).toBeGreaterThan(0);
          expect(q.tension + q.buoyancy).toBeCloseTo(q.weight);
        }
});
it("all ten chapter presets stay in bounds and have distinct teaching states", () => {
  for (const lesson of mechanismLessons) {
    expect(lesson.chapters).toHaveLength(5);
    expect(
      new Set(lesson.chapters.map((c) => JSON.stringify([c.preset, c.time])))
        .size,
    ).toBe(5);
    for (const c of lesson.chapters)
      for (const f of lesson.params) {
        expect(c.preset[f.key]).toBeGreaterThanOrEqual(f.min);
        expect(c.preset[f.key]).toBeLessThanOrEqual(f.max);
      }
  }
});
