import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { it, expect } from "vitest";
import SeismicDistanceGuide, {
  seismicTriangle,
} from "../src/SeismicDistanceGuide.jsx";
it("距离三角形保持横纵比例，深浅远近的允许参数都位于图内", () => {
  for (const depth of [5, 15, 30])
    for (const distance of [10, 40, 80]) {
      const { source, station, epicenter } = seismicTriangle(depth, distance);
      expect(
        (source[1] - epicenter[1]) / (station[0] - epicenter[0]),
      ).toBeCloseTo(depth / distance);
      expect(source[1]).toBeLessThanOrEqual(161);
      expect(station[0]).toBeLessThanOrEqual(295);
      expect(source[0]).toBe(45);
      expect(station[0] - source[0]).toBeCloseTo(distance * 3.125);
    }
});
it("3-4-5比例展示震源距与精确到时差，不把震中距代入路程", () => {
  const html = renderToStaticMarkup(
    <SeismicDistanceGuide p={{ depth: 30, distance: 40 }} />,
  );
  expect(html).toContain("50.00 km");
  expect(html).toContain("5.95");
  expect(html).toContain("不能单独确定震源方位");
});
