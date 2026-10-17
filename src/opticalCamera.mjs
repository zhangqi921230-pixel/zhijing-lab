import * as THREE from "three";

// Preserve a 1.5:1 reference field instead of the generic wide landscape frame.
export function opticalCameraFov(baseFov, aspect) {
  return (
    (2 *
      Math.atan(
        Math.tan((baseFov * Math.PI) / 360) * Math.max(1, 1.5 / aspect),
      ) *
      180) /
    Math.PI
  );
}

// Fit the framed screen (a YZ plane) with a margin for its centimetre scale.
export function opticalScreenViewOffset(fov, aspect, offset) {
  const direction = (
    offset?.clone() ?? new THREE.Vector3(-1, 0.15, 0.8)
  ).normalize();
  const camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 100);
  camera.position.copy(direction);
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld();
  const tangent = Math.tan(THREE.MathUtils.degToRad(fov / 2));
  let retreat = 0;
  for (const x of [-0.08, 0.08])
    for (const y of [-0.87, 0.87])
      for (const z of [-0.91, 0.91]) {
        const point = new THREE.Vector3(x, y, z).applyMatrix4(
          camera.matrixWorldInverse,
        );
        retreat = Math.max(
          retreat,
          point.z + (1.2 * Math.abs(point.x)) / (tangent * aspect),
          point.z + (1.2 * Math.abs(point.y)) / tangent,
        );
      }
  return direction.multiplyScalar(1 + retreat);
}
