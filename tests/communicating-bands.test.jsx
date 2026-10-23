import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { it, expect } from "vitest";
import InsightScene from "../src/InsightScene.jsx";
// Geometry check uses actual rendered rectangle sizes, not just model conservation.
it("both highlighted displacement bands have equal geometric area", () => {
  for (const ratio of [1, 1.5, 4])
    for (const [left, right] of [
      [28, 8],
      [8, 26],
      [18, 18],
    ])
      for (const time of [0, 1, 3, 6]) {
        const html = renderToStaticMarkup(
          <InsightScene
            id="communicating"
            p={{ ratio, left, right }}
            time={time}
          />,
        );
        const rects = [...html.matchAll(/<rect\b[^>]*>/g)].map(
          ([tag]) =>
            Number(tag.match(/width="([^"]+)"/)[1]) *
            Number(tag.match(/height="([^"]+)"/)[1]),
        );
        expect(rects).toHaveLength(2);
        expect(rects[0]).toBeCloseTo(rects[1], 8);
      }
});
