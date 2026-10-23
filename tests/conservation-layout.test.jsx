// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import { atomLayout, conservationFrame } from "../src/conservationLayout.mjs";
import ConservationStudio from "../src/ConservationStudio.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("every atom retains its identity across every valid inventory and fractional animation", () => {
  for (let h2 = 0; h2 <= 8; h2++)
    for (let o2 = 0; o2 <= 4; o2++)
      for (const progress of [0, 0.3, 1, 1.7, 3.5, 4]) {
        const before = atomLayout(h2, o2, 0),
          f = conservationFrame({ h2, o2, progress });
        expect(f.atoms.map((a) => a.id).sort()).toEqual(
          Object.keys(before.atoms).sort(),
        );
        expect(new Set(f.atoms.map((a) => a.id)).size).toBe(2 * h2 + 2 * o2);
        const q = f.from.q;
        expect(q.h2 * 2 + q.h2o * 2).toBe(2 * h2);
        expect(q.o2 * 2 + q.h2o).toBe(2 * o2);
        expect(q.h2 * 2 + q.o2 * 32 + q.h2o * 18).toBe(f.mass);
        for (const a of f.atoms) {
          expect(Number.isFinite(a.x)).toBe(true);
          expect(Number.isFinite(a.y)).toBe(true);
        }
      }
});
it("one complete batch changes molecule count from three to two without changing mass", () => {
  const f = conservationFrame({ h2: 2, o2: 1, progress: 1 });
  expect(f.from.molecules).toHaveLength(2);
  expect(f.mass).toBe(36);
  expect(f.fraction).toBe(0);
});
it("mid-rearrangement hides bonds, keeps atom identities and explains integer counts", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    change = vi.fn();
  try {
    await act(() =>
      root.render(
        <ConservationStudio
          p={{ h2: 2, o2: 1, progress: 0.5 }}
          onChange={change}
        />,
      ),
    );
    expect(host.textContent).toContain("最近完成的整批状态");
    expect(host.querySelectorAll("svg circle").length).toBe(12);
    const button = (t) =>
      [...host.querySelectorAll("button")].find((b) => b.textContent === t);
    await act(() => button("完成下一批").click());
    expect(change).toHaveBeenCalledWith("progress", 1);
    await act(() =>
      root.render(
        <ConservationStudio
          p={{ h2: 0, o2: 0, progress: 4 }}
          onChange={change}
        />,
      ),
    );
    expect(button("完成下一批").disabled).toBe(true);
    expect(host.textContent).toContain("尚未投入分子");
  } finally {
    await act(() => root.unmount());
  }
});
