import { it, expect } from "vitest";
import {
  sodiumProfile,
  sodiumResponse,
  SODIUM_LINES,
} from "../src/sodiumProfile.mjs";
it("normalizes to the refined maximum across the entire supported width range", () => {
  for (let k = 8; k <= 120; k++) {
    const width = k / 100,
      { peak, peakWavelength, points } = sodiumProfile(width);
    expect(sodiumResponse(peakWavelength, width) / peak).toBe(1);
    expect(Math.max(...points.map((p) => p.value)) / peak).toBe(1);
    for (let i = 0; i <= 2600; i++)
      expect(sodiumResponse(588 + i * 0.001, width) / peak).toBeLessThanOrEqual(
        1 + 1e-12,
      );
    for (const line of SODIUM_LINES)
      expect(sodiumResponse(line, width) / peak).toBeLessThanOrEqual(1 + 1e-12);
  }
});
