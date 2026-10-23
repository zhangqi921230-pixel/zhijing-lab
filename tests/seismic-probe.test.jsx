// @vitest-environment jsdom
import React, { act, useState } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import SeismicMotion from "../src/SeismicMotion.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("probe shortcuts share time with particle motion and respect the selected path distance", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    times = [];
  function Harness() {
    const [time, setTime] = useState(0);
    return (
      <SeismicMotion
        time={time}
        onSeek={(t) => {
          times.push(t);
          setTime(t);
        }}
      />
    );
  }
  await act(() => root.render(<Harness />));
  const click = async (name) =>
    act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === name)
        .click(),
    );
  const point = (kind) =>
    host.querySelector(`[data-testid="probe-${kind}"]`).getAttribute("points");
  try {
    const startP = point("P"),
      startS = point("S");
    await click("P 波经过后 0.5 s");
    expect(times.at(-1)).toBeCloseTo(40 / 6 + 0.5);
    expect(point("P")).not.toBe(startP);
    expect(point("S")).toBe(startS);
    await click("S 波经过后 0.5 s");
    expect(times.at(-1)).toBeCloseTo(40 / 3.5 + 0.5);
    expect(point("S")).not.toBe(startS);
    const slider = host.querySelector('[aria-label="观察质点位置"]');
    await act(() => {
      Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value",
      ).set.call(slider, "24");
      slider.dispatchEvent(new Event("input", { bubbles: true }));
      slider.dispatchEvent(new Event("change", { bubbles: true }));
    });
    await click("S 波经过后 0.5 s");
    expect(times.at(-1)).toBeCloseTo(80 / 3.5 + 0.5);
    expect(times.at(-1)).toBeLessThan(25);
  } finally {
    await act(() => root.unmount());
  }
});
