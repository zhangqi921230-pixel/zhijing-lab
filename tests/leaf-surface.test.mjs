import { it, expect } from "vitest";
import { leafSurface } from "../src/leafSurface.mjs";
import { createEcologySpecimens } from "../src/EcologySpecimens.js";

it("叶片两端收拢，横向曲面有拱度且左右列不交叉", () => {
  for (let leaf = 0; leaf < 6; leaf++) {
    leafSurface(0, -1, leaf).forEach((value, axis) =>
      expect(value).toBeCloseTo(leafSurface(0, 1, leaf)[axis], 12),
    );
    expect(Math.abs(leafSurface(1, 1, leaf)[2])).toBeLessThan(1e-12);
    const middle = leafSurface(0.5, 0, leaf)[1];
    expect(middle).toBeGreaterThan(leafSurface(0.5, -1, leaf)[1]);
    expect(middle).toBeGreaterThan(leafSurface(0.5, 1, leaf)[1]);
    for (let i = 1; i < 32; i++) {
      let last = -Infinity;
      for (let k = 0; k <= 8; k++) {
        const p = leafSurface(i / 32, (k - 4) / 4, leaf);
        expect(p.every(Number.isFinite)).toBe(true);
        expect(p[2]).toBeGreaterThan(last);
        last = p[2];
      }
    }
  }
});
it("详细标本保持三个渲染对象并在多个植物间共享几何", () => {
  const factory = createEcologySpecimens({ plantOnly: true }),
    a = factory.plant(),
    b = factory.plant();
  expect(a.children.length).toBe(3);
  a.children.forEach((o, i) => {
    expect(o.geometry).toBe(b.children[i].geometry);
    expect(
      [...o.geometry.attributes.position.array].every(Number.isFinite),
    ).toBe(true);
  });
  expect(a.children[0].geometry.attributes.position.count / 3).toBeLessThan(
    4000,
  );
});
