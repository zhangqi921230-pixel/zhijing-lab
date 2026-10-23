import { expect, it } from "vitest";
import { liquidSurfaceGeometry } from "../src/LiquidSurface.js";
import { createLiquidRipples } from "../src/LiquidRipples.js";

it("disturbs the interior, preserves the glass contact edge, then settles and sleeps", () => {
  const geometry = liquidSurfaceGeometry();
  const position = geometry.getAttribute("position"),
    base = Float32Array.from(position.array);
  const motion = createLiquidRipples(geometry);
  expect(motion.animate(0)).toBe(false);
  motion.setFlow(true);
  for (let t = 20; t <= 1000; t += 20) expect(motion.animate(t)).toBe(true);
  expect(geometry.getAttribute("position")).toBe(position);
  expect(position.getY(0)).toBeLessThan(-0.006);
  let changed = 0;
  for (let i = 0; i < position.count; i++) {
    const difference = Math.abs(position.getY(i) - base[i * 3 + 1]);
    if (difference > 1e-6) changed++;
    expect(difference).toBeLessThan(0.008);
    if (Math.hypot(position.getX(i), position.getZ(i)) > 0.81)
      expect(difference).toBe(0);
  }
  expect(changed).toBeGreaterThan(100);
  expect(
    [...geometry.getAttribute("normal").array].every(Number.isFinite),
  ).toBe(true);
  motion.setFlow(false);
  let active;
  for (let t = 1020; t <= 3000; t += 20) active = motion.animate(t);
  expect(active).toBe(false);
  expect(position.array).toEqual(base);
  const version = position.version;
  motion.animate(4000);
  expect(position.version).toBe(version);
});

it("restores the still surface for reduced-motion users even while adding water", () => {
  const geometry = liquidSurfaceGeometry(),
    motion = createLiquidRipples(geometry);
  const base = Float32Array.from(geometry.getAttribute("position").array);
  motion.setFlow(true);
  motion.animate(0);
  motion.animate(50);
  expect(motion.animate(100, true)).toBe(false);
  expect(geometry.getAttribute("position").array).toEqual(base);
});
