import { it, expect } from "vitest";
import { projectileLayout, projectileLanded } from "../src/ProjectileScene.jsx";
import { projectile } from "../src/models.mjs";
it("抛体画面同尺度，所有参数端点的轨迹完整落在坐标区", () => {
  for (const speed of [5, 15, 25])
    for (const angle of [0, 35, 75])
      for (const height of [0, 2, 10]) {
        const p = { speed, angle, height },
          layout = projectileLayout(p),
          origin = layout.point(0, 0),
          x = layout.point(1, 0),
          y = layout.point(0, 1);
        expect(x[0] - origin[0]).toBeCloseTo(origin[1] - y[1], 12);
        for (const s of layout.samples) {
          const pt = layout.point(s.x, s.y);
          expect(pt[0]).toBeGreaterThanOrEqual(80);
          expect(pt[0]).toBeLessThanOrEqual(660);
          expect(pt[1]).toBeGreaterThanOrEqual(68);
          expect(pt[1]).toBeLessThanOrEqual(430);
        }
        const last = layout.samples.at(-1);
        expect(last.y).toBeCloseTo(0, 10);
        expect(last.x).toBeCloseTo(projectile(p, 0).range, 10);
      }
});
it("实际等时间标记的水平间距恒定，竖直二阶差分为负 g Δt²", () => {
  for (const angle of [0, 20, 45, 75]) {
    const p = { speed: 18, angle, height: 3 },
      layout = projectileLayout(p),
      a = layout.samples;
    for (let i = 1; i < a.length; i++)
      expect(a[i].x - a[i - 1].x).toBeCloseTo(a[0].vx * layout.dt, 10);
    for (let i = 1; i < a.length - 1; i++)
      expect(a[i + 1].y - 2 * a[i].y + a[i - 1].y).toBeCloseTo(
        -9.8 * layout.dt ** 2,
        10,
      );
  }
  expect(
    projectileLayout({ speed: 5, angle: 0, height: 0 }).samples,
  ).toHaveLength(1);
});
it("落地时间容差只吸收浏览器舍入误差", () => {
  const q = projectile({ speed: 15, angle: 63, height: 2 }, 0);
  expect(projectileLanded(q.flight, q.flight - 1e-12)).toBe(true);
  expect(projectileLanded(q.flight, q.flight - 0.001)).toBe(false);
  expect(projectileLanded(0, 0)).toBe(false);
});
