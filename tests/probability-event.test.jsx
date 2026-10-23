// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import ExplorationLab from "../src/ExplorationLab.jsx";
import { explorations } from "../src/explorations.mjs";
import ProbabilityEvent, {
  eventProbability,
} from "../src/ProbabilityEvent.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("distinguishes exactly one from at least one and handles certainty", () => {
  expect(eventProbability(6, 0.5, 1, "exact").theory).toBe(6 / 64);
  expect(eventProbability(6, 0.5, 1, "atleast").theory).toBe(63 / 64);
  for (const n of [1, 6, 12])
    for (const p of [0, 0.2, 0.5, 0.8, 1]) {
      expect(eventProbability(n, p, 0, "atleast").theory).toBeCloseTo(1, 12);
      expect(
        eventProbability(n, p, 0, "atmost").theory +
          eventProbability(n, p, 1, "atleast").theory,
      ).toBeCloseTo(1, 12);
    }
});
it("recounts existing groups without replacing samples and pauses on selection", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    pause = vi.fn(),
    bins = [2, 3, 5];
  try {
    await act(() =>
      root.render(
        <ProbabilityEvent
          p={{ n: 2, p: 0.5 }}
          count={10}
          sample={{ bins }}
          onPause={pause}
        />,
      ),
    );
    expect(host.textContent).toContain("8 / 10 = 80.00%");
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === "恰好")
        .click(),
    );
    expect(host.textContent).toContain("3 / 10 = 30.00%");
    expect(host.textContent).toContain("50.00%");
    expect(bins).toEqual([2, 3, 5]);
    expect(pause).toHaveBeenCalledOnce();
    await act(() =>
      root.render(
        <ProbabilityEvent
          key="reset"
          p={{ n: 1, p: 0 }}
          count={0}
          sample={{ bins: [0, 0] }}
          onPause={pause}
        />,
      ),
    );
    expect(host.textContent).toContain("尚无样本");
    expect(host.textContent).not.toContain("NaN");
  } finally {
    await act(() => root.unmount());
  }
});

it("switching chapters replaces each probability panel without duplicate or stale content", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
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
    for (const name of ["04样本与理论", "02多次独立试验", "01一枚硬币的频率"]) {
      await act(() =>
        [...host.querySelectorAll("button")]
          .find((b) => b.textContent.replace(/\s/g, "") === name)
          .click(),
      );
      expect(host.querySelectorAll(".probability-comparison")).toHaveLength(1);
      expect(host.querySelectorAll(".probability-event")).toHaveLength(1);
    }
    expect(host.querySelector(".probability-event").textContent).toContain(
      "每组独立抛掷 1",
    );
  } finally {
    await act(() => root.unmount());
  }
});
