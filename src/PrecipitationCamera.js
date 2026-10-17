import * as THREE from "three";

// Focus bounds are authored alongside the apparatus, including the reagent label.
// Fit by moving the eye, so close-ups keep a consistent perspective without a
// wide-angle distortion. This only runs on preset selection or viewport resize.
export function frameFocusBounds(camera, controls, root, view, reset = true) {
  const bounds = root.userData.focusBounds?.[view];
  if (!bounds) return false;
  const placard = root.getObjectByName("reaction-equation-placard");
  if (placard) placard.visible = view !== "volumeReadout";
  root.updateMatrixWorld(true);
  const box = bounds.clone().applyMatrix4(root.matrixWorld);
  if (reset) {
    box.getCenter(controls.target);
    const direction = new THREE.Vector3(
      ...(root.userData.focusDirections?.[view] ?? [0.28, 0.16, 1]),
    ).normalize();
    camera.position.copy(controls.target).add(direction);
    camera.lookAt(controls.target);
    camera.fov = 40;
  }
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld();
  const tangent = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  const point = new THREE.Vector3();
  let retreat = 0;
  for (const x of [box.min.x, box.max.x])
    for (const y of [box.min.y, box.max.y])
      for (const z of [box.min.z, box.max.z]) {
        point.set(x, y, z).applyMatrix4(camera.matrixWorldInverse);
        retreat = Math.max(
          retreat,
          point.z + (1.12 * Math.abs(point.x)) / (tangent * camera.aspect),
          point.z + (1.12 * Math.abs(point.y)) / tangent,
          point.z + camera.near * 2,
        );
      }
  const back = camera.getWorldDirection(new THREE.Vector3()).negate();
  camera.position.addScaledVector(back, retreat);
  controls.minDistance =
    root.userData.focusMinDistance?.[view] ?? (view === "dosing" ? 0.5 : 2.5);
  controls.update();
  camera.updateMatrixWorld();
  return true;
}
export const framePrecipitation = frameFocusBounds;
