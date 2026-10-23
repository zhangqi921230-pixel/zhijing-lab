import { expect, it } from "vitest";
import { microscopeOptics } from "../src/MicroscopeField.jsx";
import { microscopeFocusAdvice } from "../src/microscopeFocusAdvice.mjs";

const base = {
  power: 1,
  light: 60,
  aperture: 70,
  mag: 400,
  coarse: 50,
  focus: 50,
  x: 0,
  y: 0,
};
const advice = (p) => microscopeFocusAdvice(p, microscopeOptics(p));
it("prioritizes illumination rather than diagnosing focus in darkness", () => {
  expect(advice({ ...base, power: 0, coarse: 0 }).patch).toEqual({ power: 1 });
  expect(advice({ ...base, light: 10 }).title).toBe("先改善照明");
  const darkAperture = { ...base, aperture: 20 };
  expect(microscopeOptics(darkAperture).blur).toBe(0);
  expect(advice(darkAperture).title).toBe("先调大孔径光阑");
  expect(advice(darkAperture).canAssessFocus).toBe(false);
  expect(advice({ ...darkAperture, aperture: 70 }).title).toBe(
    "已合焦 · 可以观察",
  );
});
it("only returns to low power when fine travel cannot reach the renderer's focus tolerance", () => {
  for (const coarse of [0, 20, 80, 100]) {
    const p = { ...base, coarse };
    expect(advice(p).patch).toEqual({ mag: 40 });
    for (let focus = 0; focus <= 100; focus++)
      expect(microscopeOptics({ ...p, focus }).blur).toBeGreaterThan(0.6);
  }
  expect(advice({ ...base, coarse: 58, focus: 80 }).title).toBe("用细准焦微调");
  expect(advice({ ...base, mag: 40, coarse: 0 }).patch).toBeUndefined();
});
it("acknowledges clear focus without changing specimen or focus settings", () => {
  expect(advice(base).title).toBe("已合焦 · 可以观察");
  expect(advice(base).patch).toBeUndefined();
});
