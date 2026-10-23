import { expect, it } from "vitest";
import * as T from "three";
import {
  microscopeObjectiveFront,
  microscopeObjectiveBarrel,
} from "../src/MicroscopeObjective.js";
it.each([0.38, 0.48, 0.58])(
  "stepped barrel %s preserves the lens end and exposes its outer surface",
  (length) => {
    const root = new T.Group();
    const barrel = microscopeObjectiveBarrel(root, length);
    barrel.geometry.computeBoundingBox();
    expect(barrel.geometry.boundingBox.min.y).toBeCloseTo(-length);
    expect(barrel.geometry.boundingBox.max.y).toBeCloseTo(-0.06);
    root.updateMatrixWorld(true);
    const hit = new T.Raycaster(
      new T.Vector3(1, -0.16, 0),
      new T.Vector3(-1, 0, 0),
    ).intersectObject(barrel);
    expect(hit.length).toBeGreaterThan(0);
    expect(hit[0].point.x).toBeCloseTo(0.115, 5);
  },
);

it.each([0.38, 0.48, 0.58])(
  "keeps the %s objective aperture open and the glass recessed",
  (length) => {
    const root = new T.Group();
    const front = microscopeObjectiveFront(root, length);
    root.updateMatrixWorld(true);
    // A side ray must meet the exterior taper, not pass through to the bore.
    for (const sign of [-1, 1]) {
      const sideHit = new T.Raycaster(
        new T.Vector3(sign, -length - 0.07, 0),
        new T.Vector3(-sign, 0, 0),
      ).intersectObject(front, true)[0];
      expect(sideHit.object.name).toBe("hollow-objective-nose");
      expect(sign * sideHit.point.x).toBeCloseTo(0.102 - (0.07 - 0.018) / 3, 5);
      expect(sideHit.face.normal.x * sign).toBeGreaterThan(0);
    }
    const shoot = (x) =>
      new T.Raycaster(
        new T.Vector3(x, -length - 0.5, 0),
        new T.Vector3(0, 1, 0),
      ).intersectObject(front, true);
    const axis = shoot(0)[0];
    expect(axis.object.name).toBe("recessed-objective-lens");
    expect(axis.point.y).toBeCloseTo(-length - 0.088, 5);
    expect(shoot(0.06)[0].object.name).toBe("hollow-objective-nose");
    const bounds = new T.Box3().setFromObject(front);
    expect(bounds.min.y).toBeCloseTo(-length - 0.12, 5);
    expect(bounds.max.y).toBeCloseTo(-length, 5);
  },
);
