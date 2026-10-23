// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import GeneticsStudio from "../src/GeneticsStudio.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("samples, pauses and clears without changing theoretical ratios", async () => {
  vi.useFakeTimers();
  const host = document.createElement("div"),
    root = createRoot(host);
  try {
    await act(() =>
      root.render(
        <GeneticsStudio p={{ parent1: 1, parent2: 1 }} chapter={3} />,
      ),
    );
    const button = (text) =>
      [...host.querySelectorAll("button")].find((b) => b.textContent === text);
    await act(() => button("抽样 20 个").click());
    expect(
      host.querySelector(".genetics-population-title").textContent,
    ).toContain("20 / 1000");
    await act(() => button("连续抽样至 1000").click());
    await act(() => vi.advanceTimersByTime(240));
    expect(
      host.querySelector(".genetics-population-title").textContent,
    ).toContain("40 / 1000");
    await act(() => button("暂停抽样").click());
    await act(() => vi.advanceTimersByTime(600));
    expect(
      host.querySelector(".genetics-population-title").textContent,
    ).toContain("40 / 1000");
    await act(() => button("清空本次抽样").click());
    expect(
      host.querySelector(".genetics-population-title").textContent,
    ).toContain("0 / 1000");
    expect(host.querySelector(".genetics-distribution").textContent).toContain(
      "理论 50%",
    );
  } finally {
    await act(() => root.unmount());
    vi.useRealTimers();
  }
});
