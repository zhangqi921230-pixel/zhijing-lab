import { expect, it } from "vitest";
import * as THREE from "three";
import { framePrecipitation } from "../src/PrecipitationCamera.js";
import { buildAdvanced } from "../src/AdvancedScene.js";
import { disposeSceneResources } from "../src/disposeSceneResources.mjs";

it.each([
  [
    "precipitation",
    { copper: 50, base: 100, time: 0 },
    ["perspective", "front", "top", "dosing", "sediment", "volumeReadout"],
  ],
  [
    "volcano",
    { type: 1, intensity: 3, cut: 1, labels: 1, time: 8 },
    ["volcanoCrater", "volcanoInterior"],
  ],
])(
  "contains %s focus bounds across desktop and portrait viewports",
  (id, parameters, views) => {
    const root = new THREE.Group();
    buildAdvanced(root, id, parameters);
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    const controls = {
      target: new THREE.Vector3(),
      update() {
        camera.lookAt(this.target);
      },
    };
    const verify = (view) => {
      camera.updateMatrixWorld();
      const box = root.userData.focusBounds[view];
      for (const x of [box.min.x, box.max.x])
        for (const y of [box.min.y, box.max.y])
          for (const z of [box.min.z, box.max.z]) {
            const p = new THREE.Vector3(x, y, z).project(camera);
            expect(Math.abs(p.x)).toBeLessThanOrEqual(1 / 1.12 + 1e-8);
            expect(Math.abs(p.y)).toBeLessThanOrEqual(1 / 1.12 + 1e-8);
            expect(Math.abs(p.z)).toBeLessThan(1);
          }
    };
    for (const view of views) {
      for (const aspect of [2.1, 1.4, 0.75, 0.5]) {
        camera.aspect = aspect;
        expect(framePrecipitation(camera, controls, root, view)).toBe(true);
        verify(view);
      }
      camera.position.add(new THREE.Vector3(1, 0.2, 0));
      camera.lookAt(controls.target);
      const direction = camera.getWorldDirection(new THREE.Vector3());
      camera.aspect = 0.45;
      framePrecipitation(camera, controls, root, view, false);
      verify(view);
      expect(
        camera.getWorldDirection(new THREE.Vector3()).distanceTo(direction),
      ).toBeLessThan(1e-8);
    }
    const position = camera.position.clone();
    expect(framePrecipitation(camera, controls, root, "unknown-view")).toBe(
      false,
    );
    expect(camera.position.equals(position)).toBe(true);
    disposeSceneResources(root);
  },
);

it("places the reading eye at the liquid level for initial and mixed volumes", () => {
  const root = new THREE.Group();
  buildAdvanced(root, "precipitation", { copper: 50, base: 75, time: 0 });
  const camera = new THREE.PerspectiveCamera(40, 1.4, 0.1, 100);
  const controls = {
    target: new THREE.Vector3(),
    update() {
      camera.lookAt(this.target);
    },
  };
  for (const time of [0, 4, 8, 20]) {
    root.userData.update({ copper: 50, base: 75, time });
    framePrecipitation(camera, controls, root, "volumeReadout");
    expect(camera.position.y).toBeCloseTo(
      root.userData.measurement.surface,
      10,
    );
    expect(controls.target.y).toBeCloseTo(camera.position.y, 10);
    expect(camera.getWorldDirection(new THREE.Vector3()).y).toBeCloseTo(0, 10);
  }
  disposeSceneResources(root);
});
