import { expect, it } from "vitest";
import * as T from "three";
import { buildOpticalBench } from "../src/OpticalBench.js";
import { screenScaleTicks } from "../src/OpticalScreenScale.js";
import {
  opticalAxis,
  opticalScale,
  opticalScreen,
  opticalState,
} from "../src/opticalModel.mjs";

it("the visible screen centimetre scale agrees with the optical rail and focused image height", () => {
  const ticks = screenScaleTicks();
  for (const tick of ticks) {
    const worldHeight = (0.5 - tick.y / 512) * opticalScreen.height;
    expect(worldHeight / opticalScale).toBeCloseTo(tick.cm, 10);
  }
  const first = ticks[0];
  const last = ticks.at(-1);
  expect(first.cm).toBe(-14);
  expect(last.cm).toBe(14);
  for (const [u, screen, expected] of [
    [30, 15, -3.63636],
    [20, 20, -7.27272],
    [15, 30, -14.54545],
  ]) {
    const state = opticalState({ u, f: 10, screen });
    const imagePixel = 512 * (0.5 - state.tip / opticalScreen.height);
    const readout =
      first.cm +
      ((imagePixel - first.y) / (last.y - first.y)) * (last.cm - first.cm);
    expect(readout).toBeCloseTo(expected, 4);
  }
});

it("the illuminated front is visible from the lens side and the opaque backing covers it from behind", () => {
  const root = new T.Group();
  buildOpticalBench(root, { u: 20, f: 10, screen: 20, rays: 1 });
  root.updateMatrixWorld(true);
  const screen = root.getObjectByName("optical-screen");
  const x = screen.position.x;
  for (const [side, expected] of [
    [-1, "optical-screen-face"],
    [1, "optical-screen-backing"],
  ]) {
    const ray = new T.Raycaster(
      new T.Vector3(x + side, opticalAxis, 0.2),
      new T.Vector3(-side, 0, 0),
    );
    expect(ray.intersectObject(screen, true)[0].object.name).toBe(expected);
  }
});
