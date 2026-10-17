import { volcanoPoint, volcanoFootprintRadius } from "./VolcanoSurface.js";

// Scene-space gravity and launch speed are illustrative, not SI eruption data.
export function volcanoHeightAt(x, z) {
  const radius = Math.hypot(x, z),
    angle = Math.atan2(x, z);
  if (radius >= 3.1) return -0.7;
  let low = 0,
    high = 3.1;
  for (let i = 0; i < 22; i++) {
    const mid = (low + high) / 2;
    if (volcanoFootprintRadius(mid, angle) < radius) low = mid;
    else high = mid;
  }
  return volcanoPoint((low + high) / 2, angle).y;
}

export function ejectaPosition(age, speed, angle) {
  const radius = speed * 0.45 * age;
  return {
    x: Math.cos(angle) * radius,
    y: 2.15 + speed * age - 1.4 * age * age,
    z: Math.sin(angle) * radius,
  };
}

export function ejectaImpactTime(speed, angle, radius) {
  const clearance = (t) => {
    const p = ejectaPosition(t, speed, angle);
    return p.y - radius - volcanoHeightAt(p.x, p.z);
  };
  for (let t = 0.02; t <= 6; t += 0.02) {
    if (clearance(t) > 0) continue;
    let low = t - 0.02,
      high = t;
    for (let i = 0; i < 20; i++) {
      const mid = (low + high) / 2;
      if (clearance(mid) > 0) low = mid;
      else high = mid;
    }
    return (low + high) / 2;
  }
  return 6;
}
