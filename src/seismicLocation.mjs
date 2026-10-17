// A flat, homogeneous medium with a known common source depth.
// Horizontal circles are derived from hypocentral distance, not S-P directly.
export function seismicLocation(p) {
  const stations = [
    ["A", p.distance, 0],
    ["B", -40, 35],
    ["C", -30, -40],
  ].map(([name, x, y]) => {
    const radius = Math.hypot(x, y);
    const path = Math.hypot(radius, p.depth);
    return { name, x, y, radius, path, lag: path * (1 / 3.5 - 1 / 6) };
  });
  const alternative = secondIntersection(stations);
  return { stations, alternative };
}

export function secondIntersection(stations) {
  if (stations.length < 2) return null;
  const [a, b] = stations,
    vx = b.x - a.x,
    vy = b.y - a.y,
    k = -(a.x * vx + a.y * vy) / (vx * vx + vy * vy);
  return { x: 2 * (a.x + k * vx), y: 2 * (a.y + k * vy) };
}
export function receivedLocationStations(p, time, count = 3) {
  return seismicLocation(p)
    .stations.slice(0, count)
    .filter((s) => time >= s.path / 3.5);
}
