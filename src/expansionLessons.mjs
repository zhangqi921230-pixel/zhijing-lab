import { expansionTopics } from "./expansionTopics.mjs";
const field = (key, label, min, max, step, value, unit) => ({
  key,
  label,
  min,
  max,
  step,
  value,
  unit,
});
const chapter = (title, text, task, preset, time = 6) => ({
  title,
  text,
  task,
  preset,
  time,
});
export const expansionLessons = [
  {
    ...expansionTopics[0],
    params: [
      field("radius", "底面半径", 1, 3, 0.5, 2, "cm"),
      field("height", "圆柱高度", 2, 6, 0.5, 4, "cm"),
    ],
    chapters: [
      chapter(
        "侧面展开成长方形",
        "沿母线剪开圆柱侧面，展开后的宽等于底面周长，高等于圆柱高度。",
        "播放展开，追踪金色边缘与竖向虚线；暂停在半程，判断侧面积是否改变。",
        { radius: 2, height: 4 },
        0,
      ),
      chapter(
        "补上两个圆形底面",
        "闭合圆柱的表面积包含侧面和两个相同的圆形底面。",
        "播放两个底面移向展开图，核对三个面的面积。",
        { radius: 2, height: 4 },
        1.5,
      ),
      chapter(
        "半径加倍，会发生什么？",
        "高度固定，半径加倍使侧面积加倍，而两个底面的面积变为四倍。",
        "将半径从1调到2 cm，对照面积读数。",
        { radius: 1, height: 4 },
      ),
      chapter(
        "高度加倍，哪些面不变？",
        "半径固定，高度加倍只使侧面积加倍；底面积保持不变。",
        "把高度从2调到4 cm，观察展开图。",
        { radius: 2, height: 2 },
      ),
      chapter(
        "无盖容器用多少材料？",
        "忽略材料厚度和接缝，无盖圆柱只需要侧面与一个底面。",
        "改变尺寸，对照有盖与无盖所需面积的差。",
        { radius: 2, height: 4 },
      ),
    ],
    formula: "S侧 = 2πrh；S全 = 2πrh + 2πr²",
    assumption:
      "理想薄壁圆柱，不计接缝与厚度。侧面按保持弧长的可展曲面连续展平，二维斜投影中的可见宽度不代表真实弧长。完全展平的图共用长度比例尺；左侧立体为斜视示意。动画时间表示展开进度。",
  },
  {
    ...expansionTopics[1],
    params: [
      field("red", "红光强度", 0, 100, 5, 100, "%"),
      field("green", "绿光强度", 0, 100, 5, 100, "%"),
      field("blue", "蓝光强度", 0, 100, 5, 100, "%"),
    ],
    chapters: [
      chapter(
        "三束光相遇",
        "红、绿、蓝是显示设备常用的三原色；光束重叠时，各通道相加。",
        "播放光斑靠近，观察中央重叠区。",
        { red: 100, green: 100, blue: 100 },
        0,
      ),
      chapter(
        "红光加绿光",
        "红光和绿光在屏幕上混合形成黄色。这里混合的是光，不是颜料。",
        "改变红绿光比例，再加入蓝光比较。",
        { red: 100, green: 100, blue: 0 },
      ),
      chapter(
        "青色与品红色",
        "绿加蓝得到青色，红加蓝得到品红色。",
        "先关闭绿光、打开红光，观察青色变为品红色。",
        { red: 0, green: 100, blue: 100 },
      ),
      chapter(
        "等量通道与灰白",
        "校准显示空间中，等量的三个通道产生中性的灰白；强度降低时亮度下降。",
        "同步调低三个通道，比较中性灰与白。",
        { red: 25, green: 25, blue: 25 },
      ),
      chapter(
        "互补色能合成白光",
        "红与青、绿与品红、蓝与黄，按匹配的通道强度相加可得到中性的白。",
        "从红加青开始，降低蓝光，观察白色如何偏黄。",
        { red: 100, green: 100, blue: 100 },
      ),
    ],
    formula: "(R,0,0) + (0,G,0) + (0,0,B) = (R,G,B)",
    assumption:
      "理想线性 RGB 通道示意，经 sRGB 编码显示。不是光谱计算，不表示任意三束单色光等功率就一定为白光；显示效果受屏幕影响。",
  },
];
export function expansionState(id, p) {
  if (id === "cylinder-net") {
    const base = Math.PI * p.radius ** 2,
      side = 2 * Math.PI * p.radius * p.height;
    return {
      base,
      side,
      total: side + 2 * base,
      open: side + base,
      circumference: 2 * Math.PI * p.radius,
    };
  }
  const encode = (x) =>
    Math.round(
      255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055),
    );
  return {
    rgb: [p.red, p.green, p.blue].map((x) =>
      encode(Math.max(0, Math.min(1, x / 100))),
    ),
  };
}
export function expansionReadouts(id, p) {
  const q = expansionState(id, p);
  return id === "cylinder-net"
    ? [
        ["侧面积", `${q.side.toFixed(2)} cm²`],
        ["完整表面积", `${q.total.toFixed(2)} cm²`],
        ["无盖表面积", `${q.open.toFixed(2)} cm²`],
      ]
    : [
        ["红光", `${p.red}%`],
        ["绿光", `${p.green}%`],
        ["蓝光", `${p.blue}%`],
      ];
}
