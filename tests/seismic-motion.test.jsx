import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { it, expect } from "vitest";
import SeismicMotion, {
  seismicParticleOffset,
  PARTICLE_OMEGA,
} from "../src/SeismicMotion.jsx";
it("质点间距足以采样最短波长，纵波质点顺序不会反转或重叠", () => {
  const spacing = 80 / 24;
  expect((2 * Math.PI * 3.5) / PARTICLE_OMEGA / spacing).toBeGreaterThan(4);
  for (let t = 0; t <= 30; t += 0.05) {
    let previous = -Infinity;
    for (let i = 0; i < 25; i++) {
      const x = 110 + i * 20 + seismicParticleOffset(i * spacing, t, "P")[0];
      expect(x - previous).toBeGreaterThan(7);
      previous = x;
    }
  }
});
it("未到达质点保持静止，P纵向与S横向偏移遵守各自方向", () => {
  for (const distance of [0, 20, 40, 80])
    for (const kind of ["P", "S"]) {
      const arrival = distance / (kind === "P" ? 6 : 3.5);
      expect(seismicParticleOffset(distance, arrival, kind)).toEqual([0, 0]);
      expect(seismicParticleOffset(distance, arrival - 0.1, kind)).toEqual([
        0, 0,
      ]);
      const offset = seismicParticleOffset(distance, arrival + 0.15, kind);
      expect(offset[kind === "P" ? 1 : 0]).toBe(0);
      expect(Math.abs(offset[kind === "P" ? 0 : 1])).toBeGreaterThan(1);
      expect(Math.hypot(...offset)).toBeLessThanOrEqual(7);
    }
  expect(seismicParticleOffset(40, 8, "S")).toEqual([0, 0]);
  expect(Math.abs(seismicParticleOffset(40, 8, "P")[0])).toBeGreaterThan(0);
});
it("示意明确平衡位置与非实测边界，渲染无NaN", () => {
  const html = renderToStaticMarkup(<SeismicMotion time={8} />);
  expect(html).toContain("平衡位置");
  expect(html).toContain("不代表真实地震记录");
  expect(html).not.toContain("NaN");
  expect((html.match(/<circle/g) || []).length).toBe(100);
});
