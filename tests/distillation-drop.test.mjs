import { it, expect } from "vitest";
import { distillationDrop } from "../src/distillationDrop.mjs";
it("drop reaches the rising liquid surface without passing through it", () => {
  for (const collected of [0, 10, 30, 60]) {
    let previous = 0.96;
    for (let i = 0; i <= 80; i++) {
      const q = distillationDrop(i / 100, collected);
      expect(q.y).toBeLessThanOrEqual(previous + 1e-12);
      expect(q.y - 0.035).toBeGreaterThanOrEqual(q.surface - 1e-12);
      previous = q.y;
    }
    const impact = distillationDrop(0.8, collected);
    expect(impact.y - 0.035).toBeCloseTo(impact.surface);
    expect(impact.visible).toBe(false);
    expect(distillationDrop(0.9, collected).ripple).toBeCloseTo(0.5);
    expect(distillationDrop(1, collected).y).toBe(0.96);
  }
});
