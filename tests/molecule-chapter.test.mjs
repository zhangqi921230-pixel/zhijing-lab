import { expect, it } from "vitest";
import {
  moleculeChapter,
  prepareMoleculeChapter,
} from "../src/moleculeChapter.mjs";

it("enters every chapter from every molecule and ensemble state", () => {
  for (let type = 0; type < 4; type++)
    for (const ensemble of [0, 1]) {
      const p = { type, ensemble, spread: 1.2, lonePairs: 0 };
      for (let chapter = 0; chapter < 5; chapter++) {
        const next = prepareMoleculeChapter(p, chapter);
        expect(moleculeChapter(next, chapter)).toBe(chapter);
        expect(next.spread).toBe(p.spread);
        expect(next.ensemble).toBe(chapter === 3 ? 1 : 0);
        if (chapter === 2) {
          expect(next.lonePairs).toBe(1);
          expect([0, 2, 3]).toContain(next.type);
        }
      }
    }
});

it("follows ensemble controls and preserves the lone-pair chapter during comparisons", () => {
  for (const type of [0, 2, 3])
    expect(moleculeChapter({ type, ensemble: 0 }, 2)).toBe(2);
  for (let selected = 0; selected < 5; selected++)
    expect(moleculeChapter({ type: 0, ensemble: 1 }, selected)).toBe(3);
  expect(moleculeChapter({ type: 0, ensemble: 0 }, 3)).toBe(0);
  expect(moleculeChapter({ type: 1, ensemble: 0 }, 3)).toBe(1);
});
