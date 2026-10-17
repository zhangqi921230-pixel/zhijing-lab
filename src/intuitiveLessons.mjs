import { intuitiveTopics } from "./IntuitiveTopics.mjs";
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
export const intuitiveLessons = [
  {
    ...intuitiveTopics[0],
    params: [
      f("a", "大正方形边长 a", 4, 8, 1, 6, ""),
      f("b", "小正方形边长 b", 1, 3, 0.5, 2, ""),
    ],
    chapters: [
      c(
        "去掉一个小正方形",
        "大正方形面积为 a²，右上角去掉的面积为 b²，留下一个 L 形。",
        "先观察虚线框，再播放剪拼过程。",
        { a: 6, b: 2 },
        0,
      ),
      c(
        "沿分界线分成两块",
        "上方绿色条带与下方金色条带恰好覆盖剩余区域，没有遗漏或重叠。",
        "暂停在起点，分别计算两块长方形的面积。",
        { a: 6, b: 2 },
        1,
      ),
      c(
        "旋转条带，面积不变",
        "绿色条带先移到外侧，再旋转90°，整个过程不改变边长与面积。",
        "拖动进度，追踪同一块绿色条带。",
        { a: 6, b: 2 },
        3,
      ),
      c(
        "拼成长方形",
        "绿色条带拼到金色条带右侧，得到长 a+b、宽 a−b 的长方形。",
        "核对左右两种面积计算结果。",
        { a: 6, b: 2 },
        6,
      ),
      c(
        "改变边长，验证恒等式",
        "只要 a>b>0，这种面积拼接都成立。这里限制 a≥4、b≤3，保证图形可见。",
        "比较 a=8、b=3 与 a=4、b=3；看窄条如何拼接。",
        { a: 8, b: 3 },
        6,
      ),
    ],
    formula: "a² − b² = (a+b)(a−b)",
    assumption:
      "长度为统一教学单位；移动和旋转只用于证明面积相等。参数保持 a>b>0。6秒表示剪拼进度，不代表真实运动。",
  },
  {
    ...intuitiveTopics[1],
    params: [
      f("separation", "两波源间距", 8, 24, 2, 16, "cm"),
      f("wavelength", "波长 λ", 8, 24, 2, 16, "cm"),
      f("phase", "波源 B 超前相位", 0, 180, 30, 0, "°"),
      f("probeX", "观察点横坐标", -24, 24, 1, 0, "cm"),
      f("probeY", "观察点纵坐标", -12, 12, 1, 8, "cm"),
    ],
    chapters: [
      c(
        "同相波源：中线上加强",
        "两源同频同相，中线上的点到两源等距，两列振动始终同步。",
        "播放并比较 A、B 分量和合成曲线。",
        { separation: 16, wavelength: 16, phase: 0, probeX: 0, probeY: 8 },
        0,
      ),
      c(
        "半波程差：相互抵消",
        "两源同相；此观察点到两源的距离相差8厘米，恰为半个波长。",
        "看合成曲线是否保持在平衡位置。",
        { separation: 16, wavelength: 16, phase: 0, probeX: 4, probeY: 0 },
        1,
      ),
      c(
        "一个波程差：再次加强",
        "把观察点移到两源连线延长线上，波程差为16厘米，即一个波长。",
        "比较波程差与合振幅，不把距离更远误判为必然抵消。",
        { separation: 16, wavelength: 16, phase: 0, probeX: 16, probeY: 0 },
        2,
      ),
      c(
        "波源反相：中线变为抵消",
        "相位差不仅来自路程，也来自波源；B超前180°时，等距点的两列振动反相。",
        "把相位从180°调回0°，看合振幅连续改变。",
        { separation: 16, wavelength: 16, phase: 180, probeX: 0, probeY: 8 },
        3,
      ),
      c(
        "改变波长，原位置会怎样",
        "位置不变，波长减半：原来的半波程差成为一个完整波程差。",
        "将波长从8厘米调到16厘米，比较合振幅。",
        { separation: 16, wavelength: 8, phase: 0, probeX: 4, probeY: 0 },
        4,
      ),
      c(
        "扫描观察点，寻找条纹",
        "保持两个波源同相，固定纵坐标，左右移动观察点。振幅的峰谷组成空间干涉条纹，不随播放时间向外走。",
        "对照底色与下方位置—振幅曲线；从x=0向左右移动，再改变波源相位，观察条纹重排。",
        { separation: 24, wavelength: 8, phase: 0, probeX: 0, probeY: 8 },
        2,
      ),
    ],
    formula: "y = sin(ωt−krA) + sin(ωt−krB+φ)；k=2π/λ",
    assumption:
      "理想稳态同频双源，波速20 cm/s，单源在观察点的振幅归一为1；忽略衰减、反射和启动过程。圆环只表示各源的波峰位置，不是合成水面高度；下方曲线才是观察点的振动。水面质点上下振动，不随波峰向外迁移。",
  },
];
export function squareDifference(p) {
  return {
    area: p.a * p.a - p.b * p.b,
    width: p.a + p.b,
    height: p.a - p.b,
    green: p.b * (p.a - p.b),
    gold: p.a * (p.a - p.b),
  };
}
export function rippleState(p, time) {
  const rA = Math.hypot(p.probeX + p.separation / 2, p.probeY),
    rB = Math.hypot(p.probeX - p.separation / 2, p.probeY),
    k = (2 * Math.PI) / p.wavelength,
    omega = k * 20,
    phi = (p.phase * Math.PI) / 180;
  const A = Math.sin(omega * time - k * rA),
    B = Math.sin(omega * time - k * rB + phi);
  return {
    rA,
    rB,
    A,
    B,
    total: A + B,
    amplitude: 2 * Math.abs(Math.cos((k * (rA - rB) + phi) / 2)),
    difference: Math.abs(rA - rB),
    period: p.wavelength / 20,
  };
}
export function intuitiveReadouts(id, p, t) {
  if (id === "square-difference") {
    const q = squareDifference(p);
    return [
      ["剩余面积", `${q.area} 平方单位`],
      ["拼接长度", `${q.width}`],
      ["拼接宽度", `${q.height}`],
    ];
  }
  const q = rippleState(p, t);
  return [
    ["波程差", `${q.difference.toFixed(2)} cm`],
    ["合振幅（单源=1）", q.amplitude.toFixed(2)],
    ["周期", `${q.period.toFixed(2)} s`],
  ];
}
