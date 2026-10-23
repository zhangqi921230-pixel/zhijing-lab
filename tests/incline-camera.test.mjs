import { expect, it } from "vitest";
import * as T from "three";
import { buildInclineBench } from "../src/InclineBench.js";
import { frameIncline, inclineFrameBounds } from "../src/InclineCamera.js";
import { disposeSceneResources } from "../src/disposeSceneResources.mjs";
it("frames the apparatus and complete force travel across viewports without changing motion", () => {
  for (const angle of [5, 25, 50]) {
    const root = new T.Group(),
      p = { angle, mass: 5, mu: 0.2, muStatic: 0.3, time: 0 };
    buildInclineBench(root, p);
    const motion = root.userData.motion;
    const camera = new T.PerspectiveCamera(34, 1, 0.1, 100);
    const controls = {
      target: new T.Vector3(),
      update() {
        camera.lookAt(this.target);
      },
    };
    for (const view of ["perspective", "front", "top"])
      for (const aspect of [0.45, 1, 1.8, 2.5]) {
        camera.aspect = aspect;
        expect(frameIncline(camera, controls, root, p, view)).toBe(true);
        const bounds = inclineFrameBounds(root, p);
        for (const x of [bounds.min.x, bounds.max.x])
          for (const y of [bounds.min.y, bounds.max.y])
            for (const z of [bounds.min.z, bounds.max.z]) {
              const v = new T.Vector3(x, y, z).project(camera);
              expect(Math.abs(v.x)).toBeLessThanOrEqual(1 / 1.1 + 1e-7);
              expect(Math.abs(v.y)).toBeLessThanOrEqual(1 / 1.1 + 1e-7);
              expect(Math.abs(v.z)).toBeLessThan(1);
            }
      }
    const direction = camera.getWorldDirection(new T.Vector3());
    camera.aspect = 0.8;
    frameIncline(camera, controls, root, p, "perspective", false);
    expect(
      camera.getWorldDirection(new T.Vector3()).distanceTo(direction),
    ).toBeLessThan(1e-8);
    expect(frameIncline(camera, controls, root, p, "block")).toBe(false);
    expect(root.userData.motion).toBe(motion);
    disposeSceneResources(root);
  }
});
