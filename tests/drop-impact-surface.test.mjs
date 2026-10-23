import { it, expect } from "vitest";
import * as T from "three";
import { liquidSurfaceGeometry } from "../src/LiquidSurface.js";
import { createDropImpactSurface } from "../src/DropImpactSurface.js";
import { addTitrationDrops } from "../src/TitrationDrops.js";

it("a single dose falls and contacts once without starting continuous flow", () => {
  let impacts = 0;
  const root = new T.Group();
  const drops = addTitrationDrops(root, () => impacts++);
  drops.setState(false, 0.8);
  drops.emitOne();
  expect(drops.animate(0)).toBe(true);
  expect(root.getObjectByName("titration-drops").count).toBe(1);
  for (let now = 16; now < 1000; now += 16) drops.animate(now);
  expect(impacts).toBe(1);
  expect(drops.animate(1100)).toBe(false);
  drops.emitOne();
  expect(drops.animate(1116, true)).toBe(false);
  expect(drops.animate(1132)).toBe(false);
  expect(impacts).toBe(1);
});

it("impacts disturb only the surface interior and decay to the original meniscus", () => {
  const geometry = liquidSurfaceGeometry(),
    positions = geometry.attributes.position;
  const base = Float32Array.from(positions.array),
    ripple = createDropImpactSurface(geometry);
  expect(ripple.animate(0)).toBe(false);
  ripple.impact();
  expect(ripple.animate(16)).toBe(true);
  expect(positions.getY(0)).toBeLessThan(0);
  for (let i = positions.count - 64; i < positions.count; i++)
    expect(positions.getY(i)).toBeCloseTo(base[i * 3 + 1], 7);
  for (let now = 32; now <= 1600; now += 16) ripple.animate(now);
  expect(ripple.animate(1616)).toBe(false);
  expect(positions.array).toEqual(base);
  const version = positions.version;
  ripple.animate(1632);
  expect(positions.version).toBe(version);
  ripple.impact();
  ripple.animate(1648);
  expect(ripple.animate(1664, true)).toBe(false);
  expect(positions.array).toEqual(base);
  geometry.dispose();
});

it("emits a contact only when a falling drop reaches the surface, then drains after closure", () => {
  let impacts = 0;
  const drops = addTitrationDrops(new T.Group(), () => impacts++);
  drops.setState(true, 0.8);
  drops.animate(0);
  expect(impacts).toBe(0);
  for (let now = 16; now < 400; now += 16) drops.animate(now);
  expect(impacts).toBeGreaterThan(0);
  drops.setState(false, 0.8);
  for (let now = 400; now < 1000; now += 16) drops.animate(now);
  const settled = impacts;
  expect(drops.animate(1100)).toBe(false);
  expect(impacts).toBe(settled);
});
