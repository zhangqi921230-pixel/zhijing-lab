import { it, expect } from "vitest";
import {
  gasState,
  binomial,
  sampleCoins,
  moonState,
  moonLitPath,
  GAS_R,
} from "../src/explorationModels.mjs";
import {
  allExperiments,
  workbenches,
  courseGroups,
  groupFor,
} from "../src/courseCatalog.mjs";
it("preserves all old experiment routes in exactly one workbench", () => {
  const ids = workbenches.flatMap((x) => x.members);
  expect(new Set(ids).size).toBe(allExperiments.length);
  expect([...ids].sort()).toEqual(allExperiments.map((x) => x.id).sort());
  expect(groupFor("capacitor").id).toBe("ohm");
  for (const g of courseGroups)
    expect(
      new Set(
        g.members.map((id) => allExperiments.find((x) => x.id === id).subject),
      ).size,
    ).toBe(1);
});
it("obeys Boyle and pressure-temperature laws in consistent kPa L units", () => {
  const p = { volume: 20, temperature: 300, amount: 0.5 },
    base = gasState(p);
  expect(base.pressure).toBeCloseTo(62.358469635, 8);
  expect(gasState({ ...p, volume: 10 }).pressure).toBeCloseTo(
    base.pressure * 2,
    10,
  );
  expect(gasState({ ...p, temperature: 600 }).pressure).toBeCloseTo(
    base.pressure * 2,
    10,
  );
  expect(base.pv / p.amount / p.temperature).toBeCloseTo(GAS_R, 10);
});
it("normalizes binomial probabilities including certain and impossible outcomes", () => {
  for (let n = 1; n <= 12; n++)
    for (const p of [0, 0.2, 0.5, 0.8, 1]) {
      const dist = binomial(n, p);
      expect(dist.reduce((s, v) => s + v, 0)).toBeCloseTo(1, 12);
      expect(dist.reduce((s, v, k) => s + k * v, 0)).toBeCloseTo(n * p, 12);
    }
});
it("batches extend the same random sequence and remain reproducible", () => {
  const short = sampleCoins(6, 0.5, 10),
    long = sampleCoins(6, 0.5, 1000);
  expect(long.history.slice(0, 10)).toEqual(short.history);
  expect(long.bins.reduce((a, b) => a + b, 0)).toBe(1000);
  expect(long.frequency).toBeCloseTo(0.5, 1);
  expect(sampleCoins(6, 0, 10).bins[0]).toBe(10);
  expect(sampleCoins(6, 1, 10).bins[6]).toBe(10);
  expect(sampleCoins(1, 0.5, 0).frequency).toBeNull();
});
it("matches geometric lit projected area to lunar phase fraction", () => {
  for (const angle of [0, 45, 90, 135, 180, 225, 270, 315, 360]) {
    const pts = moonLitPath(angle)
      .slice(1, -1)
      .split("L")
      .map((p) => p.split(",").map(Number));
    const area = Math.abs(
      pts.reduce((s, p, i) => {
        const q = pts[(i + 1) % pts.length];
        return s + p[0] * q[1] - q[0] * p[1];
      }, 0) / 2,
    );
    expect(area / (Math.PI * 10000)).toBeCloseTo(moonState(angle).fraction, 2);
  }
  expect(moonState(0).name).toBe("新月");
  expect(moonState(180).fraction).toBe(1);
  expect(moonState(90).name).toBe("上弦月");
  expect(moonState(270).name).toBe("下弦月");
});
