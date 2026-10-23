import { it, expect } from "vitest";
import { topicChapters } from "../src/topicChapters.mjs";
import { lessons, defaults } from "../src/lessons.mjs";
import { saveSession, restoreSession } from "../src/session.mjs";
const ids = Object.keys(topicChapters).filter(
  (id) => !["cell", "conics", "functions", "capacitor"].includes(id),
);
const memory = () => {
  let value;
  return {
    getItem: () => value,
    setItem: (_, v) => {
      value = v;
    },
  };
};
it.each(ids)(
  "round trips all configured %s chapter indices and rejects beyond the actual list",
  (id) => {
    const lesson = lessons.find((l) => l.id === id),
      p = defaults(lesson),
      storage = memory();
    for (let chapter = 0; chapter < topicChapters[id].length; chapter++) {
      saveSession(
        lesson,
        {
          p,
          t: 0,
          records: [],
          observation: { chapter, view: "top", representation: "diagram" },
        },
        storage,
      );
      const saved = restoreSession(lesson, storage);
      expect(saved.observation).toEqual({
        chapter,
        view: "top",
        representation: "diagram",
      });
      expect(saved.p).toEqual(p);
    }
    saveSession(
      lesson,
      {
        p,
        t: 0,
        records: [],
        observation: { chapter: topicChapters[id].length, view: "invalid" },
      },
      storage,
    );
    expect(restoreSession(lesson, storage).observation.chapter).toBe(0);
  },
);
it.each([
  ["photosynthesis", "leaf"],
  ["photosynthesis", "lamp"],
  ["photosynthesis", "readout"],
  ["biodiversity", "plant"],
  ["biodiversity", "fungus"],
  ["biodiversity", "insect"],
  ["incline", "block"],
])("preserves %s instrument view %s", (id, view) => {
  const lesson = lessons.find((l) => l.id === id),
    storage = memory();
  saveSession(
    lesson,
    {
      p: defaults(lesson),
      t: 0,
      records: [],
      observation: { chapter: 1, view },
    },
    storage,
  );
  expect(restoreSession(lesson, storage).observation.view).toBe(view);
});
