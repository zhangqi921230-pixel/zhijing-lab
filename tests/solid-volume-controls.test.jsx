// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import MotionLab from "../src/MotionLab.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("resizing preserves the half-height slice and complete 32-layer construction", async () => {
  const host = document.createElement("div");
  document.body.append(host);
  const root = createRoot(host);
  const change = async (label, value) =>
    act(() => {
      const input = host.querySelector(`[aria-label="${label}"]`);
      Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value",
      ).set.call(input, String(value));
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
  try {
    await act(() =>
      root.render(
        <MotionLab
          lesson={{ id: "solid-volume" }}
          open={() => {}}
          goHome={() => {}}
        />,
      ),
    );
    await act(() =>
      host.querySelectorAll('[aria-label="学习子主题"] button')[4].click(),
    );
    await change("立体高度", 3);
    expect(host.querySelector('[aria-label="演示进度"]').value).toBe("3");
    expect(host.textContent).toContain("圆锥切片：25.0%");
    expect(host.textContent).toContain("切片高度：1.50 cm");
    await act(() =>
      host.querySelectorAll('[aria-label="学习子主题"] button')[5].click(),
    );
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === "32 层")
        .click(),
    );
    await change("底面半径", 3);
    expect(host.textContent).toContain("已显示 32/32 层");
    expect(host.querySelector('[aria-label="演示进度"]').value).toBe("6");
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === "回到起点")
        .click(),
    );
    expect(host.textContent).toContain("已显示 0/32 层");
  } finally {
    await act(() => root.unmount());
    host.remove();
  }
});
