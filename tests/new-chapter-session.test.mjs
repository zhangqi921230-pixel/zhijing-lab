import { it, expect } from "vitest";
import { defaults, lessons } from "../src/lessons.mjs";
import { restoreSession, saveSession } from "../src/session.mjs";
const memory = () => {
  let value;
  return {
    getItem: () => value,
    setItem: (_, v) => {
      value = v;
    },
  };
};
it.each(["linear", "molecule", "conservation"])(
  "restores every %s chapter without preparing or changing saved parameters",
  (id) => {
    const lesson = lessons.find((l) => l.id === id),
      p = defaults(lesson),
      storage = memory();
    for (let chapter = 0; chapter < 5; chapter++)
      for (const view of ["perspective", "front", "top"]) {
        saveSession(
          lesson,
          { p, t: 0, records: [], observation: { chapter, view } },
          storage,
        );
        const result = restoreSession(lesson, storage);
        expect(result.observation.chapter).toBe(chapter);
        expect(result.observation.view).toBe(view);
        expect(result.p).toEqual(p);
      }
  },
);
it.each(["linear", "molecule", "conservation"])(
  "rejects corrupt %s navigation and retains valid data",
  (id) => {
    const lesson = lessons.find((l) => l.id === id),
      storage = memory();
    for (const chapter of [-1, 5, 1.5, "4", null]) {
      storage.setItem(
        "",
        JSON.stringify({
          version: 1,
          p: defaults(lesson),
          t: 0,
          records: [],
          observation: { chapter, view: "invalid" },
        }),
      );
      const result = restoreSession(lesson, storage);
      expect(result.observation.chapter).toBe(0);
      expect(result.observation.view).toBe("perspective");
    }
  },
);
