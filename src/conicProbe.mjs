import { conicState, conicFoci, conicPlanePoint } from "./conicGeometry.mjs";
export function conicProbe(p, segments) {
  const q = conicState(p);
  if (q.degenerate || !segments.length) return null;
  const index = Math.round(
    (Math.max(0, Math.min(100, p.probe ?? 25)) / 100) * (segments.length - 1),
  );
  const point = segments[index][0],
    plane = conicPlanePoint(p, point),
    foci = conicFoci(p);
  const distances = foci.map((f) => Math.hypot(plane[0] - f.u, plane[1]));
  if (q.kind === "抛物线") {
    const B = 2 * p.offset * q.s * q.c * (q.k * q.k + 1);
    const C = p.offset * p.offset * (q.k * q.k * q.c * q.c - q.s * q.s);
    const directrix = -C / B - B / 4;
    return {
      point,
      plane,
      distances,
      directrix,
      value: Math.abs(plane[0] - directrix),
      label: "到准线的距离",
    };
  }
  return {
    point,
    plane,
    distances,
    value:
      q.kind === "双曲线"
        ? Math.abs(distances[0] - distances[1])
        : q.kind === "圆"
          ? distances[0]
          : distances[0] + distances[1],
    label:
      q.kind === "双曲线"
        ? "|PF₁ − PF₂|"
        : q.kind === "圆"
          ? "到圆心的距离"
          : "PF₁ + PF₂",
  };
}
