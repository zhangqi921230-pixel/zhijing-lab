import { vividTopics } from "./vividTopics.mjs";
const f = (key, label, min, max, step, value, unit) => ({
  key,
  label,
  min,
  max,
  step,
  value,
  unit,
});
const c = (title, text, task, preset, time) => ({
  title,
  text,
  task,
  preset,
  time,
});
export const vividLessons = [
  {
    ...vividTopics[0],
    params: [
      f("sides", "正多边形边数", 3, 12, 1, 5, "边"),
      f("direction", "行走方向（1逆时针 / −1顺时针）", -1, 1, 2, 1, ""),
    ],
    chapters: [
      c(
        "三角形：每次转120°",
        "行走方向改变的角是外角，不是三角形的内角。转三次回到初始朝向。",
        "播放一周，比较每次转角与累积转角。",
        { sides: 3, direction: 1 },
        0,
      ),
      c(
        "正方形：四个直角",
        "每走完一边转90°；四次转向合成360°。",
        "拖到最后，核对四段色带刚好占满一周。",
        { sides: 4, direction: 1 },
        2,
      ),
      c(
        "五边形：内外角互补",
        "正五边形每个外角72°，与对应内角108°相加为180°。",
        "打开辅助线，分清前进延长线与下一条边。",
        { sides: 5, direction: 1 },
        3,
      ),
      c(
        "边越多，每次转得越少",
        "正多边形的外角等于360°除以边数；总转角保持一周。",
        "比较6、8、12边，观察单次转角变小。",
        { sides: 12, direction: 1 },
        4,
      ),
      c(
        "反向走：符号改变",
        "顺时针行走的有向外角为负，绕一周累计−360°，大小仍是一周。",
        "把方向切回1，比较转向箭头与累积读数。",
        { sides: 6, direction: -1 },
        6,
      ),
    ],
    formula: "每个外角 = 360°/n；内角 + 外角 = 180°",
    assumption:
      "演示限于凸正多边形，逆时针取正。每边先行走再原地转向，时间是教学进度，不代表真实步速。不能直接用于自交多边形。",
  },
  {
    ...vividTopics[1],
    params: [
      f("length", "初始杆长", 1, 5, 0.5, 3, "m"),
      f("delta", "目标温差", -30, 80, 5, 60, "°C"),
      f("gap", "初始接缝", 2, 12, 1, 5, "mm"),
    ],
    chapters: [
      c(
        "升温：三种金属一起比较",
        "相同杆长和温差下，线膨胀系数越大，伸长越大。",
        "播放升温，比较铝、铜、钢的端部和毫米读数。",
        { length: 3, delta: 60, gap: 5 },
        0,
      ),
      c(
        "温差加倍，伸长加倍",
        "在线膨胀近似下，伸长量正比于温差。",
        "固定杆长，比较目标温差30°C与60°C。",
        { length: 3, delta: 30, gap: 5 },
        6,
      ),
      c(
        "长杆为什么更需要留缝",
        "材料和温差相同时，初始长度越大，伸长越大。",
        "将杆长从2米调到4米，核对三行伸长量。",
        { length: 4, delta: 60, gap: 5 },
        6,
      ),
      c(
        "降温：长度缩短",
        "负温差带来负伸长，杆端退回，接缝变宽。",
        "观察虚线初始端与现在端部的相对位置。",
        { length: 3, delta: -30, gap: 5 },
        6,
      ),
      c(
        "伸缩缝：碰到边界以后",
        "自由伸长需求超过接缝时，结构受到约束。自由膨胀公式不能继续预测受约束位移。",
        "设置5米、80°C、2毫米缝，比较需求和剩余空间。",
        { length: 5, delta: 80, gap: 2 },
        6,
      ),
    ],
    formula: "ΔL = αL₀ΔT；自由接缝余量 = g₀ − ΔL",
    assumption:
      "均匀温度、小变形线膨胀近似；教学系数铝23、铜17、钢12 ×10⁻⁶/°C，实际值随成分温度变化。左端固定、右端自由；三行是独立对照。变形放大200倍，接缝局部按SVG坐标10 px/mm绘制，两图比例不同。达到约束后仅显示自由伸长需求，不计算应力；6秒为操作进度。",
  },
];
export function polygonTurn(p, time) {
  const progress = Math.max(0, Math.min(1, time / 6)) * p.sides,
    index = Math.min(p.sides - 1, Math.floor(progress)),
    phase = progress - index,
    turn = Math.max(0, Math.min(1, (phase - 0.7) / 0.3)),
    travel = Math.min(1, phase / 0.7);
  return {
    index,
    travel,
    turn,
    exterior: 360 / p.sides,
    interior: 180 - 360 / p.sides,
    total: (p.direction * (index + turn) * 360) / p.sides || 0,
  };
}
export function thermalLengths(p, time) {
  const delta = p.delta * Math.max(0, Math.min(1, time / 6));
  return [
    { name: "铝", alpha: 23 },
    { name: "铜", alpha: 17 },
    { name: "钢", alpha: 12 },
  ].map((m) => ({
    ...m,
    delta,
    extension: (m.alpha * p.length * delta) / 1000,
    remaining: p.gap - (m.alpha * p.length * delta) / 1000,
  }));
}
export function vividReadouts(id, p, t) {
  if (id === "polygon-turn") {
    const q = polygonTurn(p, t);
    return [
      ["每个外角", `${q.exterior.toFixed(1)}°`],
      ["每个内角", `${q.interior.toFixed(1)}°`],
      ["累计转向", `${q.total.toFixed(1)}°`],
    ];
  }
  const q = thermalLengths(p, t);
  return q.map((m) => [`${m.name}自由伸长`, `${m.extension.toFixed(2)} mm`]);
}
