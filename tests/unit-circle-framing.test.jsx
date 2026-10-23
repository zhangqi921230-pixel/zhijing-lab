// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { expect, it, vi } from "vitest";
import FunctionStudio from "../src/FunctionStudio.jsx";

it("关键角自动扩大视野以显示变换后的点，返回较近角不缩小视野", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const host = document.createElement("div");
  const root = createRoot(host);
  const change = vi.fn();
  const p = { type: 1, a: 3, b: 3, k: 1, shift: 0, probe: 0, analysis: 0 };
  try {
    await act(() =>
      root.render(<FunctionStudio p={p} onChange={change} unitCircle />),
    );
    const select = host.querySelector(".linear-tools select");
    expect(select.value).toBe("3");
    const angle = [
      ...host.querySelectorAll(".unit-circle-presets button"),
    ].find((b) => b.textContent === "π/2");
    await act(() => angle.click());
    expect(change).toHaveBeenLastCalledWith("probe", Math.PI / 2);
    expect(Number(select.value)).toBeGreaterThan(6);
    const expanded = select.value;
    const zero = [...host.querySelectorAll(".unit-circle-presets button")].find(
      (b) => b.textContent === "0",
    );
    await act(() => zero.click());
    expect(change).toHaveBeenLastCalledWith("probe", 0);
    expect(select.value).toBe(expanded);
  } finally {
    await act(() => root.unmount());
  }
});
