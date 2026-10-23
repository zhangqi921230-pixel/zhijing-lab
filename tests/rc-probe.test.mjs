import { expect, it } from "vitest";
import { rcProbeTime } from "../src/rcProbe.mjs";
it("maps the plot axis through centered SVG scaling and clamps to five time constants", () => {
  for (const [width, height] of [
    [440, 225],
    [880, 225],
    [220, 450],
  ]) {
    const bounds = { left: 15, width, height },
      scale = Math.min(width / 440, height / 225);
    const left = 15 + (width - 440 * scale) / 2;
    for (const tau of [0.1, 2, 20]) {
      expect(rcProbeTime(left + 46 * scale, bounds, tau)).toBeCloseTo(0);
      expect(rcProbeTime(left + 118 * scale, bounds, tau)).toBeCloseTo(tau);
      expect(rcProbeTime(left + 406 * scale, bounds, tau)).toBeCloseTo(5 * tau);
      expect(rcProbeTime(left - 100, bounds, tau)).toBe(0);
      expect(rcProbeTime(left + 1000, bounds, tau)).toBe(5 * tau);
    }
  }
  expect(rcProbeTime(0, { left: 0, width: 0, height: 0 }, 2)).toBe(null);
});
