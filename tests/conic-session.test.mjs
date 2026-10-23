import { it, expect } from "vitest";
import { lessons, defaults } from "../src/lessons.mjs";
import { restoreSession, saveSession } from "../src/session.mjs";
import { prepareConicChapter } from "../src/conicObservation.mjs";
import { conicState } from "../src/conicGeometry.mjs";
const lesson = lessons.find((l) => l.id === "conics");
it("prepares relevant chapter specimens from defaults", () => {
  const p = defaults(lesson);
  expect(conicState(prepareConicChapter(p, 1)).kind).toBe("抛物线");
  expect(conicState(prepareConicChapter(p, 2)).kind).toBe("双曲线");
  expect(conicState(prepareConicChapter(p, 4)).degenerate).toBe(true);
  expect(prepareConicChapter(p, 6).showSpheres).toBe(1);
  expect(prepareConicChapter(p, 0).showSpheres).toBe(p.showSpheres);
});
it("preserves valid chapter and view, migrates old observations without discarding records", () => {
  let value;
  const storage = {
    getItem: () => value,
    setItem: (_, v) => {
      value = v;
    },
  };
  const p = { ...defaults(lesson), tilt: 60 };
  for (const observation of [undefined, { chapter: 99, view: "invalid" }]) {
    value = JSON.stringify({
      version: 1,
      p,
      t: 0,
      records: [{ t: 0, parameters: p }],
      observation,
    });
    const restored = restoreSession(lesson, storage);
    expect(restored.observation).toEqual({ chapter: 1, view: "perspective" });
    expect(restored.records).toHaveLength(1);
  }
  saveSession(
    lesson,
    { p, t: 0, records: [], observation: { chapter: 5, view: "top" } },
    storage,
  );
  expect(restoreSession(lesson, storage).observation).toEqual({
    chapter: 5,
    view: "top",
  });
});
