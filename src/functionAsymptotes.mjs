// These families have only axis-parallel asymptotes. Degenerate constant
// functions and empty domains do not use the nonconstant-family guides.
export function functionAsymptotes(p) {
  if (p.a === 0 || (p.k ?? 1) === 0) return [];
  const lines = [];
  if ([3, 7].includes(p.type)) lines.push({ axis: "x", value: p.shift });
  if ([3, 6].includes(p.type)) lines.push({ axis: "y", value: p.b });
  return lines;
}
