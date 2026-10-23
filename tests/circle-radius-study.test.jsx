// @vitest-environment jsdom
import React, { act, useState } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import CircleRadiusStudy from "../src/CircleRadiusStudy.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("animates within lesson limits, reports squared area, and cancels for manual changes", async () => {
  vi.useFakeTimers();
  Object.defineProperty(document, "hidden", {
    configurable: true,
    value: false,
  });
  const host = document.createElement("div"),
    root = createRoot(host);
  function Harness() {
    const [radius, setRadius] = useState(2);
    return (
      <>
        <button onClick={() => setRadius(1)}>手调</button>
        <CircleRadiusStudy p={{ radius }} onRadius={setRadius} />
      </>
    );
  }
  const button = (t) =>
    [...host.querySelectorAll("button")].find((b) => b.textContent === t);
  try {
    await act(() => root.render(<Harness />));
    await act(() => button("演示 2 → 4 cm 半径缩放").click());
    for (let i = 0; i < 4; i++) await act(() => vi.advanceTimersByTime(700));
    expect(host.querySelector(".radius-scale-results").textContent).toContain(
      "面积比 B/A4 倍",
    );
    expect(button("暂停半径缩放").disabled).toBe(true);
    await act(() => button("保留当前半径为参照").click());
    expect(button("半径变为参照的 2 倍").disabled).toBe(true);
    expect(host.textContent).toContain("4 cm 上限");
    await act(() => button("演示 2 → 4 cm 半径缩放").click());
    await act(() => vi.advanceTimersByTime(700));
    await act(() => button("参照设为 2 cm").click());
    await act(() => vi.advanceTimersByTime(5000));
    expect(host.querySelector("svg").getAttribute("aria-label")).toContain(
      "当前半径2.5厘米",
    );
    expect(button("暂停半径缩放").disabled).toBe(true);
    await act(() => button("手调").click());
    await act(() => vi.advanceTimersByTime(5000));
    expect(host.querySelector("svg").getAttribute("aria-label")).toContain(
      "当前半径1厘米",
    );
  } finally {
    await act(() => root.unmount());
    expect(vi.getTimerCount()).toBe(0);
    vi.useRealTimers();
  }
});
