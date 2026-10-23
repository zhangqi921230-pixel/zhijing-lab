import { it, expect } from "vitest";
import { microscopeObservationCaption } from "../src/microscopeObservation.mjs";
it("exports specimen parameters while keeping uncalibrated photos distinct", () => {
  const p = {
    specimen: 1,
    mag: 400,
    coarse: 42,
    focus: 63,
    light: 70,
    x: -8,
    y: 13,
  };
  const simulated = microscopeObservationCaption(p, 3.25).join("\n");
  expect(simulated).toContain("总倍率 400×（目镜 10× · 物镜 40×）");
  expect(simulated).toContain("X -8 / Y 13");
  expect(simulated).toContain("非实拍");
  const photo = microscopeObservationCaption(p, 3.25, 2).join("\n");
  expect(photo).toContain("数字缩放 2× · 未标定尺度");
  expect(photo).not.toMatch(/400|物镜|洋葱|演示时间/);
});

it("freezes the local photo source independently from later observations", () => {
  const p = {
    specimen: 1,
    mag: 400,
    coarse: 50,
    focus: 50,
    light: 70,
    x: 0,
    y: 0,
  };
  const first = microscopeObservationCaption(p, 0, 2, "洋葱-样本A.png");
  const second = microscopeObservationCaption(p, 0, 1, "洋葱-样本B.png");
  expect(first[1]).toBe("来源文件：洋葱-样本A.png");
  expect(second[1]).toBe("来源文件：洋葱-样本B.png");
  expect(first.join("\n")).toContain("数字缩放 2×");
  expect(first.join("\n")).not.toContain("样本B");
  expect(
    microscopeObservationCaption(p, 0, null, "旧照片.png").join("\n"),
  ).not.toContain("来源文件");
});
