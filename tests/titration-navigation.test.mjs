import { it, expect } from "vitest";
import { lessons, defaults } from "../src/lessons.mjs";
import { restoreSession, saveSession } from "../src/session.mjs";
import { titrationViews } from "../src/titrationNavigation.mjs";

it("滴定章节、器材视图和呈现方式往返保存，不损失小数投料及记录", () => {
  const lesson = lessons.find((l) => l.id === "acid"),
    p = { ...defaults(lesson), base: 49.9993 };
  let value;
  const storage = {
    getItem: () => value,
    setItem: (_, v) => {
      value = v;
    },
  };
  for (const view of titrationViews)
    for (const representation of ["3d", "diagram"]) {
      const observation = { chapter: 3, view, representation };
      expect(
        saveSession(
          lesson,
          { p, t: 0, records: [{ t: 0, parameters: p }], observation },
          storage,
        ),
      ).toBe(true);
      const result = restoreSession(lesson, storage);
      expect(result.observation).toEqual(observation);
      expect(result.p.base).toBe(49.9993);
      expect(result.records).toHaveLength(1);
    }
  for (const observation of [
    undefined,
    { chapter: 99, view: "unknown", representation: "invalid" },
  ]) {
    value = JSON.stringify({ version: 1, p, t: 0, records: [], observation });
    const restored = restoreSession(lesson, storage);
    expect(restored.observation).toEqual({
      chapter: 0,
      view: "perspective",
      representation: "3d",
    });
    expect(restored.p.base).toBe(49.9993);
  }
});
