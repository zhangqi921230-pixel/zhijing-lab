import { it, expect } from "vitest";
import * as T from "three";
import { addReactionVolumeGuide } from "../src/ReactionVolumeGuide.js";
it("水平读数沿标定高度移动，隐藏和更新复用几何", () => {
  const root = new T.Group(),
    update = addReactionVolumeGuide(root);
  const group = root.getObjectByName("reaction-volume-guide"),
    geometry = group.children[0].geometry;
  for (const volume of [10, 50, 100, 150, 200]) {
    update(volume, true);
    expect(group.position.y).toBeCloseTo(-0.82 + (volume * 2.2) / 250, 12);
    const pos = geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) expect(pos.getY(i)).toBe(0);
    expect(group.userData.volume).toBe(volume);
  }
  update(100, false);
  expect(group.visible).toBe(false);
  update(100, true);
  expect(group.visible).toBe(true);
  expect(group.children[0].geometry).toBe(geometry);
});
