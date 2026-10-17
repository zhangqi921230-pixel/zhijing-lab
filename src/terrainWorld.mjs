// One synthetic landscape definition drives terrain, shoreline, forest and maps.
// Synthetic teaching terrain, not a real DEM. Heights are metres.
// Slope mode interprets both horizontal and vertical model units as 980 m.
export const TERRAIN_SCALE = 980;
export const TEACHING_BASIN = { x: -1.85, z: 1.95, rx: 0.62, rz: 0.56 };
export const TERRAIN_RESOLUTION = 160;
const smooth = (a, b, x) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const hash = (x, z) => {
  const v = Math.sin(x * 127.1 + z * 311.7) * 43758.5453123;
  return v - Math.floor(v);
};
export function terrainNoise(x, z) {
  const ix = Math.floor(x),
    iz = Math.floor(z),
    u = smooth(0, 1, x - ix),
    v = smooth(0, 1, z - iz);
  const a = hash(ix, iz) * (1 - u) + hash(ix + 1, iz) * u,
    b = hash(ix, iz + 1) * (1 - u) + hash(ix + 1, iz + 1) * u;
  return a * (1 - v) + b * v;
}
function fractal(x, z) {
  return (
    terrainNoise(x, z) * 0.55 +
    terrainNoise(x * 2.13, z * 2.13) * 0.27 +
    terrainNoise(x * 4.41, z * 4.41) * 0.13 +
    terrainNoise(x * 9.03, z * 9.03) * 0.05
  );
}
export function riverCenter(z) {
  return 0.1 + 0.36 * Math.sin(z * 1.65 + 0.4) + 0.09 * Math.sin(z * 3.9);
}
export function riverHeight(z) {
  if (z < 0.85) return 138 + Math.pow((0.85 - z) / 3.85, 1.45) * 292;
  if (z <= 2.2) return 138;
  return 138 - (z - 2.2) * 35;
}
export function landscapeHeight(x, z) {
  const wx = x + (fractal(x * 1.7 + 9, z * 1.7) - 0.5) * 0.24;
  const wz = z + (fractal(x * 1.8, z * 1.8 + 17) - 0.5) * 0.22;
  const peak = (cx, cz, rx, rz, h) =>
    h * Math.exp(-((wx - cx) ** 2 / rx + (wz - cz) ** 2 / rz));
  let mass =
    peak(-1.28, -1.25, 0.86, 0.76, 1490) +
    peak(-1.8, -0.28, 0.26, 1.12, 670) +
    peak(-0.65, -1.92, 0.28, 0.3, 850) +
    peak(1.44, -0.42, 0.64, 0.55, 1320) +
    peak(1.98, 0.4, 0.21, 0.74, 650) +
    peak(-1.85, 1.1, 0.23, 0.36, 820) +
    peak(-0.85, 0.7, 0.32, 0.24, 420) +
    peak(1.9, 1.25, 0.23, 0.47, 700) +
    peak(2.05, 2.2, 0.25, 0.18, 520) +
    peak(-2.2, -2, 0.21, 0.36, 670);
  const ridge = 1 - Math.abs(2 * terrainNoise(wx * 2.8 + 31, wz * 2.8) - 1);
  const crag = 1 - Math.abs(2 * terrainNoise(wx * 7.3, wz * 7.3 + 17) - 1);
  // Broad ridges define readable landforms; fine rock detail belongs in the
  // material rather than metre-scale noise that creates false miniature peaks.
  mass *= 0.72 + ridge * 0.2 + crag * 0.025;
  mass += Math.min(1, mass / 600) * (fractal(wx * 18, wz * 18) - 0.5) * 20;
  let height = riverHeight(z) + 100 + 260 * fractal(x * 1.5, z * 1.5) + mass;
  // A broad valley and narrow river bed; the foreground expands into a lake.
  const d = Math.abs(x - riverCenter(z));
  const valley = 1 - smooth(0.06, 0.72, d);
  height = height * (1 - valley * 0.72) + (riverHeight(z) + 28) * valley * 0.72;
  const stream = 1 - smooth(0.043, 0.095, d);
  const lakeDistance = Math.hypot((x - 0.15) / 0.61, (z - 1.52) / 0.74);
  const lake =
    1 -
    smooth(
      0.8,
      1.08,
      lakeDistance + (terrainNoise(x * 18, z * 18) - 0.5) * 0.11,
    );
  const water = Math.max(stream, lake);
  const depth = 16 + lake * 60 * Math.max(0, 1 - lakeDistance);
  height = height * (1 - water) + (riverHeight(z) - depth) * water;
  // A closed inland depression, spatially separated from the river and lake.
  const basinRadius = Math.hypot(
    (x - TEACHING_BASIN.x) / TEACHING_BASIN.rx,
    (z - TEACHING_BASIN.z) / TEACHING_BASIN.rz,
  );
  const blend = 1 - smooth(0.88, 1.3, basinRadius);
  const bowl =
    225 +
    350 * basinRadius * basinRadius +
    4 * (terrainNoise(x * 12, z * 12) - 0.5);
  return height * (1 - blend) + bowl * blend;
}

// A deterministic drainage incision pass creates tributary gullies on the same
// sampled mesh used for teaching. This is illustrative relief, not a DEM or a
// predictive geomorphological/erosion simulation.
export function carveDrainage(points, n) {
  const width = n + 1,
    count = points.length;
  const order = Array.from({ length: count }, (_, i) => i).sort(
    (a, b) => points[b][1] - points[a][1],
  );
  const area = new Float32Array(count).fill(1);
  const receiver = new Int32Array(count).fill(-1);
  const slopes = new Float32Array(count);
  for (const index of order) {
    const row = Math.floor(index / width),
      col = index % width;
    if (row === 0 || col === 0 || row === n || col === n) continue;
    let steepest = 0;
    for (let dz = -1; dz <= 1; dz++)
      for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dz) continue;
        const next = index + dz * width + dx;
        const slope = (points[index][1] - points[next][1]) / Math.hypot(dx, dz);
        if (slope > steepest) {
          steepest = slope;
          receiver[index] = next;
        }
      }
    slopes[index] = steepest;
    if (receiver[index] >= 0) area[receiver[index]] += area[index];
  }
  for (let i = 0; i < count; i++) {
    const [x, h, z] = points[i];
    const bank = riverHeight(z) + 30;
    if (h < bank + 90 || slopes[i] < 3) continue;
    const incision =
      Math.min(45, Math.log2(area[i] + 1) * 6) * Math.min(1, slopes[i] / 35);
    points[i][1] = Math.max(bank + 50, h - incision);
  }
  return points;
}
