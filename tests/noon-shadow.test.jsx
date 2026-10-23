// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import NoonShadow, { noonShadow } from "../src/NoonShadow.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("respects projection geometry, height scaling, zenith and horizon boundaries", () => {
  expect(noonShadow(1, 45)).toBeCloseTo(1, 10);
  expect(noonShadow(2, 30)).toBeCloseTo(2 * Math.sqrt(3), 10);
  expect(noonShadow(1, 90)).toBe(0);
  expect(noonShadow(1, 0)).toBeNull();
  expect(noonShadow(1, -5)).toBeNull();
  expect(noonShadow(1, 0.01)).toBeGreaterThan(5000);
});
it("changes rod height, suppresses polar-night shadows and labels clipping", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  try {
    await act(() => root.render(<NoonShadow p={{ day: 0, lat: 45 }} />));
    expect(host.querySelector("svg").getAttribute("aria-label")).toContain(
      "影长1.000米",
    );
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === "杆高 2 m")
        .click(),
    );
    expect(host.querySelector("svg").getAttribute("aria-label")).toContain(
      "影长2.000米",
    );
    await act(() => root.render(<NoonShadow p={{ day: 274, lat: 70 }} />));
    expect(host.textContent).toContain("不绘制来自太阳直射的杆影");
    await act(() => root.render(<NoonShadow p={{ day: 0, lat: 80 }} />));
    expect(host.textContent).toContain("影子超出图示 4 m 范围");
    await act(() => root.render(<NoonShadow p={{ day: 0, lat: 0 }} />));
    expect(host.textContent).toContain("影长为 0");
  } finally {
    await act(() => root.unmount());
  }
});
