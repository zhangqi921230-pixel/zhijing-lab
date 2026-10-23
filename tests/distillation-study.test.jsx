// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import DistillationStudy, { boilingTime } from "../src/DistillationStudy.jsx";
import { distillationState } from "../src/chemistryTopics.mjs";
it("separates warming and latent heat while conserving water for both collection modes", () => {
  for (const power of [200, 400, 600, 800]) {
    const t = boilingTime(power);
    expect(distillationState(power, t, true).temperature).toBeCloseTo(100, 10);
    expect(distillationState(power, t, true).evaporated).toBeCloseTo(0, 10);
    for (const time of [0, 100, 240])
      for (const cooling of [true, false]) {
        const q = distillationState(power, time, cooling);
        expect(q.remaining + q.collected + q.lost).toBeCloseTo(200, 10);
        if (time < t) expect(q.evaporated).toBe(0);
      }
  }
  expect(boilingTime(200)).toBeGreaterThan(240);
});
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("disables unreachable boiling seek but permits valid phase navigation", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    seek = vi.fn();
  const button = (name) =>
    [...host.querySelectorAll("button")].find((b) => b.textContent === name);
  try {
    await act(() =>
      root.render(
        <DistillationStudy
          p={{ power: 200, cooling: true }}
          time={0}
          onSeek={seek}
        />,
      ),
    );
    expect(button("刚到沸点").disabled).toBe(true);
    expect(button("汽化10克水").disabled).toBe(true);
    await act(() =>
      root.render(
        <DistillationStudy
          p={{ power: 800, cooling: true }}
          time={0}
          onSeek={seek}
        />,
      ),
    );
    await act(() => button("刚到沸点").click());
    expect(seek).toHaveBeenLastCalledWith(83.6);
    await act(() => button("汽化10克水").click());
    expect(seek).toHaveBeenLastCalledWith(89450 / 800);
  } finally {
    await act(() => root.unmount());
  }
});
