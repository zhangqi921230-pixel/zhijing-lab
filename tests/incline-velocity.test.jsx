import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { it, expect } from "vitest";
import InclineVelocityPlot, {
  inclineVelocityTrace,
} from "../src/InclineVelocityPlot.jsx";
import { incline } from "../src/advancedModels.mjs";

it("速度曲线面积等于模型位移，停止点精确且静止时不出现无穷坐标", () => {
  for (const angle of [5, 27, 50]) {
    const p = { angle, mass: 2, mu: 0.2, muStatic: 0.5 };
    for (const t of [0, 0.5, 2, 8]) {
      const q = inclineVelocityTrace(p, t);
      expect(q.displacement).toBeCloseTo(incline(p, t).s, 10);
      const html = renderToStaticMarkup(<InclineVelocityPlot p={p} t={t} />);
      expect(html).not.toMatch(/NaN|Infinity/);
      expect(q.stopped).toBe(incline(p, t).arrived);
    }
  }
});
it("绘制截止当前时刻，停止后解释速度不连续的模型边界", () => {
  const p = { angle: 50, mass: 2, mu: 0.2, muStatic: 0.3 };
  const q = inclineVelocityTrace(p, 0.2);
  expect(q.movingUntil).toBe(0.2);
  const stopped = renderToStaticMarkup(<InclineVelocityPlot p={p} t={8} />);
  expect(stopped).toContain("不表示有限碰撞加速度");
});
