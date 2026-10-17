import * as T from "three";

// Rounded glass heel and inner floor; the straight calibrated wall is unchanged.
export function reactionBeakerGeometry() {
  const outer = Array.from({ length: 13 }, (_, i) => {
    const a = (i * Math.PI) / 24;
    return [1.005 + 0.07 * Math.sin(a), 0.07 - 0.07 * Math.cos(a)];
  });
  const inner = Array.from({ length: 13 }, (_, i) => {
    const a = ((12 - i) * Math.PI) / 24;
    return [0.98 + 0.045 * Math.sin(a), 0.135 - 0.045 * Math.cos(a)];
  });
  return shapeBeakerSpout(
    new T.LatheGeometry(
      [[0, 0], ...outer, [1.075, 2.35], [1.025, 2.35], ...inner, [0, 0.09]].map(
        (p) => new T.Vector2(...p),
      ),
      96,
    ),
    -0.91,
  );
}

// Keep a fixed lower heel as volume changes; scaling the whole mesh would
// stretch that heel through the glass at low/high fill levels.
export function reactionLiquidGeometry() {
  const heel = Array.from({ length: 9 }, (_, i) => {
    const a = (i * Math.PI) / 16;
    return new T.Vector2(0.98 + 0.04 * Math.sin(a), 0.04 - 0.04 * Math.cos(a));
  });
  const geometry = new T.LatheGeometry([...heel, new T.Vector2(1.02, 1)], 80);
  geometry.userData.topVertices = [];
  const position = geometry.attributes.position;
  for (let i = 0; i < position.count; i++) {
    if (position.getY(i) > 0.99) geometry.userData.topVertices.push(i);
  }
  return geometry;
}

export function setReactionLiquidHeight(geometry, height) {
  if (geometry.userData.fillHeight === height) return;
  geometry.userData.fillHeight = height;
  for (const i of geometry.userData.topVertices)
    geometry.attributes.position.setY(i, height);
  geometry.attributes.position.needsUpdate = true;
  geometry.boundingBox = null;
  geometry.computeBoundingSphere();
}

// A single hollow wall, including a rounded open lip and the lower outlet.
// The inner radius leaves clearance around the calibrated .65-radius liquid.
export function reactionFunnelGeometry(bottom, height) {
  const top = bottom + height;
  const profile = [
    [0.05, bottom - 0.4],
    [0.69, bottom],
    [0.69, top],
    ...Array.from({ length: 8 }, (_, i) => {
      const angle = ((i + 1) * Math.PI) / 8;
      return [0.674 + 0.016 * Math.cos(angle), top + 0.016 * Math.sin(angle)];
    }),
    [0.658, bottom],
    [0.032, bottom - 0.4],
    [0.05, bottom - 0.4],
  ];
  const geometry = new T.LatheGeometry(
    profile.map((p) => new T.Vector2(...p)),
    80,
  );
  geometry.computeBoundingBox();
  return geometry;
}

// The spout starts above the 250 mL graduation (y = 1.38).
// It does not change the cylindrical measurement region below it.
export function beakerSpoutPoint(x, y, z) {
  const radius = Math.hypot(x, z);
  if (radius < 1e-8 || y <= 1.385) return [x, y, z];
  const angle = Math.atan2(x, z);
  const mouth = Math.exp(-((angle / 0.27) ** 2));
  const height = Math.min(1, (y - 1.385) / 0.055);
  const extension = 0.17 * mouth * height ** 2;
  return [
    (x * (radius + extension)) / radius,
    y - 0.035 * mouth * height ** 2,
    (z * (radius + extension)) / radius,
  ];
}

export function shapeBeakerSpout(geometry, worldOffset = 0) {
  const positions = geometry.attributes.position;
  for (let i = 0; i < positions.count; i++) {
    const [x, y, z] = beakerSpoutPoint(
      positions.getX(i),
      positions.getY(i) + worldOffset,
      positions.getZ(i),
    );
    positions.setXYZ(i, x, y - worldOffset, z);
  }
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

export function reactionNozzleGeometry() {
  return new T.LatheGeometry(
    [
      [0.02, 1.67],
      [0.044, 1.74],
      [0.05, 1.92],
      [0.03, 1.92],
      [0.024, 1.74],
      [0.009, 1.67],
      [0.02, 1.67],
    ].map(([r, y]) => new T.Vector2(r, y)),
    32,
  );
}
