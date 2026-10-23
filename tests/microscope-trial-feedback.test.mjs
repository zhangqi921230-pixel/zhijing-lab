import { it, expect } from "vitest";
import { microscopeTrialFeedback as feedback } from "../src/microscopeTrialFeedback.mjs";
it("stops at the shared focus threshold instead of encouraging overshoot", () => {
  const base = {
    valid: true,
    visible: true,
    trial: { visible: true, blur: 1 },
  };
  for (const blur of [0, 0.3, 0.6])
    expect(feedback({ ...base, blur })).toContain("停止连续试调");
  expect(
    feedback({ ...base, blur: 0.61, trial: { visible: true, blur: 0.6 } }),
  ).toContain("已离开");
  expect(feedback({ ...base, blur: 0.8 })).toContain("更清晰");
  expect(feedback({ ...base, blur: 1.2 })).toContain("更模糊");
});
it("never judges focus with insufficient illumination or a stale comparison", () => {
  expect(feedback({ valid: false, visible: false, blur: 0 })).toContain(
    "照明不足",
  );
  expect(feedback({ valid: false, visible: true, blur: 2 })).toContain(
    "先观察目镜",
  );
  expect(
    feedback({
      valid: true,
      visible: true,
      blur: 2,
      trial: { visible: false, blur: 3 },
    }),
  ).toContain("无法比较");
});
