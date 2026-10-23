import { expect, it } from "vitest";
import {
  countLabelCrossings,
  segmentCrossesLabel,
} from "../src/functionProbeLabel.mjs";

it("有序索引和无序回退与逐段精确检测一致，包括竖线和边界接触", () => {
  const forward = Array.from({ length: 401 }, (_, i) => [
    i - 200,
    80 * Math.sin(i / 15),
  ]);
  const lines = [
    forward,
    [...forward].reverse(),
    [
      [0, -50],
      [0, 50],
      [0, 80],
    ],
    [
      [0, 0],
      [50, 50],
      [-10, 20],
      [60, 0],
    ],
    [],
    [[1, 1]],
  ];
  for (const line of lines)
    for (let x = -250; x <= 250; x += 10)
      for (const y of [-80, -20, 0, 50]) {
        const rect = { x, y, width: 30, height: 25 };
        let expected = 0;
        for (let i = 0; i < line.length - 1; i++)
          if (segmentCrossesLabel(line[i], line[i + 1], rect)) expected++;
        expect(countLabelCrossings(line, rect)).toBe(expected);
      }
});
