import { solubility } from "./models.mjs";
export function saturationTemperature(mass, water) {
  if (
    !Number.isFinite(mass) ||
    mass < 0 ||
    !Number.isFinite(water) ||
    water <= 0
  )
    return null;
  const target = (mass * 100) / water;
  if (target < solubility(0) || target > solubility(80)) return null;
  let low = 0,
    high = 80;
  for (let i = 0; i < 48; i++) {
    const mid = (low + high) / 2;
    if (solubility(mid) < target) low = mid;
    else high = mid;
  }
  return (low + high) / 2;
}
