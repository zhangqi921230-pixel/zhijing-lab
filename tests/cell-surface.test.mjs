import { it, expect } from "vitest";
import { membraneGrain, createCellSurfaceTexture } from "../src/CellSurface.js";
it("tiles without a discontinuity and keeps the shared texture bounded", () => {
  for (const u of [-0.8, 0, 0.21, 0.9, 1])
    for (const v of [0, 0.38, 0.97]) {
      const n = membraneGrain(u, v);
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThanOrEqual(1);
      expect(membraneGrain(u + 1, v - 1)).toBeCloseTo(n, 10);
      expect(
        Math.abs(membraneGrain(1 - 1e-7, v) - membraneGrain(1e-7, v)),
      ).toBeLessThan(1e-5);
    }
  const a = createCellSurfaceTexture(),
    b = createCellSurfaceTexture();
  expect(a.image.data).toEqual(b.image.data);
  expect(a).not.toBe(b);
  expect(a.image.data).not.toBe(b.image.data);
  expect(a.image.data.byteLength).toBe(256 * 256 * 4);
  expect(a.generateMipmaps).toBe(true);
  a.dispose();
  b.dispose();
});

it("isolates scene pixel edits and disposal from the cached source", () => {
  const first = createCellSurfaceTexture();
  const original = first.image.data[0];
  first.image.data[0] = (original + 1) % 256;
  first.repeat.set(9, 9);
  first.dispose();
  const next = createCellSurfaceTexture();
  expect(next.image.data[0]).toBe(original);
  expect(next.repeat.toArray()).toEqual([3, 2]);
  next.dispose();
});
