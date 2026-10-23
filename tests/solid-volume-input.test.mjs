import { expect, it } from "vitest";
import {
  solidVolumePointer,
  solidVolumeKey,
} from "../src/solidVolumeInput.mjs";

it("maps chart coordinates with both horizontal and vertical SVG letterboxing", () => {
  for (const [width, height] of [
    [520, 220],
    [1040, 220],
    [260, 400],
    [340, 144],
  ]) {
    const rect = { left: 17, width, height };
    const scale = Math.min(width / 520, height / 220);
    for (const value of [0, 25, 50, 75, 100]) {
      const x =
        rect.left +
        (width - 520 * scale) / 2 +
        (48 + (420 * value) / 100) * scale;
      expect(solidVolumePointer(x, rect)).toBe(value);
    }
    expect(solidVolumePointer(-1000, rect)).toBe(0);
    expect(solidVolumePointer(10000, rect)).toBe(100);
  }
  expect(solidVolumePointer(0, { left: 0, width: 0, height: 0 })).toBeNull();
});
it("supports bounded arrow, page and endpoint keyboard actions", () => {
  expect(solidVolumeKey(50, "ArrowLeft")).toBe(49);
  expect(solidVolumeKey(50, "ArrowRight")).toBe(51);
  expect(solidVolumeKey(50, "PageDown")).toBe(40);
  expect(solidVolumeKey(50, "PageUp")).toBe(60);
  expect(solidVolumeKey(50, "Home")).toBe(0);
  expect(solidVolumeKey(50, "End")).toBe(100);
  expect(solidVolumeKey(0, "ArrowLeft")).toBe(0);
  expect(solidVolumeKey(100, "ArrowRight")).toBe(100);
  expect(solidVolumeKey(50, "Tab")).toBeNull();
});
