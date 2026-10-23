import { it, expect } from "vitest";
import { placeConicLabels } from "../src/conicLabelLayout.mjs";
it("keeps angle values and point labels separated within a narrow viewport", () => {
  const placed = placeConicLabels(
    [72, 72, 36, 36, 36].map((width) => ({ x: 310, y: 120, width })),
    330,
    250,
  );
  for (let i = 0; i < placed.length; i++) {
    const p = placed[i];
    expect(p.x - p.width / 2).toBeGreaterThanOrEqual(4);
    expect(p.x + p.width / 2).toBeLessThanOrEqual(326);
    for (const q of placed.slice(i + 1)) {
      expect(
        Math.abs(p.x - q.x) >= (p.width + q.width) / 2 + 4 ||
          Math.abs(p.y - q.y) >= 28,
      ).toBe(true);
    }
  }
});
it("separates clustered labels on narrow canvases without moving their source data", () => {
  const points = Array.from({ length: 5 }, (_, i) => ({
    x: 180 + i,
    y: 110 + i,
    id: i,
  }));
  const before = JSON.stringify(points),
    placed = placeConicLabels(points, 330, 250);
  expect(JSON.stringify(points)).toBe(before);
  expect(placeConicLabels(points, 330, 250)).toEqual(placed);
  for (let i = 0; i < placed.length; i++) {
    const p = placed[i];
    expect(p.x).toBeGreaterThanOrEqual(22);
    expect(p.x).toBeLessThanOrEqual(308);
    expect(p.y).toBeGreaterThanOrEqual(16);
    expect(p.y).toBeLessThanOrEqual(234);
    for (const q of placed.slice(i + 1))
      expect(Math.abs(p.x - q.x) >= 40 || Math.abs(p.y - q.y) >= 28).toBe(true);
  }
});
it("clamps labels at canvas edges", () => {
  for (const p of placeConicLabels(
    [
      { x: -20, y: -30 },
      { x: 380, y: 260 },
    ],
    330,
    250,
  )) {
    expect(p.x).toBeGreaterThanOrEqual(22);
    expect(p.x).toBeLessThanOrEqual(308);
    expect(p.y).toBeGreaterThanOrEqual(16);
    expect(p.y).toBeLessThanOrEqual(234);
  }
});
