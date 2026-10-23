import { expect, it } from "vitest";
import { definedProbePosition } from "../src/functionProbeRecovery.mjs";
import { functionValue } from "../src/advancedModels.mjs";

it("无定义探针可移入正确分支，不改变函数参数", () => {
  for (const type of [3, 5, 7])
    for (const k of [-2, 2]) {
      const p = {
        type,
        k,
        a: 1,
        b: 0,
        shift: 2,
        probe: type === 3 ? 2 : 2 - Math.sign(k),
      };
      const saved = { ...p },
        x = definedProbePosition(p);
      expect(x).not.toBeNull();
      expect(functionValue(p, x)).not.toBeNull();
      if (type === 7) expect(k * (x - p.shift)).toBeGreaterThan(0);
      expect(p).toEqual(saved);
    }
});
it("空定义域不能产生伪造的可定义观察点", () => {
  for (const type of [3, 7])
    expect(
      definedProbePosition({ type, k: 0, a: 1, b: 0, shift: 0, probe: 0 }),
    ).toBeNull();
});
