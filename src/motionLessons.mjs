import { natureLessons } from "./natureLessons.mjs";
import { geometricLessons } from "./geometricLessons.mjs";
import { comparisonLessons } from "./comparisonLessons.mjs";
import { signalLessons } from "./signalLessons.mjs";
import { intuitiveLessons } from "./intuitiveLessons.mjs";
import { vividLessons } from "./vividLessons.mjs";
import { mechanismLessons } from "./mechanismLessons.mjs";
import { expansionLessons } from "./expansionLessons.mjs";
import { sectionLessons } from "./sectionLessons.mjs";
import { observableLessons } from "./observableLessons.mjs";
import { networkLesson } from "./networkLesson.mjs";
import { revealLessons } from "./revealLessons.mjs";
import { opticalGeometryLessons } from "./opticalGeometryLessons.mjs";
import { visualProofLessons } from "./visualProofLessons.mjs";
import { insightLessons } from "./insightLessons.mjs";
import { discoveryLessons } from "./discoveryLessons.mjs";
import { constructionLessons } from "./constructionLessons.mjs";
import { visualLessons } from "./visualLessons.mjs";
import { oscillationLessons } from "./oscillationLessons.mjs";
const chapter = (title, text, task, preset, time) => ({
  title,
  text,
  task,
  preset,
  time,
});
export const motionTopics = [
  ...natureLessons,
  ...geometricLessons,
  ...comparisonLessons,
  ...signalLessons,
  ...intuitiveLessons,
  ...vividLessons,
  ...mechanismLessons,
  ...expansionLessons,
  ...observableLessons,
  ...sectionLessons,
  networkLesson,
  ...revealLessons,
  ...opticalGeometryLessons,
  ...visualProofLessons,
  ...insightLessons,
  ...discoveryLessons,
  ...constructionLessons,
  ...oscillationLessons,
  ...visualLessons,
  {
    id: "cycloid",
    subject: "math",
    title: "滚动的圆与摆线",
    grade: "初中观察 · 高中参数方程拓展",
    tag: "轨迹与运动",
    description: "一只滚动的轮子，三种不同轨迹：联动轮心、轮缘与描迹点。",
    params: [
      {
        key: "radius",
        label: "滚轮半径 R",
        min: 0.5,
        max: 1.6,
        step: 0.1,
        value: 1,
        unit: "m",
      },
      {
        key: "ratio",
        label: "描迹距离 / 半径",
        min: 0,
        max: 1.5,
        step: 0.1,
        value: 1,
        unit: "",
      },
    ],
    chapters: [
      chapter(
        "圆滚了一周，前进多远？",
        "无滑动滚动时，轮心前进距离等于轮缘滚过的弧长：s = Rθ。θ 以弧度计。",
        "从起点播放一周，比较前进距离与圆周长。",
        { radius: 1, ratio: 1 },
        0,
      ),
      chapter(
        "轮心为什么走直线？",
        "把描迹点放在轮心，描迹点到轮心的距离为零；轮心始终离地 R。",
        "播放后再增加描迹距离，观察直线如何变成曲线。",
        { radius: 1, ratio: 0 },
        3,
      ),
      chapter(
        "轮缘点画出摆线",
        "轮缘点同时向前平移和绕轮心转动。接地点的瞬时速度为零，轨迹在地面形成尖点。",
        "对比起点、半周和一周；半周时轮缘点位于最高处。",
        { radius: 1, ratio: 1 },
        3,
      ),
      chapter(
        "轮内点的短幅摆线",
        "描迹点位于轮内时，轨迹不接触地面，也没有尖点。",
        "将描迹距离从 0.5R 调到 R，观察轨迹最低点。",
        { radius: 1, ratio: 0.5 },
        6,
      ),
      chapter(
        "轮外点为什么会回环？",
        "延长描迹杆，使描迹点位于轮外，得到长幅摆线。部分区段的描迹点会向后运动。",
        "播放一周，再用进度条查看起点附近的反向运动。",
        { radius: 1, ratio: 1.4 },
        6,
      ),
    ],
    formula: "x = Rθ − d sinθ；y = R − d cosθ；d = 描迹距离",
    assumption:
      "理想刚性圆沿直线无滑动滚动；横纵使用同一比例。轮外描迹杆在独立平面中运动，地线仅为参考线，不计算杆与地面的碰撞。一周演示用时 6 秒。参数只在当前页面保留。",
  },
  {
    id: "doppler",
    subject: "physics",
    title: "多普勒效应与移动声源",
    grade: "高中物理 · 声学拓展",
    tag: "波面与频率",
    description: "逐个追踪发出的波面，理解接近时变密、远离时变疏。",
    params: [
      {
        key: "mach",
        label: "声源速度 / 波速",
        min: -0.75,
        max: 0.75,
        step: 0.05,
        value: 0,
        unit: "",
      },
      {
        key: "frequency",
        label: "发射频率",
        min: 0.5,
        max: 2,
        step: 0.25,
        value: 1,
        unit: "Hz",
      },
    ],
    chapters: [
      chapter(
        "静止声源：同心波面",
        "每隔一个周期发出一个波面。介质静止时，波面以相同速度向四周传播。",
        "播放观察波面间距；提高频率后重新播放。",
        { mach: 0, frequency: 1 },
        3,
      ),
      chapter(
        "向右运动：前密后疏",
        "每个波面保留在发射时的位置，圆心不会继续跟着声源移动。",
        "显示发射位置，比较当前声源位置与各个波面圆心。",
        { mach: 0.4, frequency: 1 },
        3,
      ),
      chapter(
        "方向反转，接近与远离互换",
        "右侧观察者在声源向右运动时接收更高频率；声源向左运动时情况相反。",
        "对照正、负速度，检查左右观察者的频率读数。",
        { mach: -0.4, frequency: 1 },
        3,
      ),
      chapter(
        "速度越快，压缩越明显",
        "声源速度增大但仍低于波速时，前方波面间距变小，后方间距变大。",
        "比较 0.4 与 0.75；发射频率不变，接收频率改变。",
        { mach: 0.75, frequency: 1 },
        3,
      ),
      chapter(
        "提高音调与移动声源不同",
        "发射频率增加会使两侧波面都更密；声源运动则让前后两侧的间距不同。",
        "保持速度比 0.4，对照发射频率 1 Hz 与 2 Hz。",
        { mach: 0.4, frequency: 2 },
        3,
      ),
      chapter(
        "追踪同一波面的传播",
        "每一圈以发射位置为固定圆心，半径等于波速乘以发射后经过的时间。声源当前位置与旧波面的圆心一般不同。",
        "在下方选一圈，定位发射瞬间和发射后1、2秒。播放主动画，比较固定圆心、移动声源和不断增大的半径。",
        { mach: 0.4, frequency: 1 },
        4,
      ),
    ],
    formula: "右侧 f′ = f / (1 − vₛ/c)；左侧 f′ = f / (1 + vₛ/c)",
    assumption:
      "静止均匀介质、匀速亚声速点声源、两名静止的轴向观察者。示意波速 c = 2 m/s，低频用于放慢观察，不代表空气中的实际声速或可听音调；不播放声音。频率读数为首个波面到达后的理论稳态值。参数只在当前页面保留。",
  },
];
