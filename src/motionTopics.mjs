import { natureTopics } from "./natureTopics.mjs";
import { geometricTopics } from "./ConstructionTopics.mjs";
import { comparisonTopics } from "./ComparisonTopics.mjs";
import { signalTopics } from "./SignalTopics.mjs";
import { intuitiveTopics } from "./IntuitiveTopics.mjs";
import { vividTopics } from "./vividTopics.mjs";
import { mechanismTopics } from "./mechanismTopics.mjs";
import { expansionTopics } from "./expansionTopics.mjs";
import { sectionTopics } from "./sectionTopics.mjs";
import { observableTopics } from "./observableTopics.mjs";
export const motionTopics = [
  ...natureTopics,
  ...geometricTopics,
  ...comparisonTopics,
  ...signalTopics,
  ...intuitiveTopics,
  ...vividTopics,
  ...mechanismTopics,
  ...expansionTopics,
  ...observableTopics,
  ...sectionTopics,
  {
    id: "resistor-network",
    subject: "physics",
    title: "串并联与电流分配",
    grade: "初中物理",
    tag: "电路与定量关系",
    description: "用两只电阻对照串联分压、并联分流与等效电阻。",
  },
  {
    id: "prism",
    subject: "physics",
    title: "三棱镜分光与色散",
    grade: "初中观察 · 高中光学",
    tag: "色散与双界面折射",
    description: "追踪多色光穿过棱镜的两次折射，对比色散与内反射。",
  },
  {
    id: "circle-area",
    subject: "math",
    title: "圆面积的展开与拼接",
    grade: "小学高年级 · 初中数学",
    tag: "等积变形与极限",
    description: "把圆分成扇形，交错拼接，观察面积公式如何产生。",
  },
  {
    id: "pinhole",
    subject: "physics",
    title: "小孔成像与暗箱",
    grade: "初中物理",
    tag: "光的直线传播",
    description: "穿过小孔的光形成倒立实像；联动物距、屏距与像高。",
  },
  {
    id: "inscribed-angle",
    subject: "math",
    title: "圆周角与圆心角",
    grade: "初中数学",
    tag: "圆与角度",
    description: "移动圆周顶点，观察同弧等角与直径所对的直角。",
  },
  {
    id: "pythagoras-proof",
    subject: "math",
    title: "勾股定理的面积证明",
    grade: "初中数学",
    tag: "面积与证明",
    description: "对照三边正方形，逐步理解勾股关系与面积证明。",
  },
  {
    id: "plane-mirror",
    subject: "physics",
    title: "平面镜与镜像",
    grade: "初中物理",
    tag: "光的反射",
    description: "追踪反射光路，联动物点、观察者和镜后虚像。",
  },
  {
    id: "triangle-angles",
    subject: "math",
    title: "三角形内角和与外角",
    grade: "初中数学",
    tag: "角度与变换",
    description: "搬运三个彩色角，观察内角和与外角的不变量。",
  },
  {
    id: "communicating",
    subject: "physics",
    title: "连通器与液面平衡",
    grade: "初中物理",
    tag: "液体压强",
    description: "对照管径和初始液面，追踪趋平、反向流动与体积守恒。",
  },
  {
    id: "area-cut",
    subject: "math",
    title: "面积的剪拼与等积变形",
    grade: "小学高年级 · 初中数学",
    tag: "面积与转化",
    description: "剪开、平移、补齐，直观看到平行四边形的面积公式。",
  },
  {
    id: "hydraulic",
    subject: "physics",
    title: "液压机与帕斯卡原理",
    grade: "初中物理 · 拓展",
    tag: "液体压强",
    description: "联动两端活塞，观察力的放大、位移比与功的守恒。",
  },
  {
    id: "symmetry",
    subject: "math",
    title: "轴对称与旋转",
    grade: "初中数学",
    tag: "图形变换",
    description: "折叠、转动、追踪对应点，观察距离与角度的不变量。",
  },
  {
    id: "pulley",
    subject: "physics",
    title: "滑轮、绳长与机械功",
    grade: "初中物理",
    tag: "简单机械",
    description: "对照定滑轮与动滑轮，直观看到省力、多拉绳和功的关系。",
  },
  {
    id: "polar",
    subject: "math",
    title: "极坐标与玫瑰线",
    grade: "高中数学 · 拓展观察",
    tag: "旋转与曲线",
    description: "跟随旋转射线，从圆、心形线到三瓣与四瓣玫瑰线。",
  },
  {
    id: "ballistics",
    subject: "physics",
    title: "抛体运动与轨迹对比",
    grade: "高中物理",
    tag: "运动的合成",
    description: "分解水平与竖直运动，对照抛射角、速度和重力的影响。",
  },
  {
    id: "cycloid",
    subject: "math",
    title: "滚动的圆与摆线",
    grade: "初中观察 · 高中参数方程拓展",
    tag: "轨迹与运动",
    description: "一只滚动的轮子，三种不同轨迹：联动轮心、轮缘与描迹点。",
  },
  {
    id: "doppler",
    subject: "physics",
    title: "多普勒效应与移动声源",
    grade: "高中物理 · 声学拓展",
    tag: "波面与频率",
    description: "逐个追踪发出的波面，理解接近时变密、远离时变疏。",
  },
  {
    id: "lissajous",
    subject: "math",
    title: "李萨如图形与振动合成",
    grade: "高中数学 · 跨学科拓展",
    tag: "参数曲线",
    description: "将两个垂直方向的振动合成直线、椭圆和交织的闭合曲线。",
  },
  {
    id: "standing",
    subject: "physics",
    title: "弦上的驻波与谐波",
    grade: "高中物理 · 波动拓展",
    tag: "叠加与驻波",
    description: "分解两列反向行波，寻找驻波中不动的波节与振动的波腹。",
  },
];
export const nativeMotionPreviewIds = motionTopics.map((topic) => topic.id);

export const motionPosterPath = (id) =>
  `./previews/motion/${id}.${[...natureTopics, ...geometricTopics, ...comparisonTopics, ...signalTopics, ...intuitiveTopics, ...vividTopics, ...mechanismTopics, ...expansionTopics, ...observableTopics, ...sectionTopics].some((topic) => topic.id === id) ? "svg" : "webp"}`;
