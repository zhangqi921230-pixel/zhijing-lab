import { it, expect } from "vitest";
import { contourLabelAnchors } from "../src/contourLabels.mjs";
import { terrainHeightAt } from "../src/models.mjs";
it("map elevation labels sit on their own contours and remain separated", () => {
  for (const interval of [50, 100, 200]) {
    const labels = contourLabelAnchors(interval);
    expect(labels.length).toBeGreaterThanOrEqual(2);
    for (let i = 0; i < labels.length; i++) {
      const p = labels[i];
      expect(terrainHeightAt(p.x, p.z)).toBeCloseTo(p.level, 6);
      expect(p.level % (interval * 5)).toBe(0);
      for (const q of labels.slice(i + 1))
        expect(Math.hypot(p.x - q.x, p.z - q.z)).toBeGreaterThan(1.05);
    }
  }
});
