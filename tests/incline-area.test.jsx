// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import InclineVelocityPlot from "../src/InclineVelocityPlot.jsx";
import { incline } from "../src/advancedModels.mjs";

it("area toggle follows demonstrated displacement and stops growing at the end stop", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const host = document.createElement("div"),
    root = createRoot(host);
  const p = { angle: 50, mass: 2, mu: 0.2, muStatic: 0.3 };
  const render = async (t) =>
    act(() => root.render(<InclineVelocityPlot p={p} t={t} />));
  try {
    await render(0.2);
    expect(host.querySelector('[aria-label^="速度图下方面积"]')).toBeNull();
    await act(() => host.querySelector("button").click());
    expect(host.querySelector(".incline-area-reading").textContent).toContain(
      incline(p, 0.2).s.toFixed(2),
    );
    await render(8);
    expect(host.querySelector(".incline-area-reading").textContent).toContain(
      "4.00 m",
    );
    expect(host.querySelector(".incline-area-reading").textContent).toContain(
      "不再增加",
    );
    const area = host
      .querySelector('[aria-label^="速度图下方面积"]')
      .getAttribute("d");
    await render(20);
    expect(
      host.querySelector('[aria-label^="速度图下方面积"]').getAttribute("d"),
    ).toBe(area);
    await act(() => host.querySelector("button").click());
    expect(host.querySelector('[aria-label^="速度图下方面积"]')).toBeNull();
  } finally {
    await act(() => root.unmount());
  }
});

it("phase buttons seek exact spatial milestones and disable unreachable states", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const host = document.createElement("div"),
    root = createRoot(host);
  let selected;
  const p = { angle: 40, mass: 2, mu: 0.2, muStatic: 0.3 };
  const render = async (params) =>
    act(() =>
      root.render(
        <InclineVelocityPlot
          p={params}
          t={0}
          onSeek={(time) => {
            selected = time;
          }}
        />,
      ),
    );
  const button = (label) =>
    [...host.querySelectorAll("button")].find((b) => b.textContent === label);
  try {
    await render(p);
    await act(() => button("行程一半").click());
    expect(incline(p, selected).s).toBeCloseTo(2, 10);
    expect(incline(p, selected).arrived).toBe(false);
    await act(() => button("到达挡板").click());
    expect(incline(p, selected).arrived).toBe(true);
    expect(incline(p, selected).v).toBe(0);
    await render({ ...p, angle: 5, muStatic: 0.5 });
    expect(button("行程一半").disabled).toBe(true);
    expect(button("到达挡板").disabled).toBe(true);
    expect(button("释放前").disabled).toBe(false);
    await render({
      ...p,
      angle: (Math.atan(0.2) * 180) / Math.PI + 0.001,
      muStatic: 0.2,
    });
    expect(button("行程一半").disabled).toBe(true);
    expect(button("到达挡板").disabled).toBe(true);
    expect(host.textContent).toContain("8 秒演示窗口内尚不能到达");
  } finally {
    await act(() => root.unmount());
  }
});
