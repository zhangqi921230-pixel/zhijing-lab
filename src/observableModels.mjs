export function shadowState(p, time = 0) {
  const tangent = Math.tan((p.angle * Math.PI) / 180);
  return {
    small: p.pole / tangent,
    large: p.height / tangent,
    ratio: p.height / p.pole,
    progress: Math.max(0, Math.min(1, time / 6)),
  };
}
export function circularState(p, time = 0) {
  const omega = p.speed / p.radius,
    angle = omega * time;
  return {
    angle,
    x: p.radius * Math.cos(angle),
    y: p.radius * Math.sin(angle),
    vx: -p.speed * Math.sin(angle),
    vy: p.speed * Math.cos(angle),
    ax: (-(p.speed ** 2) / p.radius) * Math.cos(angle),
    ay: (-(p.speed ** 2) / p.radius) * Math.sin(angle),
    acceleration: p.speed ** 2 / p.radius,
    force: (p.mass * p.speed ** 2) / p.radius,
    period: (2 * Math.PI) / omega,
  };
}
export function circularComparison(p, chapter, time) {
  const key = ["speed", "radius", "mass"][chapter - 2];
  if (!key) return null;
  const reference = { ...p, [key]: key === "mass" ? 1 : 2 };
  const currentState = circularState(p, time);
  const referenceState = circularState(reference, time);
  return {
    key,
    reference,
    currentState,
    referenceState,
    ratio: currentState.force / referenceState.force,
  };
}
export function observableReadouts(id, p, time) {
  if (id === "shadow-height") {
    const q = shadowState(p, time);
    return [
      ["立杆影长", `${q.small.toFixed(2)} m`],
      ["建筑影长", `${q.large.toFixed(2)} m`],
      ["测算高度", `${((p.pole * q.large) / q.small).toFixed(2)} m`],
    ];
  }
  const q = circularState(p, time);
  return [
    ["向心加速度", `${q.acceleration.toFixed(2)} m/s²`],
    ["向心合力", `${q.force.toFixed(2)} N`],
    ["一周时间", `${q.period.toFixed(2)} s`],
  ];
}
