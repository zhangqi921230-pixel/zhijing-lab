import { expect, it } from "vitest";
import * as THREE from "three";
import { buildGlassLab } from "../src/GlassLab.js";
import {
  dilutionTarget,
  dilutionViews,
  dilutionCloseViews,
} from "../src/dilutionViews.mjs";
import { firstVisibleHit } from "../src/visibleSceneHit.mjs";

it("the visible valve handle is reachable in the front and perspective views", () => {
  const root = new THREE.Group();
  const p = { solute: 10, water: 90, add: 100 };
  buildGlassLab(root, "dilution", p);
  const handle = root.getObjectByName("water-supply-handle");
  for (const addingWater of [false, true]) {
    root.userData.update({ ...p, addingWater });
    root.updateMatrixWorld(true);
    for (const { position, target: cameraTarget } of [
      { position: dilutionViews.front, target: dilutionTarget },
      { position: dilutionViews.perspective, target: dilutionTarget },
      dilutionCloseViews.valve,
    ]) {
      const camera = new THREE.PerspectiveCamera(28, 1.85, 0.1, 100);
      camera.position.set(...position);
      camera.lookAt(...cameraTarget);
      camera.updateMatrixWorld();
      const point = handle
        .getWorldPosition(new THREE.Vector3())
        .project(camera);
      const ray = new THREE.Raycaster();
      ray.setFromCamera(new THREE.Vector2(point.x, point.y), camera);
      const hit = firstVisibleHit(ray.intersectObject(root, true));
      let target = hit?.object;
      while (target && !target.userData.action) target = target.parent;
      expect(target?.name).toBe("water-supply-valve");
      expect(target?.userData.action).toBe("water-supply");
    }
  }
});
