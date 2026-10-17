// Isometric families: cone sector angle contracts as its semi-angle opens;
// cylinder curvature tends to zero with arc length held fixed.
export function unfoldedPoint(kind, radius, height, progress, u, v) {
  const t = Math.max(0, Math.min(1, progress));
  const arc = (u - 0.5) * 2 * Math.PI * radius;
  if (kind === "cylinder") {
    const curvature = (1 - t) / radius;
    const angle = arc * curvature;
    return [
      curvature < 1e-8 ? arc : Math.sin(angle) / curvature,
      (v - 0.5) * height,
      curvature < 1e-8 ? 0 : (2 * Math.sin(angle / 2) ** 2) / curvature,
    ];
  }
  const slant = Math.hypot(radius, height);
  const sine = radius / slant + t * (1 - radius / slant);
  const angle = arc / (slant * sine);
  const distance = v * slant;
  return [
    distance * sine * Math.sin(angle),
    (0.5 * slant - distance) * Math.sqrt(Math.max(0, 1 - sine * sine)),
    distance * sine * Math.cos(angle),
  ];
}

export function projectUnfoldPoint([x, y, z]) {
  // Fixed orthographic view; diagram is a projection, not an area measurement.
  return [x, -y * 0.8 + z * 0.6, y * 0.6 + z * 0.8];
}

// Fixed scale throughout each unfolding. For the cylinder, the maximum depth
// excursion is < 2.3r, giving a projected height bound of 0.8h + 1.38r.
export function solidUnfoldScale(kind, radius, height) {
  return kind === "cone"
    ? 175 / Math.hypot(radius, height)
    : Math.min(
        440 / (2 * Math.PI * radius),
        220 / (0.8 * height + 1.38 * radius),
      );
}

export function unfoldedNormal(kind, radius, height, progress, u) {
  const t = Math.max(0, Math.min(1, progress));
  if (kind === "cylinder") {
    const angle = (u - 0.5) * 2 * Math.PI * (1 - t);
    return [Math.sin(angle), 0, -Math.cos(angle)];
  }
  const slant = Math.hypot(radius, height);
  const sine = radius / slant + t * (1 - radius / slant);
  const cosine = Math.sqrt(Math.max(0, 1 - sine * sine));
  const angle = ((u - 0.5) * 2 * Math.PI * radius) / (slant * sine);
  return [cosine * Math.sin(angle), sine, cosine * Math.cos(angle)];
}

export function unfoldedLightness(kind, radius, height, progress, u) {
  const n = unfoldedNormal(kind, radius, height, progress, u);
  // Shade the side facing the fixed orthographic camera; both sides are paper.
  const facing = -0.6 * n[1] - 0.8 * n[2] >= 0 ? 1 : -1;
  const light = Math.max(
    0,
    (facing * (-0.4 * n[0] + 0.7 * n[1] - 0.6 * n[2])) / Math.sqrt(1.01),
  );
  return (kind === "cone" ? 60 : 48) + 20 * light;
}
