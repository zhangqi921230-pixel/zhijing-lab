// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import Laboratory from "../src/Laboratory.jsx";
import { lessons } from "../src/lessons.mjs";
vi.mock("../src/SceneLoader.jsx", () => ({
  default: () => <div>三维流域</div>,
}));
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("repeatedly redoing the actual watershed chapter leaves one paused local timeline", async () => {
  localStorage.clear();
  const host = document.createElement("div"),
    root = createRoot(host);
  try {
    await act(() =>
      root.render(
        <Laboratory
          lesson={lessons.find((l) => l.id === "water")}
          open={() => {}}
          goHome={() => {}}
        />,
      ),
    );
    const click = async (text) =>
      act(() =>
        [...host.querySelectorAll("button")]
          .find((b) => b.textContent.includes(text))
          .click(),
      );
    await click("径流输入与调蓄");
    for (let i = 0; i < 3; i++) {
      await click("历时 4 h");
      await click("重做本节");
      expect(host.querySelectorAll(".runoff-storage-study")).toHaveLength(1);
      expect(host.querySelectorAll(".water-budget-guide")).toHaveLength(1);
      expect(host.querySelector('input[aria-label="调蓄观察时刻"]').value).toBe(
        "0",
      );
      expect(
        [...host.querySelectorAll("button")]
          .find((b) => b.textContent === "历时 2 h")
          .getAttribute("aria-pressed"),
      ).toBe("true");
    }
  } finally {
    await act(() => root.unmount());
  }
});
