import { geometricTopics } from "./ConstructionTopics.mjs";
const c = (title, text, task, preset, time = 6) => ({
  title,
  text,
  task,
  preset,
  time,
});
const f = (key, label, min, max, step, value, unit) => ({
  key,
  label,
  min,
  max,
  step,
  value,
  unit,
});
export const geometricLessons = [
  {
    ...geometricTopics[0],
    params: [
      f("a", "向量 a 的长度", 1, 4, 0.5, 3, ""),
      f("b", "向量 b 的长度", 1, 4, 0.5, 2, ""),
      f("angle", "两向量夹角", 0, 180, 5, 60, "°"),
    ],
    chapters: [
      c(
        "首尾相接，得到合向量",
        "将向量 b 平移到 a 的终点，不改变它的方向与长度。从共同起点到新的终点，就是 a+b。",
        "播放平移动画，观察金色合向量的起点与终点。",
        { a: 3, b: 2, angle: 60 },
        0,
      ),
      c(
        "同向时，长度相加",
        "夹角为0°，合向量与两向量同向，长度为两者之和。",
        "增大 b 的长度，检查合向量长度是否同步增加。",
        { a: 3, b: 2, angle: 0 },
      ),
      c(
        "垂直时，用勾股定理",
        "两向量垂直，3与4组成的直角三角形，合向量长度为5。",
        "对照水平与竖直分量，解释合向量为什么不是7。",
        { a: 3, b: 4, angle: 90 },
      ),
      c(
        "反向抵消与零向量",
        "等长反向向量之和为零向量。零向量长度为0，方向没有定义。",
        "把 b 从3减到2，再增到4，比较合向量的方向。",
        { a: 3, b: 3, angle: 180 },
      ),
      c(
        "钝角时，水平分量为负",
        "b 的水平分量在钝角时为负，合向量的水平分量是 a+b cosθ。",
        "改变夹角，对照虚线投影和两个坐标分量。",
        { a: 2, b: 4, angle: 120 },
      ),
    ],
    formula: "Rₓ=a+b cosθ；Rᵧ=b sinθ；|R|=√(Rₓ²+Rᵧ²)",
    assumption:
      "a沿x轴正方向，b位于上半平面；箭头表示自由向量，平移不改变向量。动画进度只表示构图步骤，合向量读数始终对应当前参数的最终结果；不表示物体运动。",
  },
  {
    ...geometricTopics[1],
    params: [
      f("perimeter", "围栏总长 P", 8, 24, 2, 20, "m"),
      f("share", "横边占半周长", 10, 90, 5, 20, "%"),
    ],
    chapters: [
      c(
        "同一圈围栏，不同面积",
        "矩形的长与宽之和固定。将狭长的花园变得接近正方形，可以增加面积。",
        "播放观察围栏形状变化，核对周长一直不变。",
        { perimeter: 20, share: 50 },
        0,
      ),
      c(
        "狭长的花园",
        "周长20m时，2m×8m的矩形面积只有16m²。",
        "保持围栏总长不变，增大横边占比，看面积如何变化。",
        { perimeter: 20, share: 20 },
      ),
      c(
        "交换横边与竖边",
        "2m×8m和8m×2m面积相同，周长也相同。",
        "用下方交换按钮验证面积不变，再比较图中曲线上的位置。",
        { perimeter: 20, share: 80 },
      ),
      c(
        "正方形取得最大面积",
        "固定周长的所有矩形中，正方形面积最大。P=20m时，最大面积为25m²。",
        "点定位最大面积，再把横边占比移到45%或55%，比较面积。",
        { perimeter: 20, share: 50 },
      ),
      c(
        "围栏翻倍，最大面积四倍",
        "围栏从12m变为24m，正方形边长从3m变为6m，面积从9m²变为36m²。",
        "保持50%占比，将围栏总长从24m改为12m。",
        { perimeter: 24, share: 50 },
      ),
    ],
    formula: "x+y=P/2；S=xy=P²/16−(x−P/4)²",
    assumption:
      "只比较矩形，围栏不计厚度、无开口。主图保持每米相同尺度；面积曲线对应当前周长。动画从横边占比10%变到所选目标；读数与探针随当前尺寸变化，不表示真实生长。",
  },
];
const clean = (n) => (Math.abs(n) < 1e-10 ? 0 : n);
export function vectorState(p) {
  const t = (p.angle * Math.PI) / 180,
    bx = clean(p.b * Math.cos(t)),
    by = clean(p.b * Math.sin(t)),
    x = clean(p.a + bx),
    y = by;
  return { bx, by, x, y, length: Math.hypot(x, y) };
}
export function fenceState(p, time) {
  const u = Math.max(0, Math.min(1, time / 6)),
    share = 10 + (p.share - 10) * u,
    x = ((p.perimeter / 2) * share) / 100,
    y = p.perimeter / 2 - x;
  return { x, y, area: x * y, max: p.perimeter ** 2 / 16, share };
}
export function geometricReadouts(id, p, time) {
  if (id === "vector-sum") {
    const q = vectorState(p);
    return [
      ["水平分量", q.x.toFixed(2)],
      ["竖直分量", q.y.toFixed(2)],
      ["合向量长度", q.length.toFixed(2)],
    ];
  }
  const q = fenceState(p, time);
  return [
    ["周长", `${(2 * (q.x + q.y)).toFixed(1)} m`],
    ["当前面积", `${q.area.toFixed(2)} m²`],
    ["最大面积", `${q.max.toFixed(2)} m²`],
  ];
}
