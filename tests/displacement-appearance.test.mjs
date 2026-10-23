import { it, expect } from "vitest";
import { buildChemistryApparatus } from "../src/ChemistryApparatus.js";
import { displacementAppearance } from "../src/displacementAppearance.mjs";
import { displacementState } from "../src/chemistryTopics.mjs";
import { Matrix4, Vector3 } from "three";
it("removes exhausted original metal while retaining copper in the vessel, with excess and copper controls", () => {
  const model = buildChemistryApparatus("displacement"),
    matrix = new Matrix4(),
    position = new Vector3();
  try {
    const strip = model.root.getObjectByName("displacement-original-metal"),
      grains = model.root.getObjectByName("displacement-deposited-copper");
    for (const [metal, molar] of [
      ["iron", 55.845],
      ["zinc", 65.38],
    ]) {
      model.update({ metal, mass: molar * 0.005 }, 60, false);
      expect(strip.visible).toBe(false);
      for (let i = 0; i < grains.count; i++) {
        grains.getMatrixAt(i, matrix);
        position.setFromMatrixPosition(matrix);
        expect(position.y).toBeLessThan(0.3);
        expect(position.y).toBeGreaterThan(0.2);
      }
      model.update({ metal, mass: molar * 0.015 }, 60, false);
      expect(strip.visible).toBe(true);
      expect(strip.scale.z).toBeCloseTo(0.085 / 3, 12);
    }
    model.update({ metal: "copper", mass: 0.5 }, 60, false);
    expect(strip.visible).toBe(true);
    expect(strip.scale.z).toBe(0.085);
    const state = displacementState("copper", 0.5, 1);
    expect(displacementAppearance("copper", 0.5, state).settling).toBe(0);
  } finally {
    model.dispose();
  }
});
