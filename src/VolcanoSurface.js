import * as THREE from "three";
import { terrainNoise } from "./terrainWorld.mjs";

// Shared, shape-preserving meridian: rounded crater lip without terrace-like kinks.
const profile = [
  [0.16, 1.55],
  [0.45, 2.02],
  [0.7, 2.18],
  [0.95, 1.75],
  [1.4, 0.95],
  [2.25, -0.1],
  [3.1, -0.7],
];
const slopes = profile
  .slice(1)
  .map(([r, y], i) => (y - profile[i][1]) / (r - profile[i][0]));
const tangents = profile.map((_, i) => {
  if (i === 0) return slopes[0];
  if (i === profile.length - 1) return slopes.at(-1);
  const left = slopes[i - 1],
    right = slopes[i];
  return left * right <= 0 ? 0 : (2 * left * right) / (left + right);
});
export function volcanoProfile(radius) {
  let i = 0;
  while (i < profile.length - 2 && radius > profile[i + 1][0]) i++;
  const [r0, y0] = profile[i],
    [r1, y1] = profile[i + 1],
    width = r1 - r0,
    t = (radius - r0) / width;
  if (t < 0 || t > 1) return y0 + (y1 - y0) * t;
  return (
    (2 * t * t * t - 3 * t * t + 1) * y0 +
    (t * t * t - 2 * t * t + t) * width * tangents[i] +
    (-2 * t * t * t + 3 * t * t) * y1 +
    (t * t * t - t * t) * width * tangents[i + 1]
  );
}
function volcanoEnvelope(radius) {
  return Math.sin(Math.PI * Math.max(0, Math.min(1, (radius - 0.16) / 2.94)));
}
// The invertible footprint does not depend on any height/noise samples.
export function volcanoFootprintRadius(
  radius,
  angle,
  envelope = volcanoEnvelope(radius),
) {
  return (
    radius *
    (1 +
      envelope *
        (0.045 * Math.sin(angle * 3 + 0.6) + 0.025 * Math.cos(angle * 7)))
  );
}
// Synthetic relief, shared by shell, cuts, lava and collision surfaces.
export function volcanoPoint(radius, angle) {
  const h = volcanoProfile(radius);
  const envelope = volcanoEnvelope(radius);
  const r = volcanoFootprintRadius(radius, angle, envelope);
  const x = r * Math.sin(angle),
    z = r * Math.cos(angle);
  // Spatial noise breaks up concentric bands while retaining continuous seams.
  // The shared surface also positions lava, debris and the exposed cut faces.
  const warp = (terrainNoise(x * 1.4 + 13, z * 1.4 + 7) - 0.5) * 0.8;
  // Sample a warped circular noise field: channels have unequal spacing and depth,
  // but the seam remains periodic and the radial footprint stays invertible.
  const ring = 6 + radius * 0.45;
  const channel = terrainNoise(
    Math.sin(angle + warp * 0.12) * ring + 31,
    Math.cos(angle + warp * 0.12) * ring + 19,
  );
  const gullies =
    -0.18 * Math.pow(Math.max(0, (0.62 - channel) / 0.62), 2) +
    (terrainNoise(x * 1.8 + 61, z * 1.8 + 29) - 0.5) * 0.09;
  const rock =
    (terrainNoise(x * 4.3 + 23, z * 4.3 + 11) - 0.5) * 0.07 +
    (terrainNoise(x * 9.1 + 41, z * 9.1 + 19) - 0.5) * 0.022;
  const y = h + envelope * (gullies + rock);
  return new THREE.Vector3(x, y, z);
}

export function volcanoShell(start, length, segments = 128) {
  const rings = 80,
    positions = [],
    colors = [],
    uv = [],
    indices = [];
  const color = new THREE.Color();
  for (let j = 0; j <= rings; j++) {
    const r = 0.16 + (2.94 * j) / rings;
    for (let i = 0; i <= segments; i++) {
      const a = start + (length * i) / segments,
        point = volcanoPoint(r, a);
      positions.push(point.x, point.y, point.z);
      uv.push((a / (Math.PI * 2)) * 4, (j / rings) * 3);
      const grain =
        (terrainNoise(point.x * 5 + 37, point.z * 5 + 17) - 0.5) * 0.065 +
        (terrainNoise(point.x * 13, point.z * 13) - 0.5) * 0.025;
      const mineral = terrainNoise(point.x * 2.1 + 71, point.z * 2.1 + 53);
      const light = 0.29 + grain + 0.045 * (r / 3.1) + (mineral - 0.5) * 0.075;
      color.setHSL(0.075, 0.07 + (0.08 * r) / 3.1, light);
      colors.push(color.r, color.g, color.b);
      if (j < rings && i < segments) {
        const k = j * (segments + 1) + i;
        indices.push(
          k,
          k + segments + 1,
          k + 1,
          k + 1,
          k + segments + 1,
          k + segments + 2,
        );
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export function volcanoCutFace(angle) {
  const positions = [],
    colors = [],
    indices = [],
    color = new THREE.Color();
  for (let i = 0; i <= 80; i++) {
    const point = volcanoPoint(0.16 + (2.94 * i) / 80, angle);
    positions.push(point.x, point.y, point.z, point.x, -0.7, point.z);
    color.set("#826e5c");
    colors.push(color.r, color.g, color.b);
    color.set("#483e36");
    colors.push(color.r, color.g, color.b);
    if (i < 80)
      indices.push(
        i * 2,
        i * 2 + 1,
        i * 2 + 2,
        i * 2 + 1,
        i * 2 + 3,
        i * 2 + 2,
      );
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export function volcanoLava(angle) {
  const positions = [],
    uv = [],
    colors = [],
    indices = [],
    color = new THREE.Color(),
    rows = 96;
  for (let i = 0; i <= rows; i++) {
    const r = 0.7 + (2.35 * i) / rows;
    const center = angle + Math.sin(i * 0.08) * 0.025;
    // Broad channels remain draped on the exact same terrain as the rock shell.
    const width = 0.052 * (1 + 0.22 * Math.sin(i * 0.19));
    for (let j = 0; j < 5; j++) {
      uv.push(j / 4, i / rows);
      const point = volcanoPoint(r, center + (j - 2) * width);
      positions.push(point.x, point.y + 0.045, point.z);
      color.set(
        j === 0 || j === 4 ? "#3d211a" : j === 2 ? "#ffac3c" : "#bb3913",
      );
      colors.push(color.r, color.g, color.b);
      if (i < rows && j < 4) {
        const k = i * 5 + j;
        indices.push(k, k + 5, k + 1, k + 1, k + 5, k + 6);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.userData.rows = rows;
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  return geometry;
}

export function addVolcanoDebris(root) {
  const capacity = 520;
  const geometry = new THREE.DodecahedronGeometry(1, 0);
  geometry.computeBoundingBox();
  const material = new THREE.MeshStandardMaterial({
    color: "#77716a",
    roughness: 0.98,
    metalness: 0,
  });
  const batches = [
    new THREE.InstancedMesh(geometry, material, capacity),
    new THREE.InstancedMesh(geometry, material, capacity),
  ];
  const counts = [0, 0],
    object = new THREE.Object3D(),
    color = new THREE.Color(),
    up = new THREE.Vector3(0, 1, 0);
  for (let i = 0; i < capacity; i++) {
    const angle = (i * 2.399963) % (2 * Math.PI),
      radius = 1.02 + 1.98 * Math.sqrt(((i * 197) % 521) / 521);
    const point = volcanoPoint(radius, angle),
      size = 0.012 + 0.06 * Math.pow(((i * 79) % 523) / 523, 3);
    // Keep intact rocks clear of the removable wedge and the lava channels.
    const angularDistance = (a, b) =>
      Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b)));
    if (
      [Math.PI * 0.15, Math.PI * 1.7].some(
        (boundary) => angularDistance(angle, boundary) < (size * 1.7) / radius,
      ) ||
      [0, 1, 2, 3].some(
        (j) => angularDistance(angle, Math.PI / 2 - (j * 1.3 + 1)) < 0.095,
      )
    )
      continue;
    const which = angle >= Math.PI * 0.15 && angle <= Math.PI * 1.7 ? 0 : 1;
    const radial = volcanoPoint(radius + 0.002, angle).sub(
        volcanoPoint(radius - 0.002, angle),
      ),
      tangent = volcanoPoint(radius, angle + 0.002).sub(
        volcanoPoint(radius, angle - 0.002),
      ),
      normal = radial.cross(tangent).normalize();
    object.scale.set(size * (1 + (i % 3) * 0.3), size * 0.7, size);
    object.quaternion.setFromUnitVectors(up, normal);
    object.rotateY(i * 0.8);
    object.position.copy(point);
    // Embed the lower part in the slope instead of balancing on a single vertex.
    object.position.addScaledVector(
      normal,
      -geometry.boundingBox.min.y * object.scale.y * 0.65,
    );
    object.updateMatrix();
    batches[which].setMatrixAt(counts[which], object.matrix);
    color.setHSL(0.065, 0.07, 0.24 + (i % 7) * 0.025);
    batches[which].setColorAt(counts[which]++, color);
  }
  batches.forEach((batch, i) => {
    batch.name = i ? "volcano-cutaway-debris" : "volcano-slope-debris";
    batch.count = counts[i];
    batch.castShadow = batch.receiveShadow = true;
    batch.computeBoundingSphere();
    root.add(batch);
  });
  return (cut) => {
    batches[1].visible = !cut;
  };
}
