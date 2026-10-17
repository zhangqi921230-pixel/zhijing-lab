import * as THREE from "three";
import { LineSegments2 } from "three/addons/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/addons/lines/LineSegmentsGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";

export function addConicCurveDepth(root, curve, center) {
  const positions = new Float32Array(2048 * 6);
  const geometry = new LineSegmentsGeometry().setPositions(positions);
  const distances = new THREE.InstancedInterleavedBuffer(
    new Float32Array(2048 * 2),
    2,
    1,
  );
  geometry.setAttribute(
    "instanceDistanceStart",
    new THREE.InterleavedBufferAttribute(distances, 1, 0),
  );
  geometry.setAttribute(
    "instanceDistanceEnd",
    new THREE.InterleavedBufferAttribute(distances, 1, 1),
  );
  const back = new LineSegments2(
    geometry,
    new LineMaterial({
      color: "#b78a49",
      linewidth: 2,
      dashed: true,
      dashSize: 0.065,
      gapSize: 0.045,
      depthTest: false,
      toneMapped: false,
      transparent: true,
      opacity: 0.8,
    }),
  );
  back.name = "conic-back-intersection";
  back.renderOrder = 4;
  back.raycast = () => {};
  back.frustumCulled = false;
  geometry.instanceCount = 0;
  root.add(back);
  const eye = new THREE.Vector3();
  let oldSegments,
    oldKey = "";
  return (camera, segments, k, shellVisible) => {
    root.updateWorldMatrix(true, false);
    camera.getWorldPosition(eye);
    root.worldToLocal(eye);
    eye.y -= center;
    const key = `${eye.x}/${eye.y}/${eye.z}/${k}/${shellVisible}`;
    if (oldSegments === segments && key === oldKey) return;
    oldSegments = segments;
    oldKey = key;
    const frontPositions = curve.geometry.attributes.instanceStart.data.array;
    let frontCount = 0,
      backCount = 0,
      length = 0;
    for (const segment of segments) {
      const [a, b] = segment;
      const x = (a[0] + b[0]) / 2,
        y = (a[1] + b[1]) / 2,
        z = (a[2] + b[2]) / 2;
      const facing = x * eye.x + z * eye.z - k * k * y * eye.y;
      const isBack = shellVisible && facing < 0;
      const target = isBack ? positions : frontPositions;
      let index = (isBack ? backCount : frontCount) * 6;
      for (const point of segment) {
        target[index++] = point[0];
        target[index++] = point[1] + center;
        target[index++] = point[2];
      }
      const nextLength = length + Math.hypot(...a.map((v, i) => v - b[i]));
      if (isBack) {
        distances.array[backCount * 2] = length;
        distances.array[backCount * 2 + 1] = nextLength;
        backCount++;
      } else frontCount++;
      length = nextLength;
    }
    geometry.instanceCount = backCount;
    curve.geometry.instanceCount = frontCount;
    distances.needsUpdate = true;
    geometry.attributes.instanceStart.data.needsUpdate = true;
    curve.geometry.attributes.instanceStart.data.needsUpdate = true;
    curve.geometry.computeBoundingSphere();
  };
}
