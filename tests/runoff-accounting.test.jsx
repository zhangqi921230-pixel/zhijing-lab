// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import RunoffStorageStudy from "../src/RunoffStorageStudy.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("event water partitions remain proportional and a reset version restores local defaults", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    p = { rain: 100, infil: 40, evap: 10 };
  const draw = (key) => root.render(<RunoffStorageStudy key={key} p={p} />);
  try {
    await act(() => draw(0));
    const widths = () =>
      [...host.querySelectorAll(".runoff-water-strip span")].map((n) =>
        parseFloat(n.style.width),
      );
    expect(widths()).toEqual([100, 0, 0]);
    const click = async (text) =>
      act(() =>
        [...host.querySelectorAll("button")]
          .find((b) => b.textContent === text)
          .click(),
      );
    await click("历时 4 h");
    let w = widths();
    expect(w[0]).toBe(0);
    expect(w.reduce((a, b) => a + b, 0)).toBeCloseTo(100, 9);
    expect(w[1]).toBeGreaterThan(0);
    expect(host.querySelector(".runoff-stage-label").textContent).toContain(
      "已经停止",
    );
    expect(host.querySelector("dl").textContent).toContain("当前输入率0 mm/h");
    await act(() => draw(1));
    expect(host.querySelector("input").value).toBe("0");
    expect(
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === "历时 2 h")
        .getAttribute("aria-pressed"),
    ).toBe("true");
    expect(widths()).toEqual([100, 0, 0]);
    await act(() =>
      root.render(<RunoffStorageStudy key={2} p={{ ...p, rain: 0 }} />),
    );
    expect(widths()).toEqual([0, 0, 0]);
    expect(host.textContent).not.toMatch(/NaN|Infinity/);
  } finally {
    await act(() => root.unmount());
  }
});
