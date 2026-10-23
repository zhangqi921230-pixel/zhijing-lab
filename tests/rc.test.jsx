import { it, expect } from "vitest";
import * as T from "three";
import { buildScene } from "../src/ThreeScene.jsx";
import { rcPlot } from "../src/RCGuide.jsx";
import { rc } from "../src/advancedModels.mjs";
it("选通路径只突出当前支路，关闭后恢复原线色且复用几何", () => {
  const root = new T.Group(),
    p = { u: 6, r: 500, c: 4, mode: 0, trace: 0, time: 1 };
  buildScene(root, "capacitor", p);
  const names = [
    "rc-charge-lead",
    "rc-source-return-lead",
    "rc-discharge-lead",
    "rc-resistor-capacitor-lead",
    "rc-selector",
  ];
  const objects = names.map((name) => root.getObjectByName(name));
  const colors = objects.map((o) => o.material.color.getHex());
  const geometry = objects.map((o) => o.geometry);
  for (const mode of [0, 1]) {
    root.userData.update({ ...p, mode, trace: 1 });
    expect(objects.map((o) => o.userData.selectedBranch)).toEqual([
      mode === 0,
      mode === 0,
      mode === 1,
      true,
      true,
    ]);
    root.userData.update({ ...p, mode, trace: 0 });
    expect(objects.map((o) => o.material.color.getHex())).toEqual(colors);
    objects.forEach((o, i) => expect(o.geometry).toBe(geometry[i]));
  }
});
it("RC 正负极板显示等量标记，选择开关只连接一个触点", () => {
  const root = new T.Group();
  const p = { u: 6, r: 500, c: 4, mode: 0 };
  buildScene(root, "capacitor", { ...p, time: 0 });
  for (const mode of [0, 1])
    for (const t of [0, 0.02, 0.2, 1, 2, 10]) {
      root.userData.update({ ...p, mode, time: t });
      root.userData.animate(performance.now() + 1000, true);
      const count = (name) => root.getObjectByName(name).count;
      expect(count("rc-positive-charge")).toBe(count("rc-negative-charge"));
      expect(count("rc-positive-charge")).toBe(
        Math.round((rc({ ...p, mode }, t).voltage / p.u) * 25),
      );
      root.updateMatrixWorld(true);
      const selector = root.getObjectByName("rc-selector"),
        end = selector.localToWorld(
          new T.Vector3(0, selector.geometry.parameters.height / 2, 0),
        );
      expect(end.x).toBeCloseTo(-1.2, 12);
      expect(end.z).toBeCloseTo(mode ? -0.6 : -1.4, 12);
      expect(selector.userData.value).toBe(mode ? 0 : 1);
    }
});
it("RC 图线坐标与电压及电流公式一致，包含一个时间常数", () => {
  for (const mode of [0, 1])
    for (const r of [100, 500, 2000])
      for (const c of [1, 4, 10])
        for (const current of [false, true]) {
          const p = { mode, r, c, u: 6 },
            points = rcPlot(p, current),
            tau = rc(p, 0).tau;
          points.forEach(([x, y], i) => {
            const q = rc(p, (i / 150) * 5 * tau),
              fraction = current
                ? Math.abs(q.current) / (p.u / p.r)
                : q.voltage / p.u;
            expect(x).toBeCloseTo(46 + (i / 150) * 360, 12);
            expect((180 - y) / 140).toBeCloseTo(fraction, 12);
          });
          expect((180 - points[30][1]) / 140).toBeCloseTo(
            current || mode ? Math.exp(-1) : 1 - Math.exp(-1),
            12,
          );
        }
});
