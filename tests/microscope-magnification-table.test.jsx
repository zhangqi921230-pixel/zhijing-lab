// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { expect, it, vi } from "vitest";
import MicroscopeFieldScale from "../src/MicroscopeFieldScale.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("compares objective and total magnification without adjusting specimen or focus", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    change = vi.fn();
  try {
    await act(() =>
      root.render(
        <MicroscopeFieldScale
          mag={40}
          fieldDiameter={4500}
          onChange={change}
        />,
      ),
    );
    const rows = host.querySelectorAll("tbody tr");
    expect(rows).toHaveLength(3);
    expect(rows[0].textContent).toContain("4.50 mm");
    expect(rows[1].textContent).toContain("1.80 mm16%");
    expect(rows[2].textContent).toContain("0.45 mm1%");
    await act(() => rows[2].querySelector("button").click());
    expect(change.mock.calls).toEqual([["mag", 400]]);
  } finally {
    await act(() => root.unmount());
  }
});
