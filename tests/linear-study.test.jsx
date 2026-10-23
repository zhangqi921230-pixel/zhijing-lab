// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import { linearPointPair, linearZero } from "../src/linearStudy.mjs";
import Guide from "../src/LinearStudyGuide.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("recovers slope and intercept from distinct points in either order", () => {
  for (const k of [-3, 0, 0.1, 3])
    for (const b of [-4, 0, 4])
      for (const [a, x] of [
        [-1, 2],
        [3, -2],
      ]) {
        const q = linearPointPair(k, b, a, x);
        expect(q.slope).toBeCloseTo(k, 10);
        expect(q.ya - q.slope * a).toBeCloseTo(b, 10);
      }
  expect(linearPointPair(2, 1, 2, 2).slope).toBeNull();
  expect(linearZero(0, 0).kind).toBe("all");
  expect(linearZero(0, 2).kind).toBe("none");
  expect(linearZero(-2, 3).x).toBe(1.5);
});
it("root navigation preserves exact root and disables unreachable or nonunique roots", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  let value;
  const render = async (k, b) =>
    act(() =>
      root.render(
        <Guide
          p={{ k, b, x: 0 }}
          chapter={4}
          anchor={-1}
          onChange={(key, v) => {
            value = v;
          }}
        />,
      ),
    );
  try {
    await render(3, 1);
    await act(() => host.querySelector("button").click());
    expect(value).toBe(-1 / 3);
    await render(0.1, 4);
    expect(host.querySelector("button").disabled).toBe(true);
    expect(host.textContent).toContain("不将它截断到边界");
    await render(0, 0);
    expect(host.textContent).toContain("每一个 x");
    expect(host.querySelector("button").disabled).toBe(true);
  } finally {
    await act(() => root.unmount());
  }
});
