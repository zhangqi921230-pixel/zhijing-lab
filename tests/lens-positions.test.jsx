// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import LensPositions from "../src/LensPositions.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("classifies all five positions and moves only the object within travel", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    prepare = vi.fn();
  const render = async (u, f = 10) =>
    act(() =>
      root.render(
        <LensPositions p={{ u, f, screen: 25 }} onPrepare={prepare} />,
      ),
    );
  try {
    for (const [u, label] of [
      [8, "正立、放大虚像"],
      [10, "无有限距离像"],
      [12, "倒立、放大实像"],
      [20, "倒立、等大实像"],
      [30, "倒立、缩小实像"],
    ]) {
      await render(u);
      expect(host.querySelector(".lens-position-result").textContent).toBe(
        label,
      );
    }
    await act(() => host.querySelectorAll("button")[0].click());
    expect(prepare).toHaveBeenLastCalledWith({ u: 8 });
    await render(5, 5);
    expect(host.querySelector("button").disabled).toBe(true);
    await render(60, 20);
    expect(host.querySelectorAll("button")[4].disabled).toBe(false);
  } finally {
    await act(() => root.unmount());
  }
});
