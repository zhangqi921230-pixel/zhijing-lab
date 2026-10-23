import { it, expect } from "vitest";
import { dosingState, dosingTime } from "../src/precipitationDosing.mjs";
import { precipitate } from "../src/advancedModels.mjs";

it("按体积定位教学进度，限制容量且零试剂无除零", () => {
  expect(dosingTime(5, 0)).toBe(0);
  expect(dosingTime(-1, 50)).toBe(0);
  expect(dosingTime(60, 50)).toBe(8);
  for (const base of [10, 50, 100])
    for (const volume of [0, 1, 5, 9, base]) {
      const p = { copper: 50, base },
        t = dosingTime(volume, base);
      expect(precipitate(p, t).delivered).toBeCloseTo(
        Math.min(volume, base),
        10,
      );
      expect(dosingState(p, t).remaining).toBeCloseTo(
        base - Math.min(volume, base),
        10,
      );
    }
});
it("恰好反应体积遵守二比一物质的量关系，前后现象相符", () => {
  for (const copper of [10, 50, 90]) {
    const p = { copper, base: 100 },
      t = dosingTime(copper, 100);
    const before = precipitate(p, dosingTime(copper - 1, 100)),
      at = precipitate(p, t),
      after = precipitate(p, dosingTime(copper + 1, 100));
    expect(at.cu).toBeCloseTo(0, 10);
    expect(at.oh).toBeCloseTo(0, 10);
    expect(before.cu).toBeGreaterThan(0);
    expect(after.oh).toBeGreaterThan(0);
    expect(after.solid).toBeCloseTo(at.solid, 10);
    expect(dosingState(p, t).canReachEquivalence).toBe(true);
  }
  expect(dosingState({ copper: 50, base: 40 }, 0).canReachEquivalence).toBe(
    false,
  );
});

it("首滴到达前不计入体积或生成沉淀，之后体积定位与计量共用时间线", () => {
  const p = { copper: 50, base: 50 };
  for (const t of [0, 0.2, 0.49, 0.5]) {
    expect(precipitate(p, t).delivered).toBe(0);
    expect(precipitate(p, t).solid).toBe(0);
    expect(dosingState(p, t).delivered).toBe(0);
  }
  expect(dosingTime(25, 50)).toBe(4.25);
  expect(precipitate(p, 4.25).delivered).toBe(25);
  expect(precipitate(p, 8).delivered).toBe(50);
});
