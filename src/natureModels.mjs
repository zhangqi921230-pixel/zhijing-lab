import {
  isExtension,
  extensionState,
  extensionReadouts,
} from "./natureExtension.mjs";
export function natureState(id, p, t = 0) {
  if (isExtension(id)) return extensionState(id, p, t);
  const phase = (t % 6) / 6,
    cycle = (1 - Math.cos(phase * Math.PI * 2)) / 2;
  if (id === "combustion")
    return { burning: p.fuel === 1 && p.oxygen === 1 && p.heat === 1, phase };
  if (id === "filtration") {
    const passed = Math.min(1, Math.max(0, t / 6));
    return {
      passed,
      sandIn: p.sand * (1 - passed),
      sandHeld: p.sand * passed,
      saltOut: p.salt * passed,
      saltIn: p.salt * (1 - passed),
    };
  }
  if (id === "breathing")
    return {
      cycle,
      inhale: phase < 0.5,
      volume: 1 + (p.depth * cycle) / 100,
      phase,
    };
  if (id === "germination") {
    const suitable =
      p.water === 1 &&
      p.air === 1 &&
      p.temperature >= 15 &&
      p.temperature <= 30;
    const growth = Math.max(0, Math.min(1, t / 6));
    return { suitable, growth, experiment: suitable ? growth : 0 };
  }
  if (id === "sea-breeze")
    return { day: p.day === 1, strength: p.contrast / 10, phase };
  const capacity = (p.slope * p.flow) / 100;
  return { capacity, transport: capacity >= p.grain, phase };
}
export function natureReadouts(id, p, t) {
  if (isExtension(id)) return extensionReadouts(id, p, t);
  const q = natureState(id, p, t);
  if (id === "combustion")
    return [
      ["可燃物", p.fuel ? "有" : "无"],
      ["供氧", p.oxygen ? "充足" : "隔绝"],
      ["现象", q.burning ? "持续燃烧" : "不能持续燃烧"],
    ];
  if (id === "filtration")
    return [
      ["滤渣", q.sandHeld.toFixed(1) + " 份泥沙"],
      ["滤液溶质", q.saltOut.toFixed(1) + " 份盐"],
      ["分离对象", "不溶性固体"],
    ];
  if (id === "breathing")
    return [
      ["呼吸阶段", q.inhale ? "吸气" : "呼气"],
      ["胸廓容积", q.inhale ? "增大" : "减小"],
      ["膈肌", q.inhale ? "收缩下降" : "舒张上升"],
    ];
  if (id === "germination")
    return [
      ["实验组条件", q.suitable ? "适宜" : "不适宜"],
      ["对照组", "适量水、空气、25°C"],
      ["进度", (q.growth * 100).toFixed(0) + "%"],
    ];
  if (id === "sea-breeze")
    return [
      ["时段", q.day ? "白昼" : "夜晚"],
      [
        "近地面风",
        p.contrast === 0 ? "无局地热力风" : q.day ? "海 → 陆" : "陆 → 海",
      ],
      ["受热较强", p.contrast === 0 ? "无差异" : q.day ? "陆地" : "海洋"],
    ];
  return [
    ["搬运能力指数", q.capacity.toFixed(1)],
    ["粒径等级", p.grain],
    ["示意结果", q.transport ? "继续搬运" : "颗粒沉积"],
  ];
}
