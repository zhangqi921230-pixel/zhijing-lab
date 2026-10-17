import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

// Open-front jaws preserve the graduation window; soft pads meet the glass wall.
export function addBuretteClamps(root, metal) {
  const jawPoints = Array.from({ length: 33 }, (_, i) => {
    const angle = -1.8 + (i * 3.6) / 32;
    return new THREE.Vector3(
      0.17 * Math.sin(angle),
      0,
      -0.17 * Math.cos(angle),
    );
  });
  const jawGeometry = new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3(jawPoints),
    40,
    0.022,
    8,
    false,
  );
  const rubber = new THREE.MeshStandardMaterial({
    color: "#263f42",
    roughness: 0.88,
  });
  const padGeometry = new THREE.SphereGeometry(0.02, 12, 8);
  const hardware = [],
    pads = [];
  const cylinder = (a, b, r, segments = 16) => {
    const start = new THREE.Vector3(...a),
      end = new THREE.Vector3(...b),
      delta = end.clone().sub(start);
    const g = new THREE.CylinderGeometry(r, r, delta.length(), segments);
    g.applyQuaternion(
      new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        delta.normalize(),
      ),
    );
    g.translate(...start.add(end).multiplyScalar(0.5).toArray());
    hardware.push(g);
  };
  for (const y of [3.3, 4.65]) {
    const jaw = new THREE.Mesh(jawGeometry, metal);
    jaw.name = "burette-open-clamp";
    jaw.position.y = y;
    root.add(jaw);
    for (const sign of [-1, 1])
      pads.push(padGeometry.clone().translate(sign * 0.14, y, 0));
    cylinder([1.55, y, -0.7], [0.168, y, -0.025], 0.027);
    // Hollow boss around the stand rod, not a solid block intersecting it.
    const collar = new THREE.LatheGeometry(
      [
        [0.044, -0.08],
        [0.083, -0.08],
        [0.083, 0.08],
        [0.044, 0.08],
        [0.044, -0.08],
      ].map((p) => new THREE.Vector2(...p)),
      20,
    );
    collar.translate(1.55, y, -0.7);
    hardware.push(collar);
    cylinder([1.55, y, -0.65], [1.55, y, -0.49], 0.022);
    cylinder([1.48, y, -0.48], [1.62, y, -0.48], 0.027, 12);
  }
  padGeometry.dispose();
  const metalParts = new THREE.Mesh(mergeGeometries(hardware), metal);
  metalParts.name = "burette-clamp-hardware";
  const padParts = new THREE.Mesh(mergeGeometries(pads), rubber);
  padParts.name = "burette-clamp-pads";
  root.add(metalParts, padParts);
  [...hardware, ...pads].forEach((g) => g.dispose());
}
