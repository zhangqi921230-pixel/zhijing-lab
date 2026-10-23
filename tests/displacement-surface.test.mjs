import { it, expect, vi } from "vitest";
import { buildChemistryApparatus } from "../src/ChemistryApparatus.js";
import {
  chemistryOverview,
  displacementSurfaceView,
} from "../src/chemistryViews.mjs";
it("copper annotation appears only after deposition and follows settling when metal is exhausted", () => {
  const model = buildChemistryApparatus("displacement");
  try {
    const label = model.labels.find((l) => l.text === "析出铜");
    model.update({ metal: "iron", mass: 0.2 }, 0, false);
    expect(label.visible).toBe(false);
    model.update({ metal: "iron", mass: 0.84 }, 30, false);
    expect(label.visible).toBe(true);
    expect(label.pos[1]).toBeCloseTo(0.7);
    model.update({ metal: "iron", mass: 0.2 }, 60, false);
    expect(label.pos[1]).toBeCloseTo(0.25);
    model.update({ metal: "copper", mass: 0.56 }, 60, false);
    expect(label.visible).toBe(false);
  } finally {
    model.dispose();
  }
});
it("surface detail is one small geometry, inherits metal visibility and is disposed with the apparatus", () => {
  const model = buildChemistryApparatus("displacement"),
    surface = model.root.getObjectByName("displacement-metal-surface-detail"),
    strip = model.root.getObjectByName("displacement-original-metal");
  expect(surface.parent).toBe(strip);
  expect(surface.geometry.attributes.position.count).toBe(112);
  const geometry = surface.geometry,
    material = surface.material,
    dispose = vi.fn();
  geometry.addEventListener("dispose", dispose);
  material.addEventListener("dispose", dispose);
  for (let i = 0; i <= 60; i++) {
    model.update({ metal: "iron", mass: 0.2 }, i, false);
    expect(surface.geometry).toBe(geometry);
    expect(surface.material).toBe(material);
  }
  expect(strip.visible).toBe(false);
  model.dispose();
  expect(dispose).toHaveBeenCalledTimes(2);
});
it("surface camera allows a closer orbit without changing the target to another apparatus", () => {
  const distance = (v) =>
    Math.hypot(...v.position.map((n, i) => n - v.target[i]));
  expect(distance(displacementSurfaceView)).toBeLessThan(
    distance(chemistryOverview),
  );
  expect(distance(displacementSurfaceView)).toBeGreaterThan(
    displacementSurfaceView.minDistance,
  );
  expect(displacementSurfaceView.target).toEqual([0, 0.9, 0]);
});
