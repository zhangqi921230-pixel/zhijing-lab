import { describe, it, expect } from "vitest";
import { lessons, subjects, defaults } from "../src/lessons.mjs";
import {
  calculate,
  lens,
  refraction,
  projectile,
  reaction,
  ph,
  solubility,
  genetics,
  solar,
  terrainTriangles,
  contourSegments,
  photo,
} from "../src/models.mjs";
describe("课程完整性与参数边界", () => {
  it("每科不少于五课，标识唯一", () => {
    expect(new Set(lessons.map((x) => x.id)).size).toBe(lessons.length);
    subjects.forEach((s) =>
      expect(
        lessons.filter((l) => l.subject === s.id).length,
      ).toBeGreaterThanOrEqual(5),
    );
  });
  for (const l of lessons)
    it(`${l.title} 默认及所有参数端点读数有效`, () => {
      let states = [defaults(l)];
      for (const param of l.params) {
        states.push(
          { ...defaults(l), [param.key]: param.min },
          { ...defaults(l), [param.key]: param.max },
        );
      }
      for (const p of states) {
        const result = calculate(l.id, p);
        expect(result.length).toBeGreaterThan(0);
        for (const r of result) {
          expect(r.value).not.toBeUndefined();
          if (typeof r.value === "number")
            expect(Number.isFinite(r.value)).toBe(true);
        }
      }
    });
});
describe("数学", () => {
  it("3/8 对应135度已选角度", () =>
    expect(calculate("fractions", { n: 3, d: 8 })[0].value).toBe(0.375));
  it("3、4、5 三角形及非整数边", () => {
    expect(calculate("pythagoras", { a: 3, b: 4 })[1].value).toBe(5);
    for (let a = 1; a < 6; a += 0.2)
      expect(calculate("pythagoras", { a, b: 2.3 })[1].value ** 2).toBeCloseTo(
        a * a + 2.3 ** 2,
        10,
      );
  });
  it("圆尺度增长与立方体面积体积", () => {
    expect(
      calculate("circle", { r: 4 })[1].value /
        calculate("circle", { r: 2 })[1].value,
    ).toBe(4);
    expect(calculate("cube", { edge: 2 }).map((v) => v.value)).toEqual([24, 8]);
  });
  it("一次函数负斜率及常数退化", () => {
    expect(calculate("linear", { k: -2, b: 1, x: 3 })[0].value).toBe(-5);
    expect(calculate("linear", { k: 0, b: 4, x: 3 })[0].value).toBe(4);
  });
});
describe("物理边界与守恒", () => {
  it("欧姆定律：开路无流，功率一致", () => {
    expect(
      calculate("ohm", { u: 6, r: 20, closed: 1 }).map((v) => v.value),
    ).toEqual([0.3, 1.8]);
    expect(
      calculate("ohm", { u: 12, r: 5, closed: 0 }).map((v) => v.value),
    ).toEqual([0, 0]);
  });
  it("薄透镜：2f、焦点、虚像及方程残差", () => {
    expect(lens(20, 10)).toEqual({ v: 20, m: -1 });
    expect(lens(10, 10)).toEqual({ v: null, m: null });
    expect(lens(5, 10)).toEqual({ v: -10, m: 2 });
    for (let u = 5; u <= 60; u++)
      if (u !== 10) expect(1 / u + 1 / lens(u, 10).v).toBeCloseTo(0.1, 12);
  });
  it("斯涅尔定律与临界角", () => {
    expect(refraction(0, 1, 1.5).angle).toBe(0);
    expect(refraction(50, 1.5, 1).tir).toBe(true);
    expect(refraction(40, 1.5, 1).tir).toBe(false);
    expect(refraction(40, 1, 1).angle).toBeCloseTo(40, 10);
    let q = refraction(45, 1, 1.5);
    expect(1.5 * Math.sin((q.angle * Math.PI) / 180)).toBeCloseTo(
      Math.SQRT1_2,
      12,
    );
  });
  it("力矩平衡", () =>
    expect(
      calculate("lever", { f1: 10, l1: 1, f2: 5, l2: 2 }).map((v) => v.value),
    ).toEqual([10, 10, 0]));
  it("抛体着地、射程及机械能", () => {
    const p = { speed: 20, angle: 45, height: 0 };
    let q = projectile(p, 0);
    expect(q.range).toBeCloseTo(400 / 9.8, 10);
    expect(projectile(p, 100).y).toBe(0);
    for (let t = 0; t < q.flight; t += 0.1) {
      let z = projectile(p, t);
      expect(0.5 * (z.vx * z.vx + z.vy * z.vy) + 9.8 * z.y).toBeCloseTo(200, 8);
    }
  });
});
describe("化学质量与计量", () => {
  it("原子守恒及限制反应物遍历", () => {
    for (let h = 0; h <= 8; h++)
      for (let o = 0; o <= 4; o++)
        for (let batch = 0; batch <= 4; batch++) {
          let q = reaction(h, o, batch);
          expect(2 * q.h2 + 2 * q.h2o).toBe(2 * h);
          expect(2 * q.o2 + q.h2o).toBe(2 * o);
          expect(q.h2).toBeGreaterThanOrEqual(0);
          expect(q.o2).toBeGreaterThanOrEqual(0);
        }
  });
  it("加水稀释保持溶质质量", () => {
    expect(
      calculate("dilution", { solute: 10, water: 90, add: 100 }).map(
        (v) => v.value,
      ),
    ).toEqual([10, 5]);
  });
  it("中和点与酸碱数值稳定性", () => {
    expect(ph(50, 50, 0.1)).toBeCloseTo(7, 12);
    expect(ph(50, 0, 0.1)).toBeCloseTo(1, 10);
    expect(ph(50, 100, 0.1)).toBeCloseTo(12.522878745, 8);
    expect(ph(50, 49, 0.1)).toBeLessThan(7);
    expect(ph(50, 51, 0.1)).toBeGreaterThan(7);
  });
  it("溶解度表与固液质量守恒", () => {
    expect([0, 20, 40, 60, 80].map(solubility)).toEqual([
      13.3, 31.6, 63.9, 110, 169,
    ]);
    for (let temp = 0; temp <= 80; temp++) {
      let r = calculate("solubility", { temp, water: 100, mass: 50 });
      expect(r[0].value + r[1].value).toBeCloseTo(50, 10);
    }
  });
});
describe("生物与地理", () => {
  it("遗传概率和为1，杂合自交1:2:1", () => {
    expect(genetics(1, 1)).toEqual({
      cells: ["AA", "Aa", "Aa", "aa"],
      AA: 0.25,
      Aa: 0.5,
      aa: 0.25,
    });
    for (let a = 0; a < 3; a++)
      for (let b = 0; b < 3; b++) {
        let q = genetics(a, b);
        expect(q.AA + q.Aa + q.aa).toBe(1);
      }
  });
  it("暗条件总光合为零；高光边际收益降低", () => {
    expect(photo({ light: 0, co2: 70, temp: 25 })).toBe(0);
    let a = (l) => photo({ light: l, co2: 70, temp: 25 });
    expect(a(100) - a(90)).toBeLessThan(a(20) - a(10));
  });
  it("显微镜视野和能量递减", () => {
    expect(calculate("microscope", { mag: 400 })[1].value).toBe(0.25);
    expect(
      calculate("foodweb", { energy: 1000, eff: 10 }).map((v) => v.value),
    ).toEqual([100, 10.000000000000002]);
  });
  it("春分、夏至、极昼及南北对称", () => {
    expect(solar(0, 30).daylight).toBe(12);
    expect(solar(365 / 4, 30).decl).toBeCloseTo(23.44, 10);
    expect(solar(365 / 4, 80).daylight).toBe(24);
    expect(solar(365 / 4, -80).daylight).toBe(0);
    expect(solar(120, 45).daylight + solar(120, -45).daylight).toBeCloseTo(
      24,
      10,
    );
  });
  it("昼夜：正午与午夜", () => {
    expect(calculate("daynight", { hour: 12, lat: 30 })[1].value).toBeCloseTo(
      60,
      10,
    );
    expect(calculate("daynight", { hour: 0, lat: 30 })[1].value).toBeCloseTo(
      -60,
      10,
    );
  });
  it("流域水量守恒，端点无负数", () => {
    for (let infil = 0; infil <= 80; infil += 5)
      for (let evap = 0; evap <= 20; evap++) {
        let r = calculate("water", { rain: 100, infil, evap });
        expect(r.reduce((s, v) => s + v.value, 0)).toBeCloseTo(100, 10);
        r.forEach((v) => expect(v.value).toBeGreaterThanOrEqual(0));
      }
  });
  it("等高线位于网格三角形交线，同线等高", () => {
    expect(terrainTriangles).toHaveLength(160 * 160 * 2);
    for (let h = 100; h <= 900; h += 100) {
      let seg = contourSegments(h);
      expect(seg.length).toBeGreaterThan(0);
      for (const ends of seg)
        for (const [x, y, z] of ends) {
          expect(y).toBe(h);
          expect(Math.abs(x)).toBeLessThanOrEqual(3);
          expect(Math.abs(z)).toBeLessThanOrEqual(3);
          // A contour endpoint lies in this grid cell or an adjacent cell.
          // Check those triangle edges instead of scanning all 51,200 triangles.
          const col = Math.floor(((x + 3) / 6) * 160),
            row = Math.floor(((z + 3) / 6) * 160);
          const candidates = [];
          for (let r = Math.max(0, row - 1); r <= Math.min(159, row + 1); r++)
            for (let c = Math.max(0, col - 1); c <= Math.min(159, col + 1); c++)
              candidates.push(
                ...terrainTriangles.slice(
                  (r * 160 + c) * 2,
                  (r * 160 + c) * 2 + 2,
                ),
              );
          const onEdge = candidates.some((tri) =>
            tri.some((a, i) => {
              let b = tri[(i + 1) % 3];
              if (a[1] === b[1]) return false;
              let k = (h - a[1]) / (b[1] - a[1]);
              return (
                k >= 0 &&
                k <= 1 &&
                Math.abs(a[0] + k * (b[0] - a[0]) - x) < 1e-8 &&
                Math.abs(a[2] + k * (b[2] - a[2]) - z) < 1e-8
              );
            }),
          );
          expect(onEdge).toBe(true);
        }
    }
  });
});
