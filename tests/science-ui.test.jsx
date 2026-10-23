// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import RocketAtlas from "../src/science/RocketAtlas.jsx";
import { dropletRay } from "../src/science/WeatherScene.jsx";
import MechanismScene from "../src/science/MechanismScene.jsx";
import { orbitPath, illuminatedFraction } from "../src/science/spaceModels.mjs";
import { renderToStaticMarkup } from "react-dom/server";
import {
  AnimalDiagram,
  polygonPerimeter,
  echoMilliseconds,
} from "../src/science/AnimalScene.jsx";
import { BodyDiagram } from "../src/science/BodyScene.jsx";
import { PlantDiagram } from "../src/science/PlantScene.jsx";
import {
  TransportDiagram,
  escalatorPosition,
} from "../src/science/TransportScene.jsx";
import { scienceTopics } from "../src/science/catalog.mjs";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("new biological diagrams remain finite at control endpoints and intermediate states", () => {
  const components = {
    animals: AnimalDiagram,
    body: BodyDiagram,
    plants: PlantDiagram,
  };
  for (const topic of scienceTopics.filter((t) => components[t.category])) {
    if (
      ["spring-flowers", "roses", "yellow-flowers", "conifers"].includes(
        topic.id,
      )
    )
      continue;
    const Diagram = components[topic.category];
    for (const value of [0, 50, 100])
      for (const variant of [0, 1]) {
        const html = renderToStaticMarkup(
          <Diagram id={topic.id} value={value} variant={variant} />,
        );
        expect(html).not.toMatch(/NaN|Infinity|undefined/);
        expect(html).toContain("<svg");
      }
  }
});
it("echo time includes the return trip and equal-area polygons have the expected boundary ordering", () => {
  expect(echoMilliseconds(3.43)).toBeCloseTo(20, 8);
  expect(echoMilliseconds(6.86)).toBeCloseTo(40, 8);
  expect(polygonPerimeter(4)).toBeCloseTo(4, 8);
  expect(polygonPerimeter(6)).toBeLessThan(polygonPerimeter(4));
  expect(polygonPerimeter(4)).toBeLessThan(polygonPerimeter(3));
});
it("the atlas offers buttons for every hotspot and keeps the explanation aligned", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  try {
    await act(() => root.render(<RocketAtlas />));
    const button = [...host.querySelectorAll("button")].find(
      (x) => x.textContent === "3 · 一级氧化剂贮箱",
    );
    await act(() => button.click());
    expect(host.querySelector("[role=status]").textContent).toContain(
      "不依赖从外界空气中取氧",
    );
    expect(
      host
        .querySelector('[aria-label="查看一级氧化剂贮箱"]')
        .getAttribute("aria-pressed"),
    ).toBe("true");
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((x) => x.textContent === "隐藏图中标注")
        .click(),
    );
    expect(host.querySelectorAll(".science-hotspot")).toHaveLength(0);
    expect(host.querySelector("[role=status]").textContent).toContain("氧化剂");
  } finally {
    await act(() => root.unmount());
  }
});
it("one-reflection droplet rays stay on the sphere and exit near the primary rainbow angle", () => {
  const r = dropletRay(0.86, 1.333);
  for (const p of [r.p, r.q, r.end]) expect(Math.hypot(...p)).toBeCloseTo(1, 8);
  expect(Math.hypot(...r.out)).toBeCloseTo(1, 8);
  const a = (Math.atan2(Math.abs(r.out[1]), -r.out[0]) * 180) / Math.PI;
  expect(a).toBeGreaterThan(39);
  expect(a).toBeLessThan(43);
});
it("locks the tape at its current extension and only permits retraction after release", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  const click = async (name) =>
    act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === name)
        .click(),
    );
  try {
    await act(() =>
      root.render(
        <MechanismScene
          topic={{ id: "tape-measure" }}
          scene={{ control: "尺带拉出程度", states: ["收卷", "储能"] }}
        />,
      ),
    );
    const range = host.querySelector("input");
    expect(range.value).toBe("20");
    await click("锁住尺带");
    expect(range.disabled).toBe(true);
    expect(
      [...host.querySelectorAll("button")].find(
        (b) => b.textContent === "回收一段",
      ).disabled,
    ).toBe(true);
    await click("解除锁止");
    await click("回收一段");
    expect(range.value).toBe("0");
  } finally {
    await act(() => root.unmount());
  }
});
it("distinguishes collision, circular orbit and escape without changing the gravity law", () => {
  const circular = orbitPath(1);
  expect(circular.ending).toBe("bounded");
  for (const [x, y] of circular.points)
    expect(Math.hypot(x, y)).toBeCloseTo(1.7, 3);
  expect(orbitPath(0.65).ending).toBe("surface");
  expect(orbitPath(1.6).ending).toBe("outside");
  expect(illuminatedFraction(0)).toBeCloseTo(0);
  expect(illuminatedFraction(Math.PI / 2)).toBeCloseTo(0.5);
  expect(illuminatedFraction(Math.PI)).toBeCloseTo(1);
});

import { qrExperiment } from "../src/science/QrScene.jsx";
import { filmIntensity } from "../src/science/SignalsScene.jsx";
it("decodes actual generated QR pixels and reports failure for destructive finder damage", () => {
  expect(qrExperiment("ZHIJING SCIENCE", 0).text).toBe("ZHIJING SCIENCE");
  expect(qrExperiment("LOOK CLOSELY", 0).text).toBe("LOOK CLOSELY");
  expect(qrExperiment("ZHIJING SCIENCE", 18, true).text).toBeNull();
});
it("the two-ray film model has destructive reflection at zero thickness and a quarter-wave maximum", () => {
  expect(filmIntensity(0, 550)).toBe(0);
  expect(filmIntensity(550 / (4 * 1.33), 550)).toBeCloseTo(1, 10);
});
