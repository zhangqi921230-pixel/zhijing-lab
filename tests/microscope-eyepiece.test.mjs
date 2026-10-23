import { expect, it } from "vitest";
import * as T from "three";
import { microscopeEyepiece } from "../src/MicroscopeEyepiece.js";

it("leaves a clear optical opening while the rubber lip surrounds the recessed glass", () => {
  const root = new T.Group();
  const eye = microscopeEyepiece(
    root,
    [-0.57, 2.12, 0.12],
    [-0.29, 2.85, 0.52],
  );
  root.updateMatrixWorld(true);
  for (const sign of [-1, 1]) {
    const incoming = new T.Vector3(-sign, 0, 0).transformDirection(
      eye.matrixWorld,
    );
    const sideHit = new T.Raycaster(
      eye.localToWorld(new T.Vector3(sign, -0.05, 0)),
      incoming,
    ).intersectObject(eye.getObjectByName("hollow-rubber-eyecup"))[0];
    const localHit = eye.worldToLocal(sideHit.point.clone());
    expect(sign * localHit.x).toBeCloseTo(0.1905, 5);
    expect(sideHit.face.normal.x * sign).toBeGreaterThan(0);
  }
  const direction = new T.Vector3(0, -1, 0).transformDirection(eye.matrixWorld);
  const shoot = (x) =>
    new T.Raycaster(
      eye.localToWorld(new T.Vector3(x, 0.5, 0)),
      direction,
    ).intersectObject(eye, true);
  const central = shoot(0);
  expect(central[0].object.name).toBe("recessed-eyepiece-lens");
  expect(eye.worldToLocal(central[0].point.clone()).y).toBeCloseTo(-0.07, 3);
  expect(shoot(0.18)[0].object.name).toBe("hollow-rubber-eyecup");
  expect(eye.children).toHaveLength(5);
});
