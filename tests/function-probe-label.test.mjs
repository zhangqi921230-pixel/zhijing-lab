import { expect, it } from "vitest";
import {
  functionProbeLabel,
  segmentCrossesLabel,
} from "../src/functionProbeLabel.mjs";
const bounds = { left: 80, right: 540, top: 64, bottom: 516 };
it("keeps labels inside all four plot corners at different display scales", () => {
  for (const scale of [0.7, 1, 1.8])
    for (const point of [
      [80, 64],
      [540, 64],
      [80, 516],
      [540, 516],
    ]) {
      const box = functionProbeLabel(point, "P (−4.9, −5.999)", bounds, scale);
      expect(box.x).toBeGreaterThanOrEqual(bounds.left);
      expect(box.x + box.width).toBeLessThanOrEqual(bounds.right);
      expect(box.y).toBeGreaterThanOrEqual(bounds.top);
      expect(box.y + box.height).toBeLessThanOrEqual(bounds.bottom);
    }
});
it("avoids a descending curve and a reserved feature label when free space is available", () => {
  const curve = [
    [340, 325],
    [355, 347],
    [370, 380],
    [380, 420],
  ];
  const box = functionProbeLabel([340, 325], "P (0.9, −0.909)", bounds, 1, [
    curve,
  ]);
  for (let i = 1; i < curve.length; i++)
    expect(segmentCrossesLabel(curve[i - 1], curve[i], box)).toBe(false);
  const second = functionProbeLabel(
    [340, 325],
    "(1, 1)",
    bounds,
    1,
    [curve],
    [box],
  );
  expect(
    second.x >= box.x + box.width ||
      second.x + second.width <= box.x ||
      second.y >= box.y + box.height ||
      second.y + second.height <= box.y,
  ).toBe(true);
});
it("checks actual segment intersections instead of just endpoints", () => {
  const box = { x: 10, y: 10, width: 10, height: 10 };
  expect(segmentCrossesLabel([0, 15], [30, 15], box)).toBe(true);
  expect(segmentCrossesLabel([0, 5], [30, 5], box)).toBe(false);
  expect(segmentCrossesLabel([15, 0], [15, 30], box)).toBe(true);
});
it("places below near the horizontal-axis tick band and to the left at the right edge", () => {
  const nearAxis = functionProbeLabel([344, 325], "P (0.9, −0.909)", bounds);
  expect(nearAxis.y).toBeGreaterThan(325);
  const edge = functionProbeLabel([535, 160], "P (5, 3)", bounds);
  expect(edge.x + edge.width).toBeLessThan(535);
});
