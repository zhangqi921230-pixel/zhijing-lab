import { it, expect } from "vitest";
import {
  electrolysisState,
  displacementState,
  distillationState,
  FARADAY,
  chemistryTopics,
} from "../src/chemistryTopics.mjs";
it("Faraday charge gives a 2:1 gas volume ratio and scales with current and time", () => {
  const a = electrolysisState(1, 600),
    b = electrolysisState(2, 600);
  expect(a.hydrogen / a.oxygen).toBeCloseTo(2, 12);
  expect(b.hydrogen).toBeCloseTo(2 * a.hydrogen, 10);
  expect(electrolysisState(0, 100).hydrogen).toBe(0);
  expect(electrolysisState(1, 2 * FARADAY).hydrogen).toBeCloseTo(24465.4037, 2);
});
it("copper displacement respects both limiting reagents and does not react with copper metal", () => {
  expect(displacementState("iron", 10, 1).copper).toBeCloseTo(0.63546, 8);
  expect(displacementState("iron", 0.1, 1).extent).toBeCloseTo(
    0.1 / 55.845,
    10,
  );
  expect(displacementState("copper", 1, 1).extent).toBe(0);
  for (const metal of ["iron", "zinc"]) {
    const s = displacementState(metal, 0.3, 0.7);
    expect(s.extent + s.remaining).toBeCloseTo(0.01, 12);
  }
});
it("distillation warms before evaporation and conserves water and nonvolatile salt", () => {
  expect(distillationState(400, 10).evaporated).toBe(0);
  for (const cooling of [true, false]) {
    const s = distillationState(800, 240, cooling);
    expect(s.temperature).toBe(100);
    expect(s.remaining + s.collected + s.lost).toBeCloseTo(200, 10);
    expect(s.salt).toBe(2);
    expect(s.remaining).toBeGreaterThan(100);
  }
  expect(distillationState(800, 240, false).collected).toBe(0);
});
it("four chemistry themes retain distinct core presets and the salt lesson reuses the controlled collection conditions", () => {
  expect(chemistryTopics).toHaveLength(4);
  for (const topic of chemistryTopics) {
    expect(topic.chapters.length).toBeGreaterThanOrEqual(4);
    const core =
      topic.id === "distillation"
        ? topic.chapters.slice(0, 5)
        : topic.id === "flame"
          ? topic.chapters.slice(0, 6)
          : topic.id === "displacement"
            ? topic.chapters.slice(0, 5)
            : topic.chapters;
    expect(new Set(core.map((x) => JSON.stringify(x.preset))).size).toBe(
      core.length,
    );
    if (topic.id === "flame") {
      expect(topic.chapters[6].title).toBe("从激发到发光");
      expect(topic.chapters[6].preset).toEqual(topic.chapters[0].preset);
    }
    if (topic.id === "displacement") {
      expect(topic.chapters).toHaveLength(6);
      expect(topic.chapters[5].title).toBe("铜离子怎样变成铜");
      expect(topic.chapters[5].preset).toEqual(topic.chapters[0].preset);
    }
    if (topic.id === "distillation") {
      expect(topic.chapters).toHaveLength(6);
      expect(topic.chapters[5].preset).toEqual(topic.chapters[2].preset);
    }
  }
});
