import { expect, it } from "vitest";
import { advanceTemperatureScan } from "../src/temperatureScan.mjs";

it("scans both directions at the declared rate and stops at bounds without wrapping", () => {
  expect(advanceTemperatureScan(20, 1, 0.25)).toEqual({
    temp: 21,
    done: false,
  });
  expect(advanceTemperatureScan(60, -1, 0.25)).toEqual({
    temp: 59,
    done: false,
  });
  expect(advanceTemperatureScan(79.9, 1, 0.25)).toEqual({
    temp: 80,
    done: true,
  });
  expect(advanceTemperatureScan(0.1, -1, 0.25)).toEqual({
    temp: 0,
    done: true,
  });
  expect(advanceTemperatureScan(80, -1, 0.25)).toEqual({
    temp: 79,
    done: false,
  });
  expect(advanceTemperatureScan(0, 1, 0.25)).toEqual({ temp: 1, done: false });
  expect(advanceTemperatureScan(35, 1, -1)).toEqual({ temp: 35, done: false });
});
