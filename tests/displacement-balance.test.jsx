import { it, expect } from "vitest";
import { displacementBalance } from "../src/DisplacementBalance.jsx";
it("tracks both elements and total solid mass through reaction including limiting reagents", () => {
  for (const metal of ["iron", "zinc", "copper"])
    for (const mass of [0.1, 0.56, 0.84, 1])
      for (const progress of [0, 0.25, 0.5, 1]) {
        const q = displacementBalance(metal, mass, progress);
        expect(q.remaining + q.extent).toBeCloseTo(0.01, 12);
        expect(q.remainingMetal + q.extent).toBeCloseTo(q.initialMetal, 12);
        expect(q.solidMass + q.dissolvedMass - q.copper).toBeCloseTo(mass, 12);
        expect(q.remainingMetal).toBeGreaterThanOrEqual(-1e-12);
        if (metal === "copper") expect(q.solidMass).toBe(mass);
      }
  expect(displacementBalance("iron", 0.84, 1).solidMass).toBeGreaterThan(0.84);
  expect(displacementBalance("zinc", 0.84, 1).solidMass).toBeLessThan(0.84);
});
