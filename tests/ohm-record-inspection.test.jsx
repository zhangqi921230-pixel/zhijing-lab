// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import { OhmDataPlot } from "../src/OhmDataPlot.jsx";

it("inspects saved values by keyboard and separates zero-current and duplicate records", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const row = (number, u, current) => ({
    number,
    parameters: { u, r: 20, closed: 1 },
    values: [{ label: "电流", value: current }],
  });
  const host = document.createElement("div"),
    root = createRoot(host);
  try {
    await act(() =>
      root.render(
        <OhmDataPlot
          records={[row(1, 3, 0.149), row(2, 0, 0), row(3, 3, 0.15)]}
        />,
      ),
    );
    const report = () =>
      host.querySelector(".ohm-record-inspection").textContent;
    expect(report()).toContain("U/I = 20 Ω");
    await act(() =>
      host
        .querySelector('circle[aria-label^="检查第 1 组"]')
        .dispatchEvent(
          new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
        ),
    );
    expect(report()).toContain("U/I = 20.134 Ω");
    const select = host.querySelector(".ohm-record-inspection select");
    expect(select.options).toHaveLength(3);
    await act(() => {
      select.value = "2";
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });
    expect(report()).toContain("电流为零，不能用 U/I 计算电阻");
    expect(
      host
        .querySelector('circle[aria-pressed="true"]')
        .getAttribute("aria-label"),
    ).toContain("第 2 组");
  } finally {
    await act(() => root.unmount());
  }
});
