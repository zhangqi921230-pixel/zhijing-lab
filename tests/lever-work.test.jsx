// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import LeverWorkStudy, { leverWork } from "../src/LeverWorkStudy.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("vertical force work conserves energy and differs from force times arc length", () => {
  for (const l1 of [0.2, 1, 2])
    for (const l2 of [0.2, 1, 2])
      for (const angle of [0, 10, 25]) {
        const p = { f1: 10, l1, l2 },
          q = leverWork(p, angle);
        expect(q.force * q.rightHeight).toBeCloseTo(10 * q.leftHeight, 12);
        expect(q.work).toBeCloseTo(q.force * q.rightHeight, 12);
        if (angle > 0) {
          expect(q.rightHeight / q.leftHeight).toBeCloseTo(l2 / l1, 12);
          expect(q.rightArc).toBeGreaterThan(q.rightHeight);
        }
      }
});
it("angle controls update displacement without silently changing force parameters", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    change = vi.fn();
  try {
    await act(() =>
      root.render(
        <LeverWorkStudy
          p={{ f1: 10, l1: 1, l2: 2, f2: 7 }}
          onChange={change}
        />,
      ),
    );
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === "水平起点")
        .click(),
    );
    expect(host.querySelector("input").value).toBe("0");
    expect(
      host.querySelector('[role="img"]').getAttribute("aria-label"),
    ).toContain("左端升高0.000米");
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === "转到 25°")
        .click(),
    );
    expect(host.querySelector("input").value).toBe("25");
    expect(change).toHaveBeenLastCalledWith("l1", 1);
    expect(host.textContent).toContain("5.00 × 0.845 ≈ 4.226 J");
  } finally {
    await act(() => root.unmount());
  }
});
