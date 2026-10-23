import { it, expect } from "vitest";
import { lessons, defaults } from "../src/lessons.mjs";
import { restoreSession, saveSession } from "../src/session.mjs";

it("migrates old cell sessions and discards invalid observations without losing parameters or records", () => {
  const lesson = lessons.find((l) => l.id === "cell"),
    p = { ...defaults(lesson), part: 6, erMode: 2 };
  let value;
  const storage = {
    getItem: () => value,
    setItem: (_, next) => {
      value = next;
    },
  };
  for (const observation of [
    undefined,
    { chapter: 99, view: "reticulum" },
    { chapter: 5, view: "unknown" },
    { chapter: 5, view: "vacuole" },
  ]) {
    value = JSON.stringify({
      version: 1,
      p,
      t: 0,
      records: [{ t: 0, parameters: p }],
      observation,
    });
    const restored = restoreSession(lesson, storage);
    expect(restored.restored).toBe(true);
    expect(restored.p.erMode).toBe(2);
    expect(restored.records).toHaveLength(1);
    expect(restored.observation).toEqual({ chapter: 5, view: "perspective" });
  }
  saveSession(
    lesson,
    { p, t: 0, records: [], observation: { chapter: 5, view: "reticulum" } },
    storage,
  );
  expect(restoreSession(lesson, storage).observation).toEqual({
    chapter: 5,
    view: "reticulum",
  });
});

it("restores transport chapter and bounded progress, without restoring playback", () => {
  const lesson = lessons.find((l) => l.id === "cell");
  let value;
  const storage = {
    getItem: () => value,
    setItem: (_, next) => {
      value = next;
    },
  };
  for (const [input, expected] of [
    [75, 75],
    [150, 100],
    [-4, 0],
    [null, 0],
  ]) {
    saveSession(
      lesson,
      {
        p: {
          ...defaults(lesson),
          part: 0,
          cut: 100,
          secretoryMode: 1,
          secretoryProgress: input,
        },
        t: 0,
        records: [],
        observation: { chapter: 6, view: "perspective" },
      },
      storage,
    );
    const restored = restoreSession(lesson, storage);
    expect(restored.observation).toEqual({ chapter: 6, view: "perspective" });
    expect(restored.p.secretoryMode).toBe(1);
    expect(restored.p.secretoryProgress).toBe(expected);
    expect(restored.playing).toBeUndefined();
  }
});
