// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import ThermalComparison from "../src/ThermalComparison.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("temperature shortcuts preserve length and gap, with truthful contact bounds", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    onChange = vi.fn(),
    p = { length: 5, delta: 80, gap: 2 };
  try {
    await act(() =>
      root.render(<ThermalComparison p={p} time={6} onChange={onChange} />),
    );
    expect(host.textContent).toContain("7.20 mm");
    expect(host.textContent).toContain("17.4°C");
    const negative = [...host.querySelectorAll("button")].find(
      (b) => b.textContent === "观察 -30°C",
    );
    await act(() => negative.click());
    expect(onChange).toHaveBeenCalledWith({ length: 5, delta: -30, gap: 2 });
    await act(() =>
      root.render(
        <ThermalComparison
          p={{ length: 1, delta: 80, gap: 12 }}
          time={0}
          onChange={onChange}
        />,
      ),
    );
    expect(host.textContent).toContain("超出本页温差范围");
    expect(
      [...host.querySelectorAll("circle")].every(
        (c) => c.getAttribute("cx") === "247" && c.getAttribute("cy") === "254",
      ),
    ).toBe(true);
  } finally {
    await act(() => root.unmount());
  }
});
it("material focus reveals length-dependent slope without changing experimental inputs", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    onChange = vi.fn();
  try {
    await act(() =>
      root.render(
        <ThermalComparison
          p={{ length: 1, delta: 60, gap: 5 }}
          time={3}
          onChange={onChange}
        />,
      ),
    );
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === "聚焦铝")
        .click(),
    );
    expect(
      host.querySelector('[aria-label="材料斜率说明"]').textContent,
    ).toContain("0.023 mm");
    expect(
      host.querySelector('[data-material="铜"]').getAttribute("opacity"),
    ).toBe("0.22");
    expect(onChange).not.toHaveBeenCalled();
    await act(() =>
      root.render(
        <ThermalComparison
          p={{ length: 5, delta: 60, gap: 5 }}
          time={3}
          onChange={onChange}
        />,
      ),
    );
    expect(
      host.querySelector('[aria-label="材料斜率说明"]').textContent,
    ).toContain("0.115 mm");
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === "全部材料")
        .click(),
    );
    expect(
      [...host.querySelectorAll("[data-material]")].every(
        (g) => g.getAttribute("opacity") === "1",
      ),
    ).toBe(true);
  } finally {
    await act(() => root.unmount());
  }
});
