import { it, expect } from "vitest";
import {
  polygonTurn,
  thermalLengths,
  vividLessons,
} from "../src/vividLessons.mjs";
it("closed paths accumulate a signed complete turn for every supported polygon", () => {
  for (let sides = 3; sides <= 12; sides++)
    for (const direction of [-1, 1]) {
      const p = { sides, direction };
      expect(polygonTurn(p, 0).total).toBe(0);
      const q = polygonTurn(p, 6);
      expect(q.total).toBeCloseTo(direction * 360);
      expect(q.interior + q.exterior).toBeCloseTo(180);
      for (let i = 0; i < sides; i++) {
        expect(polygonTurn(p, ((i + 0.35) * 6) / sides).total).toBeCloseTo(
          (direction * i * 360) / sides,
        );
      }
    }
});
it("expansion obeys length and temperature proportionality and signed gap balance", () => {
  const p = { length: 3, delta: 60, gap: 5 };
  const q = thermalLengths(p, 6);
  expect(q[0].extension).toBeCloseTo(4.14);
  expect(q[1].extension).toBeCloseTo(3.06);
  expect(q[2].extension).toBeCloseTo(2.16);
  for (let i = 0; i < 3; i++) {
    expect(thermalLengths({ ...p, delta: 30 }, 6)[i].extension * 2).toBeCloseTo(
      q[i].extension,
    );
    expect(thermalLengths({ ...p, delta: -30 }, 6)[i].extension).toBeLessThan(
      0,
    );
    expect(q[i].remaining + q[i].extension).toBeCloseTo(5);
    expect(thermalLengths(p, 0)[i].extension).toBe(0);
  }
  expect(
    thermalLengths({ length: 5, delta: 80, gap: 2 }, 6).every(
      (m) => m.remaining < 0,
    ),
  ).toBe(true);
});
it("all ten teaching presets are distinct and within parameter bounds", () => {
  for (const lesson of vividLessons) {
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
