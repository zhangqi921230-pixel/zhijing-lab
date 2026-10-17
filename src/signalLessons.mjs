import { signalTopics } from "./SignalTopics.mjs";
const c = (title, text, task, preset, time) => ({
  title,
  text,
  task,
  preset,
  time,
});
export const signalLessons = [
  {
    ...signalTopics[0],
    params: [
      {
        key: "radius",
        label: "半径 r",
        min: 1,
        max: 3,
        step: 0.5,
        value: 2,
        unit: "cm",
      },
      {
        key: "angle",
        label: "圆心角",
        min: 0,
        max: 360,
        step: 1,
        value: 60,
        unit: "°",
      },
    ],
    chapters: [
      c(
        "圆弧展开，长度不变",
        "金色圆弧逐渐拉直，下方按相同尺度显示弧长。",
        "播放展开，再拖动进度检查起点与终点。",
        { radius: 2, angle: 60 },
        0,
      ),
      c(
        "接近1弧度",
        "弧长等于半径时，圆心角为1弧度，约57.30°。",
        "将角度在57°和58°之间切换，比较 s/r 与1。",
        { radius: 2, angle: 57 },
        6,
      ),
      c(
        "半圆为什么是π弧度",
        "半圆的弧长是πr，除以半径后就是π。",
        "改变半径，观察弧长改变而弧度不变。",
        { radius: 2, angle: 180 },
        6,
      ),
      c(
        "整圆与2π",
        "整圆弧长等于周长2πr，对应360°与2π弧度。",
        "查看展开后的整条线段与半径单位。",
        { radius: 1, angle: 360 },
        6,
      ),
      c(
        "相同角度，不同半径",
        "圆心角相同，弧长与半径成正比；弧度不会随圆的大小改变。",
        "保持120°，将半径从3调到1，核对弧长比例。",
        { radius: 3, angle: 120 },
        6,
      ),
      c(
        "弧长相同，圆心角不同",
        "把长度为π厘米的圆弧分别放在半径1、2、3厘米的圆上，对应的圆心角是180°、90°、60°。相同弧长不等于相同弧度。",
        "在下方固定弧长对照中依次载入三组条件，核对弧长保持不变；再切到固定90°对照，解释两种比较有什么不同。",
        { radius: 3, angle: 60 },
        6,
      ),
    ],
    formula: "θ = s/r = 角度 × π/180；s = rθ",
    assumption:
      "平面圆，弧长与半径使用相同长度单位。展开过程保持曲线长度；6秒是教学动画进度，不代表真实材料形变。",
  },
  {
    ...signalTopics[1],
    params: [
      {
        key: "frequency",
        label: "振动 A 频率",
        min: 2,
        max: 5,
        step: 0.5,
        value: 3,
        unit: "Hz",
      },
      {
        key: "difference",
        label: "B 与 A 的频率差",
        min: 0,
        max: 1,
        step: 0.1,
        value: 0.5,
        unit: "Hz",
      },
      {
        key: "amplitude",
        label: "振动 B 振幅",
        min: 0,
        max: 1,
        step: 0.1,
        value: 1,
        unit: "相对单位",
      },
    ],
    chapters: [
      c(
        "同频同相，持续加强",
        "两振动同频同相且等幅，合振幅始终为2。",
        "播放，比较两个分量与合成点的同步关系。",
        { frequency: 3, difference: 0, amplitude: 1 },
        0,
      ),
      c(
        "频率接近，出现拍",
        "频率差为0.5Hz时，合振幅每2秒经历一次强弱循环。",
        "沿虚线包络寻找最弱点，再观察合成振动。",
        { frequency: 3, difference: 0.5, amplitude: 1 },
        1,
      ),
      c(
        "频率差增大，拍变快",
        "保持A频率不变，将差值增大到1Hz，强弱循环缩短到1秒。",
        "比较上一节与本节的包络峰间距。",
        { frequency: 3, difference: 1, amplitude: 1 },
        0.5,
      ),
      c(
        "不等幅，不能完全抵消",
        "B振幅小于A时，最小合振幅是两振幅之差，不再降为零。",
        "把B振幅从0.5逐步调到1，观察包络谷底。",
        { frequency: 3, difference: 0.5, amplitude: 0.5 },
        1,
      ),
      c(
        "关掉一个振动",
        "只剩A时，合成曲线就是A自身，频率差不再形成强弱起伏。",
        "将B振幅从0调到1，观察拍如何重新出现。",
        { frequency: 3, difference: 0.5, amplitude: 0 },
        0.5,
      ),
      c(
        "加强时为什么恰好过零",
        "在本节2秒处，两个振动重新同相，包络半高为2，但两个瞬时位移恰好都为零。加强描述振幅，不要求每一刻位移都最大。",
        "用“再次同相加强”定位2秒，对照分位移标尺与包络读数，再点前进一步，观察合位移重新离开零点。",
        { frequency: 3, difference: 0.5, amplitude: 1 },
        2,
      ),
    ],
    formula: "y = sin(2πfAt) + B sin(2πfBt)；拍频 = |fB−fA|",
    assumption:
      "同一观察点的理想线性叠加，初相位为零。低频用于看清运动，不播放声音，也不代表可听音高。虚线是振幅包络，不是第三个振动；B=0或频率相等时不出现拍。",
  },
];
export function radianState(p) {
  const theta = (p.angle * Math.PI) / 180;
  return { theta, length: p.radius * theta };
}
export function beatState(p, t) {
  const A = Math.sin(2 * Math.PI * p.frequency * t),
    B = p.amplitude * Math.sin(2 * Math.PI * (p.frequency + p.difference) * t);
  return {
    A,
    B,
    total: A + B,
    envelope: Math.sqrt(
      Math.max(
        0,
        1 +
          p.amplitude ** 2 +
          2 * p.amplitude * Math.cos(2 * Math.PI * p.difference * t),
      ),
    ),
  };
}
export function signalReadouts(id, p, t) {
  if (id === "radian-arc") {
    const q = radianState(p);
    return [
      ["弧度", `${q.theta.toFixed(3)} rad`],
      ["弧长", `${q.length.toFixed(3)} cm`],
      ["s/r", q.theta.toFixed(3)],
    ];
  }
  const q = beatState(p, t);
  return [
    ["B频率", `${(p.frequency + p.difference).toFixed(1)} Hz`],
    [
      "拍周期",
      p.difference && p.amplitude
        ? `${(1 / p.difference).toFixed(2)} s`
        : "无强弱循环",
    ],
    ["当前合位移", (Math.abs(q.total) < 0.0005 ? 0 : q.total).toFixed(3)],
  ];
}
