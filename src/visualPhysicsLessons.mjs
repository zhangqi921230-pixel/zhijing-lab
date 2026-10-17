const param = (key, label, min, max, step, value, unit = "") => ({
  key,
  label,
  min,
  max,
  step,
  value,
  unit,
});
export const visualPhysicsLessons = [
  {
    id: "waves",
    subject: "physics",
    title: "波的传播与叠加",
    grade: "高中 · 波动拓展",
    tag: "机械波",
    description: "追踪质点振动，分开观察两列波，再看相长、相消与驻波。",
    params: [
      param("mode", "波形模式", 0, 2, 1, 0),
      param("amplitude", "单列波振幅", 0.1, 0.8, 0.1, 0.4, "m"),
      param("frequency", "频率", 0.2, 1, 0.1, 0.5, "Hz"),
      param("speed", "传播速度", 1, 4, 0.5, 2, "m/s"),
      param("phase", "第二列波初相位", 0, 360, 15, 0, "°"),
      param("probe", "观察质点位置", 0, 12, 0.1, 3, "m"),
    ],
    formula: "λ = v/f；y = y₁ + y₂",
    assumption:
      "一维、无耗散、线性横波；两列波频率、振幅相同。驻波由反向传播的相干波叠加，不模拟端点反射建立过程；质点只作横向振动。",
    question: "波向前传播时，标记质点也一直向前跑吗？",
    explanation:
      "质点在平衡位置附近振动，传播的是振动状态。相向波叠加可形成波节固定的驻波。",
  },
  {
    id: "buoyancy",
    subject: "physics",
    title: "浮力、排水与沉浮",
    grade: "初中 8 年级",
    tag: "力与流体",
    description: "在透明水槽中改变浸入程度和密度，对照排水体积与受力。",
    params: [
      param("mode", "观察方式", 0, 1, 1, 0),
      param("immersion", "浸入体积比例", 0, 100, 1, 50, "%"),
      param("volume", "物体体积", 0.5, 3, 0.1, 1, "L"),
      param("solid", "物体密度", 400, 1600, 100, 600, "kg/m³"),
      param("liquid", "液体密度", 800, 1200, 100, 1000, "kg/m³"),
    ],
    formula: "F浮 = ρ液gV排；G = ρ物gV物",
    assumption:
      "均匀不可压缩液体、均质长方体，g=9.8m/s²。忽略空气浮力和表面张力。受控浸入由外力保持；平衡模式直接展示最终状态，不计算落水、阻力或振荡过程。水槽截面远大于物体，水面高度视为不变。",
    question: "完全浸没后，继续加深位置会使浮力变大吗？",
    explanation:
      "均匀液体中浮力由排开液体体积决定。完全浸没后排水体积不再增加，浮力不因深度增加而变大；漂浮时浮力等于重力。",
  },
];
