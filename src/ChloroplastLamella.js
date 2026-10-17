import * as T from "three";

export function lamellaPoint(a, b, level, t, phase = 1) {
  const dx = b[0] - a[0],
    dz = b[1] - a[1],
    length = Math.hypot(dx, dz);
  const bend = 0.012 * Math.sin(Math.PI * t) * phase;
  return [
    a[0] + dx * t - (dz / length) * bend,
    level + 0.003 * Math.sin(2 * Math.PI * t),
    a[1] + dz * t + (dx / length) * bend,
  ];
}

// Flattened, closed membrane bands. The ends terminate inside granum discs.
export function createLamellaGeometry(a, b, level, phase) {
  const positions = [],
    indices = [],
    steps = 24,
    sides = 8;
  const length = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const nx = -(b[1] - a[1]) / length,
    nz = (b[0] - a[0]) / length;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps,
      [x, y, z] = lamellaPoint(a, b, level, t, phase);
    const width = 0.011 * (1 + 0.16 * Math.sin(3 * Math.PI * t));
    for (let j = 0; j < sides; j++) {
      const angle = (j / sides) * Math.PI * 2;
      positions.push(
        x + nx * width * Math.cos(angle),
        y + 0.0025 * Math.sin(angle),
        z + nz * width * Math.cos(angle),
      );
      if (i < steps) {
        const v = i * sides + j,
          next = i * sides + ((j + 1) % sides);
        indices.push(v, v + sides, next, next, v + sides, next + sides);
      }
    }
  }
  for (const end of [0, steps]) {
    const center = positions.length / 3;
    positions.push(...lamellaPoint(a, b, level, end / steps, phase));
    for (let j = 0; j < sides; j++) {
      const v = end * sides + j,
        next = end * sides + ((j + 1) % sides);
      indices.push(...(end === 0 ? [center, v, next] : [center, next, v]));
    }
  }
  const geometry = new T.BufferGeometry();
  geometry.setAttribute("position", new T.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}
