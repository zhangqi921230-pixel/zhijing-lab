// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { expect, it, vi } from "vitest";
import { AcidGuide } from "../src/AcidGuide.jsx";

it("compares amounts in mmol and targets the current acid volume, respecting the burette limit", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const host = document.createElement("div"),
    root = createRoot(host),
    prepare = vi.fn();
  try {
    await act(() =>
      root.render(
        <AcidGuide
          chapter={3}
          p={{ acid: 50, base: 49.9, c: 0.1 }}
          onPrepare={prepare}
          onSelect={() => {}}
        />,
      ),
    );
    expect([...host.querySelectorAll("dd")].map((e) => e.textContent)).toEqual([
      "5.000 / 4.990 mmol",
      "酸过量",
      "4.00",
      "99.9 mL",
    ]);
    await act(() =>
      host.querySelectorAll(".acid-equivalence button")[1].click(),
    );
    expect(prepare).toHaveBeenCalledWith({ base: 50 });
    await act(() =>
      root.render(
        <AcidGuide
          chapter={3}
          p={{ acid: 100, base: 100, c: 0.1 }}
          onPrepare={prepare}
          onSelect={() => {}}
        />,
      ),
    );
    expect(host.querySelectorAll(".acid-equivalence button")[2].disabled).toBe(
      true,
    );
    expect(
      [...host.querySelectorAll("dd")].map((e) => e.textContent),
    ).toContain("7.00");
  } finally {
    await act(() => root.unmount());
  }
});
