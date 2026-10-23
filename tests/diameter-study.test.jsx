import { expect, it } from "vitest";
import { diameterEvidence } from "../src/DiameterStudy.jsx";
it("diameter preserves right angle and squared lengths through moving positions", () => {
  for (const position of [10, 25, 50, 75, 90])
    for (const time of [0, 1, 2, 3, 4, 5, 6]) {
      const q = diameterEvidence({ central: 180, position }, time);
      expect(q.angle).toBeCloseTo(90);
      expect(q.ap2 + q.bp2).toBeCloseTo(q.ab2);
      expect(q.ab2).toBeCloseTo(4);
    }
});
it("ordinary chord counterexample does not suggest Pythagoras applies", () => {
  const q = diameterEvidence({ central: 120, position: 50 }, 0);
  expect(q.angle).toBeCloseTo(60);
  expect(q.ap2 + q.bp2).toBeCloseTo(6);
  expect(q.ab2).toBeCloseTo(3);
});
