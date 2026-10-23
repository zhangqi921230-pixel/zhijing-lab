import { it, expect } from "vitest";
import { expansionState, expansionLessons } from "../src/expansionLessons.mjs";
it("nets preserve lateral area and omit exactly one base for an open cylinder", () => {
  for (const radius of [1, 2, 3])
    for (const height of [2, 4, 6]) {
      const q = expansionState("cylinder-net", { radius, height });
      expect(q.circumference * height).toBeCloseTo(q.side);
      expect(q.total - q.open).toBeCloseTo(Math.PI * radius ** 2);
      const doubled = expansionState("cylinder-net", {
        radius: radius * 2,
        height,
      });
      expect(doubled.side / q.side).toBeCloseTo(2);
      expect(doubled.base / q.base).toBeCloseTo(4);
    }
});
it("linear RGB is encoded without confusing 25 percent light with 25 percent sRGB", () => {
  expect(
    expansionState("additive-light", { red: 100, green: 100, blue: 0 }).rgb,
  ).toEqual([255, 255, 0]);
  expect(
    expansionState("additive-light", { red: 25, green: 25, blue: 25 }).rgb,
  ).toEqual([137, 137, 137]);
  expect(
    expansionState("additive-light", { red: 0, green: 0, blue: 0 }).rgb,
  ).toEqual([0, 0, 0]);
});
it("all ten chapters have complete bounded presets", () => {
  for (const lesson of expansionLessons) {
    expect(lesson.chapters).toHaveLength(5);
    for (const chapter of lesson.chapters)
      for (const field of lesson.params) {
        expect(chapter.preset[field.key]).toBeGreaterThanOrEqual(field.min);
        expect(chapter.preset[field.key]).toBeLessThanOrEqual(field.max);
      }
  }
});
