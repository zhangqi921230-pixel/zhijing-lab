import { it, expect } from "vitest";
import { lessons, defaults } from "../src/lessons.mjs";
import { restoreSession, saveSession } from "../src/session.mjs";
it("round-trips exact function parameters without slider-step quantisation", () => {
  const lesson = lessons.find((l) => l.id === "functions");
  const p = {
    ...defaults(lesson),
    a: 1.25,
    k: 0.75,
    shift: -0.125,
    b: 0.375,
    probe: Math.PI / 6,
  };
  let saved;
  const storage = { setItem: (_, v) => (saved = v), getItem: () => saved };
  saveSession(lesson, { p, t: (p.probe + 5) * 2, records: [] }, storage);
  const restored = restoreSession(lesson, storage);
  expect(restored.restored).toBe(true);
  expect(restored.p).toEqual(p);
});
