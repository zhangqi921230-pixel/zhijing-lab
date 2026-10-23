import { it, expect } from "vitest";
import { lessons, defaults } from "../src/lessons.mjs";
import { saveSession, restoreSession } from "../src/session.mjs";
it("restores the seismic fifth chapter and station closeup without confusing water views", () => {
  let stored;
  const storage = {
    getItem: () => stored,
    setItem: (_, value) => {
      stored = value;
    },
  };
  for (const id of ["water", "earthquake"]) {
    const lesson = lessons.find((l) => l.id === id);
    saveSession(
      lesson,
      {
        p: defaults(lesson),
        t: 10,
        records: [],
        observation: { chapter: 4, view: "station" },
      },
      storage,
    );
    const q = restoreSession(lesson, storage);
    expect(q.observation.chapter).toBe(4);
    expect(q.observation.view).toBe(
      id === "earthquake" ? "station" : "perspective",
    );
  }
});
it("restores all watershed lessons with their view and parameters and rejects invalid chapter IDs", () => {
  const lesson = lessons.find((l) => l.id === "water");
  let stored;
  const storage = {
    getItem: () => stored,
    setItem: (_, v) => {
      stored = v;
    },
  };
  const p = { ...defaults(lesson), infil: 70 };
  for (const chapter of [0, 1, 2, 3, 4, 5, 6, 7]) {
    const observation = { chapter, view: "front", representation: "3d" };
    saveSession(lesson, { p, t: 0, records: [], observation }, storage);
    expect(restoreSession(lesson, storage).observation).toEqual(observation);
    expect(restoreSession(lesson, storage).p.infil).toBe(70);
  }
  saveSession(
    lesson,
    { p, t: 0, records: [], observation: { chapter: 99, view: "bad" } },
    storage,
  );
  expect(restoreSession(lesson, storage).observation).toEqual({
    chapter: 0,
    view: "perspective",
    representation: "3d",
  });
});
