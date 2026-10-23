// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import PrecipitationIons, {
  precipitationInventory,
} from "../src/PrecipitationIons.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("conserves copper, hydroxide and solution charge throughout addition", () => {
  for (const copper of [10, 50, 100])
    for (const base of [0, 25, 50, 75, 100])
      for (const t of [0, 0.5, 1, 4, 8, 20]) {
        const q = precipitationInventory({ copper, base }, t);
        expect(q.cu + q.solid).toBeCloseTo(copper * 0.1, 10);
        expect(q.oh + 2 * q.solid).toBeCloseTo(q.delivered * 0.2, 10);
        expect(q.positive).toBeCloseTo(q.negative, 10);
        expect(q.sulfate).toBe(copper * 0.1);
      }
});
it("settling leaves the inventory unchanged; excess alkali leaves spectator ions", () => {
  const p = { copper: 50, base: 75 };
  expect(precipitationInventory(p, 8)).toEqual(precipitationInventory(p, 20));
  const q = precipitationInventory(p, 20);
  expect(q).toMatchObject({ cu: 0, oh: 5, sodium: 15, sulfate: 5, solid: 5 });
});
it("readouts update from undosed to equivalence and show the approximation", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    p = { copper: 50, base: 50 };
  try {
    await act(() => root.render(<PrecipitationIons p={p} t={0} />));
    expect(host.querySelector('[aria-label="铜离子物质的量"]')).toBeNull();
    expect(
      host.querySelector('[aria-label="剩余铜离子物质的量"]').textContent,
    ).toBe("5.00 mmol");
    await act(() => root.render(<PrecipitationIons p={p} t={20} />));
    expect(
      host.querySelector('[aria-label="剩余铜离子物质的量"]').textContent,
    ).toBe("0.00 mmol");
    expect(
      host.querySelector('[aria-label="钠离子物质的量"]').textContent,
    ).toBe("10.00 mmol");
    expect(host.textContent).toContain("水的自解离");
  } finally {
    await act(() => root.unmount());
  }
});
