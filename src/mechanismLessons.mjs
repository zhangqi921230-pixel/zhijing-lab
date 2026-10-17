import { mechanismTopics } from "./mechanismTopics.mjs";
const field = (key, label, min, max, step, value, unit) => ({
  key,
  label,
  min,
  max,
  step,
  value,
  unit,
});
const chapter = (title, text, task, preset, time = 0) => ({
  title,
  text,
  task,
  preset,
  time,
});
export const mechanismLessons = [
  {
    ...mechanismTopics[0],
    params: [
      field("driver", "主动轮齿数", 12, 36, 1, 18, "齿"),
      field("driven", "从动轮齿数", 12, 36, 1, 30, "齿"),
      field("rpm", "主动轮转速", 5, 20, 1, 10, "r/min"),
    ],
    chapters: [
      chapter(
        "两轮啮合，转向相反",
        "外啮合的两只齿轮转向相反；啮合处两轮的切向速度大小相同。",
        "播放演示，追踪轮缘圆点和三角标记。",
        { driver: 18, driven: 30, rpm: 10 },
      ),
      chapter(
        "小轮带大轮：减速",
        "同一时间内通过啮合点的齿数相同。大轮齿数较多，因此转得更慢。",
        "比较12齿与36齿；主动轮转一周，从动轮转多少？",
        { driver: 12, driven: 36, rpm: 10 },
        1,
      ),
      chapter(
        "大轮带小轮：增速",
        "主动轮齿数多于从动轮时，从动轮的转速较高。",
        "将主动轮从36齿调小，观察从动轮转速变化。",
        { driver: 36, driven: 12, rpm: 5 },
        2,
      ),
      chapter(
        "相同齿数：等速反向",
        "齿数相等时，角速度大小相同、方向相反。",
        "同步观察两轮标记到达上方的时刻。",
        { driver: 24, driven: 24, rpm: 10 },
        3,
      ),
      chapter(
        "改变输入速度，比例不变",
        "齿数不变时，输入速度改变，两轮速度按相同比例变化。",
        "保持18与30齿，分别设置5和20 r/min，核对转速比。",
        { driver: 18, driven: 30, rpm: 20 },
        1.5,
      ),
    ],
    formula: "n₁z₁ = n₂z₂；外啮合转向相反",
    assumption:
      "理想外啮合齿轮，模数相同，无打滑和间隙。按节圆半径与齿数比例求运动；齿形为教学示意，不用于机械加工，也不推算效率或输出扭矩。动画时间为秒。",
  },
  {
    ...mechanismTopics[1],
    params: [
      field("volume", "物体体积", 100, 500, 50, 300, "cm³"),
      field("bodyDensity", "物体密度", 1500, 3000, 100, 2000, "kg/m³"),
      field("liquidDensity", "液体密度", 800, 1200, 50, 1000, "kg/m³"),
    ],
    chapters: [
      chapter(
        "从空气缓慢浸入液体",
        "逐渐浸入时，排开液体的体积增大，浮力增大，测力计示数减小。",
        "播放浸入过程，对照浮力箭头和测力计。",
        { volume: 300, bodyDensity: 2000, liquidDensity: 1000 },
      ),
      chapter(
        "浸没一半，浮力多少？",
        "只有液面以下的部分排开液体；浸入一半时，浮力是完全浸没时的一半。",
        "将进度定位在3秒，比较排水体积和浮力。",
        { volume: 300, bodyDensity: 2000, liquidDensity: 1000 },
        3,
      ),
      chapter(
        "完全浸没后继续下移",
        "液体密度不变时，完全浸没后浮力不随深度增大。",
        "播放后半程，检查4到6秒的浮力是否相同。",
        { volume: 300, bodyDensity: 2000, liquidDensity: 1000 },
        4,
      ),
      chapter(
        "换一种液体",
        "排水体积相同时，液体越密，浮力越大。",
        "比较800、1000与1200 kg/m³，观察示数变化。",
        { volume: 300, bodyDensity: 2000, liquidDensity: 1200 },
        4,
      ),
      chapter(
        "同体积，不同质量",
        "完全浸没的同体积物体受到相同浮力；密度较大的物体重力和测力计示数更大。",
        "固定体积与液体，调高物体密度，核对三力平衡。",
        { volume: 300, bodyDensity: 3000, liquidDensity: 1000 },
        5,
      ),
    ],
    formula: "F浮 = ρ液gV排；T + F浮 = G",
    assumption:
      "不可压缩液体与均匀实心物体，取g=9.8 N/kg。准静态悬吊浸入，忽略阻力、表面张力和液面上升；物体密度始终大于液体密度，不模拟自由漂浮。进度表示教学操作，不是自由落体时间。",
  },
];
export function mechanismState(id, p, time = 0) {
  if (id === "gear-drive")
    return {
      input: p.rpm,
      output: (p.rpm * p.driver) / p.driven,
      ratio: p.driven / p.driver,
      angle: (time * p.rpm * Math.PI) / 30,
    };
  const fraction = Math.max(0, Math.min(1, (time - 2) / 2)),
    displaced = p.volume * fraction,
    weight = p.bodyDensity * p.volume * 1e-6 * 9.8,
    buoyancy = p.liquidDensity * displaced * 1e-6 * 9.8;
  return { fraction, displaced, weight, buoyancy, tension: weight - buoyancy };
}
export function mechanismReadouts(id, p, time) {
  const q = mechanismState(id, p, time);
  return id === "gear-drive"
    ? [
        ["主动轮", `${q.input} r/min`],
        ["从动轮", `${q.output.toFixed(2)} r/min`],
        ["转速比 n₁/n₂", q.ratio.toFixed(2)],
      ]
    : [
        ["排水体积", `${q.displaced.toFixed(0)} cm³`],
        ["浮力", `${q.buoyancy.toFixed(2)} N`],
        ["测力计", `${q.tension.toFixed(2)} N`],
      ];
}
