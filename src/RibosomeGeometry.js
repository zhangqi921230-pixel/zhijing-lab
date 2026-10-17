import * as T from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

// Enlarged two-subunit silhouette, not an atomic reconstruction. Large subunit faces the membrane.
export function createRibosomeGeometry() {
  const parts = [
    {
      radius: 0.007,
      scale: [1, 0.7, 0.9],
      position: [0, -0.003, 0],
      color: "#c5aa7d",
    },
    {
      radius: 0.005,
      scale: [0.9, 0.65, 0.85],
      position: [0.0015, 0.004, 0],
      color: "#e0cda5",
    },
  ].map(({ radius, scale, position, color }) => {
    const geometry = new T.SphereGeometry(radius, 8, 6);
    geometry.scale(...scale).translate(...position);
    const c = new T.Color(color),
      count = geometry.attributes.position.count;
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) c.toArray(colors, i * 3);
    geometry.setAttribute("color", new T.BufferAttribute(colors, 3));
    return geometry;
  });
  const result = mergeGeometries(parts);
  parts.forEach((part) => part.dispose());
  return result;
}
