import { expect, it } from "vitest";
import * as T from "three";
import { addReactionRipples } from "../src/ReactionRipples.js";
import { buildAdvanced } from "../src/AdvancedScene.js";
import { disposeSceneResources } from "../src/disposeSceneResources.mjs";

it("starts waves at impact, expands and damps them, and clears after dosing", () => {
  const root = new T.Group();
  const update = addReactionRipples(root);
  update(0.49, 0, true);
  expect(root.children.every((r) => !r.visible)).toBe(true);
  update(0.5, 0, true);
  expect(root.children.filter((r) => r.visible)).toHaveLength(1);
  update(0.8, 0.2, true);
  const visible = root.children.filter((r) => r.visible);
  expect(visible).toHaveLength(4);
  for (let i = 0; i < visible.length; i++) {
    expect(visible[i].geometry).toBe(visible[0].geometry);
    expect(visible[i].position.y).toBeCloseTo(0.208);
    expect(visible[i].scale.x + 0.15).toBeLessThan(1.02);
    if (i) {
      expect(visible[i].scale.x).toBeGreaterThan(visible[i - 1].scale.x);
      expect(visible[i].material.opacity).toBeLessThan(
        visible[i - 1].material.opacity,
      );
    }
  }
  update(8.6, 0.3, true);
  expect(root.children.every((r) => !r.visible)).toBe(true);
  update(1, 0, false);
  expect(root.children.every((r) => !r.visible)).toBe(true);
  disposeSceneResources(root);
});

it("emits drops from the nozzle sequentially and freezes their positions on pause", () => {
  const root = new T.Group(),
    p = { copper: 50, base: 50, time: 0 };
  buildAdvanced(root, "precipitation", p);
  const drops = Array.from({ length: 5 }, (_, i) =>
    root.getObjectByName(`reaction-drop-${i}`),
  );
  expect(drops.filter((d) => d.visible)).toHaveLength(1);
  expect(drops[0].position.y).toBe(1.67);
  root.userData.update({ ...p, time: 0.25, dosing: true });
  expect(drops.filter((d) => d.visible)).toHaveLength(3);
  const positions = drops.map((d) => d.position.toArray());
  root.userData.update({ ...p, time: 0.25, dosing: false });
  expect(drops.map((d) => d.position.toArray())).toEqual(positions);
  expect(drops.filter((d) => d.visible)).toHaveLength(3);
  root.userData.update({ ...p, time: 8 });
  expect(drops.every((d) => !d.visible)).toBe(true);
  disposeSceneResources(root);
});
