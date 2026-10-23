import { it, expect } from "vitest";
import { conicPointerProbe } from "../src/conicPointer.mjs";
it("maps pointer positions with SVG letterboxing and chooses an actual sampled point", () => {
  const points = [
    [30, 145],
    [180, 40],
    [330, 145],
  ];
  for (const [width, height] of [
    [360, 290],
    [720, 290],
    [360, 580],
  ]) {
    const bounds = { left: 20, top: 30, width, height },
      s = Math.min(width / 360, height / 290);
    points.forEach(([x, y], i) => {
      expect(
        conicPointerProbe(
          20 + (width - 360 * s) / 2 + x * s,
          30 + (height - 290 * s) / 2 + y * s,
          bounds,
          points,
        ),
      ).toBe(i * 50);
    });
  }
  expect(
    conicPointerProbe(0, 0, { left: 0, top: 0, width: 0, height: 0 }, points),
  ).toBeNull();
  expect(
    conicPointerProbe(0, 0, { left: 0, top: 0, width: 360, height: 290 }, []),
  ).toBeNull();
});
