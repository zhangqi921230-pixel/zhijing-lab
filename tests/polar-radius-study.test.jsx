// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import PolarRadiusStudy from "../src/PolarRadiusStudy.jsx";
import { polarPoint } from "../src/visualModels.mjs";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("each rose parameter seeks exact positive, zero and negative radii", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    seek = vi.fn();
  try {
    for (const petals of [1, 2, 3, 4, 5, 6]) {
      const p = { shape: 2, radius: 2, petals };
      await act(() =>
        root.render(<PolarRadiusStudy p={p} time={0} onSeek={seek} />),
      );
      const buttons = host.querySelectorAll("button");
      for (let i = 0; i < 3; i++) {
        await act(() => buttons[i].click());
        expect(
          polarPoint(p, (seek.mock.lastCall[0] * Math.PI) / 3).r,
        ).toBeCloseTo([2, 0, -2][i], 10);
      }
    }
  } finally {
    await act(() => root.unmount());
  }
});
it("current curve and signed-radius explanation follow curve changes", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    p = { shape: 2, radius: 2, petals: 3 };
  try {
    await act(() =>
      root.render(<PolarRadiusStudy p={p} time={1} onSeek={() => {}} />),
    );
    expect(host.textContent).toContain("负极径");
    expect(host.textContent).toContain("240.0°");
    await act(() =>
      root.render(
        <PolarRadiusStudy p={{ ...p, shape: 1 }} time={3} onSeek={() => {}} />,
      ),
    );
    expect(host.textContent).toContain("心形线");
    expect(host.textContent).toContain("没有唯一方向");
    expect(host.textContent).not.toContain("负极径峰值");
  } finally {
    await act(() => root.unmount());
  }
});
