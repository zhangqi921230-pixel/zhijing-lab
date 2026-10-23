// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import EnergyPathways from "../src/EnergyPathways.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("path selection preserves the energy ledger, stops tracing, and exposes the unquantified boundary", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  try {
    await act(() =>
      root.render(<EnergyPathways p={{ energy: 5000, eff: 15 }} />),
    );
    const click = async (text) =>
      act(() =>
        [...host.querySelectorAll("button")]
          .find((b) => b.textContent === text)
          .click(),
      );
    expect(host.querySelector(".energy-pathway-values").textContent).toContain(
      "4,250 kJ",
    );
    await click("播放方向示踪");
    expect(host.querySelector(".is-tracing")).not.toBeNull();
    await click("碎屑与分解");
    expect(host.querySelector(".is-tracing")).toBeNull();
    expect(
      host.querySelectorAll(".energy-pathway-line.is-active"),
    ).toHaveLength(3);
    expect(host.querySelector(".energy-pathway-note").textContent).toContain(
      "不是返回生产者",
    );
    await click("兔 → 狐");
    expect(host.querySelector(".energy-pathway-values").textContent).toContain(
      "637.5 kJ",
    );
    await click("暂留本级");
    expect(host.querySelector(".energy-pathway-note").textContent).toContain(
      "尚未被下一级摄食",
    );
    await click("播放方向示踪");
    await act(() =>
      root.render(<EnergyPathways p={{ energy: 10000, eff: 15 }} />),
    );
    expect(host.querySelector(".is-tracing")).toBeNull();
    expect(host.querySelector(".energy-pathway-values").textContent).toContain(
      "1,275 kJ",
    );
    expect(host.textContent).toContain("分项数值未设定");
  } finally {
    await act(() => root.unmount());
  }
});
