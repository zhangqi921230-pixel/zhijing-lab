// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import MotionLab from "../src/MotionLab.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("full-stroke comparisons update both pistons and preserve force, stroke and work", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  try {
    await act(() =>
      root.render(
        <MotionLab
          lesson={{ id: "hydraulic" }}
          open={() => {}}
          goHome={() => {}}
        />,
      ),
    );
    for (const ratio of [1, 2, 4, 8]) {
      const b = [...host.querySelectorAll("button")].find(
        (b) => b.textContent === `面积比 ${ratio}∶1`,
      );
      await act(() => b.click());
      expect(host.querySelector('[aria-label="演示进度"]').value).toBe("6");
      expect(host.querySelector('[aria-label="大、小活塞面积比"]').value).toBe(
        String(ratio),
      );
      expect(host.querySelector('[aria-label="小活塞施力"]').value).toBe("40");
      expect(host.querySelector('[aria-label="小活塞下压行程"]').value).toBe(
        "8",
      );
      const rows = host.querySelectorAll(".hydraulic-comparison-row");
      expect(rows[0].textContent).toContain(`${40 * ratio} N`);
      expect(rows[1].textContent).toContain(`${8 / ratio} cm`);
      const widths = [
        ...host.querySelectorAll(".hydraulic-bar-track span"),
      ].map((e) => parseFloat(e.style.width));
      expect(widths).toEqual([100 / ratio, 100, 100, 100 / ratio, 100, 100]);
      expect(host.querySelector("svg").textContent).toContain(
        `F₂ = ${40 * ratio} N`,
      );
      expect(host.textContent).toContain("播放演示");
    }
    const half = [...host.querySelectorAll("button")].find(
      (b) => b.textContent === "下压一半",
    );
    await act(() => half.click());
    expect(
      [...host.querySelectorAll(".hydraulic-bar-track span")].map((e) =>
        parseFloat(e.style.width),
      ),
    ).toEqual([12.5, 100, 50, 6.25, 50, 50]);
    const start = [...host.querySelectorAll("button")].find(
      (b) => b.textContent === "回到起点",
    );
    await act(() => start.click());
    expect(
      [...host.querySelectorAll(".hydraulic-bar-track span")]
        .slice(2)
        .every((e) => e.style.width === "0%"),
    ).toBe(true);
    expect(host.textContent).toContain("还没有移动");
  } finally {
    await act(() => root.unmount());
  }
});
