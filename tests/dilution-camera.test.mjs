import { expect, it } from "vitest";
import * as THREE from "three";
import { buildGlassLab } from "../src/GlassLab.js";
import { frameDilution } from "../src/DilutionCamera.js";
import { disposeSceneResources } from "../src/disposeSceneResources.mjs";

it("frames the complete dilution bench across camera presets and viewport shapes", () => {
  const root = new THREE.Group();
  buildGlassLab(root, "dilution", { solute: 10, water: 90, add: 100 });
  const bounds = new THREE.Box3().setFromObject(root);
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  const controls = {
    target: new THREE.Vector3(),
    update() {
      camera.lookAt(this.target);
    },
  };
  function verify() {
    const points = [];
    for (const x of [bounds.min.x, bounds.max.x])
      for (const y of [bounds.min.y, bounds.max.y])
        for (const z of [bounds.min.z, bounds.max.z]) {
          const point = new THREE.Vector3(x, y, z).project(camera);
          expect(Math.abs(point.x)).toBeLessThanOrEqual(1 / 1.12 + 1e-7);
          expect(Math.abs(point.y)).toBeLessThanOrEqual(1 / 1.12 + 1e-7);
          expect(Math.abs(point.z)).toBeLessThan(1);
          points.push(point);
        }
    // At least one dimension fills the viewport instead of retaining the old distant framing.
    expect(
      Math.max(...points.flatMap((p) => [Math.abs(p.x), Math.abs(p.y)])),
    ).toBeGreaterThan(0.89);
  }
  for (const view of ["perspective", "front", "top"])
    for (const aspect of [2.2, 1.4, 1, 0.6, 0.4]) {
      camera.aspect = aspect;
      expect(frameDilution(camera, controls, root, view)).toBe(true);
      verify();
    }
  camera.position.add(new THREE.Vector3(1, 0.3, 2));
  camera.lookAt(controls.target);
  const direction = camera.getWorldDirection(new THREE.Vector3());
  camera.aspect = 0.5;
  frameDilution(camera, controls, root, "perspective", false);
  verify();
  expect(
    camera.getWorldDirection(new THREE.Vector3()).distanceTo(direction),
  ).toBeLessThan(1e-8);
  expect(frameDilution(camera, controls, root, "valve")).toBe(false);
  disposeSceneResources(root);
});
