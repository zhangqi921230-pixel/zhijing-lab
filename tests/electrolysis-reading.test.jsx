// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import ElectrolysisReading from "../src/ElectrolysisReading.jsx";
import { electrolysisState } from "../src/chemistryTopics.mjs";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("equal-scale gas columns show 2:1 height and reveal actual model volumes", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    onSeek = vi.fn();
  try {
    for (const current of [0.2, 1, 2])
      for (const time of [0, 300, 600]) {
        await act(() =>
          root.render(
            <ElectrolysisReading p={{ current }} time={time} onSeek={onSeek} />,
          ),
        );
        const y = [
          ...host.querySelectorAll('[data-testid="gas-reading-interface"]'),
        ].map((e) => +e.getAttribute("y1"));
        expect(y[0] - 80).toBeCloseTo(2 * (y[1] - 80));
        expect(y[0]).toBeLessThan(400);
      }
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === "显示精确读数")
        .click(),
    );
    expect(host.textContent).toContain(
      `${electrolysisState(2, 600).hydrogen.toFixed(2)} mL`,
    );
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === "观察 0 秒集气")
        .click(),
    );
    expect(onSeek).toHaveBeenCalledWith(0);
    await act(() =>
      root.render(
        <ElectrolysisReading p={{ current: 2 }} time={0} onSeek={onSeek} />,
      ),
    );
    expect(host.textContent).toContain("不能计算0∶0");
  } finally {
    await act(() => root.unmount());
  }
});
