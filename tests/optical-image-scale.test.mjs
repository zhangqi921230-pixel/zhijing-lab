import { expect, it } from "vitest";
import {
  opticalState,
  objectArrow,
  objectHeight,
} from "../src/opticalModel.mjs";

it("screen image preserves object aspect ratio in reduced, equal and enlarged images", () => {
  for (const [u, screen, m] of [
    [30, 15, -0.5],
    [20, 20, -1],
    [15, 30, -2],
  ]) {
    const state = opticalState({ u, f: 10, screen });
    expect(state.focused).toBe(true);
    expect(state.tip / objectHeight).toBeCloseTo(m);
    expect(state.projectedHeadWidth / objectArrow.headWidth).toBeCloseTo(-m);
    expect(state.projectedShaftWidth / objectArrow.shaftWidth).toBeCloseTo(-m);
    expect(state.projectedHeadWidth / Math.abs(state.tip)).toBeCloseTo(
      objectArrow.headWidth / objectHeight,
    );
  }
});

it("defocused chief-ray footprint scales by screen distance, not the theoretical image distance", () => {
  const state = opticalState({ u: 30, f: 10, screen: 30 });
  expect(state.focused).toBe(false);
  expect(state.spread).toBeGreaterThan(0);
  expect(state.projectedHeadWidth).toBeCloseTo(objectArrow.headWidth);
  expect(state.tip).toBeCloseTo(-objectHeight);
});

it("distinguishes focused but cropped images from the exact screen-edge boundary", () => {
  const edge = opticalState({ u: 15, f: 10, screen: 30 });
  expect(edge.focused).toBe(true);
  expect(edge.imageFitsScreen).toBe(true);
  const cropped = opticalState({ u: 14, f: 10, screen: 35 });
  expect(cropped.focused).toBe(true);
  expect(cropped.imageFitsScreen).toBe(false);
  expect(opticalState({ u: 6, f: 10, screen: 15 }).imageFitsScreen).toBe(false);
  expect(opticalState({ u: 10, f: 10, screen: 15 }).imageFitsScreen).toBe(
    false,
  );
});
