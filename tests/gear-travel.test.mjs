import { it, expect } from "vitest";
import { gearTravel } from "../src/gearTravel.mjs";
it("both gears pass equal pitch distances even when turns differ", () => {
  for (const driver of [12, 18, 36])
    for (const driven of [12, 30, 36])
      for (const rpm of [5, 10, 20])
        for (const time of [0, 0.13, 3, 6]) {
          const q = gearTravel({ driver, driven, rpm }, time);
          expect(q.driverTurns * driver).toBeCloseTo(q.drivenTurns * driven);
          expect(q.pitches).toBeCloseTo(q.rate * time);
          for (const n of [1, 6, 12])
            expect(
              gearTravel({ driver, driven, rpm }, n / q.rate).pitches,
            ).toBeCloseTo(n);
        }
});
