import { expect, it } from "vitest";
import * as THREE from "three";
import {
  liquidSurfaceGeometry,
  MENISCUS_RISE,
  beakerLiquidWall,
} from "../src/LiquidSurface.js";
import { buildGlassLab } from "../src/GlassLab.js";
import { beakerInnerRadius } from "../src/BeakerGeometry.js";

it("reuses the curved liquid wall without uploading unchanged levels", () => {
  const wall = beakerLiquidWall();
  wall.update(1.2);
  const version = wall.geometry.attributes.position.version;
  wall.update(1.2);
  expect(wall.geometry.attributes.position.version).toBe(version);
  wall.update(1.3);
  expect(wall.geometry.attributes.position.version).toBe(version + 1);
  expect(wall.geometry.index.count / 3).toBeLessThan(1500);
});

it("keeps a lower central surface and upward-facing normals", () => {
  const geometry = liquidSurfaceGeometry(),
    p = geometry.attributes.position,
    n = geometry.attributes.normal;
  expect(p.getY(0)).toBe(0);
  for (let i = 0; i < p.count; i++) {
    expect(p.getY(i)).toBeGreaterThanOrEqual(0);
    expect(p.getY(i)).toBeLessThanOrEqual(MENISCUS_RISE + 1e-7);
    expect(n.getY(i)).toBeGreaterThan(0);
  }
  expect(p.getY(p.count - 1)).toBeCloseTo(MENISCUS_RISE);
});

it("keeps liquid side and meniscus edge joined across mass changes without rebuilding", () => {
  const root = new THREE.Group();
  buildGlassLab(root, "dilution", { solute: 10, water: 90, add: 100 });
  const surfaces = [];
  root.traverse((o) => {
    if (o.name === "beaker-liquid-surface") surfaces.push(o);
  });
  const geometry = surfaces.map((s) => s.geometry);
  for (const add of [0, 50, 100, 200, 300]) {
    root.userData.update({ solute: 10, water: 90, add });
    surfaces.forEach((surface, index) => {
      const wall = surface.parent.getObjectByName("beaker-liquid-wall");
      expect(wall.geometry.boundingBox.max.y).toBeCloseTo(
        surface.position.y + MENISCUS_RISE,
      );
      expect(wall.geometry.boundingBox.min.y).toBeCloseTo(0.07);
      const position = wall.geometry.attributes.position;
      for (let i = 0; i < position.count; i++) {
        const radius = Math.hypot(position.getX(i), position.getZ(i));
        expect(beakerInnerRadius(position.getY(i)) - radius).toBeCloseTo(
          0.001,
          6,
        );
      }
      expect(surface.scale.x * 0.811).toBeCloseTo(
        beakerInnerRadius(surface.position.y + MENISCUS_RISE) - 0.001,
        6,
      );
      expect(surface.scale.z).toBe(surface.scale.x);
      expect(surface.geometry).toBe(geometry[index]);
    });
  }
});
