import { waveState, buoyancyState } from "./visualPhysics.mjs";
import { molecules } from "./moleculeGeometry.mjs";
import { riverHeight, carveDrainage, TERRAIN_SCALE } from "./terrainWorld.mjs";
import { landscapeHeight, TERRAIN_RESOLUTION } from "./terrainWorld.mjs";
import { advancedCalculate } from "./advancedModels.mjs";
import { leverState } from "./leverModel.mjs";
export const rad = (d) => (d * Math.PI) / 180;
export const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
export function lens(u, f) {
  return Math.abs(u - f) < 1e-9
    ? { v: null, m: null }
    : { v: (f * u) / (u - f), m: -f / (u - f) };
}
export function refraction(angle, n1, n2) {
  const s = (n1 * Math.sin(rad(angle))) / n2;
  const tir = s > 1 + 1e-12;
  return {
    tir,
    angle: tir
      ? null
      : (Math.asin(Math.abs(s - 1) < 1e-12 ? 1 : clamp(s, -1, 1)) * 180) /
        Math.PI,
    critical: n1 > n2 ? (Math.asin(n2 / n1) * 180) / Math.PI : null,
  };
}
export function projectile(p, t) {
  const vx = p.speed * Math.cos(rad(p.angle)),
    vy = p.speed * Math.sin(rad(p.angle));
  const flight = (vy + Math.sqrt(vy * vy + 19.6 * p.height)) / 9.8;
  const time = clamp(t, 0, flight);
  return {
    x: vx * time,
    y: Math.max(0, p.height + vy * time - 4.9 * time * time),
    vx,
    vy: vy - 9.8 * time,
    flight,
    range: vx * flight,
    maxHeight: p.height + (vy * vy) / 19.6,
  };
}
export function reaction(h2, o2, requested) {
  const extent = Math.min(Math.floor(h2 / 2), o2, requested);
  return {
    h2: h2 - 2 * extent,
    o2: o2 - extent,
    h2o: 2 * extent,
    extent,
    H: 2 * h2,
    O: 2 * o2,
  };
}
export function ph(acid, base, c) {
  const diff = (c * (acid - base)) / (acid + base);
  const root = Math.sqrt(diff * diff + 4e-14);
  const h = diff >= 0 ? (diff + root) / 2 : 2e-14 / (root - diff);
  return -Math.log10(h);
}
export function solubility(t) {
  const points = [13.3, 31.6, 63.9, 110, 169],
    i = Math.min(3, Math.floor(clamp(t, 0, 80) / 20));
  return points[i] + ((points[i + 1] - points[i]) * (t - i * 20)) / 20;
}
export function genetics(a, b) {
  const alleles = [
    ["A", "A"],
    ["A", "a"],
    ["a", "a"],
  ];
  const cells = alleles[a].flatMap((x) =>
    alleles[b].map((y) => [x, y].sort().join("")),
  );
  return {
    cells,
    AA: cells.filter((x) => x === "AA").length / 4,
    Aa: cells.filter((x) => x === "Aa").length / 4,
    aa: cells.filter((x) => x === "aa").length / 4,
  };
}
export function daynightState(hour, lat) {
  const altitude =
    (Math.asin(Math.cos(rad(lat)) * Math.cos(rad((hour - 12) * 15))) * 180) /
    Math.PI;
  return {
    altitude,
    phase:
      Math.abs(altitude) < 1e-8 ? "horizon" : altitude > 0 ? "day" : "night",
    noon: 90 - Math.abs(lat),
  };
}
export function solar(day, lat) {
  const lambda = (2 * Math.PI * day) / 365;
  const decl =
    (Math.asin(Math.sin(rad(23.44)) * Math.sin(lambda)) * 180) / Math.PI;
  const c = -Math.tan(rad(lat)) * Math.tan(rad(decl));
  const daylight = c <= -1 ? 24 : c >= 1 ? 0 : (24 * Math.acos(c)) / Math.PI;
  return { decl, daylight, noon: 90 - Math.abs(lat - decl), lambda };
}
export const terrain = landscapeHeight;
// Marching triangles: the same piecewise-linear surface is used by Three.js and contours.
export function terrainGrid(n = TERRAIN_RESOLUTION) {
  const pts = [];
  for (let i = 0; i <= n; i++)
    for (let j = 0; j <= n; j++) {
      let x = -3 + (6 * j) / n,
        z = -3 + (6 * i) / n;
      pts.push([x, terrain(x, z), z]);
    }
  carveDrainage(pts, n);
  const triangles = [];
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++) {
      const a = i * (n + 1) + j,
        b = a + 1,
        c = a + n + 1,
        d = c + 1;
      triangles.push([pts[a], pts[c], pts[b]], [pts[b], pts[c], pts[d]]);
    }
  return triangles;
}
export const terrainTriangles = terrainGrid();
export function waterTriangles() {
  const result = [];
  for (const tri of terrainTriangles) {
    let poly = tri.map(([x, h, z]) => ({
      x,
      z,
      y: riverHeight(z),
      depth: riverHeight(z) - h,
    }));
    const clipped = [];
    for (let i = 0; i < 3; i++) {
      const a = poly[i],
        b = poly[(i + 1) % 3],
        inside = a.depth > 0,
        next = b.depth > 0;
      if (inside) clipped.push(a);
      if (inside !== next) {
        const t = a.depth / (a.depth - b.depth);
        clipped.push({
          x: a.x + (b.x - a.x) * t,
          z: a.z + (b.z - a.z) * t,
          y: a.y + (b.y - a.y) * t,
          depth: 0,
        });
      }
    }
    for (let i = 1; i < clipped.length - 1; i++)
      result.push([clipped[0], clipped[i], clipped[i + 1]]);
  }
  return result;
}
export const shorelineWater = waterTriangles();

// Interpolate the displayed piecewise-linear surface, not the analytic source
// function: that distinction matters at ridges and near triangle diagonals.
export function terrainHeightAt(x, z) {
  const n = Math.sqrt(terrainTriangles.length / 2);
  const gx = ((Math.max(-3, Math.min(3, x)) + 3) / 6) * n;
  const gz = ((Math.max(-3, Math.min(3, z)) + 3) / 6) * n;
  const col = Math.min(n - 1, Math.floor(gx));
  const row = Math.min(n - 1, Math.floor(gz));
  const u = gx - col,
    v = gz - row;
  const index = (row * n + col) * 2;
  const [a, c, b] = terrainTriangles[index];
  const d = terrainTriangles[index + 1][2];
  return u + v <= 1
    ? a[1] * (1 - u - v) + b[1] * u + c[1] * v
    : b[1] * (1 - v) + c[1] * (1 - u) + d[1] * (u + v - 1);
}

// Facet slope uses the same selected triangle as height interpolation.
export function terrainReadingAt(x, z) {
  x = Math.max(-3, Math.min(3, x));
  z = Math.max(-3, Math.min(3, z));
  const n = Math.sqrt(terrainTriangles.length / 2);
  const gx = ((x + 3) / 6) * n,
    gz = ((z + 3) / 6) * n;
  const col = Math.min(n - 1, Math.floor(gx)),
    row = Math.min(n - 1, Math.floor(gz));
  const index = (row * n + col) * 2 + (gx - col + gz - row <= 1 ? 0 : 1);
  const [a, b, c] = terrainTriangles[index];
  const ux = b[0] - a[0],
    uz = b[2] - a[2],
    uy = b[1] - a[1];
  const vx = c[0] - a[0],
    vz = c[2] - a[2],
    vy = c[1] - a[1];
  const determinant = ux * vz - vx * uz;
  const dx = (uy * vz - vy * uz) / determinant,
    dz = (ux * vy - vx * uy) / determinant;
  return {
    x,
    z,
    height: terrainHeightAt(x, z),
    slope: (Math.atan(Math.hypot(dx, dz) / TERRAIN_SCALE) * 180) / Math.PI,
  };
}

export function terrainSectionEndpoints(position = 50, angle = 0) {
  const theta = (Math.max(0, Math.min(90, angle)) * Math.PI) / 180;
  const d = [Math.cos(theta), Math.sin(theta)];
  const offset = Math.max(0, Math.min(100, position)) * 0.06 - 3;
  const c = [-d[1] * offset, d[0] * offset];
  let lo = -Infinity,
    hi = Infinity;
  for (let axis = 0; axis < 2; axis++) {
    if (Math.abs(d[axis]) < 1e-12) continue;
    lo = Math.max(lo, (-3 - c[axis]) / d[axis]);
    hi = Math.min(hi, (3 - c[axis]) / d[axis]);
  }
  return [lo, hi].map((t) =>
    c.map((v, i) => Math.max(-3, Math.min(3, v + t * d[i]))),
  );
}

export function terrainSection(position = 50, angle = 0) {
  const [a, b] = terrainSectionEndpoints(position, angle);
  const dx = b[0] - a[0],
    dz = b[1] - a[1];
  const n = Math.sqrt(terrainTriangles.length / 2),
    step = 6 / n;
  const ts = [0, 1];
  const crossing = (value, start, delta) => {
    if (Math.abs(delta) < 1e-12) return;
    const t = (value - start) / delta;
    if (t > 1e-10 && t < 1 - 1e-10) ts.push(t);
  };
  // Split at every grid edge and triangle diagonal; interpolation between
  // successive samples is then identical to the rendered triangular mesh.
  for (let j = 1; j < n; j++) {
    crossing(-3 + j * step, a[0], dx);
    crossing(-3 + j * step, a[1], dz);
  }
  for (let j = 1; j < 2 * n; j++) crossing(-6 + j * step, a[0] + a[1], dx + dz);
  return ts
    .sort((x, y) => x - y)
    .filter((t, i, values) => i === 0 || t - values[i - 1] > 1e-10)
    .map((t) => {
      const x = a[0] + dx * t,
        z = a[1] + dz * t;
      return [x, terrainHeightAt(x, z), z];
    });
}
const contourCache = new Map();
export function contourSegments(level) {
  if (contourCache.has(level)) return contourCache.get(level);
  const seg = [];
  for (const tri of terrainTriangles) {
    const hits = [];
    for (let i = 0; i < 3; i++) {
      const a = tri[i],
        b = tri[(i + 1) % 3];
      if ((a[1] <= level && b[1] > level) || (b[1] <= level && a[1] > level)) {
        let t = (level - a[1]) / (b[1] - a[1]);
        hits.push([a[0] + (b[0] - a[0]) * t, level, a[2] + (b[2] - a[2]) * t]);
      }
    }
    if (hits.length === 2) seg.push(hits);
  }
  if (contourCache.size >= 128)
    contourCache.delete(contourCache.keys().next().value);
  contourCache.set(level, seg);
  return seg;
}
export function photo(p) {
  return (
    (p.light / (p.light + 20)) *
    (p.co2 / (p.co2 + 20)) *
    Math.exp(-(((p.temp - 25) / 15) ** 2)) *
    100
  );
}
export function calculate(id, p, t = 0) {
  const advanced = advancedCalculate(id, p, t);
  if (advanced) return advanced;
  const f = (label, value, unit = "") => ({ label, value, unit });
  switch (id) {
    case "waves":
      return [
        f("波长", p.speed / p.frequency, "m"),
        f("周期", 1 / p.frequency, "s"),
        f("观察点位移", waveState(p, p.probe, t).total, "m"),
      ];
    case "buoyancy": {
      const q = buoyancyState(p);
      return [
        f("浮力", q.force, "N"),
        f("重力", q.weight, "N"),
        f("排水体积", q.displaced, "L"),
      ];
    }
    case "fractions":
      return [
        { ...f("分数值", p.n / p.d), digits: 4 },
        f("每份圆心角", 360 / p.d, "°"),
      ];
    case "pythagoras":
      return [
        f("a² + b²", p.a * p.a + p.b * p.b),
        f("斜边 c", Math.hypot(p.a, p.b)),
      ];
    case "linear":
      return [f("观察点 y", p.k * p.x + p.b), f("斜率 k", p.k)];
    case "circle":
      return [
        f("周长", 2 * Math.PI * p.r, "cm"),
        f("面积", Math.PI * p.r * p.r, "cm²"),
      ];
    case "cube":
      return [
        f("表面积", 6 * p.edge * p.edge, "cm²"),
        f("体积", p.edge ** 3, "cm³"),
      ];
    case "ohm":
      return [
        f("电流", p.closed ? p.u / p.r : 0, "A"),
        f("电阻功率", p.closed ? (p.u * p.u) / p.r : 0, "W"),
      ];
    case "lens": {
      const q = lens(p.u, p.f);
      return [
        f("像距 v", q.v === null ? "无有限像" : q.v, "cm"),
        f("放大率 m", q.m === null ? "—" : q.m),
        f("光屏位置", p.screen ?? 15, "cm"),
      ];
    }
    case "refraction": {
      const q = refraction(p.angle, p.n1, p.n2);
      return [
        f("折射角", q.tir ? "全反射" : q.angle, "°"),
        f("反射角", p.angle, "°"),
      ];
    }
    case "lever": {
      const q = leverState(p, t);
      return [
        f("左侧力矩", q.leftTorque, "N·m"),
        f("右侧力矩", q.rightTorque, "N·m"),
        f("杆的转角", q.angle, "°"),
      ];
    }
    case "projectile": {
      const q = projectile(p, t);
      return [f("水平位移", q.x, "m"), f("离地高度", q.y, "m")];
    }
    case "molecule":
      return [
        f("分子", molecules[p.type].formula),
        f("键角", molecules[p.type].angle, "°"),
      ];
    case "conservation": {
      const q = reaction(p.h2, p.o2, p.progress);
      return [
        f("氢原子总数", q.H, "个"),
        f("氧原子总数", q.O, "个"),
        f("生成水分子", q.h2o, "个"),
      ];
    }
    case "dilution":
      return [
        f("溶质质量", p.solute, "g"),
        f("质量分数", (100 * p.solute) / (p.solute + p.water + p.add), "%"),
      ];
    case "acid":
      return [
        f("pH", ph(p.acid, p.base, p.c)),
        f("中和所需 NaOH", p.acid, "mL"),
      ];
    case "solubility": {
      const capacity = (solubility(p.temp) * p.water) / 100;
      return [
        f("已溶解", Math.min(p.mass, capacity), "g"),
        f("未溶 / 析出", Math.max(0, p.mass - capacity), "g"),
      ];
    }
    case "cell":
      return [
        f(
          "当前结构",
          [
            "植物细胞",
            "细胞核",
            "中央液泡",
            "叶绿体",
            "线粒体",
            "高尔基体",
            "内质网",
          ][p.part],
        ),
        f("模式图", "非显微照片"),
      ];
    case "microscope":
      return [f("总放大倍数", p.mag, "×"), f("相对视野直径", 100 / p.mag)];
    case "photosynthesis":
      return [f("总光合相对速率", photo(p), "%"), f("模型类型", "定性示意")];
    case "inheritance": {
      const q = genetics(p.parent1, p.parent2);
      return [
        f("显性表现概率", (q.AA + q.Aa) * 100, "%"),
        f("隐性表现概率", q.aa * 100, "%"),
      ];
    }
    case "foodweb":
      return [
        f("初级消费者", (p.energy * p.eff) / 100, "kJ"),
        f("次级消费者", p.energy * (p.eff / 100) ** 2, "kJ"),
      ];
    case "contour":
      return [f("切面海拔", p.level, "m"), f("等高距", p.interval, "m")];
    case "seasons": {
      const q = solar(p.day, p.lat);
      return [
        f("太阳直射纬度", q.decl, "°"),
        f("理论昼长", q.daylight, "h"),
        f("正午太阳高度", q.noon, "°"),
      ];
    }
    case "daynight":
      return [
        f("自转角", p.hour * 15, "°"),
        f("太阳高度", daynightState(p.hour, p.lat).altitude, "°"),
      ];
    case "water":
      return [
        f("地表径流", p.rain * (1 - (p.infil + p.evap) / 100), "mm"),
        f("下渗", (p.rain * p.infil) / 100, "mm"),
        f("蒸散", (p.rain * p.evap) / 100, "mm"),
      ];
    case "plates":
      return [
        f("边界类型", ["张裂", "大陆碰撞", "转换"][p.type]),
        f("演示进度", p.progress, "%"),
      ];
    default:
      return [];
  }
}
export const format = (x, digits = 2) =>
  typeof x === "number"
    ? Number(x.toFixed(digits)).toLocaleString("zh-CN", {
        maximumFractionDigits: digits,
      })
    : x;
