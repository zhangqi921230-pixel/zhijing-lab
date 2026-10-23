// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import MotionLab from "../src/MotionLab.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("mix presets update actual light channels and seek to overlap without changing the chapter", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  try {
    await act(() =>
      root.render(
        <MotionLab
          lesson={{ id: "additive-light" }}
          open={() => {}}
          goHome={() => {}}
        />,
      ),
    );
    const click = async (name) => {
      const button = [...host.querySelectorAll("button")].find(
        (b) => b.textContent === name,
      );
      expect(button).toBeTruthy();
      await act(() => button.click());
      return button;
    };
    const yellow = await click("红 + 绿 → 黄");
    expect(host.querySelector('[aria-label="蓝光强度"]').value).toBe("0");
    expect(host.querySelector('[aria-label="演示进度"]').value).toBe("6");
    expect(host.querySelector("h1").textContent).toBe("三束光相遇");
    expect(yellow.getAttribute("aria-pressed")).toBe("true");
    await click("三光各 25% → 灰");
    expect(yellow.getAttribute("aria-pressed")).toBe("false");
    const swatches = host.querySelectorAll(".color-mix-swatch");
    expect(swatches[3].style.backgroundColor).toBe("rgb(137, 137, 137)");
    expect(swatches[0].style.backgroundColor).toBe("rgb(137, 0, 0)");
    await click("关闭全部光源");
    expect(swatches[3].style.backgroundColor).toBe("rgb(0, 0, 0)");
    expect(host.textContent).toContain("无入射光");
    expect(host.textContent).toContain("播放演示");
  } finally {
    await act(() => root.unmount());
  }
});
