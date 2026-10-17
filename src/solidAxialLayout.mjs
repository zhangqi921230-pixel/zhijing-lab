export function solidAxialLayout(radius, height, fraction) {
  const scale = Math.min(55 / radius, 145 / height);
  const r = radius * scale;
  const h = height * scale;
  const f = Math.max(0, Math.min(1, fraction));
  return { r, h, top: 185 - h, y: 185 - h * f, rho: r * (1 - f) };
}
