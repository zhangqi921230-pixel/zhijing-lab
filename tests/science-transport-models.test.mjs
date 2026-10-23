import { it, expect } from "vitest";
import {
  bicycleModel,
  brakeModel,
  elevatorModel,
  shipModel,
} from "../src/science/transportModels.mjs";
it("fixed front chain travel produces correct rear turns in both ratios", () => {
  for (const rear of [16, 32])
    for (const v of [0, 25, 50, 100]) {
      const m = bicycleModel(v, rear);
      expect(m.rearTurns * 2 * Math.PI * (rear * 2)).toBeCloseTo(m.chainTravel);
      expect(m.frontTurns * 40).toBeCloseTo(m.rearTurns * rear);
    }
  expect(bicycleModel(100, 16).rearTurns).toBe(2.5);
  expect(bicycleModel(100, 32).rearTurns).toBe(1.25);
});
it("brakes do not decelerate or heat before pads contact and never interpenetrate", () => {
  for (let v = 0; v < 25; v++) {
    expect(brakeModel(v).heat).toBe(0);
    expect(brakeModel(v + 1).angle - brakeModel(v).angle).toBeCloseTo(7.2);
  }
  let speed = 8;
  for (let v = 25; v < 100; v++) {
    const a = brakeModel(v),
      b = brakeModel(v + 1);
    expect(a.gap).toBe(0);
    expect(a.contact).toBe(true);
    const next = b.angle - a.angle;
    expect(next).toBeLessThan(speed);
    expect(next).toBeGreaterThan(0);
    speed = next;
  }
});
it("1:1 elevator conserves suspended rope length and matches sheave rotation", () => {
  for (let v = 0; v <= 100; v++) {
    const m = elevatorModel(v);
    expect(m.car + m.counter).toBeCloseTo(420);
    expect(((-m.angle * Math.PI) / 180) * 55).toBeCloseTo(310 - m.car);
  }
});
it("ship load steps match submerged trapezoid area and retain freeboard", () => {
  let previous = 0;
  for (let v = 0; v <= 100; v++) {
    const m = shipModel(v);
    expect(380 * m.draft + (110 / 320) * m.draft * m.draft).toBeCloseTo(m.area);
    expect(m.area).toBeGreaterThanOrEqual(previous);
    expect(m.top).toBeLessThan(250);
    previous = m.area;
  }
  expect(shipModel(0).load).toBe(0);
  expect(shipModel(100).load).toBe(8);
});
