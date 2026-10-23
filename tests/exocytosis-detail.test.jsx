// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { it, expect } from "vitest";
import Detail, { exocytosisState } from "../src/ExocytosisDetail.jsx";
import SecretoryGuide from "../src/SecretoryGuide.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("cargo approaches on the cytoplasmic side and crosses only through an open membrane", () => {
  for (let p = 60; p <= 100; p++) {
    const q = exocytosisState(p);
    if (!q.open) expect(q.cargoY - 12).toBeGreaterThan(130);
    if (q.cargoY < 130) expect(q.open).toBe(true);
    const html = renderToStaticMarkup(
      <Detail progress={p} onSeek={() => {}} />,
    );
    expect(html).not.toMatch(/NaN|Infinity/);
  }
  expect(exocytosisState(100).cargoY + 12).toBeLessThan(130);
  expect(exocytosisState(89.999).cargoY).toBeCloseTo(
    exocytosisState(90).cargoY,
    2,
  );
});
it("local stage buttons update the shared secretory progress", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    changes = [];
  try {
    await act(() =>
      root.render(
        <SecretoryGuide
          p={{ secretoryMode: 1, secretoryProgress: 75 }}
          onChange={(...v) => changes.push(v)}
        />,
      ),
    );
    for (const [label, value] of [
      ["囊泡靠近", 75],
      ["融合开口", 90],
      ["释放完成", 100],
    ]) {
      const b = [...host.querySelectorAll("button")].find(
        (b) => b.textContent === label,
      );
      await act(() => b.click());
      expect(changes.at(-1)).toEqual(["secretoryProgress", value]);
    }
  } finally {
    await act(() => root.unmount());
  }
});
