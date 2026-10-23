import { it, expect } from "vitest";
import * as THREE from "three";
import { buildScene } from "../src/ThreeScene.jsx";
import { lessons, defaults } from "../src/lessons.mjs";
import {
  rc,
  incline,
  precipitate,
  seismic,
  biodiversity,
  functionValue,
  funnelFill,
} from "../src/advancedModels.mjs";
it("挡板约束后合力为零，物体不穿过终点", () => {
  const p = { mass: 2, angle: 40, mu: 0.1 },
    q = incline(p, 20);
  expect(q.s).toBe(4);
  expect(q.v).toBe(0);
  expect(q.a).toBe(0);
  expect(q.parallel - q.friction - q.stopForce).toBeCloseTo(0, 12);
});
it("生态样方可见个体数量与统计一致", () => {
  const root = new THREE.Group(),
    p = {
      ...defaults(lessons.find((l) => l.id === "biodiversity")),
      plants: 13,
      insects: 7,
      birds: 3,
      fungi: 5,
    };
  buildScene(root, "biodiversity", p);
  for (const time of [0, 8, 20]) {
    root.userData.update({ ...p, time });
    for (const [name, count] of [
      ["plant", 13],
      ["insect", 7],
      ["bird", 3],
      ["fungus", 5],
    ])
      expect(
        root.children.filter((o) => o.name === `sample-${name}` && o.visible),
      ).toHaveLength(count);
  }
});
for (const id of [
  "solids",
  "incline",
  "capacitor",
  "precipitation",
  "microscope",
  "biodiversity",
  "volcano",
  "earthquake",
]) {
  it(`${id} 构建真实几何，时间更新不重建场景`, () => {
    const root = new THREE.Group(),
      p = defaults(lessons.find((l) => l.id === id));
    buildScene(root, id, p);
    expect(root.children.length).toBeGreaterThan(3);
    const children = [...root.children];
    for (const time of [0, 1, 8, 20]) {
      root.userData.update({ ...p, time });
      root.updateMatrixWorld(true);
      root.traverse((o) =>
        expect(o.matrixWorld.elements.every(Number.isFinite)).toBe(true),
      );
    }
    expect(root.children).toEqual(children);
  });
}
it("RC 初值、时间常数、微分电流和能量一致", () => {
  for (const mode of [0, 1]) {
    const p = { mode, u: 6, r: 500, c: 4 },
      q = rc(p, 2);
    expect(q.tau).toBe(2);
    expect(rc(p, 0).voltage).toBe(mode ? 6 : 0);
    expect(q.voltage / 6).toBeCloseTo(
      mode ? Math.exp(-1) : 1 - Math.exp(-1),
      12,
    );
    const derivative =
      (rc(p, 2.00001).voltage - rc(p, 1.99999).voltage) / 0.00002;
    expect(derivative * 0.004).toBeCloseTo(q.current, 9);
    expect(q.energy).toBeCloseTo(0.5 * 0.004 * q.voltage ** 2, 12);
  }
});
it("斜面静止平衡和运动能量", () => {
  expect(incline({ mass: 2, angle: 15, mu: 0.5 }, 4).s).toBe(0);
  const p = { mass: 2, angle: 30, mu: 0.2 },
    q = incline(p, 0.3);
  expect(q.parallel - q.friction).toBeCloseTo(p.mass * q.a, 10);
  expect((q.parallel - q.friction) * q.s).toBeCloseTo(
    0.5 * p.mass * q.v ** 2,
    10,
  );
});
it("沉淀反应铜与氢氧根守恒，生成量受两种试剂共同限制", () => {
  for (const copper of [10, 50, 100])
    for (const base of [0, 20, 100])
      for (const t of [0, 4, 8, 20]) {
        const q = precipitate({ copper, base }, t);
        expect(q.cu + q.solid).toBeCloseTo(copper * 0.1, 12);
        expect(q.oh + 2 * q.solid).toBeCloseTo(q.delivered * 0.2, 12);
        expect(q.cu).toBeGreaterThanOrEqual(0);
        expect(q.oh).toBeGreaterThanOrEqual(0);
      }
});
it("地震波前在各自到时恰好经过台站", () => {
  const p = { depth: 15, distance: 40 },
    q = seismic(p, 0);
  expect(seismic(p, q.tp).pRadius).toBeCloseTo(q.distance, 12);
  expect(seismic(p, q.ts).sRadius).toBeCloseTo(q.distance, 12);
  expect(q.tp).toBeLessThan(q.ts);
});
it("多样性与函数定义域", () => {
  expect(
    biodiversity({ plants: 8, insects: 8, birds: 8, fungi: 8 }).diversity,
  ).toBeCloseTo(Math.log(4), 12);
  expect(
    biodiversity({ plants: 8, insects: 0, birds: 0, fungi: 0 }).diversity,
  ).toBe(0);
  const p = { type: 3, a: 2, b: 1, shift: 1 };
  expect(functionValue(p, 1)).toBeNull();
  expect(functionValue(p, 1.01)).toBeCloseTo(201, 8);
});

it("滴液漏斗锥体和圆柱实际几何容积等于余液体积", () => {
  for (const volume of [0, 0.1, 1, 5, 10, 50, 100]) {
    const q = funnelFill(volume);
    const geometricVolume =
      (Math.PI * q.coneRadius ** 2 * q.coneHeight) / 3 +
      Math.PI * 0.65 ** 2 * q.cylinderHeight;
    expect(geometricVolume / q.unitVolume).toBeCloseTo(volume, 10);
  }
});
it("不同装液量下烧杯液面与刻度一致，沉淀颗粒不越出液体", () => {
  const root = new THREE.Group();
  buildScene(root, "precipitation", { copper: 50, base: 50, time: 0 });
  for (const copper of [10, 50, 100])
    for (const base of [0, 50, 100])
      for (const time of [0.1, 4, 8, 20]) {
        root.userData.update({ copper, base, time });
        const q = precipitate({ copper, base }, time),
          liquid = root.getObjectByName("reaction-liquid");
        liquid.geometry.computeBoundingBox();
        const liquidTop = liquid.position.y + liquid.geometry.boundingBox.max.y;
        expect(liquidTop).toBeCloseTo(root.userData.measurement.surface, 6);
        expect((liquidTop + 0.82) / (2.2 / 250)).toBeCloseTo(
          copper + q.delivered,
          4,
        );
        const particles = root.getObjectByName("reaction-precipitate"),
          matrix = new THREE.Matrix4(),
          vertex = new THREE.Vector3(),
          vertices = particles.geometry.attributes.position;
        for (let i = 0; i < particles.count; i++) {
          particles.getMatrixAt(i, matrix);
          let lowest = Infinity,
            highest = -Infinity;
          for (let j = 0; j < vertices.count; j++) {
            vertex.fromBufferAttribute(vertices, j).applyMatrix4(matrix);
            lowest = Math.min(lowest, vertex.y);
            highest = Math.max(highest, vertex.y);
          }
          expect(lowest).toBeGreaterThanOrEqual(-0.82 - 1e-6);
          expect(highest).toBeLessThanOrEqual(
            root.userData.measurement.surface + 1e-6,
          );
        }
      }
});

it("显微镜物镜转位过程不碰撞载玻片，结束后选中物镜对准光轴", () => {
  const root = new THREE.Group(),
    p = defaults(lessons.find((x) => x.id === "microscope"));
  buildScene(root, "microscope", p);
  for (const mag of [40, 100, 400])
    for (const coarse of [0, 50, 100])
      for (const focus of [0, 100]) {
        root.userData.update({ ...p, mag, coarse, focus });
        const now = performance.now();
        for (const elapsed of [0, 90, 180, 270, 400]) {
          root.userData.animate(now + elapsed, false);
          root.updateMatrixWorld(true);
          const slideBounds = new THREE.Box3().setFromObject(
            root.getObjectByName("microscope-slide"),
          );
          for (const candidate of [40, 100, 400]) {
            const bounds = new THREE.Box3().setFromObject(
              root.getObjectByName("objective-" + candidate),
            );
            expect(bounds.min.y).toBeGreaterThan(slideBounds.max.y);
          }
        }
        root.updateMatrixWorld(true);
        const objective = root.getObjectByName("objective-" + mag),
          pos = new THREE.Vector3();
        objective.getWorldPosition(pos);
        expect(pos.x).toBeCloseTo(-0.3, 10);
        expect(pos.z).toBeCloseTo(0.1, 10);
        const lensBounds = new THREE.Box3().setFromObject(objective),
          slideBounds = new THREE.Box3().setFromObject(
            root.getObjectByName("microscope-slide"),
          );
        expect(lensBounds.min.y).toBeGreaterThan(slideBounds.max.y);
      }
});

it("显微镜视野缩放、移动方向和高倍调焦敏感度", async () => {
  const { microscopeOptics } = await import("../src/MicroscopeField.jsx");
  const p = { mag: 100, coarse: 55, focus: 50, x: 10, y: 10 };
  const a = microscopeOptics(p),
    b = microscopeOptics({ ...p, mag: 400 });
  expect(a.fieldDiameter).toBe(1800);
  expect(b.fieldDiameter).toBe(450);
  expect(a.dx).toBe(-10);
  expect(a.dy).toBe(10);
  expect(b.dx).toBe(-40);
  expect(b.blur).toBeGreaterThan(a.blur);
  expect(microscopeOptics({ ...p, coarse: 50 }).blur).toBe(0);
});

it("光具座射线在真实像面相交，焦点处平行，虚像不产生实屏焦点", async () => {
  const { opticalState, objectHeight } = await import("../src/OpticalBench.js");
  const root = new THREE.Group();
  buildScene(root, "lens", { u: 30, f: 10, screen: 15, rays: 1 });
  for (const [u, f] of [
    [30, 10],
    [20, 10],
    [15, 10],
    [60, 20],
  ]) {
    const v = (u * f) / (u - f);
    root.userData.update({ u, f, screen: v, rays: 1 });
    const q = root.userData.optics;
    expect(q.focused).toBe(true);
    expect(q.spread).toBeCloseTo(0, 12);
    q.paths.forEach((ray) =>
      expect(ray.end).toBeCloseTo((-v / u) * objectHeight, 12),
    );
  }
  root.userData.update({ u: 10, f: 10, screen: 20, rays: 1 });
  const rays = root.userData.optics.paths;
  expect(rays[0].outgoing).toBeCloseTo(rays[2].outgoing, 12);
  expect(opticalState({ u: 8, f: 10, screen: 20 }).focused).toBe(false);
  for (const u of [5, 20, 60])
    for (const f of [5, 10, 20])
      for (const screen of [5, 80]) {
        root.userData.update({ u, f, screen, rays: 1 });
        root.traverse((o) => {
          const a = o.geometry?.attributes?.position?.array;
          if (a) expect([...a].every(Number.isFinite)).toBe(true);
        });
      }
});
