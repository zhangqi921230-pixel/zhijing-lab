// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import ProbabilityComparison, {
  frequencyPath,
} from "../src/ProbabilityComparison.jsx";
import ExplorationLab from "../src/ExplorationLab.jsx";
import { explorations } from "../src/explorations.mjs";
import { sampleCoins } from "../src/explorationModels.mjs";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("retains an immutable reference when new samples replace the current round", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    pause = vi.fn();
  const p = { n: 4, p: 0.5 };
  const render = (count) =>
    act(() =>
      root.render(
        <ProbabilityComparison
          p={p}
          count={count}
          sample={sampleCoins(4, 0.5, count)}
          onPause={pause}
        />,
      ),
    );
  try {
    await render(0);
    expect(host.querySelector("button").disabled).toBe(true);
    await render(100);
    await act(() => host.querySelector("button").click());
    expect(pause).toHaveBeenCalledOnce();
    await render(0);
    expect(host.textContent).toContain("100 组");
    expect(host.textContent).toContain("两轮样本量不同");
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === "移除参考轮")
        .click(),
    );
    expect(host.textContent).toContain("尚未保留");
  } finally {
    await act(() => root.unmount());
  }
});
it("bounds chart complexity at 10000 groups and preserves the final point", () => {
  const history = sampleCoins(12, 0.5, 10000).history;
  const path = frequencyPath(history, 10000);
  expect(path.split("L").length).toBeLessThanOrEqual(401);
  expect(path.endsWith(`720 ${245 - history.at(-1) * 190}`)).toBe(true);
});
it("progressive trials stop on manual batches, condition changes and unmount", async () => {
  vi.useFakeTimers();
  Object.defineProperty(document, "hidden", {
    configurable: true,
    value: false,
  });
  const host = document.createElement("div"),
    root = createRoot(host);
  const button = (text) =>
    [...host.querySelectorAll("button")].find((b) => b.textContent === text);
  try {
    await act(() =>
      root.render(
        <ExplorationLab
          lesson={explorations.find((x) => x.id === "probability")}
          open={() => {}}
          goHome={() => {}}
        />,
      ),
    );
    await act(() => button("逐组演示 100 组").click());
    await act(() => vi.advanceTimersByTime(1050));
    expect(host.textContent).toContain("第 3 组结果");
    await act(() => button("做 10 组").click());
    await act(() => vi.advanceTimersByTime(1050));
    expect(host.textContent).toContain("第 13 组结果");
    await act(() => button("逐组演示 100 组").click());
    await act(() =>
      host.querySelectorAll('[aria-label="学习子主题"] button')[4].click(),
    );
    await act(() => vi.advanceTimersByTime(1050));
    expect(host.textContent).toContain("还没有样本");
    await act(() => button("逐组演示 100 组").click());
    await act(() => root.unmount());
    expect(vi.getTimerCount()).toBe(0);
  } finally {
    vi.useRealTimers();
  }
});
