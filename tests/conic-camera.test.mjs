import { it, expect } from "vitest";
import * as THREE from "three";
import { conicCameraFov } from "../src/conicCamera.mjs";
import { CONIC_HEIGHT } from "../src/conicGeometry.mjs";
it("frames both cone rims across allowed angles and desktop/portrait aspects", () => {
  for (const aspect of [0.5, 0.8, 1, 1.8, 2.5])
    for (const alpha of [20, 30, 45])
      for (const position of [
        [-5, 4.6, 9],
        [0, 1.1, 11],
        [0, 12, 0.01],
      ]) {
        const camera = new THREE.PerspectiveCamera(
          conicCameraFov(32, aspect),
          aspect,
          0.1,
          100,
        );
        camera.position.set(...position);
        camera.lookAt(0, 1.1, 0);
        camera.updateMatrixWorld();
        for (const side of [-1, 1])
          for (let i = 0; i < 96; i++) {
            const angle = (i * Math.PI) / 48,
              r = CONIC_HEIGHT * Math.tan((alpha * Math.PI) / 180);
            const point = new THREE.Vector3(
              r * Math.cos(angle),
              1.1 + side * CONIC_HEIGHT,
              r * Math.sin(angle),
            ).project(camera);
            expect(Math.abs(point.x)).toBeLessThan(0.92);
            expect(Math.abs(point.y)).toBeLessThan(0.92);
          }
      }
});
