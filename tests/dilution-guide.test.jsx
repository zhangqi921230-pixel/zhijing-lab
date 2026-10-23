// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { expect, it } from "vitest";
import { DilutionGuide } from "../src/DilutionGuide.jsx";

it("shows unchanged solute and counts solute in both solution-mass denominators", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const host = document.createElement("div"),
    root = createRoot(host);
  try {
    await act(() =>
      root.render(
        <DilutionGuide
          chapter={2}
          p={{ solute: 10, water: 90, add: 100 }}
          onSelect={() => {}}
          onPrepare={() => {}}
        />,
      ),
    );
    expect([...host.querySelectorAll("dd")].map((e) => e.textContent)).toEqual([
      "10 g",
      "100 → 200 g",
      "10.00 → 5.00 %",
      "100 g",
    ]);
  } finally {
    await act(() => root.unmount());
  }
});
