// s is material arc length: the surface is never stretched as curvature falls.
export function unrolledPoint(radius, s, progress) {
  const curvature = (1 - Math.max(0, Math.min(1, progress))) / radius;
  if (Math.abs(curvature) < 1e-8) return { x: s, z: 0 };
  const theta = curvature * s;
  return {
    x: Math.sin(theta) / curvature,
    // Half-angle form avoids cancellation close to the flat endpoint.
    z: (2 * Math.sin(theta / 2) ** 2) / curvature,
  };
}
