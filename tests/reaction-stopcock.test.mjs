import { expect, it } from "vitest";
import * as THREE from "three";
import { buildAdvanced } from "../src/AdvancedScene.js";
it("exposes the actual stopcock as an action and closes it on pause or when empty", () => {
  const root = new THREE.Group(),
    p = { copper: 50, base: 50, time: 2 };
  buildAdvanced(root, "precipitation", p);
  const valve = root.getObjectByName("reaction-stopcock"),
    handle = root.getObjectByName("reaction-valve-handle");
  expect(valve.userData.action).toBe("precipitation-valve");
  expect(handle.parent).toBe(valve);
  root.userData.update({ ...p, dosing: true });
  expect(handle.rotation.x).toBe(Math.PI / 2);
  root.userData.update({ ...p, dosing: false });
  expect(handle.rotation.x).toBe(0);
  root.userData.update({ ...p, time: 8, dosing: true });
  expect(handle.rotation.x).toBe(0);
  root.userData.update({ ...p, base: 0, dosing: true });
  expect(handle.rotation.x).toBe(0);
  root.userData.update({ ...p, time: 0, dosing: true });
  expect(handle.rotation.x).toBe(Math.PI / 2);
});
