import { expect, it } from "vitest";
import { createEcologyPond } from "../src/EcologyPond.js";
import { HABITAT_POND, habitatHeight } from "../src/ecologyHabitat.mjs";
import { disposeSceneResources } from "../src/disposeSceneResources.mjs";

it("keeps a horizontal water level, rewinds ripple appearance and releases its map", () => {
  const pond = createEcologyPond(),
    geometry = pond.geometry;
  const positions = geometry.attributes.position;
  for (let i = 0; i < positions.count; i++) {
    expect(Math.abs(positions.getY(i))).toBeLessThan(1e-6);
    expect(
      Math.hypot(positions.getX(i), positions.getZ(i)),
    ).toBeLessThanOrEqual(HABITAT_POND.radius + 1e-6);
  }
  expect(pond.position.y).toBe(HABITAT_POND.level);
  const colors = geometry.attributes.color;
  expect(colors.itemSize).toBe(4);
  let shallowest = 1,
    deepest = 0;
  for (let i = 0; i < positions.count; i++) {
    const depth = Math.max(
      0,
      HABITAT_POND.level -
        habitatHeight(
          HABITAT_POND.x + positions.getX(i),
          HABITAT_POND.z + positions.getZ(i),
        ),
    );
    const opacity = colors.getW(i);
    expect(opacity).toBeGreaterThanOrEqual(0.03999);
    expect(opacity).toBeLessThanOrEqual(0.8);
    if (depth < 0.01) shallowest = Math.min(shallowest, opacity);
    if (depth > 0.12) deepest = Math.max(deepest, opacity);
  }
  expect(shallowest).toBeLessThan(0.13);
  expect(deepest).toBeGreaterThan(0.6);
  const map = pond.material.normalMap;
  pond.userData.update(3);
  const offset = map.offset.clone();
  pond.userData.update(10);
  pond.userData.update(3);
  expect(map.offset.equals(offset)).toBe(true);
  expect(pond.geometry).toBe(geometry);
  let released = false;
  map.addEventListener("dispose", () => (released = true));
  disposeSceneResources(pond);
  expect(released).toBe(true);
});
