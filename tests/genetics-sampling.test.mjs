import { it, expect } from "vitest";
import { drawOffspring, summarizeOffspring } from "../src/geneticsSampling.mjs";
import { genetics } from "../src/models.mjs";
it("every parental cross enumerates its four equally likely gamete combinations", () => {
  for (let a = 0; a < 3; a++)
    for (let b = 0; b < 3; b++) {
      const samples = [];
      for (const first of [0.25, 0.75])
        for (const second of [0.25, 0.75]) {
          const draws = [first, second];
          samples.push(drawOffspring(a, b, () => draws.shift()));
        }
      const counts = summarizeOffspring(samples),
        theoretical = genetics(a, b);
      for (const key of ["AA", "Aa", "aa"])
        expect(counts[key] / 4).toBe(theoretical[key]);
    }
});
it("independent samples permit runs that differ from the 1:2:1 expectation", () => {
  expect(
    summarizeOffspring(
      Array.from({ length: 20 }, () => drawOffspring(1, 1, () => 0.1)),
    ),
  ).toEqual({ AA: 20, Aa: 0, aa: 0 });
});
