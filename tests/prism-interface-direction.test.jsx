// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import { InterfaceDiagram, rayArrow } from "../src/PrismInterfaces.jsx";
import PrismInterfaces from "../src/PrismInterfaces.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("outgoing angle uses the transmitted normal or the incident-side reflected normal", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  try {
    for (const refraction of [25, 70, null]) {
      await act(() =>
        root.render(
          <InterfaceDiagram
            incidence={50}
            refraction={refraction}
            color="#123"
            title="角度"
            entering={false}
          />,
        ),
      );
      const arc = host
        .querySelector('[data-testid="outgoing-angle"]')
        .getAttribute("d");
      const nums = arc.match(/-?\d+(?:\.\d+)?/g).map(Number),
        angle = ((refraction ?? 50) * Math.PI) / 180;
      expect(nums.at(-2)).toBeCloseTo(180 + 38 * Math.sin(angle));
      expect(nums.at(-1)).toBeCloseTo(
        125 + (refraction === null ? -1 : 1) * 38 * Math.cos(angle),
      );
      expect(host.querySelectorAll('[data-testid$="direction"]')).toHaveLength(
        2,
      );
    }
    await act(() =>
      root.render(
        <PrismInterfaces
          p={{ angle: 30, index: 1.65, color: 0 }}
          chapter={4}
          onSeek={() => {}}
        />,
      ),
    );
    expect(host.querySelector("details").open).toBe(true);
    expect(host.textContent).toContain("全反射");
  } finally {
    await act(() => root.unmount());
  }
});
it("arrow tips point forward on horizontal rays", () => {
  const nums = rayArrow([0, 0], [100, 0])
    .match(/-?\d+(?:\.\d+)?/g)
    .map(Number);
  expect(nums).toEqual([59, 4, 68, 0, 59, -4]);
});
