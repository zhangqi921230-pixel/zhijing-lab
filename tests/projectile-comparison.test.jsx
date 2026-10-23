// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { expect, it, vi } from "vitest";
import ProjectileComparison from "../src/ProjectileComparison.jsx";
import {
  projectileApexProgress,
  projectileState,
} from "../src/visualModels.mjs";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("apex seeking gives zero vertical velocity including elevated launches and zero duration", () => {
  for (const angle of [0, 30, 45, 90])
    for (const height of [0, 10, 15]) {
      const p = { angle, height, speed: 18, gravity: 9.8 },
        q = projectileState(p, projectileApexProgress(p));
      expect(q.vy).toBeCloseTo(0, 10);
      expect(q.y).toBeCloseTo(q.apex, 10);
    }
});
it("shows both complete flights and switches explanation when equal-range assumptions change", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    seek = vi.fn();
  const p = { angle: 30, height: 0, speed: 18, gravity: 9.8 };
  try {
    await act(() => root.render(<ProjectileComparison p={p} onSeek={seek} />));
    expect(host.textContent).toContain("射程相等");
    const values = [...host.querySelectorAll("tbody tr:first-child td")].map(
      (x) => x.textContent,
    );
    expect(values[0]).toBe(values[1]);
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === "定位当前最高点")
        .click(),
    );
    expect(seek).toHaveBeenCalledWith(3);
    await act(() =>
      root.render(
        <ProjectileComparison p={{ ...p, height: 10 }} onSeek={seek} />,
      ),
    );
    expect(host.textContent).toContain("前提不成立");
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === "定位当前最高点")
        .click(),
    );
    expect(seek.mock.lastCall[0]).toBeLessThan(3);
    await act(() =>
      root.render(
        <ProjectileComparison p={{ ...p, angle: 45 }} onSeek={seek} />,
      ),
    );
    expect(host.textContent).toContain("完全重合");
  } finally {
    await act(() => root.unmount());
  }
});
