import { expect, it } from "vitest";
import * as THREE from "three";
import { addCircuitMeter } from "../src/CircuitMeter.js";

it("mechanical needle matches every major tick of the canvas dial", () => {
  for (const range of [3, 15]) {
    for (let i = 0; i <= 6; i++) {
      const root = new THREE.Group();
      const meter = addCircuitMeter(root, [0, 0, 0], range, "test");
      meter.set((range * i) / 6);
      root.updateMatrixWorld(true);
      const tip = root
        .getObjectByName("circuit-pointer-test")
        .localToWorld(new THREE.Vector3(178, 0, 0));
      const angle = Math.PI + (i / 6) * Math.PI;
      expect(tip.x).toBeCloseTo((Math.cos(angle) * 178 * 1.37) / 768);
      expect(tip.y).toBeCloseTo(
        (0.5 - (255 + Math.sin(angle) * 178) / 384) * 0.74,
      );
    }
  }
});

it("needle motion settles, retargets without a jump and honors reduced motion", () => {
  const root = new THREE.Group();
  const meter = addCircuitMeter(root, [0, 0, 0], 3, "A");
  const pointer = root.getObjectByName("circuit-pointer-A");
  meter.set(0);
  meter.set(3);
  expect(meter.animate(0, false)).toBe(true);
  meter.animate(210, false);
  expect(pointer.rotation.z).toBeCloseTo(Math.PI / 2);
  meter.set(0);
  meter.animate(211, false);
  expect(pointer.rotation.z).toBeCloseTo(Math.PI / 2);
  expect(meter.animate(631, false)).toBe(false);
  expect(pointer.rotation.z).toBe(Math.PI);
  meter.set(3);
  expect(meter.animate(632, true)).toBe(false);
  expect(pointer.rotation.z).toBe(0);
  expect(meter.animate(1000, false)).toBe(false);
});
