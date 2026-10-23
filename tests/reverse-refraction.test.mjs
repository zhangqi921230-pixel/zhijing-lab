import { it, expect } from "vitest";
import { reverseRefraction } from "../src/reverseRefraction.mjs";
import { refraction } from "../src/models.mjs";
it("reverses both media and ray angle without rounding, and two reversals recover initial ray", () => {
  for (const [n1, n2] of [
    [1, 1.5],
    [1.5, 1],
    [1.33, 1.5],
    [1.5, 1.5],
  ])
    for (const angle of [0, 10, 30]) {
      const p = { angle, n1, n2 },
        next = reverseRefraction(p),
        back = reverseRefraction(next);
      expect(next.n1).toBe(n2);
      expect(next.n2).toBe(n1);
      expect(next.angle).toBe(refraction(angle, n1, n2).angle);
      expect(back.angle).toBeCloseTo(angle, 10);
      expect(back.n1).toBe(n1);
      expect(back.n2).toBe(n2);
    }
});
it("does not turn TIR or out-of-range grazing rays into fabricated reverse paths", () => {
  expect(reverseRefraction({ angle: 50, n1: 1.5, n2: 1 })).toBeNull();
  expect(
    reverseRefraction({
      angle: (Math.asin(1 / 1.5) * 180) / Math.PI,
      n1: 1.5,
      n2: 1,
    }),
  ).toBeNull();
});
