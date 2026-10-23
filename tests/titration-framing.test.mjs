import { expect, it } from "vitest";
import * as THREE from "three";
import { buildTitrationLab } from "../src/TitrationLab.js";
import { frameTitration } from "../src/TitrationFraming.js";
import { disposeSceneResources } from "../src/disposeSceneResources.mjs";

it("完整器材在横屏和窄屏均不裁切，切换近景不受全景拟合影响", () => {
  const root = new THREE.Group();
  buildTitrationLab(root, { acid: 50, base: 25, c: 0.1 });
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  const controls = {
    target: new THREE.Vector3(),
    update() {
      camera.lookAt(this.target);
    },
  };
  const verify = () => {
    let extent = 0,
      depthExtent = 0;
    const p = new THREE.Vector3();
    root.traverseVisible((object) => {
      if (!object.isMesh) return;
      const positions = object.geometry.attributes.position;
      const instance = new THREE.Matrix4();
      for (
        let part = 0;
        part < (object.isInstancedMesh ? object.count : 1);
        part++
      ) {
        if (object.isInstancedMesh) object.getMatrixAt(part, instance);
        for (let i = 0; i < positions.count; i++) {
          p.fromBufferAttribute(positions, i)
            .applyMatrix4(instance)
            .applyMatrix4(object.matrixWorld)
            .project(camera);
          extent = Math.max(extent, Math.abs(p.x), Math.abs(p.y));
          depthExtent = Math.max(depthExtent, Math.abs(p.z));
        }
      }
    });
    expect(extent).toBeGreaterThan(0.75);
    expect(extent).toBeLessThan(0.88);
    expect(depthExtent).toBeLessThan(1);
    expect(camera.position.distanceTo(controls.target)).toBeLessThan(
      controls.maxDistance,
    );
  };
  for (const view of ["perspective", "front", "top"])
    for (const aspect of [2.2, 1, 0.4]) {
      camera.aspect = aspect;
      frameTitration(camera, controls, root, view);
      verify();
    }
  camera.position.add(new THREE.Vector3(2, 0, 1));
  camera.lookAt(controls.target);
  const direction = camera.getWorldDirection(new THREE.Vector3());
  frameTitration(camera, controls, root, "top", false);
  expect(
    camera.getWorldDirection(new THREE.Vector3()).distanceTo(direction),
  ).toBeLessThan(1e-8);
  const position = camera.position.clone();
  expect(frameTitration(camera, controls, root, "meniscus")).toBe(false);
  expect(camera.position.equals(position)).toBe(true);
  disposeSceneResources(root);
});
