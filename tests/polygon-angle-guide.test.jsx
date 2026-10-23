import React from "react";
import { it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import PolygonAngleGuide, { angleArc } from "../src/PolygonAngleGuide.jsx";
it("arc endpoints and sweep flag follow signed turn rather than unsigned angle", () => {
  const positive = angleArc([0, 0], 10, 0, Math.PI / 2),
    negative = angleArc([0, 0], 10, 0, -Math.PI / 2);
  expect(positive).toContain("0 0 1");
  expect(negative).toContain("0 0 0");
  expect(positive.endsWith(",10")).toBe(true);
  expect(negative.endsWith(",-10")).toBe(true);
});
it("moving along a side has no accumulated turn arc, turning exposes one", () => {
  const props = {
    a: [0, 0],
    b: [100, 0],
    exterior: 90,
    interior: 90,
    direction: 1,
  };
  expect(
    renderToStaticMarkup(<PolygonAngleGuide {...props} turn={0} />),
  ).not.toContain("turn-sweep");
  expect(
    renderToStaticMarkup(<PolygonAngleGuide {...props} turn={0.5} />),
  ).toContain("turn-sweep");
});
