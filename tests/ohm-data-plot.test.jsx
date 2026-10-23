import { expect, it } from "vitest";
import { groupOhmRecords } from "../src/OhmDataPlot.jsx";

it("separates resistance groups and uses recorded current instead of manufacturing a perfect line", () => {
  const row = (number, u, r, current, closed = 1) => ({
    number,
    parameters: { u, r, closed },
    values: [{ label: "电流", value: current }],
  });
  const result = groupOhmRecords([
    row(1, 3, 20, 0.149),
    row(2, 6, 10, 0.6),
    row(3, 6, 20, 0.3),
    row(4, 9, 20, 0, 0),
    row(5, 6, 0, Infinity),
  ]);
  expect(result.excluded).toBe(2);
  expect(result.groups.map(([r]) => r)).toEqual([10, 20]);
  expect(result.groups[1][1]).toEqual([
    { voltage: 3, current: 0.149, number: 1 },
    { voltage: 6, current: 0.3, number: 3 },
  ]);
});
