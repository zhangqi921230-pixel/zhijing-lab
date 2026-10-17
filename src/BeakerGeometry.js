import * as THREE from "three";

export const BEAKER_SCALE_BOTTOM = 0.15;
export const BEAKER_SCALE_SPAN = 2.12;
export const BEAKER_PRINT_BOTTOM = 0.1;
export const BEAKER_PRINT_HEIGHT = 2.32;

// Same straight outer-wall profile used by the lathed vessel, before the spout.
export function beakerOuterRadius(y) {
  if (y < 0.08)
    return 0.77 + Math.sqrt(Math.max(0, 0.08 ** 2 - (y - 0.08) ** 2));
  return y <= 2.27
    ? 0.85 + (0.016 * (y - 0.08)) / (2.27 - 0.08)
    : 0.866 + (0.004 * (y - 2.27)) / 0.23;
}

export function beakerInnerRadius(y) {
  if (y <= 0.07000001) return 0.76;
  if (y <= 0.12)
    return 0.76 + Math.sqrt(Math.max(0, 0.05 ** 2 - (y - 0.12) ** 2));
  if (y <= 2.27) return 0.81 + (0.016 * (y - 0.12)) / 2.15;
  return 0.826 + (0.004 * (y - 2.27)) / 0.23;
}

export function beakerGraduationGeometry() {
  const geometry = new THREE.PlaneGeometry(0.72, BEAKER_PRINT_HEIGHT, 24, 32);
  const position = geometry.attributes.position;
  for (let i = 0; i < position.count; i++) {
    const angle = position.getX(i) + 0.12;
    const y = position.getY(i) + BEAKER_PRINT_BOTTOM + BEAKER_PRINT_HEIGHT / 2;
    const radius = beakerOuterRadius(y) + 0.003;
    position.setXYZ(i, radius * Math.sin(angle), y, radius * Math.cos(angle));
  }
  return shapeBeakerSpout(geometry);
}

// Form a pouring lip at +Z without opening a gap between the inner and outer
// walls. The bowl below the shoulder retains its original circular section.
export function shapeBeakerSpout(geometry, height = 2.5) {
  const position = geometry.attributes.position;
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i),
      y = position.getY(i),
      z = position.getZ(i);
    const angle = Math.atan2(x, z);
    const angular = Math.max(0, 1 - Math.abs(angle) / 0.38);
    const shoulder = THREE.MathUtils.smoothstep(
      y,
      height - 0.23,
      height - 0.015,
    );
    const projection = 0.2 * angular * angular * shoulder;
    position.setXYZ(
      i,
      x + Math.sin(angle) * projection,
      y,
      z + Math.cos(angle) * projection,
    );
  }
  position.needsUpdate = true;
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}

export function beakerWallGeometry() {
  // Rounded heel and inner floor use concentric quarter-circle transitions.
  // Sampling the actual profile keeps the vessel thickness visible at close range.
  const outerHeel = Array.from({ length: 9 }, (_, i) => {
    const a = (i * Math.PI) / 16;
    return [0.77 + 0.08 * Math.sin(a), 0.08 - 0.08 * Math.cos(a)];
  });
  const innerHeel = Array.from({ length: 9 }, (_, i) => {
    const a = ((8 - i) * Math.PI) / 16;
    return [0.76 + 0.05 * Math.sin(a), 0.12 - 0.05 * Math.cos(a)];
  });
  const profile = [
    [0, 0],
    ...outerHeel,
    [0.866, 2.27],
    [0.87, 2.5],
    [0.83, 2.5],
    [0.826, 2.27],
    ...innerHeel,
    [0, 0.07],
  ];
  return shapeBeakerSpout(
    new THREE.LatheGeometry(
      profile.map((v) => new THREE.Vector2(...v)),
      96,
    ),
  );
}

export function beakerLipGeometry() {
  const geometry = new THREE.TorusGeometry(0.85, 0.022, 8, 96);
  geometry.rotateX(Math.PI / 2);
  geometry.translate(0, 2.5, 0);
  return shapeBeakerSpout(geometry);
}
