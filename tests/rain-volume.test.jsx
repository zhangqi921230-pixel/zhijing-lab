// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import RainVolumeStudy, { rainfallVolume } from "../src/RainVolumeStudy.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("converts mm times square metres to cubic metres and conserves all partitions", () => {
  for (const rain of [0, 1, 50, 200])
    for (const area of [1, 100, 10000, 1000000])
      for (const infil of [0, 40, 80])
        for (const evap of [0, 15, 20]) {
          const q = rainfallVolume({ rain, infil, evap }, area);
          expect(q.total).toBeCloseTo((rain * area) / 1000, 8);
          expect(q.parts.reduce((n, p) => n + p.volume, 0)).toBeCloseTo(
            q.total,
            8,
          );
        }
  expect(rainfallVolume({ rain: 1, infil: 40, evap: 15 }, 1).total).toBe(0.001);
});
it("changing area and units changes volumes without altering the rain model", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    p = { rain: 100, infil: 40, evap: 15 };
  try {
    await act(() => root.render(<RainVolumeStudy p={p} />));
    const button = (text) =>
      [...host.querySelectorAll("button")].find((b) => b.textContent === text);
    expect(host.querySelector("header>strong").textContent).toBe("1,000 m³");
    await act(() => button("10 m × 10 m").click());
    expect(host.querySelector("header>strong").textContent).toBe("10 m³");
    await act(() => button("升 L").click());
    expect(host.querySelector("header>strong").textContent).toBe("10,000 L");
    expect(p.rain).toBe(100);
    await act(() => root.render(<RainVolumeStudy p={{ ...p, rain: 0 }} />));
    expect(host.querySelector("header>strong").textContent).toBe("0 L");
    expect(host.querySelector("svg").textContent).not.toContain("NaN");
  } finally {
    await act(() => root.unmount());
  }
});
