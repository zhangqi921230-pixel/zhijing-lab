import { expect, it } from "vitest";
import * as T from "three";
import { createRCSelectorMotion } from "../src/RCSelectorMotion.js";

it("keeps the pivot fixed, reverses continuously and supports reduced motion", () => {
  const common = [-0.7, -0.45, -1],
    contacts = [
      [-1.2, -0.45, -1.4],
      [-1.2, -0.45, -0.6],
    ];
  const length = new T.Vector3(...common).distanceTo(
    new T.Vector3(...contacts[0]),
  );
  const selector = new T.Mesh(new T.CylinderGeometry(0.055, 0.055, length)),
    grip = new T.Object3D();
  const motion = createRCSelectorMotion(selector, grip, common, contacts, 0);
  motion.setMode(1, 0);
  expect(motion.sample(120)).toBe(true);
  selector.updateMatrixWorld();
  expect(
    selector
      .localToWorld(new T.Vector3(0, -length / 2, 0))
      .distanceTo(new T.Vector3(...common)),
  ).toBeLessThan(1e-10);
  const before = grip.position.clone();
  motion.setMode(0, 120);
  motion.sample(120);
  expect(grip.position.distanceTo(before)).toBeLessThan(1e-10);
  expect(motion.sample(360)).toBe(false);
  expect(grip.position.distanceTo(new T.Vector3(...contacts[0]))).toBeLessThan(
    1e-10,
  );
  motion.setMode(1, 400);
  expect(motion.sample(400, true)).toBe(false);
  expect(grip.position.distanceTo(new T.Vector3(...contacts[1]))).toBeLessThan(
    1e-10,
  );
});
