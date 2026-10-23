// @vitest-environment jsdom
import React, { act, useState } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import DiameterStudy from "../src/DiameterStudy.jsx";
import OpticalGeometryScene from "../src/OpticalGeometryScene.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("proof steps reveal the actual radius and angle arcs only for a diameter", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  function Harness() {
    const [p, setP] = useState({ central: 180, position: 25 });
    return (
      <>
        <OpticalGeometryScene id="inscribed-angle" p={p} time={0} chapter={3} />
        <DiameterStudy p={p} time={0} onChange={setP} />
      </>
    );
  }
  const click = async (text) =>
    act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === text)
        .click(),
    );
  try {
    await act(() => root.render(<Harness />));
    expect(host.querySelector('[data-testid="diameter-proof"]')).toBeNull();
    await click("1 · 连接半径 OP");
    expect(
      host.querySelector(
        '[data-testid="diameter-proof"] path[stroke-dasharray]',
      ),
    ).not.toBeNull();
    await click("2 · 标出两个底角");
    expect(host.querySelector('[role="status"]').textContent).toContain(
      "2α + 2β = 180°",
    );
    expect(
      host.querySelector('[data-testid="diameter-proof"]').textContent,
    ).toContain("α + β = 90°");
    await click("普通弦 AB · 120°");
    expect(host.querySelector('[data-testid="diameter-proof"]')).toBeNull();
  } finally {
    await act(() => root.unmount());
  }
});
