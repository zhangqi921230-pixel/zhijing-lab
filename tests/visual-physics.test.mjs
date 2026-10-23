import { it, expect } from "vitest";
import { waveState, buoyancyState } from "../src/visualPhysics.mjs";
import { lessons, defaults } from "../src/lessons.mjs";
import { calculate } from "../src/models.mjs";
import { topicChapters } from "../src/topicChapters.mjs";
import { saveSession, restoreSession } from "../src/session.mjs";
it("superposes waves, cancels opposite phases, and fixes standing-wave nodes", () => {
  const p = defaults(lessons.find((l) => l.id === "waves"));
  for (const t of [0, 0.23, 1, 2.6])
    for (const x of [0, 0.7, 3, 6]) {
      const a = waveState({ ...p, mode: 1 }, x, t);
      expect(a.total).toBeCloseTo(2 * a.first, 12);
      expect(waveState({ ...p, mode: 1, phase: 180 }, x, t).total).toBeCloseTo(
        0,
        12,
      );
      expect(waveState({ ...p, mode: 2 }, 2, t).total).toBeCloseTo(0, 12);
      expect(waveState(p, x + p.speed / p.frequency, t).total).toBeCloseTo(
        waveState(p, x, t).total,
        12,
      );
    }
});
it("balances floating and bottom contact and separates density from displaced volume", () => {
  const p = defaults(lessons.find((l) => l.id === "buoyancy"));
  const a = buoyancyState({ ...p, mode: 1 });
  expect(a.fraction).toBe(0.6);
  expect(a.force).toBeCloseTo(a.weight, 12);
  const sunk = buoyancyState({ ...p, mode: 1, solid: 1400 });
  expect(sunk.state).toBe("沉底平衡");
  expect(sunk.force + sunk.support).toBeCloseTo(sunk.weight, 12);
  const full = buoyancyState({ ...p, immersion: 100 });
  expect(full.force).toBeCloseTo(9.8, 12);
  expect(buoyancyState({ ...p, immersion: 100, solid: 1600 }).force).toBe(
    full.force,
  );
  expect(buoyancyState({ ...p, immersion: 0 }).force).toBe(0);
});
it.each(["waves", "buoyancy"])(
  "all %s teaching presets compute finite values and persist the fifth chapter",
  (id) => {
    const lesson = lessons.find((l) => l.id === id);
    for (const chapter of topicChapters[id])
      for (const scenario of chapter.scenarios) {
        const p = { ...defaults(lesson), ...scenario.p };
        expect(
          calculate(id, p, scenario.time ?? 0).every((v) =>
            Number.isFinite(v.value),
          ),
        ).toBe(true);
      }
    let saved;
    const storage = {
      getItem: () => saved,
      setItem: (_, v) => {
        saved = v;
      },
    };
    saveSession(
      lesson,
      { p: defaults(lesson), t: 1, records: [], observation: { chapter: 4 } },
      storage,
    );
    expect(restoreSession(lesson, storage).observation.chapter).toBe(4);
  },
);
