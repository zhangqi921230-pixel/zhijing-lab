// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import { offspringQuartet } from "../src/offspringQuartet.mjs";
import GeneticsStudio from "../src/GeneticsStudio.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("enumerates mutually exclusive ordered outcomes and binomial probabilities including endpoints", () => {
  for (const p of [0, 0.25, 0.5, 1]) {
    const q = offspringQuartet(p);
    expect(new Set(q.sequences.map((s) => s.recessive.join())).size).toBe(16);
    expect(q.distribution.map((s) => s.arrangements)).toEqual([1, 4, 6, 4, 1]);
    expect(q.distribution.reduce((a, s) => a + s.probability, 0)).toBeCloseTo(
      1,
    );
    expect(
      q.distribution.reduce((a, s) => a + s.count * s.probability, 0),
    ).toBeCloseTo(4 * p);
  }
  expect(offspringQuartet(0.25).distribution[1].probability).toBeCloseTo(
    27 / 64,
  );
  expect(offspringQuartet(1).distribution[4].probability).toBe(1);
  expect(offspringQuartet(0).distribution[0].probability).toBe(1);
});
it("chapter eight reveals chosen order, pauses, resets for new parents and clears timers", async () => {
  vi.useFakeTimers();
  Object.defineProperty(document, "hidden", {
    configurable: true,
    value: false,
  });
  const host = document.createElement("div"),
    root = createRoot(host);
  const button = (t) =>
    [...host.querySelectorAll("button")].find((b) => b.textContent === t);
  try {
    await act(() =>
      root.render(
        <GeneticsStudio p={{ parent1: 1, parent2: 1 }} chapter={7} />,
      ),
    );
    expect(host.textContent).toContain("42.19%");
    expect(
      host.querySelectorAll('[aria-label="选择性状排列"] button'),
    ).toHaveLength(4);
    await act(() => button("逐个揭示所选排列").click());
    expect(host.querySelectorAll(".unrevealed")).toHaveLength(4);
    await act(() => vi.advanceTimersByTime(650));
    expect(host.querySelectorAll(".unrevealed")).toHaveLength(3);
    await act(() => button("暂停揭示").click());
    await act(() => vi.advanceTimersByTime(3000));
    expect(host.querySelectorAll(".unrevealed")).toHaveLength(3);
    await act(() => button("揭示下一个").click());
    expect(host.querySelectorAll(".unrevealed")).toHaveLength(2);
    await act(() =>
      root.render(
        <GeneticsStudio p={{ parent1: 2, parent2: 2 }} chapter={7} />,
      ),
    );
    expect(host.querySelectorAll(".unrevealed")).toHaveLength(0);
    expect(host.textContent).toContain("该排列不可能出现");
    await act(() => button("逐个揭示所选排列").click());
  } finally {
    await act(() => root.unmount());
    expect(vi.getTimerCount()).toBe(0);
    vi.useRealTimers();
  }
});
