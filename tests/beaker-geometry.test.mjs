import { expect, it } from "vitest";
import {
  beakerWallGeometry,
  beakerLipGeometry,
  beakerGraduationGeometry,
  beakerOuterRadius,
  BEAKER_SCALE_BOTTOM,
  BEAKER_SCALE_SPAN,
} from "../src/BeakerGeometry.js";
import * as THREE from "three";
import { beaker } from "../src/GlassLab.js";

it("wraps printed graduations around the actual tapered wall including the spout", () => {
  const geometry = beakerGraduationGeometry();
  const p = geometry.attributes.position;
  const normal = geometry.attributes.normal;
  for (let i = 0; i < p.count; i++) {
    const angle = Math.atan2(p.getX(i), p.getZ(i));
    const angular = Math.max(0, 1 - Math.abs(angle) / 0.38);
    const shoulder = THREE.MathUtils.smoothstep(p.getY(i), 2.27, 2.485);
    const outer = beakerOuterRadius(p.getY(i)) + 0.2 * angular ** 2 * shoulder;
    const clearance = Math.hypot(p.getX(i), p.getZ(i)) - outer;
    expect(clearance).toBeCloseTo(0.003, 6);
    expect(
      normal.getX(i) * Math.sin(angle) + normal.getZ(i) * Math.cos(angle),
    ).toBeGreaterThan(0); // Spout slopes are valid; every printed face must point outward.
  }
  expect(geometry.boundingBox.min.y).toBeCloseTo(0.1);
  expect(geometry.boundingBox.max.y).toBeCloseTo(2.42);
});

it("aligns each major relative-level tick with the centre of the meniscus", () => {
  const cup = beaker(new THREE.Group(), 0);
  for (let i = 0; i <= 5; i++) {
    cup.setLevel(i / 5);
    expect(cup.meniscus.position.y).toBeCloseTo(
      BEAKER_SCALE_BOTTOM + (BEAKER_SCALE_SPAN * i) / 5,
      10,
    );
  }
});

it("forms a matched glass pouring lip while preserving the circular bowl below it", () => {
  const wall = beakerWallGeometry(),
    lip = beakerLipGeometry();
  for (const geometry of [wall, lip]) {
    expect(
      Array.from(geometry.attributes.position.array).every(Number.isFinite),
    ).toBe(true);
    expect(
      Array.from(geometry.attributes.normal.array).every(Number.isFinite),
    ).toBe(true);
    expect(geometry.boundingBox.max.z).toBeGreaterThan(1.05);
    expect(geometry.boundingBox.min.z).toBeGreaterThan(-0.88);
  }
  const p = wall.attributes.position;
  for (let i = 0; i < p.count; i++) {
    if (p.getY(i) < 2.28)
      expect(Math.hypot(p.getX(i), p.getZ(i))).toBeLessThan(0.87);
  }
  expect(Math.abs(wall.boundingBox.max.z - lip.boundingBox.max.z)).toBeLessThan(
    0.01,
  );
});
