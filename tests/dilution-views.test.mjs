import { expect, it } from "vitest";
import * as THREE from "three";
import { buildGlassLab } from "../src/GlassLab.js";
import { dilutionTarget, dilutionViews } from "../src/dilutionViews.mjs";

it("keeps the apparatus inside all preset views on wide and narrow stages", () => {
  const root = new THREE.Group();
  buildGlassLab(root, "dilution", { solute: 10, water: 90, add: 300 });
  root.updateMatrixWorld(true);
  const points = [];
  root.traverseVisible((object) => {
    const vertices = object.geometry?.getAttribute("position");
    if (!vertices) return;
    for (
      let instance = 0;
      instance < (object.isInstancedMesh ? object.count : 1);
      instance++
    ) {
      const transform = new THREE.Matrix4();
      if (object.isInstancedMesh) object.getMatrixAt(instance, transform);
      transform.premultiply(object.matrixWorld);
      for (let i = 0; i < vertices.count; i++)
        points.push(
          new THREE.Vector3()
            .fromBufferAttribute(vertices, i)
            .applyMatrix4(transform),
        );
    }
  });
  for (const aspect of [0.7, 1, 1.85, 2.3]) {
    const fov = THREE.MathUtils.radToDeg(
      2 *
        Math.atan(
          Math.tan(THREE.MathUtils.degToRad(28) / 2) *
            Math.max(1, 1.85 / aspect),
        ),
    );
    for (const position of Object.values(dilutionViews)) {
      const camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 100);
      camera.position.set(...position);
      camera.lookAt(...dilutionTarget);
      camera.updateMatrixWorld();
      let extentX = 0,
        extentY = 0,
        minZ = 1,
        maxZ = -1;
      for (const point of points) {
        const projected = point.clone().project(camera);
        extentX = Math.max(extentX, Math.abs(projected.x));
        extentY = Math.max(extentY, Math.abs(projected.y));
        minZ = Math.min(minZ, projected.z);
        maxZ = Math.max(maxZ, projected.z);
      }
      expect(extentX).toBeLessThan(0.96);
      expect(extentY).toBeLessThan(0.96);
      expect(minZ).toBeGreaterThan(-1);
      expect(maxZ).toBeLessThan(1);
    }
  }
});
