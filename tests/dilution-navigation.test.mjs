import { it, expect } from "vitest";
import { lessons, defaults } from "../src/lessons.mjs";
import { saveSession, restoreSession } from "../src/session.mjs";
import { dilutionViews, dilutionCloseViews } from "../src/dilutionViews.mjs";
it("稀释所有章节和视角可恢复，旧存档和异常视角安全回退且保留质量", () => {
  const lesson = lessons.find((l) => l.id === "dilution");
  const p = { ...defaults(lesson), add: 69.53 };
  let value;
  const storage = {
    getItem: () => value,
    setItem: (_, v) => {
      value = v;
    },
  };
  for (let chapter = 0; chapter < 6; chapter++)
    for (const view of [
      ...Object.keys(dilutionViews),
      ...Object.keys(dilutionCloseViews),
    ])
      for (const representation of ["3d", "diagram"]) {
        const observation = { chapter, view, representation };
        expect(
          saveSession(
            lesson,
            { p, t: 2, records: [{ t: 2, parameters: p }], observation },
            storage,
          ),
        ).toBe(true);
        const result = restoreSession(lesson, storage);
        expect(result.observation).toEqual(observation);
        expect(result.p.add).toBe(69.53);
        expect(result.records).toHaveLength(1);
      }
  for (const observation of [
    undefined,
    { chapter: 1.5, view: "unknown", representation: "bad" },
    { chapter: 6 },
  ]) {
    value = JSON.stringify({ version: 1, p, t: 2, records: [], observation });
    const result = restoreSession(lesson, storage);
    expect(result.observation).toEqual({
      chapter: 0,
      view: "perspective",
      representation: "3d",
    });
    expect(result.p.add).toBe(69.53);
  }
});
