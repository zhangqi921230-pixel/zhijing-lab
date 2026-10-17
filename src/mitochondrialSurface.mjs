// Shared parametric surface for membrane geometry and attached teaching details.
export function cristaPoint(n, u, v) {
  const x =
    (n - 3) * 0.058 +
    0.012 * Math.cos(Math.PI * u) +
    0.008 * Math.sin(v * 4 + n * 1.7) * (1 - v * v);
  const radial = Math.sqrt(Math.max(0, 1 - (x / 0.252) ** 2));
  const arc = Math.sqrt(Math.max(0, 1 - v * v));
  const y =
    -0.098 * radial * arc +
    (0.064 + 0.012 * Math.sin(n * 2.3 + 0.8)) *
      radial *
      arc *
      Math.sin(Math.PI * u);
  return [x, y, v * 0.127 * radial];
}
