import { it, expect } from "vitest";
import { topicEntry, instrumentEntry } from "../src/chapterEntry.mjs";
import { lessons, defaults } from "../src/lessons.mjs";
import { topicChapters } from "../src/topicChapters.mjs";
import { lensChapters } from "../src/lensChapters.mjs";

it("loads bounded, visibly distinct adjacent chapter states across all general topics", () => {
  for (const [id, chapters] of Object.entries(topicChapters)) {
    const lesson = lessons.find((l) => l.id === id);
    let previous;
    for (let index = 0; index < chapters.length; index++) {
      const entry = topicEntry(lesson, chapters, index, defaults(lesson));
      for (const param of lesson.params) {
        expect(
          entry.p[param.key],
          `${id}/${index}/${param.key}`,
        ).toBeGreaterThanOrEqual(param.min);
        expect(entry.p[param.key]).toBeLessThanOrEqual(param.max);
      }
      expect(entry.view).toBeTruthy();
      expect(entry.time).toBeGreaterThanOrEqual(0);
      // The quartet chapter intentionally keeps Aa × Aa to compare a new
      // sample-space presentation; learning-flow verifies that rendered change.
      const signature = JSON.stringify({
        ...entry,
        presentation:
          id === "inheritance" && index === 7 ? "quartet" : "default",
      });
      expect(
        signature,
        `${id}/${index} repeats previous demonstration`,
      ).not.toBe(previous);
      previous = signature;
    }
  }
});
it("starts conic and optics demonstrations at their actual mathematical conditions", () => {
  const conic = lessons.find((l) => l.id === "conics");
  const e = topicEntry(conic, topicChapters.conics, 1, defaults(conic));
  expect(e.p.tilt + e.p.alpha).toBe(90);
  const lens = lessons.find((l) => l.id === "lens");
  const equal = instrumentEntry(lens, lensChapters, 2, {}).p;
  expect(equal.u).toBe(2 * equal.f);
  expect(equal.screen).toBe(equal.u);
  const virtual = instrumentEntry(lens, lensChapters, 5, {}).p;
  expect(virtual.u).toBeLessThan(virtual.f);
});
