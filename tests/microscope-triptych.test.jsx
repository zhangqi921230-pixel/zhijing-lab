// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import MicroscopeFieldTriptych from "../src/MicroscopeFieldTriptych.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("the same off-center target is lost at high power, then visible at all powers after centering", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    onChange = vi.fn();
  try {
    await act(() =>
      root.render(
        <MicroscopeFieldTriptych x={32} y={24} mag={40} onChange={onChange} />,
      ),
    );
    expect(host.querySelector('[data-reference-mag="40"]')).not.toBeNull();
    expect(host.querySelector('[data-reference-mag="100"]')).not.toBeNull();
    expect(host.querySelector('[data-reference-mag="400"]')).toBeNull();
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === "切到 400×")
        .click(),
    );
    expect(onChange.mock.calls).toEqual([["mag", 400]]);
    await act(() =>
      root.render(
        <MicroscopeFieldTriptych x={0} y={0} mag={400} onChange={onChange} />,
      ),
    );
    expect(host.querySelectorAll("[data-reference-mag]")).toHaveLength(3);
    for (const dot of host.querySelectorAll("[data-reference-mag]")) {
      expect(dot.getAttribute("cx")).toBe("90");
      expect(dot.getAttribute("cy")).toBe("90");
    }
  } finally {
    await act(() => root.unmount());
  }
});
