import { expect, it } from "vitest";
import { graduationSurface } from "../src/CurvedGraduations.js";

it("烧杯和漏斗刻度面及面片弦均在玻璃外，保留真实高度", () => {
  for (const [radius, wall, base, height] of [
    [1.078, 1.075, -0.84, 2.3],
    [0.693, 0.69, 2.32, 1.8],
  ]) {
    const geometry = graduationSurface(radius, base, height),
      p = geometry.attributes.position;
    let minY = Infinity,
      maxY = -Infinity;
    for (let i = 0; i < p.count; i++) {
      expect(Math.hypot(p.getX(i), p.getZ(i))).toBeCloseTo(radius, 6);
      minY = Math.min(minY, p.getY(i));
      maxY = Math.max(maxY, p.getY(i));
    }
    expect(minY).toBeCloseTo(base, 6);
    expect(maxY).toBeCloseTo(base + height, 6);
    for (let i = 0; i < 24; i++) {
      const x = (p.getX(i) + p.getX(i + 1)) / 2,
        z = (p.getZ(i) + p.getZ(i + 1)) / 2;
      expect(Math.hypot(x, z)).toBeGreaterThan(wall);
    }
  }
});
