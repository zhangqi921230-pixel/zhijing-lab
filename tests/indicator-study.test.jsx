// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import IndicatorStudy from "../src/IndicatorStudy.jsx";
import {
  indicators,
  indicatorAppearance,
  volumeForPH,
} from "../src/indicatorModel.mjs";
import { ph } from "../src/models.mjs";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("pH target volumes invert the shared water-ionization model and honor burette travel", () => {
  for (const acid of [10, 50, 100])
    for (const c of [0.01, 0.1, 0.2])
      for (const target of [6, 6.8, 7, 7.6, 8, 9, 10]) {
        const volume = volumeForPH(acid, c, target);
        if (volume !== null) expect(ph(acid, volume, c)).toBeCloseTo(target, 6);
        else expect(acid === 100 && target > 7).toBe(true);
      }
  expect(volumeForPH(50, 0.1, 0)).toBeNull();
  expect(volumeForPH(50, 0.1, 14)).toBeNull();
});
it("the same neutral sample gives different indicator appearances", () => {
  expect(indicatorAppearance(indicators[0], 7).label).toBe("无色");
  expect(indicatorAppearance(indicators[1], 7).label).toBe("变色过渡区");
  expect(indicatorAppearance(indicators[0], 11).label).toBe("粉红");
  expect(indicatorAppearance(indicators[1], 11).label).toBe("蓝色");
});
it("target buttons prepare precise volumes, disable unreachable targets and preserve equivalence", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    prepare = vi.fn();
  const render = (acid) =>
    act(() =>
      root.render(
        <IndicatorStudy p={{ acid, base: acid, c: 0.1 }} onPrepare={prepare} />,
      ),
    );
  try {
    await render(50);
    const target = [...host.querySelectorAll("button")].find(
      (b) => b.textContent === "酚酞 pH 9.0",
    );
    await act(() => target.click());
    expect(ph(50, prepare.mock.calls[0][0].base, 0.1)).toBeCloseTo(9, 6);
    await render(100);
    expect(
      [...host.querySelectorAll("button")].find(
        (b) => b.textContent === "酚酞 pH 9.0",
      ).disabled,
    ).toBe(true);
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === "对照恰好中和 · pH 7")
        .click(),
    );
    expect(prepare).toHaveBeenLastCalledWith({ base: 100 });
  } finally {
    await act(() => root.unmount());
  }
});
