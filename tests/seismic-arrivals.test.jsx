// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import { AdvancedOverlay } from "../src/AdvancedOverlay.jsx";
import { seismic } from "../src/advancedModels.mjs";
it("波形止于当前游标，到站按钮使用模型精确时刻", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const host = document.createElement("div"),
    root = createRoot(host),
    onSeek = vi.fn();
  const p = { depth: 15, distance: 40 },
    q = seismic(p, 0),
    t = (q.tp + q.ts) / 2;
  try {
    await act(() =>
      root.render(
        <AdvancedOverlay id="earthquake" p={p} t={t} onSeek={onSeek} />,
      ),
    );
    const path = host.querySelector('path[stroke="#74cbd0"]');
    const last = path.getAttribute("d").split("L").at(-1).split(",");
    expect(Number(last[0])).toBeCloseTo(26 + (t / 25) * 230, 2);
    expect(Number(last[0])).toBeLessThan(256);
    expect(host.textContent).toContain("P 波已到站");
    const buttons = host.querySelectorAll("button");
    for (const [i, time] of [q.tp, t, q.ts].entries()) {
      await act(() => buttons[i].click());
      expect(onSeek).toHaveBeenLastCalledWith(time);
    }
  } finally {
    await act(() => root.unmount());
  }
});
