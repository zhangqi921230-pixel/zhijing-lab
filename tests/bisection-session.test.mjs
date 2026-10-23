import { expect, it } from "vitest";
import { defaults, lessons } from "../src/lessons.mjs";
import { restoreSession, saveSession } from "../src/session.mjs";
import {
  functionObservation,
  bisectionSignature,
} from "../src/functionObservation.mjs";
import { bisectionExport } from "../src/bisectionExport.mjs";
import { csvText } from "../src/csvDownload.mjs";
const lesson = lessons.find((l) => l.id === "functions");
const p = { ...defaults(lesson), b: -2 };
const progress = {
  signature: bisectionSignature(p),
  left: "0",
  right: "2",
  steps: 5,
};
it("restores the chapter and bisection progress without dropping prior experiment records", () => {
  let text;
  const storage = {
    setItem: (key, value) => {
      text = value;
    },
    getItem: () => text,
  };
  expect(
    saveSession(
      lesson,
      {
        p,
        t: 0,
        records: [{ parameters: p, t: 0 }],
        observation: { chapter: 9, bisection: progress },
      },
      storage,
    ),
  ).toBe(true);
  const restored = restoreSession(lesson, storage);
  expect(restored.observation).toEqual({ chapter: 9, bisection: progress });
  expect(restored.records).toHaveLength(1);
  expect(restored.records[0].parameters).toEqual(p);
  expect(
    saveSession(
      lesson,
      { p, t: 0, records: [], observation: {} },
      {
        setItem() {
          throw Error("full");
        },
      },
    ),
  ).toBe(false);
});
it("sanitizes corrupt progress, invalid brackets and stale function identities", () => {
  expect(
    functionObservation(
      { chapter: 999, bisection: { ...progress, steps: 100 } },
      p,
    ).chapter,
  ).toBe(0);
  expect(
    functionObservation({ bisection: { ...progress, steps: 100 } }, p).bisection
      .steps,
  ).toBe(0);
  expect(
    functionObservation({ bisection: { ...progress, left: "" } }, p).bisection,
  ).toMatchObject({ left: "", steps: 0 });
  expect(
    functionObservation({ bisection: progress }, { ...p, b: 1 }).bisection
      .steps,
  ).toBe(0);
  expect(
    functionObservation({ bisection: { ...progress, left: {} } }, p).bisection
      .left,
  ).toBe("0");
});
it("exports actual bisection history and unrounded final bounds with BOM and quoted CSV cells", () => {
  const rows = bisectionExport(p, "0", "2", 5);
  expect(rows).toContainEqual(["当前保留区间", 1.375, 1.4375]);
  expect(rows).toContainEqual(["中点近似值", 1.40625]);
  expect(rows).toContainEqual(["误差上界", 0.03125]);
  expect(rows).toContainEqual([1, 0, 2, 1, -1]);
  expect(csvText(rows).startsWith("\uFEFF")).toBe(true);
  expect(csvText([['a,"b']])).toBe('\uFEFF"a,""b"');
  expect(bisectionExport({ ...p, type: 3, shift: 1 }, "0", "2", 5)).toBeNull();
});
