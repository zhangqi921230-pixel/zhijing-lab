import * as THREE from "three";
import { beakerInnerRadius } from "./BeakerGeometry.js";

export const MENISCUS_RISE = 0.014;

export function beakerLiquidWall() {
  const geometry = new THREE.LatheGeometry(
    [
      ...Array.from({ length: 9 }, (_, i) => {
        const a = (i * Math.PI) / 16;
        return new THREE.Vector2(
          0.759 + 0.05 * Math.sin(a),
          0.12 - 0.05 * Math.cos(a),
        );
      }),
      new THREE.Vector2(0.815, 1),
    ],
    64,
  );
  const positions = geometry.attributes.position;
  const top = [];
  let previousHeight;
  for (let i = 0; i < positions.count; i++) {
    if (positions.getY(i) > 0.13) {
      const angle = Math.atan2(positions.getX(i), positions.getZ(i));
      top.push([i, Math.sin(angle), Math.cos(angle)]);
    }
  }
  return {
    geometry,
    update(height) {
      const radius = beakerInnerRadius(height) - 0.001;
      if (height === previousHeight) return radius;
      previousHeight = height;
      for (const [i, sin, cos] of top)
        positions.setXYZ(i, radius * sin, height, radius * cos);
      positions.needsUpdate = true;
      geometry.computeVertexNormals();
      geometry.computeBoundingBox();
      geometry.computeBoundingSphere();
      return radius;
    },
  };
}

// Qualitative wetting profile for an aqueous solution against clean glass.
// This is visual geometry, not a capillary-pressure or contact-angle solver.
export function liquidSurfaceGeometry(radius = 0.811) {
  const segments = 64,
    rings = 10;
  // Keep a broad flat interior and resolve the narrow wetting edge with the
  // existing vertex budget. This profile remains a qualitative illustration.
  const radii = [0.1, 0.2, 0.35, 0.5, 0.65, 0.78, 0.88, 0.94, 0.98, 1];
  const vertices = [0, 0, 0],
    indices = [];
  for (let ring = 1; ring <= rings; ring++) {
    const fraction = radii[ring - 1];
    for (let segment = 0; segment < segments; segment++) {
      const angle = (segment / segments) * Math.PI * 2;
      vertices.push(
        radius * fraction * Math.cos(angle),
        MENISCUS_RISE * fraction ** 32,
        radius * fraction * Math.sin(angle),
      );
    }
  }
  for (let segment = 0; segment < segments; segment++) {
    const next = (segment + 1) % segments;
    indices.push(0, 1 + next, 1 + segment);
    for (let ring = 1; ring < rings; ring++) {
      const a = 1 + (ring - 1) * segments + segment;
      const b = 1 + (ring - 1) * segments + next;
      const c = a + segments,
        d = b + segments;
      indices.push(a, b, c, b, d, c);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3),
  );
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}
