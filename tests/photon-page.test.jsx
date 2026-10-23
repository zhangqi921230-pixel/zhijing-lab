// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import ChemistryLab from "../src/ChemistryLab.jsx";
vi.mock("../src/Chemistry3D.jsx", () => ({ default: () => <div>器材</div> }));
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("the actual flame chapter owns one energy panel and redo restores its local state", async () => {
  localStorage.clear();
  const host = document.createElement("div"),
    root = createRoot(host);
  const click = async (text) =>
    act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent.includes(text))
        .click(),
    );
  try {
    await act(() =>
      root.render(
        <ChemistryLab
          lesson={{ id: "flame" }}
          open={() => {}}
          goHome={() => {}}
        />,
      ),
    );
    await click("从激发到发光");
    expect(host.querySelectorAll(".photon-emission")).toHaveLength(1);
    expect(host.querySelector(".chem-apparatus")).toBeNull();
    expect(host.querySelector("h1").textContent).toBe("从激发到发光");
    expect(host.querySelector(".chem-save-note").textContent).toContain(
      "能级练习为临时状态",
    );
    await click("450 nm");
    await click("3. 激发态");
    expect(
      Number(
        host.querySelector('[data-testid="energy-state"]').getAttribute("cy"),
      ),
    ).toBeLessThan(265);
    await click("重做本节");
    expect(host.querySelectorAll(".photon-emission")).toHaveLength(1);
    expect(host.querySelector(".photon-wavelength input").value).toBe("589");
    expect(
      host.querySelector('[data-testid="energy-state"]').getAttribute("cy"),
    ).toBe("265");
    await click("认识特征焰色");
    expect(host.querySelector(".photon-emission")).toBeNull();
    expect(host.querySelector(".chem-apparatus")).not.toBeNull();
  } finally {
    await act(() => root.unmount());
  }
});
