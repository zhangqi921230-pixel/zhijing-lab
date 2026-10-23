import { it, expect } from "vitest";
import {
  probeRailPosition,
  probeRailValue,
  probeExtent,
} from "../src/functionProbeRail.mjs";
it("parameter rail remains inside the viewport and maps its entire range independently of graph zoom", () => {
  for (const width of [240, 420, 880]) {
    const left = 310 - width / 2 + 25,
      right = 310 + width / 2 - 25;
    for (const value of [-5, -3, 0, 2.4, 5]) {
      const position = probeRailPosition(value, left, right);
      expect(position).toBeGreaterThanOrEqual(left);
      expect(position).toBeLessThanOrEqual(right);
      expect(probeRailValue(position, left, right)).toBeCloseTo(value);
      const extent = probeExtent(value, 0.5, width);
      expect((Math.abs(value) * 230) / extent).toBeLessThan(width / 2 - 25);
      expect(extent).toBeGreaterThan(0.5);
    }
    expect(probeRailValue(left - 100, left, right)).toBe(-5);
    expect(probeRailValue(right + 100, left, right)).toBe(5);
    expect(probeExtent(1, 30, width)).toBeGreaterThan(30);
  }
});
