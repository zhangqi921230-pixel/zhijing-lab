import { functionValue } from "./advancedModels.mjs";

export function functionLandmark(p) {
  const k = p.k ?? 1;
  if (k === 0) return null;
  const sourceX = [3, 7].includes(p.type) ? 1 : 0;
  const x = p.shift + sourceX / k;
  const y = functionValue(p, x);
  if (!Number.isFinite(y)) return null;
  const names = [
    "顶点",
    "中线交点",
    "折点",
    "对应点",
    "拐点",
    "定义域端点",
    "对应点",
    "对应点",
  ];
  return {
    sourceX,
    sourceY: functionValue({ ...p, a: 1, k: 1, shift: 0, b: 0 }, sourceX),
    x,
    y,
    name: p.a === 0 && p.type !== 5 ? "对应点" : names[p.type],
  };
}
