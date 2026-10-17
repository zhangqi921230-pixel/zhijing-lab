import * as T from "three";
import { inclinePose } from "./InclineBench.js";

export function inclineFrameBounds(root, p) {
  root.updateMatrixWorld(true);
  const bounds = new T.Box3();
  root.traverse((o) => {
    if (!o.isMesh) return;
    for (let parent = o; parent; parent = parent.parent)
      if (parent.userData.structureLabels) return;
    o.geometry.computeBoundingBox();
    bounds.union(o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld));
  });
  // Reserve both ends of the travel before playback, so the camera does not
  // chase the block. Labels are screen-packed separately and do not inflate it.
  const a = (p.angle * Math.PI) / 180,
    length = p.mass * 9.8 * 0.032;
  for (const s of [0, 4]) {
    const pose = inclinePose(p.angle, s);
    for (const [dx, dy] of [
      [0, 0],
      [0, -length],
      [length * Math.sin(a), length * Math.cos(a)],
      [-length * Math.cos(a), length * Math.sin(a)],
    ])
      bounds.expandByPoint(
        new T.Vector3(pose.x + dx, pose.blockY + dy, 0.49).applyMatrix4(
          root.matrixWorld,
        ),
      );
  }
  return bounds;
}

export function frameIncline(camera, controls, root, p, view, reset = true) {
  const directions = {
    perspective: [4.5, 3.35, 10],
    front: [0, 0, 1],
    top: [0, 1, 0.001],
  };
  if (!directions[view] || !root.children.length) return false;
  const bounds = inclineFrameBounds(root, p);
  const back = reset
    ? new T.Vector3(...directions[view]).normalize()
    : camera.getWorldDirection(new T.Vector3()).negate();
  bounds.getCenter(controls.target);
  camera.position.copy(controls.target).add(back);
  camera.lookAt(controls.target);
  camera.fov = 40;
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld();
  const tangent = Math.tan(T.MathUtils.degToRad(camera.fov / 2));
  let retreat = 0;
  for (const x of [bounds.min.x, bounds.max.x])
    for (const y of [bounds.min.y, bounds.max.y])
      for (const z of [bounds.min.z, bounds.max.z]) {
        const point = new T.Vector3(x, y, z).applyMatrix4(
          camera.matrixWorldInverse,
        );
        retreat = Math.max(
          retreat,
          point.z + (1.1 * Math.abs(point.x)) / (tangent * camera.aspect),
          point.z + (1.1 * Math.abs(point.y)) / tangent,
          point.z + camera.near * 2,
        );
      }
  camera.position.addScaledVector(back, retreat);
  controls.minDistance = 2;
  controls.update();
  camera.updateMatrixWorld();
  return true;
}
