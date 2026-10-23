import { it, expect } from "vitest";
import { onionTissue, onionWallControl } from "../src/onionTissue.mjs";
it("epidermal cells share edges, remain convex and contain their nuclei", () => {
  const cells = onionTissue();
  expect(onionTissue()).toEqual(cells);
  for (const cell of cells) {
    const p = cell.points;
    for (let i = 0; i < 4; i++) {
      const a = p[i],
        b = p[(i + 1) % 4],
        c = p[(i + 2) % 4],
        n = cell.nucleus;
      expect(onionWallControl(a, b)).toEqual(onionWallControl(b, a));
      expect(
        (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]),
      ).toBeGreaterThan(0);
      expect(
        (b[0] - a[0]) * (n[1] - a[1]) - (b[1] - a[1]) * (n[0] - a[0]),
      ).toBeGreaterThan(0);
    }
    if (cell.col < 17) {
      const right = cells[cell.row * 18 + cell.col + 1];
      expect(p[1]).toBe(right.points[0]);
      expect(p[2]).toBe(right.points[3]);
    }
    if (cell.row < 49) {
      const below = cells[(cell.row + 1) * 18 + cell.col];
      expect(p[3]).toBe(below.points[0]);
      expect(p[2]).toBe(below.points[1]);
    }
  }
});
