import { it, expect } from "vitest";
import * as T from "three";
import { circuitViews, circuitDetailFov } from "../src/circuitViews.mjs";
import { buildCircuitBench } from "../src/CircuitBench.js";
import { disposeSceneResources } from "../src/disposeSceneResources.mjs";
it("keeps the switch blade and grip visible and pickable on narrow and wide stages", () => {
  const root = new T.Group();
  buildCircuitBench(root, { u: 6, r: 20, closed: 1 });
  for (const aspect of [0.4, 0.7, 1, 2.2]) {
    const camera = new T.PerspectiveCamera(
      circuitDetailFov(aspect),
      aspect,
      0.1,
      100,
    );
    camera.position.set(...circuitViews.switch.position);
    camera.lookAt(new T.Vector3(...circuitViews.switch.target));
    camera.updateMatrixWorld();
    for (const closed of [0, 1]) {
      root.userData.update({ u: 6, r: 20, closed });
      root.updateMatrixWorld(true);
      for (const name of [
        "circuit-switch-blade",
        "circuit-switch-grip",
        "circuit-switch-base",
      ]) {
        const mesh = root.getObjectByName(name);
        const pos = mesh.geometry.attributes.position;
        let extent = 0;
        for (let i = 0; i < pos.count; i++) {
          const point = new T.Vector3()
            .fromBufferAttribute(pos, i)
            .applyMatrix4(mesh.matrixWorld)
            .project(camera);
          extent = Math.max(extent, Math.abs(point.x), Math.abs(point.y));
        }
        expect(extent, `${aspect}, ${closed}, ${name}`).toBeLessThan(1);
      }
      const grip = root.getObjectByName("circuit-switch-grip");
      const aim = grip.getWorldPosition(new T.Vector3());
      const hits = new T.Raycaster(
        camera.position,
        aim.sub(camera.position).normalize(),
      ).intersectObject(root, true);
      expect(hits[0].object.userData.action).toBe("switch");
    }
  }
  disposeSceneResources(root);
});
