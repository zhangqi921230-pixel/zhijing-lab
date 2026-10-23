// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import MotionLab from "../src/MotionLab.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("same initial levels compare weighted equilibrium and reset through the shared timeline", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  await act(() =>
    root.render(
      <MotionLab
        lesson={{ id: "communicating" }}
        open={() => {}}
        goHome={() => {}}
      />,
    ),
  );
  try {
    const click = async (text) =>
      act(() =>
        [...host.querySelectorAll("button")]
          .find((b) => b.textContent.includes(text))
          .click(),
      );
    await click("共同液面不是简单平均");
    for (const [ratio, height] of [
      [1, 18],
      [2, 14.67],
      [4, 12],
    ]) {
      await click(`右管截面积 ${ratio} 倍`);
      expect(host.querySelector('input[aria-label="左管初始液面"]').value).toBe(
        "28",
      );
      expect(host.querySelector('input[aria-label="右管初始液面"]').value).toBe(
        "8",
      );
      expect(host.querySelector('input[aria-label="演示进度"]').value).toBe(
        "6",
      );
      expect(
        host.querySelector(".communicating-average").textContent,
      ).toContain(`${height} cm`);
      expect(host.textContent).toContain("播放演示");
    }
    const cards = host.querySelectorAll(".communicating-evidence-grid article");
    expect(cards[0].textContent).toContain("流出 10 × 16 ≈ 160 cm³");
    expect(cards[1].textContent).toContain("流入 40 × 4 ≈ 160 cm³");
    await click("回到初始液面重看");
    expect(host.querySelector('input[aria-label="演示进度"]').value).toBe("0");
    expect(cards[0].textContent).toContain("液面未变");
    await click("交换高低，流动反向");
    expect(cards[0].textContent).toContain("流入");
    expect(cards[1].textContent).toContain("流出");
    await click("原本等高，不会流动");
    expect(cards[0].textContent).toContain("净转移");
    expect(cards[1].textContent).toContain("净转移");
  } finally {
    await act(() => root.unmount());
  }
});
