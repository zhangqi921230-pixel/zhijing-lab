import { it, expect } from "vitest";
import { Matrix4, Vector3, Quaternion } from "three";
import { buildChemistryApparatus } from "../src/ChemistryApparatus.js";
it("shows jacket flow before boiling, points uphill and freezes droplets when paused", () => {
  const model = buildChemistryApparatus("distillation");
  try {
    const flow = model.root.getObjectByName("condenser-cooling-direction"),
      drop = model.root.getObjectByName("distillation-drop");
    model.update({ power: 800, cooling: true }, 0, false);
    expect(flow.visible).toBe(true);
    expect(drop.visible).toBe(false);
    const m = new Matrix4(),
      pos = new Vector3(),
      q = new Quaternion(),
      scale = new Vector3();
    flow.getMatrixAt(0, m);
    m.decompose(pos, q, scale);
    const direction = new Vector3(0, 1, 0).applyQuaternion(q);
    expect(direction.x).toBeLessThan(0);
    expect(direction.y).toBeGreaterThan(0);
    expect(pos.z).toBeCloseTo(0.09, 6);
    model.update({ power: 800, cooling: true }, 120.3, true);
    const matrices = Array.from(flow.instanceMatrix.array),
      y = drop.position.y;
    model.update({ power: 800, cooling: true }, 120.3, false);
    expect(drop.visible).toBe(true);
    expect(drop.position.y).toBe(y);
    expect(Array.from(flow.instanceMatrix.array)).toEqual(matrices);
    model.update({ power: 800, cooling: false }, 120.3, false);
    expect(flow.visible).toBe(false);
    expect(drop.visible).toBe(false);
  } finally {
    model.dispose();
  }
});

it("inner-tube flow starts only after evaporation, freezes with time and distinguishes cooling", () => {
  const model = buildChemistryApparatus("distillation");
  try {
    const flow = model.root.getObjectByName("distillation-inner-flow");
    model.update({ power: 800, cooling: true }, 0, false);
    expect(flow.visible).toBe(false);
    model.update({ power: 800, cooling: true }, 120, true);
    expect(flow.visible).toBe(true);
    expect(flow.count).toBe(10);
    const matrices = Array.from(flow.instanceMatrix.array),
      colors = Array.from(flow.instanceColor.array);
    expect(
      new Set(
        Array.from({ length: 10 }, (_, i) =>
          colors.slice(i * 3, i * 3 + 3).join(","),
        ),
      ).size,
    ).toBe(2);
    model.update({ power: 800, cooling: true }, 120, false);
    expect(Array.from(flow.instanceMatrix.array)).toEqual(matrices);
    model.update({ power: 800, cooling: false }, 120, false);
    expect(flow.visible).toBe(true);
    const dry = Array.from(flow.instanceColor.array);
    expect(
      new Set(
        Array.from({ length: 10 }, (_, i) =>
          dry.slice(i * 3, i * 3 + 3).join(","),
        ),
      ).size,
    ).toBe(1);
    const m = new Matrix4(),
      pos = new Vector3(),
      rotation = new Quaternion(),
      scale = new Vector3();
    for (let i = 0; i < 10; i++) {
      flow.getMatrixAt(i, m);
      m.decompose(pos, rotation, scale);
      expect(pos.z).toBeCloseTo(0, 8);
      expect(pos.x).toBeGreaterThanOrEqual(-1.71);
      expect(pos.x).toBeLessThan(2.05);
      expect(pos.y).toBeGreaterThan(1);
      expect(pos.y).toBeLessThan(2.5);
    }
  } finally {
    model.dispose();
  }
});
it("contact ripple follows the liquid surface, pauses deterministically and releases its resources", () => {
  const model = buildChemistryApparatus("distillation");
  const ripple = model.root.getObjectByName("distillation-impact-ripple"),
    drop = model.root.getObjectByName("distillation-drop"),
    collected = model.root.getObjectByName("distillation-collected-liquid");
  let geometryDisposed = 0,
    materialDisposed = 0;
  ripple.geometry.addEventListener("dispose", () => geometryDisposed++);
  ripple.material.addEventListener("dispose", () => materialDisposed++);
  try {
    model.update({ power: 800, cooling: true }, 120.9, true);
    expect(ripple.visible).toBe(true);
    expect(drop.visible).toBe(false);
    const y = ripple.position.y,
      scale = ripple.scale.x,
      opacity = ripple.material.opacity;
    expect(y).toBeGreaterThan(0.21);
    expect(opacity).toBeGreaterThan(0);
    model.update({ power: 800, cooling: true }, 120.9, false);
    expect(ripple.position.y).toBe(y);
    expect(ripple.scale.x).toBe(scale);
    expect(ripple.material.opacity).toBe(opacity);
    model.update({ power: 800, cooling: true }, 180.9, false);
    expect(ripple.position.y).toBeGreaterThan(y);
    model.update({ power: 800, cooling: false }, 180.9, false);
    expect(ripple.visible).toBe(false);
    expect(drop.visible).toBe(false);
    model.update({ power: 800, cooling: true }, 0.9, false);
    expect(ripple.visible).toBe(false);
  } finally {
    model.dispose();
  }
  expect(geometryDisposed).toBe(1);
  expect(materialDisposed).toBe(1);
});
it("steam thermometer does not borrow pre-boiling liquid temperatures", () => {
  const model = buildChemistryApparatus("distillation");
  try {
    const column = model.root.getObjectByName(
        "distillation-steam-thermometer-column",
      ),
      scale = model.root.getObjectByName("distillation-thermometer-scale");
    expect(scale.geometry.attributes.position.count).toBe(34);
    model.update({ power: 800, cooling: true }, 40, false);
    expect(column.visible).toBe(false);
    model.update({ power: 800, cooling: true }, 120, false);
    expect(column.visible).toBe(true);
    const height = column.scale.y;
    model.update({ power: 800, cooling: true }, 200, false);
    expect(column.scale.y).toBe(height);
    model.update({ power: 200, cooling: true }, 120, false);
    expect(column.visible).toBe(false);
  } finally {
    model.dispose();
  }
});
