import React from "react";
import { it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import VividScene from "../src/VividScene.jsx";
it("extreme cooling keeps all rendered dimensions positive and contact is explicit", () => {
  const cold = renderToStaticMarkup(
    <VividScene
      id="thermal-length"
      p={{ length: 5, delta: -30, gap: 12 }}
      time={6}
    />,
  );
  expect(cold).not.toMatch(/width="-/);
  expect(cold).not.toMatch(/NaN|undefined/);
  const hot = renderToStaticMarkup(
    <VividScene
      id="thermal-length"
      p={{ length: 5, delta: 80, gap: 2 }}
      time={6}
    />,
  );
  expect(hot.match(/已抵接/g)).toHaveLength(3);
});
it("each polygon chapter changes its rendered state and guide toggle removes angle annotations", () => {
  const p = { sides: 5, direction: 1 };
  const a = renderToStaticMarkup(
      <VividScene id="polygon-turn" p={p} time={0} />,
    ),
    b = renderToStaticMarkup(
      <VividScene id="polygon-turn" p={p} time={6} guides={false} />,
    );
  expect(a).not.toEqual(b);
  expect(b).toContain("360°");
  expect(b).not.toContain("内角");
});
