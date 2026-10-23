// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import DistillationStudy, { boilingTime } from "../src/DistillationStudy.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("distinguishes the boiling threshold from evaporated water and keeps core actions outside disclosure", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  try {
    await act(() =>
      root.render(
        <DistillationStudy
          p={{ power: 800, cooling: true }}
          time={boilingTime(800)}
          onSeek={() => {}}
        />,
      ),
    );
    const process = host.querySelector('[aria-label="当前蒸馏过程"]');
    expect(process.textContent).toContain("100.0 °C");
    expect(process.textContent).toContain("尚无累计汽化量");
    const details = host.querySelector("details");
    expect(details.open).toBe(false);
    expect(details.textContent).toContain("温度计感温泡");
    expect(details.querySelector("button")).toBeNull();
    expect(
      host
        .querySelector('[aria-label="定位蒸馏阶段"]')
        .compareDocumentPosition(
          host.querySelector('[aria-label="温度曲线，可横向滚动"]'),
        ) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    await act(() =>
      root.render(
        <DistillationStudy
          p={{ power: 800, cooling: false }}
          time={240}
          onSeek={() => {}}
        />,
      ),
    );
    expect(process.textContent).toContain("收集 0.00 g");
    expect(process.textContent).toContain("蒸汽计入未收集量");
    expect(process.textContent).toContain("水离开原瓶");
  } finally {
    await act(() => root.unmount());
  }
});
