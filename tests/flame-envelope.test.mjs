import { it, expect } from "vitest";
import { buildChemistryApparatus } from "../src/ChemistryApparatus.js";
it("keeps two reusable volumetric flame envelopes synchronized to the presentation clock", () => {
  const model = buildChemistryApparatus("flame");
  try {
    const outer = model.root.getObjectByName("flame-outer-envelope"),
      inner = model.root.getObjectByName("flame-blue-core");
    expect(outer.geometry.type).toBe("LatheGeometry");
    expect(inner.geometry).toBe(outer.geometry);
    expect(outer.material.uniforms.clock).toBe(inner.material.uniforms.clock);
    const positions = Array.from(outer.geometry.attributes.position.array);
    const p = { sample: "potassium", contamination: 0.7 };
    model.update(p, 2.5, true);
    expect(inner.material.uniforms.clock.value).toBe(2.5);
    expect(outer.material.uniforms.pollution.value).toBe(0.7);
    model.update(p, 2.5, false);
    expect(inner.material.uniforms.clock.value).toBe(2.5);
    expect(Array.from(outer.geometry.attributes.position.array)).toEqual(
      positions,
    );
    expect(inner.scale.y).toBeLessThan(outer.scale.y);
  } finally {
    model.dispose();
  }
});
