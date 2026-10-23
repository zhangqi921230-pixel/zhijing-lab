// @vitest-environment jsdom
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { it, expect } from "vitest";
import ScienceGallery from "../src/science/ScienceGallery.jsx";
it("gallery cards remain navigation-only and machinery comes before weather without changing topic identity", () => {
  const html = renderToStaticMarkup(
    <ScienceGallery route="science" open={() => {}} />,
  );
  const dom = document.createElement("div");
  dom.innerHTML = html;
  expect(dom.querySelector(".science-feature-media img")).not.toBeNull();
  expect(dom.querySelector(".science-feature-media svg")).toBeNull();
  expect(dom.querySelector(".science-card h3").textContent).toContain("卷尺");
  expect(dom.querySelectorAll(".science-category")).toHaveLength(12);
  expect(html).not.toContain("science-hotspot");
  expect(html).not.toContain("science-atlas-note");
  expect(dom.querySelectorAll(".science-featured-media")).toHaveLength(3);
  const weather = document.createElement("div");
  weather.innerHTML = renderToStaticMarkup(
    <ScienceGallery route="science?category=weather" open={() => {}} />,
  );
  expect(weather.querySelectorAll(".science-card")).toHaveLength(10);
  expect(weather.querySelector(".science-card h3").textContent).toContain(
    "天空",
  );
});
