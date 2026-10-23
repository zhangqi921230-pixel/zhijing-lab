// @vitest-environment jsdom
import { it, expect, vi } from "vitest";
import { chemistryTopics } from "../src/chemistryTopics.mjs";
import {
  normalizeChemistrySession,
  loadChemistrySession,
  saveChemistrySession,
} from "../src/chemistrySession.mjs";
it("restores each chemistry topic independently and clamps untrusted state", () => {
  localStorage.clear();
  for (const lesson of chemistryTopics) {
    const state = {
      chapter: 4,
      p: lesson.chapters[4].preset,
      time: 12.3,
      view: "diagram",
      labels: false,
      running: true,
    };
    expect(saveChemistrySession(lesson, state)).toBe(true);
    const read = loadChemistrySession(lesson);
    expect(read.chapter).toBe(4);
    expect(read.time).toBe(12.3);
    expect(read.p).toEqual(state.p);
    expect(read.view).toBe("diagram");
    expect(read.labels).toBe(false);
    expect(read.running).toBeUndefined();
  }
  const lesson = chemistryTopics.find((x) => x.id === "electrolysis");
  const bad = normalizeChemistrySession(lesson, {
    chapter: 999,
    time: 99999,
    p: { current: -3, extra: 9 },
    view: "bad",
  });
  expect(bad.chapter).toBe(0);
  expect(bad.time).toBe(600);
  expect(bad.p).toEqual({ current: 0.2 });
  expect(bad.view).toBe("3d");
  localStorage.clear();
});
it("corrupted data or denied storage does not break teaching", () => {
  const lesson = chemistryTopics[0];
  localStorage.setItem("zhijing:chemistry:v1:flame", "broken");
  expect(loadChemistrySession(lesson).chapter).toBe(0);
  const mock = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("denied");
  });
  expect(saveChemistrySession(lesson, {})).toBe(false);
  mock.mockRestore();
  localStorage.clear();
});
