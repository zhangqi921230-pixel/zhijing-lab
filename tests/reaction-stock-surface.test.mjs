import { expect, it } from "vitest";
import * as THREE from "three";
import { buildAdvanced } from "../src/AdvancedScene.js";
import { disposeSceneResources } from "../src/disposeSceneResources.mjs";

it("keeps the stock meniscus on the volume-calibrated liquid in both funnel sections", () => {
  const root = new THREE.Group();
  const p = { copper: 50, base: 50, time: 0 };
  buildAdvanced(root, "precipitation", p);
  const surface = root.getObjectByName("reaction-stock-surface");
  const cylinder = root.getObjectByName("reaction-stock");
  const cone = root.getObjectByName("reaction-stock-cone");
  const geometry = surface.geometry;
  let previous = Infinity;
  for (const time of [0, 4, 7, 7.9, 8]) {
    root.userData.update({ ...p, time });
    expect(surface.geometry).toBe(geometry);
    expect(surface.visible).toBe(time < 8);
    expect(surface.position.y).toBeLessThanOrEqual(previous);
    previous = surface.position.y;
    if (time === 8) continue;
    const liquid = cylinder.visible ? cylinder : cone;
    expect(surface.position.y).toBeCloseTo(
      liquid.position.y + liquid.scale.y / 2,
      8,
    );
    expect(surface.scale.x).toBeCloseTo(
      cylinder.visible ? 0.65 : cone.scale.x,
      8,
    );
    expect(surface.scale.z).toBe(surface.scale.x);
  }
  disposeSceneResources(root);
});
