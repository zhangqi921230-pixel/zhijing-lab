// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import { shadowSimilarityGeometry } from "../src/ShadowSimilarity.jsx";
import MotionLab from "../src/MotionLab.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("uses uniform scaling and the two triangles coincide exactly at the endpoint", () => {
  for (const angle of [25, 45, 65])
    for (const pole of [1, 2, 3])
      for (const height of [4, 8, 10]) {
        const p = { angle, pole, height };
        for (const t of [0, 1.5, 3, 6]) {
          const q = shadowSimilarityGeometry(p, t, 2);
          expect(q.small.height / q.small.length).toBeCloseTo(
            Math.tan((angle * Math.PI) / 180),
          );
          expect(q.factor).toBeCloseTo(1 + ((height / pole - 1) * t) / 6);
        }
        const end = shadowSimilarityGeometry(p, 6, 2);
        expect(end.small.x).toBe(end.large.x);
        expect(end.small.height).toBeCloseTo(end.large.height);
        expect(end.small.length).toBeCloseTo(end.large.length);
      }
});
it("steps drive the main diagram, playback enters scaling, and chapter switches stop it", async () => {
  vi.stubGlobal(
    "requestAnimationFrame",
    vi.fn(() => 42),
  );
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
  const host = document.createElement("div"),
    root = createRoot(host);
  const click = async (text) =>
    act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === text)
        .click(),
    );
  try {
    await act(() =>
      root.render(
        <MotionLab
          lesson={{ id: "shadow-height" }}
          open={() => {}}
          goHome={() => {}}
        />,
      ),
    );
    await act(() =>
      host.querySelectorAll('[aria-label="学习子主题"] button')[1].click(),
    );
    expect(host.textContent).toContain("两个角相等");
    await click("2 · 配对对应边");
    expect(host.textContent).toContain("高度对应高度");
    await click("播放演示");
    expect(host.textContent).toContain("把小三角形等比例放大");
    expect(host.textContent).toContain("暂停演示");
    await click("6 秒");
    expect(host.textContent).toContain("轮廓已重合");
    await click("4 · 代入测高");
    expect(host.textContent).toContain("H = h × L / l = 8.00 m");
    await act(() =>
      host.querySelectorAll('[aria-label="学习子主题"] button')[2].click(),
    );
    expect(host.querySelector('[aria-label="相似测高推导步骤"]')).toBeNull();
    expect(host.textContent).toContain("播放演示");
  } finally {
    await act(() => root.unmount());
    vi.unstubAllGlobals();
  }
});
