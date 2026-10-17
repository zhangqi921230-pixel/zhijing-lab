import * as T from "three";
import { box } from "./CircuitBench.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

// One shared rounded geometry/material per mechanical detail set. Keeping the
// batch inside its moving parent preserves rotation and ancestor picking.
export function repeatedBoxes(
  parent,
  size,
  color,
  radius,
  poses,
  name,
  segments = 3,
) {
  const prototype = box(new T.Group(), size, color, [0, 0, 0], radius);
  if (radius === 0) {
    prototype.geometry.dispose();
    prototype.geometry = new T.BoxGeometry(...size);
  } else if (segments !== 3) {
    prototype.geometry.dispose();
    prototype.geometry = new RoundedBoxGeometry(...size, segments, radius);
  }
  const batch = new T.InstancedMesh(
    prototype.geometry,
    prototype.material,
    poses.length,
  );
  const transform = new T.Object3D();
  poses.forEach(({ position, rotation = [0, 0, 0], scale = [1, 1, 1] }, i) => {
    transform.position.set(...position);
    transform.rotation.set(...rotation);
    transform.scale.set(...scale);
    transform.updateMatrix();
    batch.setMatrixAt(i, transform.matrix);
  });
  batch.name = name;
  batch.castShadow = prototype.castShadow;
  batch.receiveShadow = prototype.receiveShadow;
  batch.computeBoundingBox();
  batch.computeBoundingSphere();
  parent.add(batch);
  return batch;
}
