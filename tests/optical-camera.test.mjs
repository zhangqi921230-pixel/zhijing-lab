import { it, expect } from "vitest";
import * as T from "three";
import {
  opticalCameraFov,
  opticalScreenViewOffset,
} from "../src/opticalCamera.mjs";
it("keeps an orbit direction while fitting a narrow resized viewport", () => {
  const direction = new T.Vector3(-2, 1, -3);
  const original = direction.clone();
  const camera = new T.PerspectiveCamera(55, 0.45, 0.1, 100);
  const fitted = opticalScreenViewOffset(55, 0.45, direction);
  expect(direction.equals(original)).toBe(true);
  expect(
    fitted.clone().normalize().distanceTo(direction.normalize()),
  ).toBeLessThan(1e-10);
  camera.position.copy(fitted);
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld();
  for (const x of [-0.08, 0.08])
    for (const y of [-0.87, 0.87])
      for (const z of [-0.91, 0.91]) {
        const point = new T.Vector3(x, y, z).project(camera);
        expect(Math.abs(point.x)).toBeLessThanOrEqual(1 / 1.2 + 1e-10);
        expect(Math.abs(point.y)).toBeLessThanOrEqual(1 / 1.2 + 1e-10);
      }
});
it("fits the framed screen and ruler at different screen positions and aspect ratios", () => {
  for (const aspect of [0.5, 1, 1.8, 2.5])
    for (const screen of [5, 20, 80]) {
      const fov = opticalCameraFov(38, aspect);
      const camera = new T.PerspectiveCamera(fov, aspect, 0.1, 100);
      const target = new T.Vector3(screen * 0.055, 0.4, 0);
      camera.position.copy(target).add(opticalScreenViewOffset(fov, aspect));
      camera.lookAt(target);
      camera.updateMatrixWorld();
      for (const y of [-0.87, 0.87])
        for (const z of [-0.91, 0.91]) {
          const point = target
            .clone()
            .add(new T.Vector3(0, y, z))
            .project(camera);
          expect(Math.abs(point.x)).toBeLessThan(1 / 1.2);
          expect(Math.abs(point.y)).toBeLessThan(1 / 1.2);
        }
    }
});
it("fits the complete optical bench envelope in standard views and tall panels", () => {
  for (const aspect of [0.5, 0.85, 1, 1.5, 1.85, 2.5]) {
    for (const position of [
      [0, 1.4, 11],
      [4.5, 4, 10],
      [0.55, 11, 0.01],
    ]) {
      const camera = new T.PerspectiveCamera(
        opticalCameraFov(38, aspect),
        aspect,
        0.1,
        100,
      );
      camera.position.set(...position);
      camera.lookAt(0.55, -0.25, 0);
      camera.updateMatrixWorld();
      for (const x of [-3.85, 4.95])
        for (const y of [-1.4, 1.3])
          for (const z of [-1.3, 1.3]) {
            const point = new T.Vector3(x, y, z).project(camera);
            expect(Math.abs(point.x)).toBeLessThan(0.95);
            expect(Math.abs(point.y)).toBeLessThan(0.95);
          }
    }
  }
  expect(opticalCameraFov(38, 1)).toBeLessThan(
    (2 * Math.atan(Math.tan((38 * Math.PI) / 360) * 1.85) * 180) / Math.PI,
  );
});
