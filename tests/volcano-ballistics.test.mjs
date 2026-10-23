import { it, expect } from "vitest";
import { volcanoPoint } from "../src/VolcanoSurface.js";
import {
  volcanoHeightAt,
  ejectaPosition,
  ejectaImpactTime,
} from "../src/VolcanoBallistics.js";

it("碰撞高度使用实际起伏山体，不用平面高度替代", () => {
  for (let r = 0.2; r <= 3; r += 0.2) {
    for (let a = 0; a < Math.PI * 2; a += 0.3) {
      const p = volcanoPoint(r, a);
      expect(volcanoHeightAt(p.x, p.z)).toBeCloseTo(p.y, 4);
    }
  }
});
it("所有强度的碎屑保持恒定重力，首次接触前不穿透地形", () => {
  for (const type of [0, 1])
    for (let intensity = 1; intensity <= 5; intensity++) {
      const speed = (type ? 0.7 : 0.22) * intensity;
      for (let i = 0; i < 24; i++) {
        const a = i * 2.39996,
          radius = 0.035;
        const hit = ejectaImpactTime(speed, a, radius);
        const impact = ejectaPosition(hit, speed, a);
        expect(impact.y - radius).toBeCloseTo(
          volcanoHeightAt(impact.x, impact.z),
          5,
        );
        for (let t = 0; t < hit; t += 0.01) {
          const p = ejectaPosition(t, speed, a);
          expect(
            p.y - radius - volcanoHeightAt(p.x, p.z),
          ).toBeGreaterThanOrEqual(-0.00001);
        }
        const h = 0.01,
          t = hit / 2;
        const acceleration =
          (ejectaPosition(t + h, speed, a).y -
            2 * ejectaPosition(t, speed, a).y +
            ejectaPosition(t - h, speed, a).y) /
          (h * h);
        expect(acceleration).toBeCloseTo(-2.8, 6);
      }
    }
});
