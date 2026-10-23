// @vitest-environment jsdom
import React, { act, useState } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { it, expect } from "vitest";
import DisplacementElectrons from "../src/DisplacementElectrons.jsx";
import { chemistryTopics, displacementState } from "../src/chemistryTopics.mjs";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("electron accounting uses twice the actual reaction extent and copper has no net transfer", () => {
  for (const metal of ["iron", "zinc", "copper"])
    for (const mass of [0.1, 0.56, 1])
      for (const time of [0, 30, 60]) {
        const q = displacementState(metal, mass, time / 60);
        const html = renderToStaticMarkup(
          <DisplacementElectrons
            p={{ metal, mass }}
            time={time}
            onSeek={() => {}}
          />,
        );
        expect(html).toContain((q.extent * 2000).toFixed(3));
        expect(html).not.toMatch(/NaN|Infinity/);
        if (metal === "copper") {
          expect(html).toContain("没有净电子转移");
          expect(html).not.toContain("失电子、氧化");
        }
      }
  expect(
    chemistryTopics.find((x) => x.id === "displacement").chapters[5].title,
  ).toBe("铜离子怎样变成铜");
});
it("three stage controls update the selected accounting state and can return to reactants", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  function Harness() {
    const [time, setTime] = useState(0);
    return (
      <DisplacementElectrons
        p={{ metal: "iron", mass: 0.56 }}
        time={time}
        onSeek={setTime}
      />
    );
  }
  await act(() => root.render(<Harness />));
  const click = async (label) =>
    act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === label)
        .click(),
    );
  try {
    await click("看电子记账");
    expect(
      host.querySelector('[aria-label="两个电子用于记账"]'),
    ).not.toBeNull();
    expect(host.textContent).toContain("2×(−1)");
    await click("看反应后");
    expect(host.querySelector('[aria-label="两个电子用于记账"]')).toBeNull();
    expect(host.textContent).toContain("析出的铜原子");
    await click("看反应前");
    expect(host.querySelector("svg").textContent).toContain("0 + (+2) = +2");
  } finally {
    await act(() => root.unmount());
  }
});
