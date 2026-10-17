export function triangleAngleRadius(p, scale, maximum) {
  return Math.min(
    maximum,
    0.3 *
      scale *
      Math.min(
        p.base,
        Math.hypot(p.offset, p.height),
        Math.hypot(p.base - p.offset, p.height),
      ),
  );
}
export function triangleAngles(p) {
  const a = Math.atan2(p.height, p.offset),
    b = Math.atan2(p.height, p.base - p.offset);
  return { a, b, c: Math.PI - a - b, exterior: Math.PI - b };
}
export function communicatingState(p, time) {
  const t = Math.max(0, Math.min(1, time / 6)),
    f = t * t * (3 - 2 * t);
  const equilibrium = (p.left + p.ratio * p.right) / (1 + p.ratio);
  const left = p.left + (equilibrium - p.left) * f,
    right = p.right + (equilibrium - p.right) * f;
  return {
    left,
    right,
    equilibrium,
    volume: 10 * left + 10 * p.ratio * right,
    transfer: 10 * (p.left - left),
    pressure: 98 * (left - right),
    direction: Math.sign(left - right),
  };
}
export function insightReadouts(id, p, time) {
  if (id === "triangle-angles") {
    const q = triangleAngles(p);
    return [
      ["∠A", `${((q.a * 180) / Math.PI).toFixed(1)}°`],
      ["∠B", `${((q.b * 180) / Math.PI).toFixed(1)}°`],
      ["∠C", `${((q.c * 180) / Math.PI).toFixed(1)}°`],
    ];
  }
  const q = communicatingState(p, time);
  return [
    ["最终共同液面", `${q.equilibrium.toFixed(2)} cm`],
    ["左 → 右净转移", `${q.transfer.toFixed(1)} cm³`],
    ["两竖管液体总体积", `${q.volume.toFixed(1)} cm³`],
  ];
}
