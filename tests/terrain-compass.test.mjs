import { it, expect } from "vitest";
import { PerspectiveCamera, Vector3 } from "three";
import { northScreenAngle } from "../src/terrainCompass.mjs";
it("north indicator agrees with actual projected geographic north from every orbit quadrant", () => {
  for (const position of [
    [0, 6, 10],
    [10, 6, 0],
    [0, 6, -10],
    [-10, 6, 0],
    [0, 16, 0.001],
    [4, 6, 12],
  ]) {
    const camera = new PerspectiveCamera(28, 1.5, 0.1, 100);
    camera.position.set(...position);
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld();
    const origin = new Vector3().project(camera),
      north = new Vector3(0, 0, -0.1).project(camera);
    // Convert NDC to equal-sized screen pixels before comparing directions.
    const angle =
      (Math.atan2((north.x - origin.x) * 1.5, north.y - origin.y) * 180) /
      Math.PI;
    const difference =
      northScreenAngle(camera.matrixWorldInverse.elements) - angle;
    expect(
      Math.atan2(
        Math.sin((difference * Math.PI) / 180),
        Math.cos((difference * Math.PI) / 180),
      ),
    ).toBeCloseTo(0, 6);
  }
});
it("edge-on north has no misleading screen direction", () => {
  const camera = new PerspectiveCamera();
  camera.position.set(0, 0, 10);
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld();
  expect(northScreenAngle(camera.matrixWorldInverse.elements)).toBeNull();
});
