// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import { seismicLocation } from "../src/seismicLocation.mjs";
import SeismicLocation from "../src/SeismicLocation.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("arrival differences recover source paths and both two-station intersections, while C rejects the alternative", () => {
  for (const distance of [10, 20, 40, 70, 100])
    for (const depth of [5, 15, 30]) {
      const { stations, alternative } = seismicLocation({ distance, depth });
      for (const s of stations) {
        const recovered = s.lag / (1 / 3.5 - 1 / 6);
        expect(recovered).toBeCloseTo(s.path, 10);
        expect(Math.sqrt(recovered ** 2 - depth ** 2)).toBeCloseTo(
          s.radius,
          10,
        );
        expect(Math.hypot(s.x, s.y)).toBeCloseTo(s.radius, 10);
      }
      for (const s of stations.slice(0, 2))
        expect(
          Math.hypot(s.x - alternative.x, s.y - alternative.y),
        ).toBeCloseTo(s.radius, 10);
      const c = stations[2];
      expect(
        Math.abs(
          Math.hypot(c.x - alternative.x, c.y - alternative.y) - c.radius,
        ),
      ).toBeGreaterThan(1);
      const deep = seismicLocation({ distance, depth: depth + 10 });
      deep.stations.forEach((s, i) => {
        expect(s.radius).toBe(stations[i].radius);
        expect(s.lag).toBeGreaterThan(stations[i].lag);
      });
    }
});
it("step controls progressively reveal distance rings, candidate points and corresponding measurements", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  await act(() =>
    root.render(<SeismicLocation p={{ distance: 40, depth: 15 }} />),
  );
  try {
    for (const count of [1, 2, 3, 1]) {
      await act(() =>
        host
          .querySelectorAll('[aria-label="逐步加入台站"] button')
          [count - 1].click(),
      );
      expect(host.querySelectorAll(".location-ring")).toHaveLength(count);
      expect(host.querySelectorAll("tbody tr")).toHaveLength(count);
      expect(host.querySelector("svg").textContent.includes("候选 2")).toBe(
        count === 2,
      );
      expect(host.querySelector("svg").textContent.includes("共同交点")).toBe(
        count === 3,
      );
    }
  } finally {
    await act(() => root.unmount());
  }
});
it("live evidence keeps waiting station rows and reveals only complete arrivals", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    p = { distance: 100, depth: 10 },
    stations = seismicLocation(p).stations;
  try {
    await act(() => root.render(<SeismicLocation p={p} time={0} />));
    await act(() =>
      host.querySelectorAll('[aria-label="逐步加入台站"] button')[2].click(),
    );
    await act(() =>
      host
        .querySelectorAll('[aria-label="定位数据呈现方式"] button')[1]
        .click(),
    );
    expect(host.querySelectorAll("tbody tr")).toHaveLength(3);
    expect(host.querySelectorAll(".location-ring")).toHaveLength(0);
    expect(host.querySelectorAll(".location-station-waiting")).toHaveLength(3);
    expect(host.querySelector("tbody").textContent).toContain("等待P波");
    await act(() =>
      root.render(<SeismicLocation p={p} time={stations[0].path / 6} />),
    );
    expect(host.querySelector("tbody tr").textContent).toContain(
      "P已到 · 等待S",
    );
    expect(host.querySelector("tbody tr").textContent).toContain("—");
    expect(host.querySelectorAll(".location-ring")).toHaveLength(2);
    await act(() =>
      root.render(<SeismicLocation p={p} time={stations[0].path / 3.5} />),
    );
    expect(host.querySelectorAll(".location-ring")).toHaveLength(3);
    expect(host.querySelector("tbody").textContent).not.toContain("—");
  } finally {
    await act(() => root.unmount());
  }
});
