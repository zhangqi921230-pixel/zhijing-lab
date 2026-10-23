import { it, expect } from "vitest";
import * as T from "three";
import { addOpticalFocalMarks } from "../src/OpticalFocalMarks.js";
import { opticalScale, opticalAxis } from "../src/opticalModel.mjs";

it("focal teaching marks track focal length and auxiliary visibility without changing the light state", () => {
  const root = new T.Group(),
    update = addOpticalFocalMarks(root);
  for (const f of [5, 10, 20]) {
    update({ f, rays: 1, light: 0 });
    expect(root.getObjectByName("optical-focal-marks").visible).toBe(true);
    for (const n of [-2, -1, 1, 2]) {
      const mark = root.getObjectByName(`optical-focal-${n}`);
      expect(mark.position.x).toBeCloseTo(n * f * opticalScale, 10);
      expect(mark.position.y).toBe(opticalAxis);
      expect(mark.position.z).toBe(0);
    }
  }
  update({ f: 10, rays: 0, light: 1 });
  expect(root.getObjectByName("optical-focal-marks").visible).toBe(false);
});
