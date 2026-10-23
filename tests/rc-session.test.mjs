import { it, expect } from "vitest";
import { defaults, lessons } from "../src/lessons.mjs";
import { restoreSession, saveSession } from "../src/session.mjs";
const lesson = lessons.find((item) => item.id === "capacitor");
const memory = () => {
  let value;
  return {
    getItem: () => value,
    setItem: (_, next) => {
      value = next;
    },
  };
};

it("restores RC chapter and supported camera without re-preparing electrical state", () => {
  const storage = memory();
  const p = { ...defaults(lesson), mode: 1, initialRatio: 36.7879 };
  for (const chapter of [2, 3, 4]) {
    for (const view of [
      "perspective",
      "front",
      "top",
      "source",
      "selector",
      "plates",
    ]) {
      saveSession(
        lesson,
        {
          p,
          t: 2.5,
          records: [{ t: 1, parameters: p }],
          observation: { chapter, view },
        },
        storage,
      );
      const restored = restoreSession(lesson, storage);
      expect(restored.observation).toEqual({ chapter, view });
      expect(restored.p).toEqual(p);
      expect(restored.t).toBe(2.5);
      expect(restored.records).toHaveLength(1);
    }
  }
});

it("migrates old or invalid observations to the actual charging/discharging chapter", () => {
  const storage = memory();
  for (const mode of [0, 1]) {
    for (const observation of [
      undefined,
      null,
      { chapter: 99, view: "nucleus" },
      { chapter: 1 - mode, view: "bad" },
    ]) {
      storage.setItem(
        "",
        JSON.stringify({
          version: 1,
          p: { ...defaults(lesson), mode },
          t: 1,
          records: [],
          observation,
        }),
      );
      expect(restoreSession(lesson, storage).observation).toEqual({
        chapter: mode,
        view: "perspective",
      });
    }
  }
});
