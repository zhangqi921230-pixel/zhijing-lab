import { expect, it } from "vitest";
import { watershedCrownGeometry } from "../src/WatershedVegetation.js";

it("共享树冠保留分枝团簇且几何规模固定、法线有限", () => {
  const a = watershedCrownGeometry(),
    b = watershedCrownGeometry();
  expect(a.attributes.position.count).toBe(660);
  expect([...a.attributes.position.array]).toEqual([
    ...b.attributes.position.array,
  ]);
  expect([...a.attributes.normal.array].every(Number.isFinite)).toBe(true);
  expect(a.boundingSphere.radius).toBeLessThan(0.2);
  expect(a.boundingSphere.radius).toBeGreaterThan(0.1);
});
