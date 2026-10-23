// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import RunoffStorageStudy from "../src/RunoffStorageStudy.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("retains reference duration, shares the water budget, and clears it explicitly", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  const render = (rain) =>
    act(() =>
      root.render(<RunoffStorageStudy p={{ rain, infil: 40, evap: 10 }} />),
    );
  const click = (text) =>
    act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === text)
        .click(),
    );
  try {
    await render(100);
    await click("历时 0.5 h");
    await click("固定当前历时作对照");
    await click("历时 4 h");
    const readout = () =>
      host.querySelector('[aria-label="同水量历时对照读数"]').textContent;
    expect(readout()).toContain("当前 4 h：峰值 12.27 mm/h");
    expect(readout()).toContain("参照 0.5 h：峰值 39.35 mm/h");
    expect(host.querySelector('[aria-label="参照出流曲线"]')).toBeTruthy();
    await click("定位参照峰值时刻");
    expect(host.querySelector("input").value).toBe("0.5");
    await render(0);
    expect(readout()).toContain("当前 4 h：峰值 0 mm/h");
    expect(readout()).toContain("参照 0.5 h：峰值 0 mm/h");
    expect(readout()).not.toMatch(/NaN|Infinity/);
    await click("清除历时对照");
    expect(host.querySelector('[aria-label="参照出流曲线"]')).toBeNull();
  } finally {
    await act(() => root.unmount());
  }
});
