// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import CellEnergyCompare from "../src/CellEnergyCompare.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("comparison selects actual organelle ids and reveals the respiration explanation", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    select = vi.fn();
  const button = (t) =>
    [...host.querySelectorAll("button")].find((b) => b.textContent === t);
  try {
    await act(() =>
      root.render(<CellEnergyCompare part={4} onSelect={select} />),
    );
    expect(button("对照线粒体近景").getAttribute("aria-pressed")).toBe("true");
    await act(() => button("对照叶绿体近景").click());
    expect(select).toHaveBeenLastCalledWith(3);
    await act(() => button("夜间没有光，植物还进行呼吸吗？").click());
    expect(host.querySelector("[role=status]").textContent).toContain(
      "白天和夜间都进行呼吸",
    );
    await act(() => button("收起解释").click());
    expect(host.querySelector("[role=status]")).toBeNull();
  } finally {
    await act(() => root.unmount());
  }
});
