import { it, expect } from "vitest";
import * as THREE from "three";
import { buildCircuitBench, leads, terminals } from "../src/CircuitBench.js";
import { buildGlassLab } from "../src/GlassLab.js";
import { restoreSession, saveSession } from "../src/session.mjs";
import { lessons, defaults } from "../src/lessons.mjs";

it("电流表串联，电压表两端只接电阻对应端，不跨接电源或开关", () => {
  const graph = new Map();
  for (const [a, b] of leads) {
    expect(terminals[a]).toBeDefined();
    expect(terminals[b]).toBeDefined();
    graph.set(a, [...(graph.get(a) || []), b]);
    graph.set(b, [...(graph.get(b) || []), a]);
  }
  expect(graph.get("V+")).toEqual(["R+"]);
  expect(graph.get("V-")).toEqual(["R-"]);
  expect(graph.get("A+")).toEqual(["switch-out"]);
  expect(graph.get("A-")).toEqual(["R+"]);
  expect(graph.get("source+")).toEqual(["switch-in"]);
  expect(graph.get("source-")).toEqual(["R-"]);
});
it("实际导线网格的两端落在接线柱，整条导线不穿过桌面", () => {
  const root = new THREE.Group();
  buildCircuitBench(root, { u: 6, r: 20, closed: 1 });
  for (const [a, b] of leads) {
    const wire = root.getObjectByName(`lead:${a}:${b}`),
      curve = wire.geometry.parameters.path;
    expect(
      curve.getPoint(0).distanceTo(new THREE.Vector3(...terminals[a])),
    ).toBeLessThan(1e-8);
    expect(
      curve.getPoint(1).distanceTo(new THREE.Vector3(...terminals[b])),
    ).toBeLessThan(1e-8);
    const points = wire.geometry.getAttribute("position");
    for (let i = 0; i < points.count; i++)
      expect(points.getY(i)).toBeGreaterThan(-0.645);
  }
  const original = root.children.slice();
  root.userData.update({ u: 12, r: 5, closed: 0 });
  expect(root.children).toEqual(original);
});
it("达到溶解容量后晶体消失，降温后再出现，更新不重建器材", () => {
  const root = new THREE.Group(),
    p = { temp: 0, mass: 50, water: 100 };
  buildGlassLab(root, "solubility", p);
  const crystals = root.getObjectByName("solubility-crystals");
  expect(crystals.count).toBeGreaterThan(0);
  root.userData.update({ ...p, temp: 80 });
  expect(crystals.count).toBe(0);
  root.userData.update(p);
  expect(crystals.count).toBeGreaterThan(0);
  root.userData.update({ ...p, mass: 0 });
  expect(crystals.count).toBe(0);
});
const lesson = lessons.find((l) => l.id === "ohm");
const memory = () => {
  const values = new Map();
  return {
    getItem: (k) => values.get(k) || null,
    setItem: (k, v) => values.set(k, v),
  };
};
it("实验恢复时重算结果，不信任存储中的旧计算值", () => {
  const storage = memory(),
    p = { ...defaults(lesson), u: 12 };
  expect(
    saveSession(
      lesson,
      { p, t: 0, records: [{ parameters: p, t: 0, values: [{ value: 999 }] }] },
      storage,
    ),
  ).toBe(true);
  const restored = restoreSession(lesson, storage);
  expect(restored.restored).toBe(true);
  expect(restored.p.u).toBe(12);
  expect(restored.records[0].values[0].value).toBe(0.6);
});
it("损坏、越界或拒绝访问的存储安全回退，不阻断课堂", () => {
  expect(restoreSession(lesson, { getItem: () => "{" }).restored).toBe(false);
  const storage = memory();
  saveSession(
    lesson,
    { p: { ...defaults(lesson), r: 0 }, t: 0, records: [] },
    storage,
  );
  expect(restoreSession(lesson, storage).p.r).toBe(20);
  expect(
    saveSession(
      lesson,
      { p: defaults(lesson), t: 0, records: [] },
      {
        setItem() {
          throw Error("quota");
        },
      },
    ),
  ).toBe(false);
  expect(restoreSession(lesson, null).restored).toBe(false);
});
