// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import ChemistryLab from "../src/ChemistryLab.jsx";
import { chemistryTopics } from "../src/chemistryTopics.mjs";
vi.mock("../src/Chemistry3D.jsx", () => ({
  default: () => <div>三维器材</div>,
}));
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("reaction observation stages preserve the selected sample and pause at exact progress", async () => {
  localStorage.clear();
  const host = document.createElement("div"),
    root = createRoot(host);
  try {
    await act(() =>
      root.render(
        <ChemistryLab
          lesson={chemistryTopics.find((t) => t.id === "displacement")}
          open={() => {}}
          goHome={() => {}}
        />,
      ),
    );
    const before = [
      ...host.querySelectorAll(
        ".chem-notes input,.chem-notes button[aria-pressed=true]",
      ),
    ].map((e) => e.value || e.textContent);
    for (const [i, t] of [0, 30, 60].entries()) {
      await act(() =>
        host
          .querySelectorAll('[aria-label="置换反应观察阶段"] button')
          [i].click(),
      );
      expect(host.querySelector(".chem-playbar input").value).toBe(String(t));
      expect(
        [
          ...host.querySelectorAll(
            ".chem-notes input,.chem-notes button[aria-pressed=true]",
          ),
        ].map((e) => e.value || e.textContent),
      ).toEqual(before);
      expect(host.querySelector(".chem-primary").textContent).toBe("开始演示");
    }
  } finally {
    await act(() => root.unmount());
    localStorage.clear();
  }
});
