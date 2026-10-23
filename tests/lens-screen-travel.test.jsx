import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { it, expect } from "vitest";
import { LensGuide } from "../src/LensGuide.jsx";
import { lessons, defaults } from "../src/lessons.mjs";

it("distinguishes unreachable real images from defocus, infinity and virtual images", () => {
  const lesson = lessons.find((l) => l.id === "lens");
  const screenControl = lesson.params.find((p) => p.key === "screen");
  const render = (u, f = 10) =>
    renderToStaticMarkup(
      <LensGuide
        chapter={3}
        p={{ ...defaults(lesson), u, f, screen: 80 }}
        screenControl={screenControl}
        onSelect={() => {}}
        onPrepare={() => {}}
      />,
    );
  expect(render(11)).toContain("计算像距为 110.00 cm");
  expect(render(11)).toContain("像平面超出光屏行程");
  expect(render(11)).toContain("5–80 cm");
  expect(render(80 / 7)).not.toContain("实像存在，光屏暂时无法到达");
  expect(render(20)).toContain("移动光屏寻找像");
  expect(render(10)).toContain("无有限成像位置");
  expect(render(6)).toContain("虚像不能承接");
  expect(render(10)).not.toContain("实像存在，光屏暂时无法到达");
  expect(render(6)).not.toContain("实像存在，光屏暂时无法到达");
});
