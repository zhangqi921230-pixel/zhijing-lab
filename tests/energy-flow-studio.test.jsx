// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import EnergyFlowStudio from "../src/EnergyFlowStudio.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("plays sequential levels, stops at the end and exposes conserved accounts", async () => {
  vi.useFakeTimers();
  const host = document.createElement("div"),
    root = createRoot(host);
  try {
    await act(() =>
      root.render(
        <EnergyFlowStudio p={{ energy: 5000, eff: 15 }} chapter={0} />,
      ),
    );
    const button = (text) =>
      [...host.querySelectorAll("button")].find((b) => b.textContent === text);
    await act(() => button("逐级演示").click());
    await act(() => vi.advanceTimersByTime(1600));
    expect(
      host.querySelector(".energy-level[aria-pressed=true]").textContent,
    ).toContain("兔");
    await act(() => vi.advanceTimersByTime(1600));
    expect(
      host.querySelector(".energy-level[aria-pressed=true]").textContent,
    ).toContain("狐");
    expect(button("逐级演示")).toBeTruthy();
    await act(() => button("守恒账本").click());
    expect(host.querySelector(".energy-ledger").textContent).toContain(
      "4,250 + 637.5 + 112.5 = 5,000 kJ",
    );
    await act(() => button("回到生产者").click());
    expect(
      host.querySelector(".energy-level[aria-pressed=true]").textContent,
    ).toContain("草");
  } finally {
    await act(() => root.unmount());
    vi.useRealTimers();
  }
});
