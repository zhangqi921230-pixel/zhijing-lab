// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import PhotoFactorial, { photoFactorial } from "../src/PhotoFactorial.jsx";
import { photo } from "../src/models.mjs";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("four groups preserve temperature and compare the same light increment", () => {
  for (const t of [5, 25, 45]) {
    const rows = photoFactorial(t);
    expect(rows).toHaveLength(4);
    for (const r of rows) {
      expect(r.temp).toBe(t);
      expect(r.rate).toBe(photo(r));
    }
    expect(rows[3].rate - rows[2].rate).toBeGreaterThan(
      rows[1].rate - rows[0].rate,
    );
  }
});
it("controls change only one factor and identify a matching combination", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    change = vi.fn();
  try {
    await act(() =>
      root.render(
        <PhotoFactorial
          p={{ light: 20, co2: 80, temp: 25 }}
          onChange={change}
        />,
      ),
    );
    expect(host.querySelectorAll("rect[stroke-dasharray]")).toHaveLength(1);
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === "光照设为 80%")
        .click(),
    );
    expect(change).toHaveBeenCalledWith("light", 80);
  } finally {
    await act(() => root.unmount());
  }
});
