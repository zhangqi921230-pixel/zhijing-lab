import { conicState } from "./conicGeometry.mjs";
import { functionFamilies } from "./functionFamilies.mjs";
import { dosingFraction } from "./precipitationDosing.mjs";
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
export const advancedIds = [
  "conics",
  "functions",
  "solids",
  "incline",
  "capacitor",
  "precipitation",
  "biodiversity",
  "volcano",
  "earthquake",
];
export const timedIds = [
  "waves",
  ...advancedIds.filter((id) => id !== "conics"),
  "microscope",
  "molecule",
  "lever",
];
export function functionValue(p, x) {
  const value = functionFamilies[p.type]?.evaluate((p.k ?? 1) * (x - p.shift));
  return value == null ? null : p.a === 0 ? p.b : p.a * value + p.b;
}
export function functionDerivative(p, x) {
  const k = p.k ?? 1,
    z = k * (x - p.shift);
  if (functionValue(p, x) === null) return null;
  if (k === 0) return 0;
  // A domain endpoint has no two-sided derivative, even when output scale is zero.
  if (p.type === 5 && z === 0) return null;
  if (p.a === 0) return 0;
  const derivative = [
    () => 2 * z,
    () => Math.cos(z),
    () => (z === 0 ? null : Math.sign(z)),
    () => -1 / (z * z),
    () => 3 * z * z,
    () => 1 / (2 * Math.sqrt(z)),
    () => Math.LN2 * 2 ** z,
    () => 1 / (z * Math.LN2),
  ][p.type]?.();
  if (derivative == null) return null;
  const result = p.a * k * derivative;
  return Number.isFinite(result) ? result : null;
}
export function functionRates(p, x = p.probe) {
  const dx = p.dx ?? 1,
    y = functionValue(p, x),
    qx = x + dx;
  const qy = functionValue(p, qx);
  const secant = dx !== 0 && y !== null && qy !== null ? (qy - y) / dx : null;
  return {
    x,
    y,
    qx,
    qy,
    dx,
    secant: Number.isFinite(secant) ? secant : null,
    tangent: functionDerivative(p, x),
    crossesGap: p.type === 3 && (x - p.shift) * (qx - p.shift) < 0,
  };
}
export function solidsState(p, t = 0) {
  const fraction = t > 0 ? clamp(t / 20, 0, 1) : clamp(p.slice / 100, 0, 1),
    r = p.radius,
    h = p.height;
  return {
    fraction,
    z: fraction * h,
    sectionRadius: r * (1 - fraction),
    cylinderArea: Math.PI * r * r,
    coneArea: Math.PI * (r * (1 - fraction)) ** 2,
    cylinderVolume: Math.PI * r * r * h,
    coneVolume: (Math.PI * r * r * h) / 3,
  };
}
export function coneHeightForVolume(fraction) {
  return 1 - Math.cbrt(1 - Math.max(0, Math.min(1, fraction)));
}
export function accumulatedVolumes(radius, height, fraction) {
  const f = Math.max(0, Math.min(1, fraction));
  const cylinder = Math.PI * radius * radius * height;
  return {
    cylinder: cylinder * f,
    cone: cylinder * (f - f * f + f ** 3 / 3),
    coneFraction: f * (3 - 3 * f + f * f),
  };
}
export function rc(p, t) {
  const tau = (p.r * p.c) / 1000,
    elapsed = Math.max(0, t) / tau,
    decay = Math.exp(-elapsed),
    charged = -Math.expm1(-elapsed),
    ratio =
      p.mode === 0 ? (p.chargeInitialRatio ?? 0) : (p.initialRatio ?? 100),
    initialVoltage = (p.u * Math.max(0, Math.min(100, ratio))) / 100,
    targetVoltage = p.mode === 0 ? p.u : 0,
    difference = targetVoltage - initialVoltage,
    capacitance = p.c / 1000,
    voltage = initialVoltage * decay + targetVoltage * charged,
    current = (difference / p.r) * decay;
  return {
    tau,
    initialVoltage,
    voltage,
    current,
    energy: 0.5 * capacitance * voltage ** 2,
    charge: capacitance * voltage,
    initialEnergy: 0.5 * capacitance * initialVoltage ** 2,
    sourceWork:
      p.mode === 0 ? targetVoltage * capacitance * difference * charged : 0,
    heat: 0.5 * capacitance * difference ** 2 * -Math.expm1(-2 * elapsed),
    resistorPower: current ** 2 * p.r,
  };
}
export function normalizeInclineFriction(p, changedKey) {
  const next = { ...p, muStatic: p.muStatic ?? p.mu };
  if (next.mu > next.muStatic) {
    if (changedKey === "muStatic") next.mu = next.muStatic;
    else next.muStatic = next.mu;
  }
  return next;
}
export function incline(p, t) {
  const coefficients = normalizeInclineFriction(p);
  const angle = (p.angle * Math.PI) / 180,
    gravity = p.mass * 9.8,
    normal = gravity * Math.cos(angle),
    parallel = gravity * Math.sin(angle);
  const staticLimit = coefficients.muStatic * normal;
  const willSlide = parallel > staticLimit + 1e-10;
  const friction = willSlide ? coefficients.mu * normal : parallel,
    a = (parallel - friction) / p.mass;
  const end = a > 1e-10 ? Math.sqrt(8 / a) : Infinity,
    elapsed = Math.min(t, end);
  return {
    gravity,
    normal,
    parallel,
    impactTime: end,
    staticLimit,
    muStatic: coefficients.muStatic,
    muKinetic: coefficients.mu,
    criticalAngle: (Math.atan(coefficients.muStatic) * 180) / Math.PI,
    phase: t >= end ? "stopped" : willSlide ? "sliding" : "static",
    friction,
    a: t >= end ? 0 : a,
    stopForce: t >= end ? parallel - friction : 0,
    s: Math.min(4, 0.5 * a * elapsed ** 2),
    v: t >= end ? 0 : a * elapsed,
    arrived: t >= end,
  };
}
export function precipitate(p, t) {
  // mmol from mL × mol/L; delivery starts when the first drop arrives.
  const delivered = p.base * dosingFraction(t),
    cu = p.copper * 0.1,
    oh = delivered * 0.2;
  const solid = Math.min(cu, oh / 2);
  return {
    delivered,
    solid,
    cu: cu - solid,
    oh: oh - 2 * solid,
    mass: solid * 0.09756,
  };
}
// Scene length units: calibrated beaker inner radius 1.02, 250 mL in 2.2 units.
export function funnelFill(volume) {
  const radius = 0.65,
    coneHeight = 0.42;
  const unitVolume = Math.PI * 1.02 ** 2 * (2.2 / 250);
  const coneCapacity = (Math.PI * radius ** 2 * coneHeight) / 3 / unitVolume;
  const fraction = Math.cbrt(Math.min(Math.max(volume, 0) / coneCapacity, 1));
  return {
    coneCapacity,
    coneHeight: coneHeight * fraction,
    coneRadius: radius * fraction,
    cylinderHeight:
      (Math.max(0, volume - coneCapacity) * unitVolume) /
      (Math.PI * radius ** 2),
    unitVolume,
  };
}
export function seismic(p, t) {
  const distance = Math.hypot(p.depth, p.distance),
    tp = distance / 6,
    ts = distance / 3.5;
  return {
    distance,
    tp,
    ts,
    pRadius: 6 * t,
    sRadius: 3.5 * t,
    stage: t < tp ? "波尚未到站" : t < ts ? "P 波已到站" : "P、S 波均已到站",
  };
}
export function biodiversity(p) {
  const counts = [p.plants, p.insects, p.birds, p.fungi],
    total = counts.reduce((a, b) => a + b, 0);
  return {
    total,
    richness: counts.filter(Boolean).length,
    diversity: counts.reduce(
      (sum, n) => (n ? sum - (n / total) * Math.log(n / total) : sum),
      0,
    ),
  };
}
export const duration = (id, p) =>
  id === "capacitor"
    ? 5 * rc(p, 0).tau
    : id === "earthquake"
      ? Math.max(25, seismic(p, 0).ts + 5)
      : ["incline", "lever"].includes(id)
        ? 8
        : 20;
const value = (label, value, unit = "", digits) => ({
  label,
  value,
  unit,
  ...(digits === undefined ? {} : { digits }),
});
export function advancedCalculate(id, p, t = 0) {
  switch (id) {
    case "functions": {
      const x = t > 0 ? -5 + Math.min(20, t) * 0.5 : p.probe;
      return [
        value("探针 x", x, "", 3),
        value("f(x)", functionValue(p, x) ?? "未定义", "", 3),
        ...(p.analysis === 1
          ? [
              value(
                "割线斜率",
                functionRates(p, x).secant ?? "不可计算",
                "",
                3,
              ),
              value(
                "导数 f′(x)",
                functionDerivative(p, x) ?? "无有限两侧导数",
                "",
                3,
              ),
            ]
          : []),
      ];
    }
    case "conics": {
      const q = conicState(p);
      return [
        value("截线类型", q.kind),
        value(
          "离心率 e（非退化）",
          q.degenerate ? "不适用" : q.eccentricity,
          "",
          3,
        ),
        value("抛物线临界倾角", 90 - p.alpha, "°"),
      ];
    }
    case "solids": {
      const q = solidsState(p, t),
        base = q.cylinderVolume;
      return [
        value("圆柱体积", base, "cm³"),
        value("圆锥体积", base / 3, "cm³"),
        value("同底同高体积比", 3),
        value("截面距底面", q.z, "cm"),
        value("圆锥截面半径", q.sectionRadius, "cm"),
        value("圆锥截面积", q.coneArea, "cm²"),
      ];
    }
    case "incline": {
      const q = incline(p, t);
      return [
        value("支持力", q.normal, "N"),
        value("摩擦力", q.friction, "N"),
        value("加速度", q.a, "m/s²"),
        value("沿斜面位移", q.s, "m"),
      ];
    }
    case "capacitor": {
      const q = rc(p, t);
      return [
        value("电容电压", q.voltage, "V"),
        value("电流", q.current * 1000, "mA"),
        value("时间常数 τ", q.tau, "s"),
        value("储存能量", q.energy * 1000, "mJ"),
      ];
    }
    case "precipitation": {
      const q = precipitate(p, t);
      return [
        value("已加入 NaOH", q.delivered, "mL"),
        value("Cu(OH)₂ 沉淀", q.mass, "g"),
        value("剩余 Cu²⁺", q.cu, "mmol"),
      ];
    }
    case "biodiversity": {
      const q = biodiversity(p);
      return [
        value("样本个体数", q.total),
        value("示例物种数", q.richness),
        value("Shannon 指数", q.diversity),
      ];
    }
    case "volcano":
      return [
        value(
          "演示阶段",
          t < 3
            ? "通道与岩浆"
            : t < 13
              ? "喷发与溢流"
              : t < 20
                ? "减弱与结壳"
                : "观察流迹",
        ),
        value("喷发类型", p.type ? "爆发式示意" : "溢流式示意"),
      ];
    case "earthquake": {
      const q = seismic(p, t);
      return [
        value("P 波到时", q.tp, "s"),
        value("S 波到时", q.ts, "s"),
        value("S−P 时差", q.ts - q.tp, "s"),
        value("台站状态", q.stage),
      ];
    }
    default:
      return null;
  }
}
