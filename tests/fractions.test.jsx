import { it, expect } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import FractionsScene, {
  sectorPath,
  fractionLayout,
} from "../src/FractionsScene.jsx";
it("圆形实际扇形路径严格等角等面积，无累积缺口", () => {
  for (let d = 2; d <= 12; d++) {
    let total = 0;
    for (let i = 0; i < d; i++) {
      const n = sectorPath(0, 0, 133, i, d)
        .match(/-?\d+(?:\.\d+)?(?:e[-+]?\d+)?/gi)
        .map(Number);
      let angle = Math.atan2(n[10], n[9]) - Math.atan2(n[3], n[2]);
      if (angle < 0) angle += 2 * Math.PI;
      expect(angle).toBeCloseTo((2 * Math.PI) / d, 10);
      total += angle;
    }
    expect(total).toBeCloseTo(2 * Math.PI, 10);
  }
});
it("整数、零和假分数在圆形和分数条中取出数量完全一致", () => {
  for (let n = 0; n <= 12; n++)
    for (let d = 1; d <= 12; d++) {
      const html = renderToStaticMarkup(
        <FractionsScene p={{ n, d }} onChange={() => {}} />,
      );
      expect((html.match(/aria-pressed="true"/g) || []).length).toBe(2 * n);
      expect(html).not.toMatch(/NaN|Infinity/);
      const q = fractionLayout(n, d);
      expect(q.marker).toBeGreaterThanOrEqual(90);
      expect(q.marker).toBeLessThanOrEqual(810);
    }
});
