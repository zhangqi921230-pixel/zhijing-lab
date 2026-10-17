import { comparisonTopics } from "./ComparisonTopics.mjs";
const c = (title, text, task, preset, time = 6) => ({
  title,
  text,
  task,
  preset,
  time,
});
export const comparisonLessons = [
  {
    ...comparisonTopics[0],
    params: [
      {
        key: "scale",
        label: "目标边长比 k",
        min: 0.5,
        max: 3,
        step: 0.5,
        value: 2,
        unit: "倍",
      },
      {
        key: "shape",
        label: "图形：0矩形 / 1三角形",
        min: 0,
        max: 1,
        step: 1,
        value: 0,
        unit: "",
      },
    ],
    chapters: [
      c(
        "放大两倍，面积几倍？",
        "对应边都变为原来的2倍，周长变为2倍，面积变为4倍。",
        "播放缩放，用单位网格核对面积。",
        { scale: 2, shape: 0 },
        0,
      ),
      c(
        "放大三倍",
        "长和宽分别变为3倍，面积包含3×3份原面积。",
        "比较长度标尺和面积读数，解释为什么不是3倍。",
        { scale: 3, shape: 0 },
      ),
      c(
        "缩小到一半",
        "长与宽都减半，面积只剩原来的四分之一。",
        "先预测面积，再将进度移到终点验证。",
        { scale: 0.5, shape: 0 },
      ),
      c(
        "三角形也成立",
        "相似三角形的底与高同比例变化，面积比仍为k²。",
        "在矩形与三角形间切换，对照相同的面积比。",
        { scale: 2, shape: 1 },
      ),
      c(
        "不是整数倍也成立",
        "边长比1.5时，面积比为2.25；面积比规律不依赖整数分割。",
        "把目标边长比在1、1.5、2间切换并保持进度在终点。",
        { scale: 1.5, shape: 1 },
      ),
      c(
        "用四分之一块解释面积比",
        "边长放大2.5倍时，目标面积是原来的6.25倍。把原图的底、高减半得到四分之一面积的小块，目标图正好包含25块。",
        "在下方逐块检查分割，再切换为矩形：块数相同，面积比不变。",
        { scale: 2.5, shape: 1 },
      ),
    ],
    formula: "对应边比 = 周长比 = k；面积比 = k²",
    assumption:
      "两个图使用同一厘米尺度，基础底3cm、高2cm。动画从原尺寸连续缩放到目标尺寸，读数随当前尺寸变化；动画进度不是物理时间。三角形为直角三角形。",
  },
  {
    ...comparisonTopics[1],
    params: [
      {
        key: "angle",
        label: "检偏片方向",
        min: 0,
        max: 90,
        step: 1,
        value: 45,
        unit: "°",
      },
      {
        key: "insert",
        label: "中间片：0移出 / 1插入",
        min: 0,
        max: 1,
        step: 1,
        value: 0,
        unit: "",
      },
      {
        key: "middle",
        label: "中间片方向",
        min: 0,
        max: 90,
        step: 0.5,
        value: 45,
        unit: "°",
      },
    ],
    chapters: [
      c(
        "平行，透光最多",
        "自然光经过第一片理想偏振片后剩下一半光强，平行的检偏片不再削弱它。",
        "播放观察振动方向，再缓慢旋转检偏片。",
        { angle: 0, insert: 0, middle: 45 },
        0,
      ),
      c(
        "转过45度",
        "检偏片相对第一片转过45°，最终光强为入射自然光的25%。",
        "对照逐级读数，区别振幅投影与光强比例。",
        { angle: 45, insert: 0, middle: 45 },
        1.5,
      ),
      c(
        "正交消光",
        "两片透振方向相差90°，理想模型中没有光透过。",
        "确认最终读数为0，再进入下一节。",
        { angle: 90, insert: 0, middle: 45 },
        3,
      ),
      c(
        "插入一片，重新变亮",
        "在正交的两片之间插入45°偏振片，两次投影后仍有光通过。",
        "移出、插入中间片，比较0%与12.5%。",
        { angle: 90, insert: 1, middle: 45 },
        3,
      ),
      c(
        "寻找最亮的中间方向",
        "首尾正交时，中间片方向为45°时透射最大；在0°或90°时仍消光。",
        "保持检偏片90°，对照下方角度—光强曲线，比较中间片后与最终光强，再定位最亮方向。",
        { angle: 90, insert: 1, middle: 20 },
        4.5,
      ),
      c(
        "最亮方向不总是45度",
        "当首尾透振方向相差60°，中间片转到30°时最终光强最大；45°只对应首尾正交的情况。",
        "在下方定位最亮方向，再把检偏片改为30°，预测新的最佳角度并验证。",
        { angle: 60, insert: 1, middle: 30 },
        4.5,
      ),
    ],
    formula: "I₁ = I₀/2；每片之后 I出 = I入 cos²(方向差)",
    assumption:
      "自然光入射、理想线性偏振片，忽略额外吸收和反射。轴线是透振方向，不代表材料中的狭缝。动画只示意慢放的电场方向，不模拟真实光频率；读数是时间平均光强，亮度只作示意。",
  },
];
export function similarState(p, time) {
  const k = 1 + (p.scale - 1) * Math.max(0, Math.min(1, time / 6));
  const area = p.shape ? 3 : 6;
  const perimeter = p.shape ? 5 + Math.sqrt(13) : 10;
  return {
    k,
    baseArea: area,
    area: area * k * k,
    basePerimeter: perimeter,
    perimeter: perimeter * k,
  };
}
export function polarizationState(p) {
  const cos2 = (a) => {
    const c = Math.cos((a * Math.PI) / 180);
    return Math.abs(c) < 1e-12 ? 0 : c * c;
  };
  const first = 0.5;
  const middle = p.insert ? first * cos2(p.middle) : first;
  return {
    first,
    middle,
    output: middle * cos2(p.angle - (p.insert ? p.middle : 0)),
  };
}
export function comparisonReadouts(id, p, time) {
  if (id === "similar-area") {
    const q = similarState(p, time);
    return [
      ["当前边长比", q.k.toFixed(2)],
      ["周长比", q.k.toFixed(2)],
      ["面积比", (q.k * q.k).toFixed(2)],
    ];
  }
  const q = polarizationState(p);
  return [
    ["第一片后", "50.0%"],
    ["中间片后", p.insert ? `${(q.middle * 100).toFixed(1)}%` : "未插入"],
    ["最终光强", `${(q.output * 100).toFixed(1)}%`],
  ];
}
