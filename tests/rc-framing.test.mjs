import { it, expect } from "vitest";
import * as T from "three";
import { buildAdvanced } from "../src/AdvancedScene.js";
import { frameApparatus } from "../src/TitrationFraming.js";
import { disposeSceneResources } from "../src/disposeSceneResources.mjs";
it("fits the RC apparatus in wide and tall stages", () => {
  const root = new T.Group();
  buildAdvanced(root, "capacitor", { u: 6, r: 500, c: 4, mode: 0, time: 2 });
  const camera = new T.PerspectiveCamera(38, 1, 0.1, 100),
    controls = {
      target: new T.Vector3(),
      update() {
        camera.lookAt(this.target);
      },
    };
  for (const aspect of [0.45, 1, 2.2])
    for (const direction of [
      [-5.5, 6.1, 9.1],
      [0, 0, 1],
      [0, 1, 0.001],
    ]) {
      camera.aspect = aspect;
      frameApparatus(camera, controls, root, direction);
      let extent = 0,
        depthExtent = 0;
      const point = new T.Vector3(),
        matrix = new T.Matrix4();
      root.traverseVisible((o) => {
        if (!o.isMesh) return;
        for (let j = 0; j < (o.isInstancedMesh ? o.count : 1); j++) {
          matrix.identity();
          if (o.isInstancedMesh) o.getMatrixAt(j, matrix);
          for (let i = 0; i < o.geometry.attributes.position.count; i++) {
            point
              .fromBufferAttribute(o.geometry.attributes.position, i)
              .applyMatrix4(matrix)
              .applyMatrix4(o.matrixWorld)
              .project(camera);
            extent = Math.max(extent, Math.abs(point.x), Math.abs(point.y));
            depthExtent = Math.max(depthExtent, Math.abs(point.z));
          }
        }
      });
      expect(depthExtent).toBeLessThan(1);
      expect(extent).toBeLessThan(0.88);
      expect(extent).toBeGreaterThan(0.7);
    }
  disposeSceneResources(root);
});
