import { expect, it } from "vitest";
import * as THREE from "three";
import { buildGlassLab } from "../src/GlassLab.js";
import { WATER_OUTLET } from "../src/WaterDispenser.js";

it("joins stream to outlet and surface and shuts off when paused or full", () => {
  const root = new THREE.Group(),
    p = { solute: 10, water: 90, add: 0 };
  buildGlassLab(root, "dilution", p);
  const stream = root.getObjectByName("dilution-water-stream"),
    geometry = stream.geometry;
  const ferrule = root.getObjectByName("water-outlet-ferrule");
  ferrule.geometry.computeBoundingBox();
  expect(ferrule.position.toArray()).toEqual(WATER_OUTLET);
  expect(ferrule.geometry.boundingBox.min.y).toBe(0);
  const fp = ferrule.geometry.attributes.position;
  for (let i = 0; i < fp.count; i++) {
    expect(Math.hypot(fp.getX(i), fp.getZ(i))).toBeGreaterThan(0.0269);
  }
  expect(root.getObjectByName("reservoir-cap-grip").count).toBe(24);
  expect(stream.visible).toBe(false);
  for (const add of [0, 100, 299]) {
    root.userData.update({ ...p, add, addingWater: true });
    expect(stream.visible).toBe(true);
    expect(stream.position.y + stream.scale.y / 2).toBeCloseTo(WATER_OUTLET[1]);
    const surfaces = [];
    root.traverse((o) => {
      if (o.name === "beaker-liquid-surface") surfaces.push(o);
    });
    const surface = surfaces[1];
    expect(stream.position.y - stream.scale.y / 2).toBeCloseTo(
      surface.position.y + surface.parent.position.y,
    );
    expect(stream.position.x).toBe(surface.parent.position.x);
    expect(stream.geometry).toBe(geometry);
  }
  root.userData.update({ ...p, add: 299, addingWater: false });
  expect(stream.visible).toBe(false);
  root.userData.update({ ...p, add: 300, addingWater: true });
  expect(stream.visible).toBe(false);
  root.userData.update({ ...p, add: 100, addingWater: true });
  root.userData.animate(0, false);
  root.userData.animate(50, false);
  const surfaces = [];
  root.traverse((o) => {
    if (o.name === "beaker-liquid-surface") surfaces.push(o);
  });
  const surface = surfaces[1];
  expect(surface.geometry.attributes.position.getY(0)).toBeLessThan(0);
  expect(stream.position.y - stream.scale.y / 2).toBeCloseTo(
    surface.parent.position.y +
      surface.position.y +
      surface.geometry.attributes.position.getY(0),
    10,
  );
  root.userData.animate(100, true);
  expect(stream.position.y - stream.scale.y / 2).toBeCloseTo(
    surface.parent.position.y + surface.position.y,
    10,
  );
});
