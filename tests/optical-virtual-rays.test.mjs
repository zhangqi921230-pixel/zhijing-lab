import { expect, it } from "vitest";
import * as T from "three";
import {
  buildOpticalBench,
  opticalScale,
  opticalAxis,
  objectHeight,
} from "../src/OpticalBench.js";

it("virtual extensions meet at the upright image and preserve their buffers across updates", () => {
  const root = new T.Group();
  buildOpticalBench(root, { u: 6, f: 10, screen: 15, rays: 1 });
  const lines = [0, 1, 2].map((i) =>
    root.getObjectByName(`optical-virtual-extension-${i}`),
  );
  const buffers = lines.map((line) => line.geometry.attributes.position);
  const distances = lines.map((line) => line.geometry.attributes.lineDistance);
  for (const [u, f] of [
    [6, 10],
    [9, 10],
    [19, 20],
  ]) {
    root.userData.update({ u, f, screen: 15, rays: 1 });
    const { v, m } = root.userData.optics;
    lines.forEach((line, i) => {
      expect(line.visible).toBe(true);
      expect(line.material.isLineDashedMaterial).toBe(true);
      expect(line.geometry.attributes.position).toBe(buffers[i]);
      expect(line.geometry.attributes.lineDistance).toBe(distances[i]);
      const p = buffers[i].array;
      expect(p[3]).toBeCloseTo(v * opticalScale, 5);
      expect(p[4]).toBeCloseTo(opticalAxis + m * objectHeight, 5);
      expect(distances[i].array[1]).toBeCloseTo(
        Math.hypot(p[3] - p[0], p[4] - p[1]),
        5,
      );
    });
  }
  for (const p of [
    { u: 10, f: 10, rays: 1 },
    { u: 30, f: 10, rays: 1 },
    { u: 6, f: 10, rays: 0 },
  ]) {
    root.userData.update({ ...p, screen: 15 });
    expect(lines.every((line) => !line.visible)).toBe(true);
  }
});
