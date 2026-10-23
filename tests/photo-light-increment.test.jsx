import { it, expect } from "vitest";
import { photoLightIntervals } from "../src/PhotoLightIncrement.jsx";
it("equal light increments show diminishing gains at fixed conditions", () => {
  for (const temp of [5, 25, 45])
    for (const co2 of [10, 70, 100]) {
      const [low, high] = photoLightIntervals({ co2, temp, light: 50 });
      expect(low.end - low.start).toBe(high.end - high.start);
      expect(low.to - low.from).toBeGreaterThan(high.to - high.from);
      expect(high.to - high.from).toBeGreaterThan(0);
    }
  expect(
    photoLightIntervals({ co2: 0, temp: 25, light: 50 }).every(
      (r) => r.from === 0 && r.to === 0,
    ),
  ).toBe(true);
});
