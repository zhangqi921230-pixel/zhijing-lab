import { functionValue } from "./advancedModels.mjs";

export function definedProbePosition(p) {
  const direction = Math.sign(p.k ?? 1);
  const candidates = [
    p.shift,
    p.shift + direction,
    p.shift - direction,
    0,
    -5,
    5,
  ]
    .filter((x) => Number.isFinite(x) && x >= -5 && x <= 5)
    .filter((x) => {
      const y = functionValue(p, x);
      return y !== null && Number.isFinite(y);
    });
  candidates.sort((a, b) => Math.abs(a - p.probe) - Math.abs(b - p.probe));
  return candidates[0] ?? null;
}
