import { it, expect } from "vitest";
import * as THREE from "three";
import { createRCSelectorHardware } from "../src/RCSelectorHardware.js";
import { createRCSelectorMotion } from "../src/RCSelectorMotion.js";
import { disposeSceneResources } from "../src/disposeSceneResources.mjs";
it("keeps the flat blade horizontal and the grip above its contact throughout turning", () => {
  const root = new THREE.Group(),
    common = [-0.7, -0.45, -1],
    contacts = [
      [-1.2, -0.45, -1.4],
      [-1.2, -0.45, -0.6],
    ];
  const { selector, grip } = createRCSelectorHardware(root, common, contacts);
  const motion = createRCSelectorMotion(selector, grip, common, contacts, 0);
  const geometries = [selector.geometry, grip.geometry];
  motion.setMode(1, 0);
  for (const time of [0, 60, 120, 180, 240]) {
    motion.sample(time);
    expect(
      new THREE.Vector3(1, 0, 0)
        .applyQuaternion(selector.quaternion)
        .distanceTo(new THREE.Vector3(0, 1, 0)),
    ).toBeLessThan(1e-10);
    grip.geometry.computeBoundingBox();
    expect(grip.geometry.boundingBox.min.y).toBeGreaterThanOrEqual(0.013);
    expect(selector.geometry).toBe(geometries[0]);
    expect(grip.geometry).toBe(geometries[1]);
  }
  expect(
    grip.position.distanceTo(new THREE.Vector3(...contacts[1])),
  ).toBeLessThan(1e-10);
  expect(grip.userData.key).toBe("mode");
  disposeSceneResources(root);
});
