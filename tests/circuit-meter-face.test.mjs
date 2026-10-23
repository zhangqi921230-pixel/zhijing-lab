import { it, expect } from "vitest";
import { circuitMeterFace } from "../src/CircuitBench.js";

it("keeps unit, range and calibrated divisions visible when digital answers are hidden", () => {
  for (const [unit, range, step] of [
    ["A", 3, "0.1"],
    ["V", 15, "0.5"],
  ]) {
    const texts = [],
      ticks = [];
    const context = new Proxy(
      {
        fillText(text, x, y) {
          texts.push({ text, x, y });
        },
        moveTo(x, y) {
          ticks.push([x, y]);
        },
      },
      { get: (o, key) => o[key] ?? (() => {}) },
    );
    circuitMeterFace(context, "测试仪表", range / 2, unit, range, false);
    expect(texts.some((t) => t.text === "— — —")).toBe(true);
    expect(texts.some((t) => t.text === unit)).toBe(true);
    expect(texts.some((t) => t.text === `0–${range} ${unit}`)).toBe(true);
    expect(texts.some((t) => t.text === `每小格 ${step} ${unit}`)).toBe(true);
    expect(ticks).toHaveLength(31);
    for (let i = 0; i <= 30; i += 5) {
      const label = texts.find((t) => t.text === ((i * range) / 30).toFixed(1));
      const angle = Math.atan2(label.y - 255, label.x - 384);
      const tickAngle = Math.atan2(ticks[i][1] - 255, ticks[i][0] - 384);
      expect(angle).toBeCloseTo(tickAngle, 9);
    }
  }
});
