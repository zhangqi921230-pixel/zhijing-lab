import { it, expect } from "vitest";
import { pondMotion } from "../src/pondMotion.mjs";
it("swimmer orientation follows its continuous path through the full demonstration", () => {
  for (let i = 0; i < 54; i++)
    for (let t = 0; t <= 120; t += 0.73) {
      const p = pondMotion(i, t),
        next = pondMotion(i, t + 0.0001),
        prev = pondMotion(i, t - 0.0001);
      const dx = (next.x - prev.x) / 0.0002,
        dy = (next.y - prev.y) / 0.0002;
      expect(p.vx).toBeCloseTo(dx, 5);
      expect(p.vy).toBeCloseTo(dy, 5);
      const speed = Math.hypot(dx, dy);
      expect(speed).toBeGreaterThan(0.01);
      expect(
        (dx * Math.cos(p.heading) + dy * Math.sin(p.heading)) / speed,
      ).toBeCloseTo(1, 8);
      expect(Math.abs(p.x)).toBeLessThan(288);
      expect(Math.abs(p.y)).toBeLessThan(280);
    }
});
