import { expect, it } from "vitest";
import { recordedParameter } from "../src/recordedParameter.mjs";

it("uses actual option values ahead of obsolete index-based labels", () => {
  const param = {
    options: [
      { value: 3, label: "氨 NH₃" },
      { value: 9, label: "自定义情境" },
    ],
    unit: "",
  };
  expect(recordedParameter(param, 3, ["水", "CO₂", "甲烷", "旧选项"])).toBe(
    "氨 NH₃",
  );
  expect(recordedParameter(param, 9)).toBe("自定义情境");
  expect(recordedParameter({ unit: "" }, 1, ["断开", "闭合"])).toBe("闭合");
});

it("preserves numeric units and distinguishes missing historical values from zero", () => {
  expect(recordedParameter({ unit: "cm" }, 1.25)).toBe("1.25cm");
  const option = { options: [{ value: 0, label: "隐藏孤电子对" }], unit: "" };
  expect(recordedParameter(option, 0)).toBe("隐藏孤电子对");
  expect(recordedParameter(option, undefined)).toBe("未记录");
  expect(recordedParameter(option, null)).toBe("未记录");
});
