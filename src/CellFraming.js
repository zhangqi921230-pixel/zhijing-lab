import * as T from "three";
import { cellCameraFov } from "./cellCamera.mjs";

// Fit the visible teaching structure and billboard labels on preset changes,
// not during orbiting. Bounding boxes are computed once and cached by geometry.
export function fitCellCamera(camera, root, baseFov = 28) {
  root.userData.restoreLabelLayout?.();
  camera.updateMatrixWorld();
  root.updateMatrixWorld(true);
  let tangent = Math.tan(
    (cellCameraFov(baseFov, camera.aspect) * Math.PI) / 360,
  );
  const point = new T.Vector3();
  const size = new T.Vector3();
  const include = (p, halfWidth = 0, halfHeight = 0) => {
    if (p.z >= -camera.near) return;
    tangent = Math.max(
      tangent,
      (1.08 * (Math.abs(p.x) + halfWidth)) / (-p.z * camera.aspect),
      (1.08 * (Math.abs(p.y) + halfHeight)) / -p.z,
    );
  };
  root.traverseVisible((object) => {
    if (object.isSprite) {
      object.getWorldPosition(point).applyMatrix4(camera.matrixWorldInverse);
      object.getWorldScale(size);
      include(point, size.x / 2, size.y / 2);
    } else if (object.geometry) {
      const geometry = object.geometry;
      const boundsOwner = object.isInstancedMesh ? object : geometry;
      if (!boundsOwner.boundingBox) boundsOwner.computeBoundingBox();
      const box = boundsOwner.boundingBox;
      if (!box || box.isEmpty()) return;
      for (const x of [box.min.x, box.max.x])
        for (const y of [box.min.y, box.max.y])
          for (const z of [box.min.z, box.max.z]) {
            point
              .set(x, y, z)
              .applyMatrix4(object.matrixWorld)
              .applyMatrix4(camera.matrixWorldInverse);
            include(point);
          }
    }
  });
  camera.fov = (360 / Math.PI) * Math.atan(tangent);
  camera.updateProjectionMatrix();
}
