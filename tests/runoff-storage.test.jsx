// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import { runoffStorage } from "../src/runoffStorage.mjs";
import RunoffStorageStudy from "../src/RunoffStorageStudy.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("reservoir conserves input, has continuous outflow and correct rate derivative", () => {
  for (const total of [0, 25, 200])
    for (const d of [0.5, 1, 2, 4]) {
      for (const t of [0, 0.2, 1.3, 5, 12]) {
        const q = runoffStorage(total, d, t);
        expect(q.input).toBeCloseTo(q.released + q.storage, 10);
        expect(q.storage).toBeGreaterThanOrEqual(0);
        expect(q.released).toBeGreaterThanOrEqual(0);
        if (t > 0 && Math.abs(t - d) > 0.01) {
          const derivative =
            (runoffStorage(total, d, t + 1e-5).released -
              runoffStorage(total, d, t - 1e-5).released) /
            2e-5;
          expect(derivative).toBeCloseTo(q.outRate, 5);
        }
      }
      expect(runoffStorage(total, d, d - 1e-7).outRate).toBeCloseTo(
        runoffStorage(total, d, d + 1e-7).outRate,
        4,
      );
      expect(runoffStorage(total, d, 40).released).toBeCloseTo(total, 9);
    }
  expect(runoffStorage(50, 0.5, 0.5).peak).toBeGreaterThan(
    runoffStorage(50, 4, 4).peak,
  );
});
it("duration comparisons seek to input end, preserve budget, and new rainfall resets time", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  try {
    await act(() =>
      root.render(
        <RunoffStorageStudy p={{ rain: 100, infil: 40, evap: 10 }} />,
      ),
    );
    const click = async (text) =>
      act(() =>
        [...host.querySelectorAll("button")]
          .find((b) => b.textContent === text)
          .click(),
      );
    await click("历时 4 h");
    expect(host.querySelector("input").value).toBe("4");
    expect(host.querySelector("dl").textContent).toContain("累计输入50 mm");
    await click("停止输入 3 h 后");
    expect(host.querySelector("input").value).toBe("7");
    expect(host.textContent).toContain("播放调蓄过程");
    await act(() =>
      root.render(<RunoffStorageStudy p={{ rain: 0, infil: 40, evap: 10 }} />),
    );
    expect(host.querySelector("input").value).toBe("0");
    expect(host.querySelector("dl").textContent).not.toMatch(/NaN|Infinity/);
    expect(host.querySelector("dl").textContent).toContain(
      "本次出流峰值0 mm/h",
    );
  } finally {
    await act(() => root.unmount());
  }
});
