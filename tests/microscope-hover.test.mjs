import { it, expect } from "vitest";
import * as T from "three";
import { microscopeHoverAction } from "../src/MicroscopeHover.js";
it("hover resolves the actionable ancestor and distinguishes slide drag from selection", () => {
  const child = new T.Mesh(),
    group = new T.Group();
  group.add(child);
  group.userData = { action: "parameter", key: "mag", value: 400 };
  expect(microscopeHoverAction(child)).toEqual({
    text: "40× 物镜 · 点击切换至总倍率 400×",
    cursor: "pointer",
  });
  group.userData = { action: "parameter", key: "specimen", value: 1 };
  expect(microscopeHoverAction(child).text).toContain("洋葱表皮");
  group.userData = { action: "parameter", key: "power", value: 0 };
  expect(microscopeHoverAction(child).text).toBe("点击关闭光源");
  group.userData = {};
  group.name = "microscope-slide";
  expect(microscopeHoverAction(child).cursor).toBe("grab");
  expect(microscopeHoverAction(new T.Group())).toBeNull();
  expect(microscopeHoverAction(undefined)).toBeNull();
});
