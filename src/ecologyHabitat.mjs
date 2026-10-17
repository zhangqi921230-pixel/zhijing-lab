export const HABITAT_POND = { x: 2.2, z: 1.35, radius: 0.85, level: -0.87 };
export function habitatHeight(x, z) {
  const r = Math.hypot(x - HABITAT_POND.x, z - HABITAT_POND.z);
  const t = Math.max(0, Math.min(1, (r - 0.42) / 0.43));
  return (
    -0.85 +
    0.025 * Math.sin(x * 3) * Math.cos(z * 2) -
    0.18 * (1 - t * t * (3 - 2 * t))
  );
}
export function habitatSites() {
  let seed = 313;
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const sites = [];
  for (let attempt = 0; sites.length < 35 && attempt < 5000; attempt++) {
    const x = -3.05 + rand() * 6.1,
      z = -1.95 + rand() * 3.9;
    if (Math.hypot(x - HABITAT_POND.x, z - HABITAT_POND.z) < 1) continue;
    if (sites.some((p) => Math.hypot(p.x - x, p.z - z) < 0.48)) continue;
    sites.push({ x, z });
  }
  return sites;
}
