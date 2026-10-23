import { expect, it } from "vitest";
import * as T from "three";
import { buildOpticalBench } from "../src/OpticalBench.js";
import {
  objectHeight,
  opticalScale,
  opticalState,
} from "../src/opticalModel.mjs";

it("height adjustment moves real images oppositely without changing focus or magnification", () => {
  for (const [u, screen] of [
    [30, 15],
    [20, 20],
    [15, 30],
  ]) {
    const aligned = opticalState({ u, f: 10, screen });
    for (const sourceOffset of [-3, 0, 3]) {
      const state = opticalState({ u, f: 10, screen, sourceOffset });
      expect(state.v).toBe(aligned.v);
      expect(state.m).toBe(aligned.m);
      expect(state.focused).toBe(true);
      expect(state.base / opticalScale).toBeCloseTo(state.m * sourceOffset);
      expect(state.tip - state.base).toBeCloseTo(state.m * objectHeight);
    }
  }
  expect(
    opticalState({ u: 15, f: 10, screen: 30, sourceOffset: 3 }).imageFitsScreen,
  ).toBe(false);
  expect(
    opticalState({ u: 15, f: 10, screen: 30, sourceOffset: -3 })
      .imageFitsScreen,
  ).toBe(true);
});

it("the adjustable post remains seated and each ray meets the vertically shifted image", () => {
  const root = new T.Group();
  buildOpticalBench(root, { u: 20, f: 10, screen: 20, rays: 1 });
  const source = root.getObjectByName("optical-object");
  const post = source.getObjectByName("optical-post");
  const head = source.getObjectByName("optical-source-head");
  for (const u of [6, 15, 20, 30]) {
    for (const sourceOffset of [-3, 0, 3]) {
      const v = opticalState({ u, f: 10 }).v;
      root.userData.update({
        u,
        f: 10,
        screen: v > 0 ? v : 15,
        sourceOffset,
        rays: 1,
      });
      const state = root.userData.optics;
      expect(head.position.y).toBeCloseTo(sourceOffset * opticalScale);
      const halfHeight = (post.geometry.parameters.height * post.scale.y) / 2;
      expect(post.position.y - halfHeight).toBeCloseTo(-0.62);
      expect(post.position.y + halfHeight).toBeCloseTo(0.23 + head.position.y);
      root.updateMatrixWorld(true);
      const collarBounds = new T.Box3().setFromObject(
        source.getObjectByName("optical-height-collar"),
      );
      const sleeveBounds = new T.Box3().setFromObject(
        source.getObjectByName("optical-height-sleeve"),
      );
      expect(sleeveBounds.min.y).toBeCloseTo(-0.62, 6);
      expect(collarBounds.max.y).toBeLessThan(0.23 + head.position.y);
      for (const path of state.paths) {
        expect(path.height + path.outgoing * v * opticalScale).toBeCloseTo(
          state.m * (objectHeight + sourceOffset * opticalScale),
        );
      }
    }
  }
});
