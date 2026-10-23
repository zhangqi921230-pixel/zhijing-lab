// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import BeatObservation, {
  beatObservationTimes,
} from "../src/BeatObservation.jsx";
import { beatState, signalReadouts } from "../src/signalLessons.mjs";
import MotionLab from "../src/MotionLab.jsx";
import { motionTopics } from "../src/motionLessons.mjs";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("same-phase zero displacement differs from cancellation and observation times follow the actual frequencies", () => {
  for (const difference of [0.1, 0.2, 0.5, 1]) {
    const p = { frequency: 3, difference, amplitude: 1 },
      points = beatObservationTimes(p);
    expect(beatState(p, points[0].time).A).toBeCloseTo(1);
    expect(beatState(p, points[1].time).envelope).toBeCloseTo(0);
    expect(beatState(p, points[2].time).envelope).toBeCloseTo(2);
    expect(points[2].available).toBe(1 / difference <= 6);
  }
  const q = beatState({ frequency: 3, difference: 0.5, amplitude: 1 }, 2);
  expect(q.total).toBeCloseTo(0);
  expect(q.envelope).toBe(2);
  expect(
    signalReadouts(
      "beat-frequency",
      { frequency: 3, difference: 0.5, amplitude: 1 },
      2,
    )[2][1],
  ).toBe("0.000");
  for (const p of [
    { frequency: 3, difference: 0, amplitude: 1 },
    { frequency: 3, difference: 1, amplitude: 0 },
  ])
    expect(
      beatObservationTimes(p)
        .slice(1)
        .every((x) => !x.available && x.time === null),
    ).toBe(true);
});
it("unreachable time is disabled, not silently clamped, while a reachable minimum remains usable", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    seek = vi.fn();
  try {
    await act(() =>
      root.render(
        <BeatObservation
          p={{ frequency: 3, difference: 0.1, amplitude: 1 }}
          time={0}
          onSeek={seek}
        />,
      ),
    );
    const buttons = host.querySelectorAll("button");
    expect(buttons[1].disabled).toBe(false);
    expect(buttons[2].disabled).toBe(true);
    expect(host.textContent).toContain("超出当前6秒");
    await act(() => buttons[1].click());
    expect(seek).toHaveBeenCalledWith(5);
  } finally {
    await act(() => root.unmount());
  }
});
it("integrated sixth chapter freezes the exact observation time without altering parameters", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    lesson = motionTopics.find((x) => x.id === "beat-frequency");
  try {
    await act(() =>
      root.render(
        <MotionLab lesson={lesson} open={() => {}} goHome={() => {}} />,
      ),
    );
    await act(() =>
      host.querySelectorAll('[aria-label="学习子主题"] button')[5].click(),
    );
    expect(host.querySelector("h1").textContent).toBe("加强时为什么恰好过零");
    expect(host.textContent).toContain("此刻包络半高 2.000");
    const first = [...host.querySelectorAll("button")].find((x) =>
      x.textContent.startsWith("A第一次到正峰"),
    );
    await act(() => first.click());
    expect(
      Number(host.querySelector('[aria-label="演示进度"]').value),
    ).toBeCloseTo(1 / 12, 2);
    expect(host.querySelector('[aria-label="振动 A 频率"]').value).toBe("3");
    expect(host.querySelector('[aria-label="B 与 A 的频率差"]').value).toBe(
      "0.5",
    );
    expect(host.textContent).toContain("播放演示");
  } finally {
    await act(() => root.unmount());
  }
});
