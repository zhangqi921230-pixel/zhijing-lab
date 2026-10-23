import { it, expect } from "vitest";
import { opticalRays, incidentAngle } from "../src/RefractionScene.jsx";
import { refraction } from "../src/models.mjs";
it("实际光线端点满足反射定律与斯涅尔定律，透射光不跨错半空间", () => {
  for (const n1 of [1, 1.33, 1.5, 1.8])
    for (const n2 of [1, 1.33, 1.5, 1.8])
      for (const angle of [0, 10, 40, 60, 80, 89.9]) {
        const q = opticalRays({ n1, n2, angle });
        expect(q.incident[1]).toBeLessThanOrEqual(300);
        expect(q.reflected[1]).toBeCloseTo(q.incident[1], 12);
        expect(q.reflected[0] - 320).toBeCloseTo(320 - q.incident[0], 12);
        if (q.tir) expect(q.transmitted).toBeNull();
        else {
          expect(q.transmitted[1]).toBeGreaterThanOrEqual(300);
          expect((n2 * (q.transmitted[0] - 320)) / 220).toBeCloseTo(
            (n1 * (320 - q.incident[0])) / 220,
            11,
          );
        }
      }
});
it("临界角浮点误差不误判全反射，临界角两侧状态正确", () => {
  for (let n1 = 1.01; n1 <= 1.8; n1 += 0.01) {
    const c = refraction(0, n1, 1).critical;
    expect(refraction(c, n1, 1).tir).toBe(false);
    expect(refraction(c, n1, 1).angle).toBeCloseTo(90, 10);
    expect(refraction(c + 0.00001, n1, 1).tir).toBe(true);
    expect(refraction(c - 0.00001, n1, 1).tir).toBe(false);
  }
});
it("光源拖动坐标按法线反算入射角并限制到可选范围", () => {
  for (const angle of [0, 0.1, 20, 40, 80, 89.9]) {
    const a = (angle * Math.PI) / 180;
    expect(
      incidentAngle(320 - 252 * Math.sin(a), 300 - 252 * Math.cos(a)),
    ).toBe(angle);
  }
  expect(incidentAngle(500, 100)).toBe(0);
  expect(incidentAngle(0, 400)).toBe(89.9);
});
