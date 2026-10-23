import { it, expect } from "vitest";
import * as T from "three";
import { sphericalLiquidLevel } from "../src/sphericalLiquid.mjs";
import { buildFlaskLiquid } from "../src/FlaskLiquid.js";
import { buildChemistryApparatus } from "../src/ChemistryApparatus.js";
import { distillationState } from "../src/chemistryTopics.mjs";
it("sphere-cap height reproduces volume rather than linearly scaling height", () => {
  const r = 0.565;
  for (let n = 0; n <= 100; n++) {
    const f = n / 100,
      q = sphericalLiquidLevel(r, f);
    expect(
      (q.height * q.height * (3 * r - q.height)) / (4 * r ** 3),
    ).toBeCloseTo(f, 10);
    expect(q.surfaceRadius ** 2 + q.y ** 2).toBeCloseTo(r * r, 10);
  }
  expect(sphericalLiquidLevel(r, 0.25).height).toBeGreaterThan(r / 2);
});
it("liquid surface stays horizontal, curved vertices stay on the bulb and updates reuse buffers", () => {
  const geometries = [],
    material = new T.MeshBasicMaterial(),
    liquid = buildFlaskLiquid(material, (g) => (geometries.push(g), g));
  const wall = liquid.group.getObjectByName("distillation-liquid-curved-wall"),
    surface = liquid.group.getObjectByName(
      "distillation-liquid-horizontal-surface",
    );
  const positions = wall.geometry.attributes.position;
  try {
    for (const mass of [200, 170, 145, 100, 1, 0]) {
      liquid.update(mass);
      liquid.group.updateMatrixWorld(true);
      expect(wall.geometry.attributes.position).toBe(positions);
      for (let i = 0; i < positions.count; i++) {
        const point = new T.Vector3().fromBufferAttribute(positions, i);
        expect(point.length()).toBeCloseTo(0.565, 6);
        expect(point.y).toBeLessThanOrEqual(
          liquid.group.userData.surfaceHeight + 1e-7,
        );
      }
      for (let i = 0; i < surface.geometry.attributes.position.count; i++) {
        const point = new T.Vector3()
          .fromBufferAttribute(surface.geometry.attributes.position, i)
          .applyMatrix4(surface.matrixWorld);
        expect(point.y).toBeCloseTo(liquid.group.userData.surfaceHeight, 8);
      }
      const version = positions.version;
      liquid.update(mass);
      expect(positions.version).toBe(version);
    }
  } finally {
    geometries.forEach((g) => g.dispose());
    material.dispose();
  }
});
it("distillation remaining mass drives the flask level with or without cooling", () => {
  const model = buildChemistryApparatus("distillation");
  try {
    const liquid = model.root.getObjectByName("distillation-flask-liquid");
    for (const cooling of [true, false])
      for (const time of [0, 120, 240]) {
        const p = { power: 800, cooling },
          q = distillationState(800, time, cooling);
        model.update(p, time, false);
        expect(liquid.userData.remainingMass).toBe(q.remaining);
        expect(liquid.userData.surfaceHeight).toBeCloseTo(
          sphericalLiquidLevel(0.565, q.remaining / 400).y,
          10,
        );
      }
  } finally {
    model.dispose();
  }
});
