// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import VolcanoTimeline from "../src/VolcanoTimeline.jsx";

it("阶段按钮定位对应时刻，播放与回看更新当前说明", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const host = document.createElement("div"),
    root = createRoot(host),
    onSeek = vi.fn();
  try {
    for (const [time, active] of [
      [0, 0],
      [3, 1],
      [13, 2],
      [20, 3],
      [8, 1],
    ]) {
      await act(() =>
        root.render(<VolcanoTimeline time={time} onSeek={onSeek} />),
      );
      const buttons = host.querySelectorAll("button");
      expect(buttons[active].getAttribute("aria-pressed")).toBe("true");
      expect(host.querySelectorAll('[aria-pressed="true"]').length).toBe(1);
    }
    for (const [i, time] of [1.5, 8, 16.5, 20].entries()) {
      await act(() => host.querySelectorAll("button")[i].click());
      expect(onSeek).toHaveBeenLastCalledWith(time);
    }
    await act(() =>
      root.render(<VolcanoTimeline time={16.5} onSeek={onSeek} />),
    );
    expect(host.textContent).toContain("不表示内部已经完全冷却");
    const onChange = vi.fn();
    await act(() =>
      root.render(
        <VolcanoTimeline
          time={8}
          p={{ showAsh: 0 }}
          onChange={onChange}
          onSeek={onSeek}
        />,
      ),
    );
    const layers = host.querySelector('[aria-label="喷发现象显示"]');
    const toggles = layers.querySelectorAll("button");
    expect(toggles[0].getAttribute("aria-pressed")).toBe("true");
    expect(toggles[1].getAttribute("aria-pressed")).toBe("false");
    onSeek.mockClear();
    await act(() => toggles[1].click());
    expect(onChange).toHaveBeenLastCalledWith("showAsh", 1);
    expect(onSeek).not.toHaveBeenCalled();
  } finally {
    await act(() => root.unmount());
  }
});
