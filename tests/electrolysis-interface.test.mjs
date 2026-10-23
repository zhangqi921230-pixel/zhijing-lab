import { it, expect } from "vitest";
import { Matrix4, Vector3, Quaternion } from "three";
import { buildChemistryApparatus } from "../src/ChemistryApparatus.js";
import { electrolysisColumn } from "../src/electrolysisColumn.mjs";
import { electrolysisState } from "../src/chemistryTopics.mjs";
it("keeps visible bubbles below each moving liquid surface over the supported current and time range", () => {
  const model = buildChemistryApparatus("electrolysis");
  const matrix = new Matrix4(),
    pos = new Vector3(),
    scale = new Vector3(),
    rotation = new Quaternion();
  try {
    for (const current of [0.5, 1, 2])
      for (const time of [0, 30, 120, 300, 600]) {
        model.update({ current }, time, true);
        const state = electrolysisState(current, time);
        for (const [gas, volume] of [
          ["hydrogen", state.hydrogen],
          ["oxygen", state.oxygen],
        ]) {
          const column = electrolysisColumn(volume),
            liquid = model.root.getObjectByName(`${gas}-column-liquid`),
            surface = model.root.getObjectByName(`${gas}-meniscus`),
            bubbles = model.root.getObjectByName(`${gas}-bubbles`);
          expect(surface.position.y).toBeCloseTo(
            liquid.position.y + liquid.scale.y / 2,
            12,
          );
          expect(surface.position.y).toBeCloseTo(column.surface, 12);
          for (let i = 0; i < bubbles.count; i++) {
            bubbles.getMatrixAt(i, matrix);
            matrix.decompose(pos, rotation, scale);
            expect(pos.y + 0.025 * scale.y).toBeLessThan(column.surface);
            expect(pos.y - 0.025 * scale.y).toBeGreaterThan(0.66);
          }
          const before = Array.from(bubbles.instanceMatrix.array);
          model.update({ current }, time, false);
          expect(Array.from(bubbles.instanceMatrix.array)).toEqual(before);
        }
        if (time > 0)
          expect(
            electrolysisColumn(state.hydrogen).gasHeight /
              electrolysisColumn(state.oxygen).gasHeight,
          ).toBeCloseTo(2, 12);
      }
  } finally {
    model.dispose();
  }
});
