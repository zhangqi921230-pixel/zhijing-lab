import { expect, it } from "vitest";
import * as T from "three";
import { buildOpticalBench } from "../src/OpticalBench.js";
import {
  opticalState,
  aperture,
  opticalScale,
  objectHeight,
} from "../src/opticalModel.mjs";

it("halving pupil diameter quarters its area and halves geometric defocus without changing the image plane", () => {
  const p = { u: 20, f: 10, screen: 25 };
  const open = opticalState(p);
  const half = opticalState({ ...p, aperture: 50 });
  expect(half.relativeLight).toBe(0.25);
  expect(half.spread).toBeCloseTo(open.spread / 2);
  expect(half.v).toBe(open.v);
  expect(half.m).toBe(open.m);
  expect(half.tip).toBe(open.tip);
  expect(half.focused).toBe(false);
  expect(opticalState({ ...p, screen: 20, aperture: 25 }).spread).toBe(0);
});

it("the visible pupil and rays use one radius, retain buffers, and meet the same focused image", () => {
  const root = new T.Group();
  buildOpticalBench(root, { u: 20, f: 10, screen: 20 });
  const ring = root.getObjectByName("optical-aperture");
  const positions = ring.geometry.attributes.position;
  for (const percent of [25, 50, 100]) {
    root.userData.update({ u: 20, f: 10, screen: 20, aperture: percent });
    expect(ring.geometry.attributes.position).toBe(positions);
    for (let i = 0; i <= 64; i++) {
      expect(Math.hypot(positions.getX(i), positions.getY(i))).toBeCloseTo(
        (aperture * percent) / 100,
        6,
      );
    }
    for (const path of root.userData.optics.paths) {
      expect(Math.abs(path.height)).toBeLessThan((aperture * percent) / 100);
      expect(path.height + path.outgoing * 20 * opticalScale).toBeCloseTo(
        -objectHeight,
      );
    }
    const version = positions.version;
    root.userData.update({
      u: 20,
      f: 10,
      screen: 20,
      aperture: percent,
      rays: 0,
    });
    expect(positions.version).toBe(version);
  }
});
