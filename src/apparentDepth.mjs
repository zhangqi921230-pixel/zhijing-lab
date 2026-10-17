import { refraction, rad } from "./models.mjs";
export function apparentDepth(depth, angle, n1, n2) {
  const q = refraction(angle, n1, n2),
    limit = (depth * n2) / n1;
  if (q.tir || q.angle >= 90 - 1e-8)
    return {
      ...q,
      depth,
      apparent: null,
      limit,
      offset: depth * Math.tan(rad(angle)),
    };
  return {
    ...q,
    depth,
    apparent:
      angle < 1e-8
        ? limit
        : (depth * Math.tan(rad(angle))) / Math.tan(rad(q.angle)),
    limit,
    offset: depth * Math.tan(rad(angle)),
  };
}
