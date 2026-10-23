import { expect, it } from "vitest";
import { unitCircleState, circleProbe } from "../src/unitCircle.mjs";
import { functionValue } from "../src/advancedModels.mjs";
it("单位圆保持单位半径，投影与变换后的正弦函数一致", () => {
  for (const k of [-3, -1, 0, 0.5, 2])
    for (const probe of [-5, -Math.PI / 2, 0, Math.PI / 2, 5]) {
      const p = { type: 1, a: -2, k, shift: 1.2, b: 0.7, probe },
        q = unitCircleState(p);
      expect(q.cosine ** 2 + q.sine ** 2).toBeCloseTo(1, 12);
      expect(q.y).toBeCloseTo(functionValue(p, probe), 12);
    }
});
it("拖动跨负轴保持角度连续，翻折和零系数按定义处理", () => {
  const p = { type: 1, a: 1, k: 1, shift: 0, b: 0, probe: 3.13 };
  expect(circleProbe(p, -3.13)).toBeCloseTo(2 * Math.PI - 3.13, 12);
  expect(circleProbe({ ...p, k: -1, probe: 0 }, Math.PI / 2)).toBeCloseTo(
    -Math.PI / 2,
    12,
  );
  expect(circleProbe({ ...p, k: 0 }, 1)).toBe(null);
  expect(circleProbe({ ...p, k: 0.1, probe: 0 }, 1)).toBe(5);
});
