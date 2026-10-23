// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { expect, it, vi } from "vitest";
vi.mock("../src/Laboratory.jsx", () => {
  throw new Error("Simulated unavailable chunk");
});
import LaboratoryLoader, { loadLaboratory } from "../src/LaboratoryLoader.jsx";

it("加载失败后提供恢复和返回入口，不改写实验记录", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const host = document.createElement("div"),
    root = createRoot(host),
    goHome = vi.fn();
  localStorage.setItem("lab-test-evidence", "keep");
  try {
    await act(() =>
      root.render(
        <LaboratoryLoader
          lesson={{ id: "cell", title: "植物细胞" }}
          goHome={goHome}
        />,
      ),
    );
    await act(async () => {
      await loadLaboratory().catch(() => {});
    });
    expect(host.querySelector('[role="alert"]').textContent).toContain(
      "暂时无法加载",
    );
    const buttons = [...host.querySelectorAll("button")];
    expect(buttons.some((b) => b.textContent === "重新加载页面")).toBe(true);
    await act(() =>
      buttons.find((b) => b.textContent === "返回探索馆").click(),
    );
    expect(goHome).toHaveBeenCalledOnce();
    expect(localStorage.getItem("lab-test-evidence")).toBe("keep");
  } finally {
    await act(() => root.unmount());
    localStorage.removeItem("lab-test-evidence");
  }
});
