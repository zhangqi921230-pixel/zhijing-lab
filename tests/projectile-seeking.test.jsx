// @vitest-environment jsdom
import React, { act, useState } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import ProjectileComparison from "../src/ProjectileComparison.jsx";
import ProjectileScene from "../src/ProjectileScene.jsx";
import { projectile } from "../src/models.mjs";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("basic scene uses fixed gravity and seeks actual apex and landing seconds", async () => {
  const p = { speed: 15, angle: 30, height: 5 },
    host = document.createElement("div"),
    root = createRoot(host);
  let observed;
  function Harness() {
    const [t, setT] = useState(0);
    observed = t;
    return <ProjectileScene p={p} t={t} onChange={() => {}} onSeek={setT} />;
  }
  try {
    await act(() => root.render(<Harness />));
    expect(host.textContent).not.toContain("NaN");
    const rows = host.querySelectorAll(".projectile-comparison tbody tr");
    expect(rows[0].querySelector("td").textContent).toBe(
      projectile(p, 0).range.toFixed(2),
    );
    const button = (name) =>
      [...host.querySelectorAll("button")].find((b) => b.textContent === name);
    await act(() => button("定位当前最高点").click());
    expect(observed).toBeCloseTo((15 * 0.5) / 9.8, 12);
    expect(host.querySelector(".projectile-guide h3").textContent).toBe(
      "到达最高点",
    );
    await act(() => button("定位落地点").click());
    expect(observed).toBeCloseTo(projectile(p, 0).flight, 12);
    expect(host.querySelector(".projectile-guide h3").textContent).toBe(
      "到达地面",
    );
  } finally {
    await act(() => root.unmount());
  }
});
it("zero-duration horizontal launch has finite comparison and seeks zero", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  let time = -1;
  try {
    await act(() =>
      root.render(
        <ProjectileScene
          p={{ speed: 15, angle: 0, height: 0 }}
          t={0}
          onChange={() => {}}
          onSeek={(t) => (time = t)}
        />,
      ),
    );
    expect(host.textContent).not.toContain("NaN");
    for (const label of ["定位当前最高点", "定位落地点"]) {
      await act(() =>
        [...host.querySelectorAll("button")]
          .find((b) => b.textContent === label)
          .click(),
      );
      expect(time).toBe(0);
    }
  } finally {
    await act(() => root.unmount());
  }
});

it("saved trajectory preserves its original speed and height after current conditions change", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  const a = { speed: 10, angle: 45, height: 0, gravity: 9.8 },
    b = { ...a, speed: 20 };
  try {
    await act(() =>
      root.render(<ProjectileComparison p={a} onSeek={() => {}} />),
    );
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === "保留当前轨迹作对照")
        .click(),
    );
    await act(() =>
      root.render(<ProjectileComparison p={b} onSeek={() => {}} />),
    );
    const cells = host.querySelectorAll("tbody tr:first-child td");
    expect(Number(cells[0].textContent)).toBeCloseTo(400 / 9.8, 2);
    expect(Number(cells[1].textContent)).toBeCloseTo(100 / 9.8, 2);
    expect(
      host.querySelector("[data-reference-trajectory]").getAttribute("d"),
    ).not.toEqual(
      host.querySelector("[data-current-trajectory]").getAttribute("d"),
    );
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === "恢复互余角对照")
        .click(),
    );
    expect(
      host.querySelector("[data-reference-trajectory]").getAttribute("d"),
    ).toBe(host.querySelector("[data-current-trajectory]").getAttribute("d"));
  } finally {
    await act(() => root.unmount());
  }
});

it("comparison markers use equal real time and freeze an earlier landing", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  const a = { speed: 10, angle: 45, height: 0, gravity: 9.8 },
    b = { ...a, speed: 20 };
  try {
    await act(() =>
      root.render(
        <ProjectileComparison p={a} currentTime={0} onSeek={() => {}} />,
      ),
    );
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === "保留当前轨迹作对照")
        .click(),
    );
    await act(() =>
      root.render(
        <ProjectileComparison p={b} currentTime={1.5} onSeek={() => {}} />,
      ),
    );
    const panel = host.querySelector(".projectile-time-comparison");
    expect(panel.textContent).toContain("当前 · 空中运动");
    expect(panel.textContent).toContain("参考 · 已到达地面");
    expect(panel.textContent).toContain("x=10.20 m · y=0.00 m");
    expect(
      host.querySelector("[data-reference-position]").getAttribute("cy"),
    ).toBe("255");
    expect(
      Number(host.querySelector("[data-current-position]").getAttribute("cy")),
    ).toBeLessThan(255);
    const refX = host
      .querySelector("[data-reference-position]")
      .getAttribute("cx");
    await act(() =>
      root.render(
        <ProjectileComparison p={b} currentTime={2} onSeek={() => {}} />,
      ),
    );
    expect(
      host.querySelector("[data-reference-position]").getAttribute("cx"),
    ).toBe(refX);
  } finally {
    await act(() => root.unmount());
  }
});
