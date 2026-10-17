import { sectionTopics } from "./sectionTopics.mjs";
const field = (key, label, min, max, step, value, unit) => ({
  key,
  label,
  min,
  max,
  step,
  value,
  unit,
});
const chapter = (title, text, task, preset, time = 3) => ({
  title,
  text,
  task,
  preset,
  time,
});
export const sectionLessons = [
  {
    ...sectionTopics[0],
    params: [
      field("radius", "底面半径", 1, 3, 0.5, 2, "cm"),
      field("height", "立体高度", 3, 6, 1, 6, "cm"),
    ],
    chapters: [
      chapter(
        "从底面到顶点的切片",
        "同底等高的圆柱和圆锥，水平截面并不一样大。圆锥的截面越接近顶点越小。",
        "播放切片上移，比较同一高度的两片圆。",
        { radius: 2, height: 6 },
        1.5,
      ),
      chapter(
        "三份圆锥，装满圆柱",
        "圆锥体积是同底等高圆柱的三分之一。右侧每一层表示一份完整圆锥的体积。",
        "拖动时间到2、4、6秒，依次填入一份、两份、三份。",
        { radius: 2, height: 6 },
        2,
      ),
      chapter(
        "半径加倍，体积四倍",
        "高度固定时，底面积与半径的平方成正比，两个立体的体积都随之变化。",
        "把半径从1 cm调到2 cm，核对体积增大为4倍。",
        { radius: 1, height: 6 },
      ),
      chapter(
        "高度加倍，体积两倍",
        "半径不变，高度加倍，圆柱与圆锥的体积都加倍，二者比值仍是3。",
        "把高度从3 cm调到6 cm，比较底面不变而高度增加。",
        { radius: 2, height: 3 },
      ),
      chapter(
        "半高处不是半个底面积",
        "从底面量到半高处，圆锥截面半径减半，面积变为底面积的四分之一。",
        "将时间定位到3秒，再与底面和顶点对比。",
        { radius: 2, height: 6 },
        3,
      ),
      chapter(
        "用薄片逼近圆锥体积",
        "用每层顶部半径作圆柱，体积偏小；用底部半径作圆柱，体积偏大。层数增加时，两者一起逼近圆锥体积。",
        "选择4、8、16、32层，比较上下界间距；回到起点并播放，逐层观察薄圆柱。",
        { radius: 2, height: 6 },
        6,
      ),
    ],
    formula: "V柱 = πr²h；V锥 = πr²h / 3；A(z) = πr²(1 − z/h)²",
    assumption:
      "斜视图以椭圆表现水平圆面，所有长度共用比例尺。切片和体积分层为几何示意，不是液体倒入圆锥的模拟。6秒表示一次展示进度。",
  },
  {
    ...sectionTopics[1],
    params: [
      field("depth", "水深", 1, 5, 0.5, 3, "m"),
      field("density", "液体密度", 800, 1200, 100, 1000, "kg/m³"),
    ],
    chapters: [
      chapter(
        "越深，压强越大",
        "静止液体内部的表压随深度线性增大。测压点从液面移向底部，压强读数随之增加。",
        "播放探头下潜，核对半深处和底部读数。",
        { depth: 3, density: 1000 },
        0,
      ),
      chapter(
        "同深度，与左右位置无关",
        "同种静止液体中，同一深度的压强相等。两个探头横向分开，读数仍然相同。",
        "改变水深，观察同深度两个探头始终等压。",
        { depth: 3, density: 1000 },
      ),
      chapter(
        "换一种密度的液体",
        "同一深度，密度越大，液体压强越大。保持水深不变可直接对照。",
        "把密度从800调至1200 kg/m³，探头深度保持不变，压强变成原来的1.5倍。绿色虚线固定为相同水深下的清水分布，金色表示当前液体。",
        { depth: 3, density: 800 },
      ),
      chapter(
        "水坝为什么下部更厚",
        "竖直坝面受到的压强从零增至底部最大值，每单位坝宽的水平合力与水深的平方成正比。",
        "把水深从2调至4 m，比较底部压强和每米坝宽合力。",
        { depth: 2, density: 1000 },
        6,
      ),
      chapter(
        "合力作用在哪里",
        "三角形压强分布的合力作用点，在距水面三分之二水深处。下部承受更大的压强。",
        "改变水深，观察合力位置始终在水深的2/3处。",
        { depth: 4, density: 1000 },
        6,
      ),
    ],
    formula: "p = ρgz；F / 坝宽 = ρgh² / 2；合力深度 = 2h / 3",
    assumption:
      "静止、均匀密度液体；g = 9.8 m/s²，读数是相对大气的表压。坝面竖直，另一侧为空气，不计算渗流和坝体稳定性。箭头以同一压强比例绘制；探头移动为展示进度，不是水流。",
  },
];
export function sectionState(id, p, time = 0) {
  const progress = Math.max(0, Math.min(1, time / 6));
  if (id === "solid-volume") {
    const base = Math.PI * p.radius ** 2,
      cylinder = base * p.height;
    return {
      progress,
      base,
      cylinder,
      cone: cylinder / 3,
      sliceRadius: p.radius * (1 - progress),
      sliceArea: base * (1 - progress) ** 2,
    };
  }
  return {
    progress,
    probeDepth: p.depth * progress,
    pressure: p.density * 9.8 * p.depth * progress,
    bottom: p.density * 9.8 * p.depth,
    force: (p.density * 9.8 * p.depth ** 2) / 2,
    center: (p.depth * 2) / 3,
  };
}
export function sectionReadouts(id, p, time, chapter = 0) {
  const q = sectionState(id, p, time);
  return id === "solid-volume"
    ? [
        ["圆柱体积", `${q.cylinder.toFixed(2)} cm³`],
        ["圆锥体积", `${q.cone.toFixed(2)} cm³`],
        chapter === 1
          ? ["已填体积", `${(q.cylinder * q.progress).toFixed(2)} cm³`]
          : chapter === 5
            ? ["理论体积比", "圆锥 : 圆柱 = 1 : 3"]
            : ["切片面积", `${q.sliceArea.toFixed(2)} cm²`],
      ]
    : [
        ["探头表压", `${(q.pressure / 1000).toFixed(2)} kPa`],
        ["底部表压", `${(q.bottom / 1000).toFixed(2)} kPa`],
        ["每米坝宽合力", `${(q.force / 1000).toFixed(2)} kN/m`],
      ];
}
