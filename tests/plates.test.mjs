import { expect, it } from "vitest";
import * as THREE from "three";
import { plateColumn, platePoint } from "../src/plateModel.mjs";
import { buildPlateScene } from "../src/PlateScene.js";
import { setPlateVisibility } from "../src/plateVisibility.mjs";

it("extends and thins a rift, shortens and thickens a collision, without inverting columns", () => {
  for (const type of [0, 1, 2])
    for (const progress of [0, 35, 100]) {
      for (const z of [-2, 0, 2])
        for (let u = 0; u <= 1; u += 0.05) {
          const q = plateColumn(u, z, { type, progress });
          expect(q.jacobian).toBeGreaterThan(0);
          expect(q.thickness * q.jacobian).toBeCloseTo(1.1, 12);
          const derivative =
            (plateColumn(u + 1e-5, z, { type, progress }).x - q.x) / 1e-5;
          expect(derivative).toBeCloseTo(q.jacobian * 3, 3);
        }
    }
  const rift = plateColumn(0, 0, { type: 0, progress: 100 });
  const mountain = plateColumn(0, 0, { type: 1, progress: 100 });
  expect(rift.thickness).toBeLessThan(1.1);
  expect(rift.top).toBeLessThan(0);
  expect(mountain.thickness).toBeGreaterThan(1.1);
  expect(mountain.top).toBeGreaterThan(0.8);
  expect(mountain.top - mountain.thickness).toBeLessThan(-1.1);
});
it("slides transform markers parallel to the fault without uplift or change of thickness", () => {
  for (const side of [-1, 1]) {
    const a = platePoint(side, 0.4, 0.1, 0, { type: 2, progress: 0 });
    const b = platePoint(side, 0.4, 0.1, 0, { type: 2, progress: 100 });
    expect(a[0]).toBe(b[0]);
    expect(a[1]).toBe(b[1]);
    expect(b[2] - a[2]).toBeCloseTo(side * 0.75);
  }
});
it("reuses all geometry and forest instances through boundary changes", () => {
  const root = new THREE.Group();
  buildPlateScene(root, { type: 0, progress: 0 });
  const objects = [...root.children],
    geometry = root.getObjectByName("plate--1").geometry;
  for (const type of [0, 1, 2])
    for (const progress of [0, 50, 100]) {
      root.userData.update({ type, progress });
      expect(root.children).toEqual(objects);
      expect(root.getObjectByName("plate--1").geometry).toBe(geometry);
      expect(
        [...geometry.attributes.position.array].every(Number.isFinite),
      ).toBe(true);
      expect(root.getObjectByName("plate-forest").count).toBe(180);
    }
  const version = geometry.attributes.position.version;
  root.userData.update({ type: 2, progress: 100 });
  expect(geometry.attributes.position.version).toBe(version);
});

it("hides only requested teaching layers and preserves their state across deformation", () => {
  const root = new THREE.Group();
  buildPlateScene(root, { type: 0, progress: 0 });
  const geometry = root.getObjectByName("plate--1").geometry;
  const version = geometry.attributes.position.version;
  setPlateVisibility(root, { vegetation: false, markers: false, arrows: true });
  expect(root.getObjectByName("plate-forest").visible).toBe(false);
  expect(root.getObjectByName("plate-trunks").visible).toBe(false);
  expect(root.getObjectByName("plate-marker-1").visible).toBe(false);
  expect(root.getObjectByName("plate-arrow-1").visible).toBe(true);
  expect(geometry.attributes.position.version).toBe(version);
  root.userData.update({ type: 1, progress: 100 });
  expect(root.getObjectByName("plate-forest").visible).toBe(false);
  expect(root.getObjectByName("plate--1").visible).toBe(true);
  setPlateVisibility(root, { vegetation: true, markers: true, arrows: false });
  expect(root.getObjectByName("plate-forest").visible).toBe(true);
  expect(root.getObjectByName("plate-marker-1").visible).toBe(true);
  expect(root.getObjectByName("plate-arrow-1").visible).toBe(false);
});
