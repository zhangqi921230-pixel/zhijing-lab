import { refraction } from "./models.mjs";
export function reverseRefraction(p) {
  const q = refraction(p.angle, p.n1, p.n2);
  if (q.tir || q.angle > 89.9) return null;
  return { ...p, n1: p.n2, n2: p.n1, angle: q.angle };
}
