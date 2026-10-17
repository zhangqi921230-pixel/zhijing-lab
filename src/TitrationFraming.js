import * as THREE from "three";

const directions = {
  perspective: [4.8, 3.44, 11.2],
  front: [0, 0, 1],
  top: [0, 1, 0.001],
};

// Fit individual apparatus bounds; a single enclosing box includes large empty
// corners around the tall stand. Run on presets/resize, never during orbiting.
export function frameTitration(camera, controls, root, view, reset = true) {
  if (!directions[view]) return false;
  return frameApparatus(camera, controls, root, directions[view], reset);
}

export function frameApparatus(
  camera,
  controls,
  root,
  direction,
  reset = true,
) {
  root.updateMatrixWorld(true);
  const points = [];
  const bounds = new THREE.Box3();
  root.traverseVisible((object) => {
    if (!object.isMesh) return;
    const owner = object.isInstancedMesh ? object : object.geometry;
    if (!owner.boundingBox) owner.computeBoundingBox();
    const box = owner.boundingBox;
    if (!box || box.isEmpty()) return;
    for (const x of [box.min.x, box.max.x])
      for (const y of [box.min.y, box.max.y])
        for (const z of [box.min.z, box.max.z]) {
          const point = new THREE.Vector3(x, y, z).applyMatrix4(
            object.matrixWorld,
          );
          points.push(point);
          bounds.expandByPoint(point);
        }
  });
  if (!points.length) return false;
  const back = reset
    ? new THREE.Vector3(...direction).normalize()
    : camera.getWorldDirection(new THREE.Vector3()).negate();
  bounds.getCenter(controls.target);
  camera.position.copy(controls.target).add(back);
  camera.lookAt(controls.target);
  camera.fov = 38;
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld();
  const tangent = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  let retreat = 0;
  for (const point of points) {
    point.applyMatrix4(camera.matrixWorldInverse);
    retreat = Math.max(
      retreat,
      point.z + (Math.abs(point.x) * 1.14) / (tangent * camera.aspect),
      point.z + (Math.abs(point.y) * 1.14) / tangent,
      point.z + camera.near * 2,
    );
  }
  camera.position.addScaledVector(back, retreat);
  controls.minDistance = 2;
  controls.maxDistance = Math.max(
    18,
    camera.position.distanceTo(controls.target) * 2,
  );
  controls.update();
  camera.updateMatrixWorld();
  return true;
}
