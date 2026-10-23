// @vitest-environment jsdom
import React, { act, useState } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import MicroscopeMotionStudy from "../src/MicroscopeMotionStudy.jsx";
import { microscopeReference } from "../src/microscopeReference.mjs";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("all four image offsets recenter by moving the slide toward the image, while opposite motion moves it farther away", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  let current, reference;
  function Harness() {
    const [p, setP] = useState({ x: 0, y: 0, mag: 40 });
    current = p;
    return (
      <MicroscopeMotionStudy
        p={p}
        onChange={(k, v) => setP((p) => ({ ...p, [k]: v }))}
        onReference={(v) => (reference = v)}
      />
    );
  }
  const click = async (label) =>
    act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === label)
        .click(),
    );
  await act(() => root.render(<Harness />));
  try {
    for (const [scenario, direction, opposite] of [
      ["物像偏右", "玻片右移", "玻片左移"],
      ["物像偏左", "玻片左移", "玻片右移"],
      ["物像偏上", "玻片上移", "玻片下移"],
      ["物像偏下", "玻片下移", "玻片上移"],
    ]) {
      await click(scenario);
      expect(reference).toBe(true);
      expect(current.mag).toBe(100);
      expect(current.specimen).toBe(0);
      const before = microscopeReference(current).edgeFraction;
      await click(opposite);
      expect(microscopeReference(current).edgeFraction).toBeGreaterThan(before);
      await click(scenario);
      for (let n = 0; n < 3; n++) await click(direction);
      expect(current.x).toBe(0);
      expect(current.y).toBe(0);
      expect(host.textContent).toContain("参考点已居中");
    }
    await click("物像偏左");
    for (let n = 0; n < 8; n++) await click("玻片右移");
    expect(current.x).toBe(40);
    expect(
      [...host.querySelectorAll("button")].find(
        (b) => b.textContent === "玻片右移",
      ).disabled,
    ).toBe(true);
  } finally {
    await act(() => root.unmount());
  }
});
