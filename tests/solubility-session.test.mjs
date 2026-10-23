import { it, expect } from "vitest";
import { lessons, defaults } from "../src/lessons.mjs";
import { saveSession, restoreSession } from "../src/session.mjs";
import { solubilityObservation } from "../src/solubilityViews.mjs";

it("restores the crystallization chapter, closeup and representation without losing parameters or records", () => {
  const lesson = lessons.find((item) => item.id === "solubility");
  let stored;
  const storage = {
    getItem: () => stored,
    setItem: (_, value) => {
      stored = value;
    },
  };
  const p = { ...defaults(lesson), temp: 40, mass: 100 };
  for (const chapter of [0, 1, 2, 3, 4, 5])
    for (const view of [
      "perspective",
      "top",
      "front",
      "crystals",
      "thermometer",
    ]) {
      const observation = { chapter, view, representation: "diagram" };
      expect(
        saveSession(
          lesson,
          { p, t: 0, records: [{ parameters: p, t: 0 }], observation },
          storage,
        ),
      ).toBe(true);
      const restored = restoreSession(lesson, storage);
      expect(restored.observation).toEqual(observation);
      expect(restored.p).toEqual(p);
      expect(restored.records).toHaveLength(1);
    }
});

it("falls back safely for missing or invalid observation state", () => {
  for (const value of [
    undefined,
    null,
    {},
    { chapter: 6, view: "missing", representation: "bad" },
    { chapter: -1 },
    { chapter: 2.5 },
  ])
    expect(solubilityObservation(value)).toEqual({
      chapter: 0,
      view: "perspective",
      representation: "3d",
    });
});
