// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import FunctionStudio from "../src/FunctionStudio.jsx";
import { bisectionSignature } from "../src/functionObservation.mjs";

it("keeps restored controlled progress on mount and clears it only when the function changes", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const host = document.createElement("div"),
    root = createRoot(host);
  let p = {
    type: 0,
    a: 1,
    k: 1,
    b: -2,
    shift: 0,
    probe: 1,
    analysis: 0,
    dx: 1,
  };
  let stored = {
    signature: bisectionSignature(p),
    left: "0",
    right: "2",
    steps: 5,
  };
  const change = (value) => {
    stored = value;
  };
  const render = () =>
    act(() =>
      root.render(
        <FunctionStudio
          p={p}
          onChange={() => {}}
          bisection
          bisectionProgress={stored}
          onBisectionProgress={change}
        />,
      ),
    );
  try {
    await render();
    expect(stored.steps).toBe(5);
    expect(host.querySelector(".bisection-readouts").textContent).toContain(
      "1.40625",
    );
    p = { ...p, probe: 2 };
    await render();
    expect(stored.steps).toBe(5);
    p = { ...p, b: -1 };
    await render();
    expect(stored.steps).toBe(0);
  } finally {
    await act(() => root.unmount());
  }
});
it("steps, undoes, resets after function changes and clears invalid graph overlays", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const host = document.createElement("div"),
    root = createRoot(host);
  const initial = {
    type: 0,
    a: 1,
    k: 1,
    b: -2,
    shift: 0,
    probe: 1,
    analysis: 0,
    dx: 1,
  };
  const render = (p) =>
    act(() =>
      root.render(<FunctionStudio p={p} onChange={() => {}} bisection />),
    );
  const button = (text) =>
    [...host.querySelectorAll("button")].find((b) => b.textContent === text);
  try {
    await render(initial);
    await act(() => button("折半一步").click());
    expect(host.querySelector(".bisection-readouts").textContent).toContain(
      "[1, 2]",
    );
    expect(host.querySelector('[aria-label="二分法保留区间"]')).not.toBeNull();
    const zoom = host.querySelector('[aria-label="局部放大数轴"]');
    expect(zoom.textContent).toContain("第 1 步");
    expect(zoom.querySelector('[aria-label="保留段"]').getAttribute("d")).toBe(
      "M300 35H560",
    );
    await act(() => button("辅助线").click());
    expect(host.querySelector('[aria-label="二分法保留区间"] path')).toBeNull();
    expect(host.querySelector(".function-notes")).toBeNull();
    await act(() => button("上一步").click());
    expect(host.querySelector(".bisection-readouts").textContent).toContain(
      "[0, 2]",
    );
    await act(() => button("折半一步").click());
    await render({ ...initial, type: 3, shift: 1, b: 0 });
    expect(button("折半一步").disabled).toBe(true);
    expect(host.querySelector('[aria-label="二分法保留区间"]')).toBeNull();
    expect(host.querySelector('[aria-label="局部放大数轴"]')).toBeNull();
    await render(initial);
    expect(host.querySelector(".bisection-readouts").textContent).toContain(
      "[0, 2]",
    );
  } finally {
    await act(() => root.unmount());
  }
});
