// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import EqualChargeStudy from "../src/EqualChargeStudy.jsx";
import { electrolysisState } from "../src/chemistryTopics.mjs";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("applies equal-charge states and disables times beyond the scene limit", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    apply = vi.fn();
  try {
    await act(() => root.render(<EqualChargeStudy onApply={apply} />));
    for (const button of host.querySelectorAll("article button"))
      await act(() => button.click());
    expect(apply.mock.calls).toEqual([
      [0.5, 600],
      [1, 300],
      [2, 150],
    ]);
    const amounts = apply.mock.calls.map(
      ([i, t]) => electrolysisState(i, t).hydrogen,
    );
    expect(amounts[0]).toBe(amounts[1]);
    expect(amounts[1]).toBe(amounts[2]);
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === "600 C")
        .click(),
    );
    expect(host.querySelector("article button").disabled).toBe(true);
    expect(host.textContent).toContain("超过600秒演示范围");
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === "120 C")
        .click(),
    );
    expect(host.querySelector("article button").disabled).toBe(false);
  } finally {
    await act(() => root.unmount());
  }
});
