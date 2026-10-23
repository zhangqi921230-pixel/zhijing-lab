// Normalized two-body integration: GM=1, Earth radius=1; no atmosphere.
export function orbitPath(speedFactor = 1) {
  const dt = 0.012,
    points = [];
  let x = 0,
    y = 1.7,
    vx = speedFactor / Math.sqrt(1.7),
    vy = 0;
  const acceleration = (a, b) => {
    const r = Math.hypot(a, b);
    return [-a / r ** 3, -b / r ** 3];
  };
  let [ax, ay] = acceleration(x, y),
    ending = "bounded";
  for (let i = 0; i < 2200; i++) {
    points.push([x, y]);
    const nx = x + vx * dt + 0.5 * ax * dt * dt,
      ny = y + vy * dt + 0.5 * ay * dt * dt;
    const [bx, by] = acceleration(nx, ny);
    vx += ((ax + bx) * dt) / 2;
    vy += ((ay + by) * dt) / 2;
    x = nx;
    y = ny;
    ax = bx;
    ay = by;
    if (Math.hypot(x, y) <= 1) {
      ending = "surface";
      points.push([x, y]);
      break;
    }
    if (Math.hypot(x, y) > 8) {
      ending = "outside";
      break;
    }
  }
  return { points, ending };
}
export const planets = [
  ["水星", 0.383, 0.387, "#a6a49e"],
  ["金星", 0.949, 0.723, "#cda96e"],
  ["地球", 1, 1, "#73b4ce"],
  ["火星", 0.532, 1.524, "#c87752"],
  ["木星", 11.21, 5.203, "#be9873"],
  ["土星", 9.45, 9.58, "#d5c090"],
  ["天王星", 4.01, 19.2, "#9bcdd0"],
  ["海王星", 3.88, 30.05, "#608dcd"],
];
export const illuminatedFraction = (angle) => (1 - Math.cos(angle)) / 2;
