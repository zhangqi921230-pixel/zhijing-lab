// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import MicroscopeFieldScale from "../src/MicroscopeFieldScale.jsx";
import { microscopeOptics } from "../src/MicroscopeField.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("shows inverse linear and squared area ratios while retaining expanded state on lens change", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  try {
    for (const [mag, percent] of [
      [40, 100],
      [100, 16],
      [400, 1],
    ]) {
      const optics = microscopeOptics({
        mag,
        coarse: 50,
        focus: 50,
        x: 0,
        y: 0,
      });
      await act(() =>
        root.render(
          <MicroscopeFieldScale
            mag={mag}
            fieldDiameter={optics.fieldDiameter}
          />,
        ),
      );
      const circles = host.querySelectorAll("circle");
      const ratio =
        Number(circles[1].getAttribute("r")) /
        Number(circles[0].getAttribute("r"));
      expect(ratio).toBeCloseTo(optics.fieldDiameter / 4500, 12);
      expect(ratio * ratio * 100).toBeCloseTo(percent, 12);
      expect(host.textContent).toContain(`面积保留 ${percent}%`);
      if (mag === 40) host.querySelector("details").open = true;
      expect(host.querySelector("details").open).toBe(true);
    }
  } finally {
    await act(() => root.unmount());
  }
});
