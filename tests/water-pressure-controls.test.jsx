// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import MotionLab from "../src/MotionLab.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("density changes preserve measurement depth and depth changes preserve its fraction", async () => {
  const host = document.createElement("div");
  document.body.append(host);
  const root = createRoot(host);
  const change = async (label, value) =>
    act(() => {
      const input = host.querySelector(`[aria-label="${label}"]`);
      Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value",
      ).set.call(input, String(value));
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
  try {
    await act(() =>
      root.render(
        <MotionLab
          lesson={{ id: "water-pressure" }}
          open={() => {}}
          goHome={() => {}}
        />,
      ),
    );
    await act(() =>
      host.querySelectorAll('[aria-label="学习子主题"] button')[2].click(),
    );
    expect(host.textContent).toContain("A 11.76 kPa");
    await change("液体密度", 1200);
    expect(host.querySelector('[aria-label="演示进度"]').value).toBe("3");
    expect(host.textContent).toContain("A 17.64 kPa");
    expect(host.textContent).toContain("深度 z = 1.50 m");
    expect(host.textContent).toContain("同深度清水 14.70 kPa");
    await change("水深", 4);
    expect(host.textContent).toContain("深度 z = 2.00 m");
    expect(host.textContent).toContain("A 23.52 kPa");
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === "液面")
        .click(),
    );
    expect(host.textContent).toContain("A 0.00 kPa");
    expect(host.textContent).not.toContain("NaN");
  } finally {
    await act(() => root.unmount());
    host.remove();
  }
});
