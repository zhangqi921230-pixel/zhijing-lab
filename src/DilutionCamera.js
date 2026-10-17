import * as THREE from "three";
import { dilutionTarget, dilutionViews } from "./dilutionViews.mjs";

// Frame the actual apparatus rather than widening the lens for tall viewports.
// Only called on view selection / resize, never in the animation loop.
export function frameDilution(camera, controls, root, view, reset = true) {
  if (!dilutionViews[view] || !root.children.length) return false;
  root.updateMatrixWorld(true);
  const bounds = new THREE.Box3().setFromObject(root);
  if (bounds.isEmpty()) return false;
  const back = reset
    ? new THREE.Vector3(...dilutionViews[view])
        .sub(new THREE.Vector3(...dilutionTarget))
        .normalize()
    : camera.getWorldDirection(new THREE.Vector3()).negate();
  bounds.getCenter(controls.target);
  camera.position.copy(controls.target).add(back);
  camera.lookAt(controls.target);
  camera.fov = 40;
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld();
  const tangent = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  const point = new THREE.Vector3();
  let distance = 0;
  for (const x of [bounds.min.x, bounds.max.x])
    for (const y of [bounds.min.y, bounds.max.y])
      for (const z of [bounds.min.z, bounds.max.z]) {
        point.set(x, y, z).applyMatrix4(camera.matrixWorldInverse);
        distance = Math.max(
          distance,
          point.z + (1.12 * Math.abs(point.x)) / (tangent * camera.aspect),
          point.z + (1.12 * Math.abs(point.y)) / tangent,
          point.z + camera.near * 2,
        );
      }
  camera.position.addScaledVector(back, distance);
  controls.minDistance = 2;
  controls.update();
  camera.updateMatrixWorld();
  return true;
}
