// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import LeverBalanceStudy, {
  leverBalanceCurve,
} from "../src/LeverBalanceStudy.jsx";
import { leverState } from "../src/leverModel.mjs";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("all balance solutions stay within apparatus limits and keep equal torques at tilted angles", () => {
  for (const moment of [0.2, 1, 5, 10, 40]) {
    const curve = leverBalanceCurve(moment);
    expect(curve.length).toBe(101);
    for (const { distance, force } of curve) {
      expect(distance).toBeGreaterThanOrEqual(0.2);
      expect(distance).toBeLessThanOrEqual(2);
      expect(force).toBeGreaterThanOrEqual(1 - 1e-10);
      expect(force).toBeLessThanOrEqual(20 + 1e-10);
      for (const a of [-20, 0, 20])
        expect(force * distance * Math.cos((a * Math.PI) / 180)).toBeCloseTo(
          moment * Math.cos((a * Math.PI) / 180),
          10,
        );
    }
  }
  const near = leverState({ f1: 20, l1: 0.5, f2: 10, l2: 0.5 });
  const far = leverState({ f1: 10, l1: 1, f2: 5, l2: 1 });
  expect(near.leftTorque - near.rightTorque).toBe(
    far.leftTorque - far.rightTorque,
  );
  expect(far.inertia).toBeCloseTo(2 * near.inertia, 12);
  expect(near.alpha).toBeCloseTo(2 * far.alpha, 12);
});
it("distance choices change the original parameter; unavailable balance is explained and disabled", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    change = vi.fn();
  const render = async (p) =>
    act(() =>
      root.render(
        <LeverBalanceStudy p={p} q={leverState(p)} onChange={change} />,
      ),
    );
  try {
    await render({ f1: 10, l1: 1, f2: 4, l2: 2 });
    await act(() => host.querySelectorAll("button")[0].click());
    expect(change).toHaveBeenLastCalledWith("l2", 0.5);
    await act(() => host.querySelectorAll("button")[4].click());
    expect(change).toHaveBeenLastCalledWith("f2", 5);
    await render({ f1: 20, l1: 2, f2: 4, l2: 0.2 });
    expect(host.querySelectorAll("button")[4].disabled).toBe(true);
    expect(host.textContent).toContain("超出本台");
    expect(host.querySelectorAll("circle").length).toBe(1);
  } finally {
    await act(() => root.unmount());
  }
});
