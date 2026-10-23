// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { expect, it, vi } from "vitest";
import { planDilution } from "../src/dilutionTarget.mjs";
import { DilutionTarget } from "../src/DilutionTarget.jsx";

it("distinguishes attainable targets, concentration increases, and demonstration limits", () => {
  expect(planDilution(10, 90, 5)).toEqual({
    status: "ready",
    added: 100,
    totalMass: 200,
  });
  expect(planDilution(10, 90, 10).added).toBe(0);
  expect(planDilution(10, 90, 20).status).toBe("higher");
  expect(planDilution(10, 90, 2).status).toBe("outside");
  expect(planDilution(10, 90, 2.5)).toEqual({
    status: "ready",
    added: 300,
    totalMass: 400,
  });
  for (const target of [0, -1, 101, NaN, Infinity])
    expect(planDilution(10, 90, target).status).toBe("invalid");
  const plan = planDilution(17, 83, 7);
  expect((100 * 17) / (100 + plan.added)).toBeCloseTo(7, 12);
});

it("lets learners reveal the calculation before applying a target", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const host = document.createElement("div"),
    root = createRoot(host),
    prepare = vi.fn();
  try {
    await act(() =>
      root.render(
        <DilutionTarget
          p={{ solute: 10, water: 90, add: 250 }}
          onPrepare={prepare}
        />,
      ),
    );
    expect(host.textContent).not.toContain("目标溶液质量 =");
    await act(() => host.querySelector("button").click());
    expect(host.textContent).toContain("100.00 g");
    await act(() => host.querySelectorAll("button")[1].click());
    expect(prepare).toHaveBeenCalledWith({ add: 100 });
  } finally {
    await act(() => root.unmount());
  }
});
