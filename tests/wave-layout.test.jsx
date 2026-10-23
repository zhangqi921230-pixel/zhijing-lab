// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import VisualPhysicsScene, {
  waveDisplacementText,
} from "../src/VisualPhysicsScene.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("single waves avoid duplicate rows and maximum superposition stays within each panel", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    p = {
      mode: 0,
      amplitude: 0.8,
      frequency: 0.5,
      speed: 2,
      phase: 0,
      probe: 1,
    };
  try {
    await act(() =>
      root.render(
        <VisualPhysicsScene id="waves" p={p} t={0} onChange={() => {}} />,
      ),
    );
    expect(host.querySelectorAll("[data-wave-row]")).toHaveLength(1);
    await act(() =>
      root.render(
        <VisualPhysicsScene
          id="waves"
          p={{ ...p, mode: 1 }}
          t={0}
          onChange={() => {}}
        />,
      ),
    );
    expect(host.querySelectorAll("[data-wave-row]")).toHaveLength(3);
    const circles = host
      .querySelector('[data-wave-row="total"]')
      .querySelectorAll("circle");
    for (const c of circles) {
      const y = Number(c.getAttribute("cy"));
      expect(y).toBeGreaterThanOrEqual(559);
      expect(y).toBeLessThanOrEqual(751);
    }
    expect(host.querySelector(".vp-wave-diagram").getAttribute("viewBox")).toBe(
      "0 0 840 780",
    );
  } finally {
    await act(() => root.unmount());
  }
});

it("wave labels normalize rounded negative zero without changing small resolved displacements", () => {
  expect(waveDisplacementText(-1e-14)).toBe("0.000");
  expect(waveDisplacementText(-0.00049)).toBe("0.000");
  expect(waveDisplacementText(-0.00051)).toBe("-0.001");
  expect(waveDisplacementText(0.00051)).toBe("0.001");
});
