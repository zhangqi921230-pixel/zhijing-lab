// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import ProbabilityComparison from "../src/ProbabilityComparison.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("reads original first-group frequencies, keeps the saved round, and labels missing samples", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    pause = vi.fn(),
    p = { n: 10, p: 0.5 };
  const render = (history, frequency) =>
    act(() =>
      root.render(
        <ProbabilityComparison
          p={p}
          count={history.length}
          sample={{ history, frequency }}
          onPause={pause}
        />,
      ),
    );
  const text = () =>
    host.querySelector('[aria-label="同组次频率读数"]').textContent;
  try {
    await render([0.2, 0.3, 0.4], 0.4);
    expect(text()).toContain("当前轮 20.00%");
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === "保留为参考轮")
        .click(),
    );
    expect(pause).toHaveBeenCalled();
    await render([0.8, 0.6], 0.6);
    expect(text()).toContain("当前轮 80.00%");
    expect(text()).toContain("参考轮 20.00%");
    await render([], 0);
    expect(text()).toContain("当前轮 尚无该组样本");
    expect(text()).toContain("参考轮 20.00%");
  } finally {
    await act(() => root.unmount());
  }
});
