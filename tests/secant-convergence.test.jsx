// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import SecantConvergence, {
  convergenceRows,
} from "../src/SecantConvergence.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const p = { type: 0, a: 1, k: 1, shift: 0, b: 0, probe: 1, dx: 1 };
it("separates smooth convergence, a cusp, a domain endpoint and a crossed gap", () => {
  for (const row of convergenceRows(p)) {
    expect(row.left.secant).toBeCloseTo(2 - row.h, 9);
    expect(row.right.secant).toBeCloseTo(2 + row.h, 9);
  }
  for (const row of convergenceRows({ ...p, type: 2, probe: 0 })) {
    expect(row.left.secant).toBe(-1);
    expect(row.right.secant).toBe(1);
    expect(row.left.tangent).toBeNull();
  }
  for (const row of convergenceRows({ ...p, type: 5, probe: 0 }))
    expect(row.left.secant).toBeNull();
  expect(
    convergenceRows({ ...p, type: 3, probe: 0.05 })[0].left.crossesGap,
  ).toBe(true);
});
it("applies a signed interval without changing the probe and flags invalid comparisons", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    change = vi.fn();
  try {
    await act(() => root.render(<SecantConvergence p={p} onChange={change} />));
    const b = [...host.querySelectorAll("button")].find((x) =>
      x.getAttribute("aria-label").startsWith("左侧间距0.01，"),
    );
    await act(() => b.click());
    expect(change).toHaveBeenCalledWith("dx", -0.01);
    expect(p.probe).toBe(1);
    await act(() =>
      root.render(
        <SecantConvergence
          p={{ ...p, type: 3, probe: 0.05 }}
          onChange={change}
        />,
      ),
    );
    expect(host.textContent).toContain("跨越间断");
    await act(() =>
      root.render(
        <SecantConvergence p={{ ...p, type: 5, probe: 0 }} onChange={change} />,
      ),
    );
    expect(host.querySelectorAll("button")).toHaveLength(4);
  } finally {
    await act(() => root.unmount());
  }
});
