import { expect, it } from "vitest";
import { drawProjectedArrow } from "../src/OpticalScreenSurface.js";

it("renders one continuous arrow with its intended area and no internal neck edge", () => {
  for (const height of [-128, -256, -512]) {
    const vertices = [];
    let fills = 0;
    const context = {
      beginPath() {},
      closePath() {},
      moveTo(x, y) {
        vertices.push([x, y]);
      },
      lineTo(x, y) {
        vertices.push([x, y]);
      },
      fill() {
        fills++;
      },
    };
    const shaft = 12,
      head = 48,
      fraction = 0.75;
    drawProjectedArrow(context, height, shaft, head, fraction);
    const area =
      Math.abs(
        vertices.reduce((sum, [x, y], i) => {
          const next = vertices[(i + 1) % vertices.length];
          return sum + x * next[1] - y * next[0];
        }, 0),
      ) / 2;
    expect(fills).toBe(1);
    expect(area).toBeCloseTo(
      Math.abs(height) * (shaft * fraction + (head * (1 - fraction)) / 2),
    );
    expect(Math.max(...vertices.map((v) => v[1]))).toBe(-height);
    expect(Math.min(...vertices.map((v) => v[1]))).toBe(0);
  }
});
