import { expect, it } from "vitest";
import * as THREE from "three";
import { buildGlassLab } from "../src/GlassLab.js";
import { PROBE_TIP } from "../src/TemperatureProbe.js";

it("leaves the probe collar open and keeps the arm outside the rubber handle", () => {
  const root = new THREE.Group();
  buildGlassLab(root, "solubility", { temp: 20, water: 100, mass: 50 });
  root.updateMatrixWorld(true);
  const collar = root.getObjectByName("temperature-probe-collar");
  const ray = new THREE.Raycaster(
    new THREE.Vector3(-0.45, 3, -0.35),
    new THREE.Vector3(0, -1, 0),
  );
  expect(ray.intersectObject(collar)).toHaveLength(0);
  ray.ray.origin.x += 0.075;
  expect(ray.intersectObject(collar).length).toBeGreaterThan(0);
  const arm = root.getObjectByName("temperature-clamp-arm"),
    vertices = arm.geometry.attributes.position;
  const point = new THREE.Vector3();
  for (let i = 0; i < vertices.count; i++) {
    point.fromBufferAttribute(vertices, i).applyMatrix4(arm.matrixWorld);
    expect(Math.hypot(point.x + 0.45, point.z + 0.35)).toBeGreaterThan(0.057);
  }
  for (const name of ["stand", "probe"]) {
    const grips = root.getObjectByName(`temperature-${name}-thumbwheel-grips`);
    expect(grips.isInstancedMesh).toBe(true);
    expect(grips.count).toBe(12);
  }
});

it("keeps the sensing tip immersed without penetrating the vessel bottom or wall", () => {
  const root = new THREE.Group();
  buildGlassLab(root, "solubility", { temp: 20, water: 50, mass: 50 });
  root.updateMatrixWorld(true);
  expect(PROBE_TIP[1]).toBeGreaterThan(-0.4725 + 0.07);
  expect(Math.hypot(PROBE_TIP[0], PROBE_TIP[2]) + 0.025).toBeLessThan(0.79);
  const stem = root.getObjectByName("temperature-sensing-stem");
  expect(new THREE.Box3().setFromObject(stem).min.y).toBeCloseTo(PROBE_TIP[1]);
  let surface;
  root.traverse((o) => {
    if (o.name === "beaker-liquid-surface") surface = o;
  });
  const geometry = stem.geometry;
  for (const water of [50, 100, 200]) {
    root.userData.update({ temp: 60, water, mass: 50 });
    root.updateMatrixWorld(true);
    expect(surface.getWorldPosition(new THREE.Vector3()).y).toBeGreaterThan(
      PROBE_TIP[1],
    );
    expect(stem.geometry).toBe(geometry);
  }
});
