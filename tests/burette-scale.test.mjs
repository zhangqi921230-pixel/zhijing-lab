import { expect, it } from "vitest";
import {
  buretteGraduations,
  buretteReadingHeight,
} from "../src/buretteScale.mjs";

it("aligns every printed graduation with the lowest meniscus point", () => {
  expect(buretteGraduations).toHaveLength(501);
  expect(buretteGraduations.filter((t) => t.kind === "numbered")).toHaveLength(
    21,
  );
  for (const [i, tick] of buretteGraduations.entries()) {
    const printedY = 3.85 + 2.5 / 2 - tick.fraction * 2.5;
    expect(printedY).toBeCloseTo(buretteReadingHeight(tick.volume), 12);
    if (i)
      expect(tick.volume - buretteGraduations[i - 1].volume).toBeCloseTo(
        0.2,
        12,
      );
  }
  expect(buretteReadingHeight(0)).toBeCloseTo(5.1);
  expect(buretteReadingHeight(100)).toBeCloseTo(2.6);
  expect(buretteReadingHeight(27.4) - buretteReadingHeight(27.5)).toBeCloseTo(
    0.0025,
    12,
  );
});
