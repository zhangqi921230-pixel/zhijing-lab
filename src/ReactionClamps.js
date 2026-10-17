import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

// Rear jaws leave the front graduation scale visible. All hardware is static.
export function addReactionClamps(root) {
  const metal = [],
    pads = [],
    knobs = [];
  function bar(parts, a, b, radius, segments = 16) {
    const start = new THREE.Vector3(...a),
      end = new THREE.Vector3(...b);
    const delta = end.clone().sub(start);
    const geometry = new THREE.CylinderGeometry(
      radius,
      radius,
      delta.length(),
      segments,
    );
    geometry.applyQuaternion(
      new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        delta.normalize(),
      ),
    );
    geometry.translate(...start.add(end).multiplyScalar(0.5).toArray());
    parts.push(geometry);
  }
  for (const y of [2.65, 3.95]) {
    const points = Array.from({ length: 41 }, (_, i) => {
      const a = -1.72 + (i * 3.44) / 40;
      return new THREE.Vector3(
        0.738 * Math.sin(a),
        y,
        -0.15 - 0.738 * Math.cos(a),
      );
    });
    metal.push(
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(points),
        48,
        0.032,
        8,
        false,
      ),
    );
    // Soft contact sleeves: inner radius .690 matches the glass reservoir.
    for (const a of [-1.5, 0, 1.5]) {
      const arc = Array.from(
        { length: 9 },
        (_, i) =>
          new THREE.Vector3(
            0.738 * Math.sin(a - 0.12 + i * 0.03),
            y,
            -0.15 - 0.738 * Math.cos(a - 0.12 + i * 0.03),
          ),
      );
      pads.push(
        new THREE.TubeGeometry(
          new THREE.CatmullRomCurve3(arc),
          8,
          0.048,
          10,
          false,
        ),
      );
    }
    bar(metal, [1.6, y, -0.55], [0.73, y, -0.26], 0.035);
    const boss = new THREE.LatheGeometry(
      [
        [0.047, -0.09],
        [0.1, -0.09],
        [0.1, 0.09],
        [0.047, 0.09],
        [0.047, -0.09],
      ].map((p) => new THREE.Vector2(...p)),
      24,
    );
    metal.push(boss.translate(1.6, y, -0.55));
    bar(metal, [1.6, y, -0.5], [1.6, y, -0.3], 0.026);
    bar(knobs, [1.6, y, -0.34], [1.6, y, -0.28], 0.075, 12);
    bar(metal, [0.74, y, -0.3], [0.94, y, -0.3], 0.027);
    bar(knobs, [0.92, y, -0.3], [0.98, y, -0.3], 0.07, 12);
  }
  for (const [name, parts, options] of [
    [
      "reaction-clamp-metal",
      metal,
      { color: "#9aa9ac", metalness: 0.75, roughness: 0.32 },
    ],
    ["reaction-clamp-pads", pads, { color: "#314a49", roughness: 0.86 }],
    ["reaction-clamp-knobs", knobs, { color: "#334249", roughness: 0.65 }],
  ]) {
    const mesh = new THREE.Mesh(
      mergeGeometries(parts),
      new THREE.MeshStandardMaterial(options),
    );
    mesh.name = name;
    root.add(mesh);
    parts.forEach((g) => g.dispose());
  }
}
