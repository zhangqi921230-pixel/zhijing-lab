import { it, expect } from "vitest";
import { rollingPoint, dopplerState } from "../src/motionModels.mjs";
import { motionTopics } from "../src/motionLessons.mjs";
it("rolling without slip has the correct contact, apex, circumference and wheel-center trajectory", () => {
  for (const R of [0.5, 1, 1.6]) {
    expect(rollingPoint(R, 1, 0).y).toBe(0);
    expect(rollingPoint(R, 1, Math.PI).y).toBeCloseTo(2 * R);
    expect(rollingPoint(R, 1, 2 * Math.PI).x).toBeCloseTo(2 * Math.PI * R);
    expect(rollingPoint(R, 0, 1).y).toBe(R);
    expect(rollingPoint(R, 0, 1).x).toBe(R);
    expect(rollingPoint(R, 0.5, 0).y).toBeCloseTo(0.5 * R);
    expect(rollingPoint(R, 1.4, 0.01).x).toBeLessThan(0);
  }
});
it("wavefront centers stay at emission positions and all radii propagate at c", () => {
  const a = dopplerState(0.4, 2, 2),
    b = dopplerState(0.4, 2, 3);
  a.fronts.forEach((front, i) => {
    expect(front.x).toBe(0.8 * front.born);
    expect(b.fronts[i].x).toBe(front.x);
    expect(b.fronts[i].radius - front.radius).toBeCloseTo(2);
  });
  expect(a.rightWavelength * a.rightFrequency).toBeCloseTo(2);
  expect(a.leftWavelength * a.leftFrequency).toBeCloseTo(2);
});
it("stationary symmetry and reversal agree with Doppler frequencies and observer boundaries", () => {
  expect(dopplerState(0, 2, 3).leftFrequency).toBe(2);
  const a = dopplerState(0.75, 1, 6),
    b = dopplerState(-0.75, 1, 6);
  expect(a.rightFrequency).toBe(4);
  expect(a.rightFrequency).toBe(b.leftFrequency);
  expect(Math.abs(a.sourceX)).toBeLessThan(12);
});
it("each topic has at least five chapters with valid distinct observable conditions", () => {
  for (const topic of motionTopics) {
    expect(topic.chapters.length).toBeGreaterThanOrEqual(5);
    // The rearrangement chapter intentionally keeps 3-4-5 conditions while
    // changing the geometry; its rendered distinction is tested separately.
    const core =
      topic.id === "pythagoras-proof"
        ? topic.chapters.slice(0, 5)
        : topic.chapters;
    expect(
      new Set(core.map((c) => JSON.stringify([c.preset, c.time]))).size,
    ).toBe(core.length);
    topic.chapters.forEach((c) =>
      topic.params.forEach((f) => {
        expect(c.preset[f.key]).toBeGreaterThanOrEqual(f.min);
        expect(c.preset[f.key]).toBeLessThanOrEqual(f.max);
      }),
    );
  }
});
