import { conicState } from "./conicGeometry.mjs";

// A bounded ellipse is convex. A triangle fan is valid only when the sampled
// intersection closes completely inside the finite cone; never bridge gaps.
export function conicSectionTriangles(p, segments) {
  const state = conicState(p);
  if (state.degenerate || state.eccentricity >= 1 || segments.length < 3)
    return [];
  const same = (a, b) => Math.hypot(...a.map((v, i) => v - b[i])) < 1e-8;
  if (
    !segments.every((segment, i) =>
      same(segment[1], segments[(i + 1) % segments.length][0]),
    )
  )
    return [];
  const center = [0, 0, 0];
  for (const [point] of segments)
    point.forEach((value, axis) => {
      center[axis] += value / segments.length;
    });
  return segments.flatMap(([a, b]) => [...center, ...a, ...b]);
}
