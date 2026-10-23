import { expect, it } from "vitest";
import * as T from "three";
import {
  reactionBeakerGeometry,
  reactionLiquidGeometry,
  setReactionLiquidHeight,
} from "../src/ReactionGlass.js";

it("rounded beaker has a thick floor and contains the liquid heel throughout the fill range", () => {
  const glass = new T.Mesh(
    reactionBeakerGeometry(),
    new T.MeshBasicMaterial({ side: T.DoubleSide }),
  );
  const ray = new T.Raycaster(new T.Vector3(0, 3, 0), new T.Vector3(0, -1, 0));
  const hits = ray.intersectObject(glass);
  expect(hits[0].point.y).toBeCloseTo(0.09, 6);
  expect(hits.at(-1).point.y).toBeCloseTo(0, 6);
  const liquid = reactionLiquidGeometry();
  const position = liquid.attributes.position;
  const original = position.array.slice();
  for (const ml of [10, 25, 50, 100, 200]) {
    setReactionLiquidHeight(liquid, (ml * 2.2) / 250);
    for (let i = 0; i < position.count; i++) {
      const y = position.getY(i);
      if (!liquid.userData.topVertices.includes(i))
        expect(y).toBe(original[i * 3 + 1]);
      const r = Math.hypot(position.getX(i), position.getZ(i));
      const cavity =
        y < 0.045
          ? 0.98 + Math.sqrt(Math.max(0, 0.045 ** 2 - (y - 0.045) ** 2))
          : 1.025;
      expect(r).toBeLessThanOrEqual(cavity + 1e-6);
    }
    liquid.computeBoundingBox();
    expect(liquid.boundingBox.max.y).toBeCloseTo((ml * 2.2) / 250, 6);
    const version = position.version;
    setReactionLiquidHeight(liquid, (ml * 2.2) / 250);
    expect(position.version).toBe(version);
  }
  liquid.dispose();
  glass.geometry.dispose();
  glass.material.dispose();
});
