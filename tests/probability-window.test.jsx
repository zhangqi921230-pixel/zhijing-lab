// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import ProbabilityComparison from "../src/ProbabilityComparison.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("early view retains complete rounds and uses visible history endpoints", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    pause = vi.fn(),
    history = Array.from({ length: 100 }, (_, i) => (i < 50 ? 0.2 : 0.8));
  try {
    await act(() =>
      root.render(
        <ProbabilityComparison
          p={{ n: 1, p: 0.5 }}
          count={100}
          sample={{ frequency: 0.8, history }}
          onPause={pause}
        />,
      ),
    );
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === "保留为参考轮")
        .click(),
    );
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === "前 50 组")
        .click(),
    );
    expect(host.querySelector("input").max).toBe("50");
    for (const name of ["current", "reference"]) {
      const circle = host.querySelector(
        `[data-testid="${name}-frequency-end"]`,
      );
      expect(circle.getAttribute("cx")).toBe("720");
      expect(circle.getAttribute("cy")).toBe("207");
    }
    expect(host.textContent).toContain("100 组 · 80.00%");
    expect(history).toHaveLength(100);
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === "全部组次")
        .click(),
    );
    expect(host.querySelector("input").max).toBe("100");
    expect(
      host
        .querySelector('[data-testid="current-frequency-end"]')
        .getAttribute("cy"),
    ).toBe("93");
    expect(pause).toHaveBeenCalledTimes(3);
  } finally {
    await act(() => root.unmount());
  }
});
