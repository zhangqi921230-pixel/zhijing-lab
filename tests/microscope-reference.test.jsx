// @vitest-environment jsdom
import React, { act, useState } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import { microscopeReference } from "../src/microscopeReference.mjs";
import { microscopeOptics } from "../src/MicroscopeField.jsx";
import MicroscopeFieldScale from "../src/MicroscopeFieldScale.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("reference map and actual eyepiece use the same inverted displacement and circular boundary", () => {
  for (const mag of [40, 100, 400])
    for (const x of [-40, 0, 31, 40])
      for (const y of [-40, 0, 24, 40]) {
        const p = { mag, x, y, coarse: 50, focus: 50 };
        const r = microscopeReference(p),
          o = microscopeOptics(p);
        expect(r.dx).toBeCloseTo(o.dx, 12);
        expect(r.dy).toBeCloseTo(o.dy, 12);
        const inMap = Math.hypot(r.lowX, r.lowY) <= (70 * 40) / mag;
        expect(r.visible).toBe(inMap);
      }
  expect(microscopeReference({ mag: 400, x: 31, y: 0 }).visible).toBe(true);
  expect(microscopeReference({ mag: 400, x: 31.01, y: 0 }).visible).toBe(false);
});
it("low-power off-center point disappears on magnification and returns on centering", async () => {
  function Harness() {
    const [p, setP] = useState({ mag: 40, x: 0, y: 0 }),
      [reference, setReference] = useState(false);
    return (
      <MicroscopeFieldScale
        {...p}
        fieldDiameter={180000 / p.mag}
        reference={reference}
        onReference={setReference}
        onChange={(key, value) => setP((old) => ({ ...old, [key]: value }))}
      />
    );
  }
  const host = document.createElement("div"),
    root = createRoot(host);
  const click = async (text) =>
    act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === text)
        .click(),
    );
  try {
    await act(() => root.render(<Harness />));
    await click("显示教学参考点");
    await click("准备低倍偏心参考");
    expect(host.querySelector('[role="status"]').textContent).toContain(
      "在当前视野内",
    );
    await click("换到400×");
    expect(host.querySelector('[role="status"]').textContent).toContain(
      "已离开当前视野",
    );
    await click("把参考点移到中央");
    expect(host.querySelector('[role="status"]').textContent).toContain(
      "半径的 0%",
    );
    expect(
      host
        .querySelector('[data-testid="field-reference-point"]')
        .getAttribute("cx"),
    ).toBe("85");
    await click("隐藏教学参考点");
    expect(
      host.querySelector('[data-testid="field-reference-point"]'),
    ).toBeNull();
  } finally {
    await act(() => root.unmount());
  }
});

it("inserting the centering lesson does not inherit another chapter's specimen presets", async () => {
  const { instrumentEntry } = await import("../src/chapterEntry.mjs");
  const { microscopeChapters } = await import("../src/microscopeChapters.mjs");
  const { lessons } = await import("../src/lessons.mjs");
  const lesson = lessons.find((l) => l.id === "microscope");
  const locate = (en) =>
    instrumentEntry(
      lesson,
      microscopeChapters,
      microscopeChapters.findIndex((c) => c.en === en),
      {},
    ).p;
  expect(locate("CENTER BEFORE ZOOM")).toMatchObject({
    specimen: 0,
    mag: 40,
    x: 32,
    y: 24,
  });
  expect(locate("EXPLORATION")).toMatchObject({ specimen: 1, mag: 400 });
  expect(locate("CHECK YOUR UNDERSTANDING")).toMatchObject({
    specimen: 0,
    mag: 40,
    coarse: 40,
  });
});
