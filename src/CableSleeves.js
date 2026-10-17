import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

export function addCableSleeves(root, wires) {
  const pieces = [];
  for (const wire of wires) {
    const path = wire.geometry.parameters.path,
      length = path.getLength();
    const fraction = Math.min(0.12, 0.18 / length);
    for (const end of [0, 1]) {
      const curve = new THREE.Curve();
      curve.getPoint = (t, target = new THREE.Vector3()) =>
        path.getPointAt(end ? 1 - t * fraction : t * fraction, target);
      const tube = new THREE.TubeGeometry(curve, 48, 1, 16, false);
      const positions = tube.attributes.position,
        color = wire.userData.originalColor;
      const colors = new Float32Array(positions.count * 3);
      for (let row = 0; row <= 48; row++) {
        const t = row / 48,
          center = curve.getPoint(t);
        // A short insulated grip with four moulded ridges tapers into the cable.
        const radius =
          t < 0.68
            ? 0.056 +
              0.01 * Math.pow(0.5 + 0.5 * Math.cos((t / 0.68) * Math.PI * 8), 2)
            : 0.066 -
              (0.5 - 0.5 * Math.cos(((t - 0.68) / 0.32) * Math.PI)) * 0.034;
        for (let col = 0; col <= 16; col++) {
          const index = row * 17 + col;
          const point = new THREE.Vector3()
            .fromBufferAttribute(positions, index)
            .sub(center)
            .multiplyScalar(radius)
            .add(center);
          positions.setXYZ(index, ...point.toArray());
          color.toArray(colors, index * 3);
        }
      }
      tube.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      tube.computeVertexNormals();
      pieces.push(tube);
    }
  }
  const geometry = mergeGeometries(pieces);
  pieces.forEach((g) => g.dispose());
  const mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.72 }),
  );
  mesh.name = "circuit-cable-sleeves";
  mesh.castShadow = mesh.receiveShadow = true;
  mesh.userData.sleeveCount = wires.length * 2;
  root.add(mesh);
  return mesh;
}
