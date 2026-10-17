import { extensionLessons } from "./natureExtension.mjs";
import { natureTopics } from "./natureTopics.mjs";
const f = (key, label, min, max, step, value, unit = "") => ({
  key,
  label,
  min,
  max,
  step,
  value,
  unit,
});
const c = (title, text, task, preset, time = 0) => ({
  title,
  text,
  task,
  preset,
  time,
});
export const natureLessons = [
  {
    ...natureTopics[0],
    params: [
      f("fuel", "可燃物：0 无 / 1 有", 0, 1, 1, 1),
      f("oxygen", "氧气：0 隔绝 / 1 充足", 0, 1, 1, 1),
      f("heat", "温度：0 低于 / 1 达到着火点", 0, 1, 1, 1),
    ],
    chapters: [
      c(
        "三个条件缺一不可",
        "可燃物与氧气接触，温度达到其着火点，才具备燃烧条件。",
        "播放火焰，再一次只改变一个条件。",
        { fuel: 1, oxygen: 1, heat: 1 },
      ),
      c(
        "隔绝氧气",
        "覆盖使可燃物与氧气隔离，不能维持燃烧。",
        "恢复供氧，比较现象。",
        { fuel: 1, oxygen: 0, heat: 1 },
      ),
      c(
        "降温至着火点以下",
        "降温改变的是温度，不是物质本身的着火点。",
        "调节温度条件，对照其余两项。",
        { fuel: 1, oxygen: 1, heat: 0 },
      ),
      c(
        "移走可燃物",
        "移开可燃物也能破坏燃烧条件。",
        "观察燃料消失后，即便供氧与温度条件满足也不会燃烧。",
        { fuel: 0, oxygen: 1, heat: 1 },
      ),
    ],
    formula: "可燃物 + 氧气接触 + 达到着火点 → 具备燃烧条件",
    assumption:
      "条件判断模型；不模拟耗氧、传热、火灾蔓延及特殊燃烧反应。动画速度不代表燃烧速率。",
  },
  {
    ...natureTopics[1],
    params: [
      f("sand", "泥沙颗粒份数", 0, 20, 1, 12),
      f("salt", "溶解盐份数", 0, 20, 1, 8),
    ],
    chapters: [
      c(
        "泥沙与盐水",
        "不溶的泥沙可被滤纸截留，溶解的盐随水进入滤液。",
        "播放过滤，对照滤渣与滤液。",
        { sand: 12, salt: 8 },
      ),
      c(
        "泥水的过滤",
        "过滤可以分离液体与不溶性固体。",
        "将泥沙数量增加，观察滤纸上的残留。",
        { sand: 20, salt: 0 },
      ),
      c(
        "透明不等于纯净",
        "盐水看起来透明，过滤后仍是盐水。",
        "滤渣为零时，检查滤液中的盐。",
        { sand: 0, salt: 15 },
      ),
      c(
        "检查分离结果",
        "过滤没有使盐消失，也没有生成新的物质。",
        "核对各处泥沙和盐的总份数是否分别守恒。",
        { sand: 10, salt: 10 },
        3,
      ),
    ],
    formula: "泥沙：原液 + 滤渣 = 总量；盐：原液 + 滤液 = 总量",
    assumption:
      "理想过滤，忽略滤纸吸附和液体残留。颗粒为符号，不代表真实尺寸；盐点代表溶解物示意，不是盐晶体。滤液不可据此视为饮用水。",
  },
  {
    ...natureTopics[2],
    params: [f("depth", "呼吸幅度", 20, 100, 5, 70, "%")],
    chapters: [
      c(
        "吸气：胸廓扩大",
        "吸气时膈肌收缩下降，胸廓容积增大，肺内气压暂时低于外界，空气进入。",
        "播放，追踪膈肌与气流方向。",
        { depth: 70 },
        1,
      ),
      c(
        "呼气：胸廓回缩",
        "平静呼气时膈肌舒张上升，胸廓容积减小，空气排出。",
        "对照呼气和吸气的箭头。",
        { depth: 70 },
        4,
      ),
      c(
        "浅呼吸与深呼吸",
        "幅度不同，胸廓与肺的扩张程度也不同。",
        "降低幅度，比较同一阶段的轮廓。",
        { depth: 25 },
        1.5,
      ),
      c(
        "肺不是主动收缩的肌肉",
        "肺随胸廓运动被动扩张和回缩。图中同时显示膈肌与肺，避免把气体误画入胸膜腔。",
        "增大幅度并拖动进度，按顺序解释变化。",
        { depth: 100 },
        3,
      ),
    ],
    formula: "膈肌运动 → 胸廓容积变化 → 肺内外压差 → 气流",
    assumption:
      "平静呼吸的结构示意，未模拟气体交换和肺顺应性。轮廓、位移放大，周期用于教学，不用于医学判断。",
  },
  {
    ...natureTopics[3],
    params: [
      f("water", "水分：0 干燥 / 1 适量", 0, 1, 1, 1),
      f("air", "空气：0 缺乏 / 1 充足", 0, 1, 1, 1),
      f("temperature", "环境温度", 5, 40, 5, 25, "°C"),
    ],
    chapters: [
      c(
        "适宜条件与对照组",
        "选用完整、有活力且已解除休眠的同种种子，两组数量一致。对照组保持适量水、空气与25°C。",
        "播放，比较两组幼根与幼芽。",
        { water: 1, air: 1, temperature: 25 },
      ),
      c(
        "只改变水分",
        "实验组不给水，其他条件与对照组相同。",
        "比较两组；只修改水分，避免同时改变温度。",
        { water: 0, air: 1, temperature: 25 },
      ),
      c(
        "只改变空气条件",
        "缺少充足空气时，种子萌发受到限制。",
        "恢复空气后重新播放。",
        { water: 1, air: 0, temperature: 25 },
      ),
      c(
        "只改变温度",
        "适宜温度随植物种类而异。这里用一种假设种子的条件模型比较低温组。",
        "把实验组温度调至25°C，与对照组比较。",
        { water: 1, air: 1, temperature: 5 },
      ),
    ],
    formula: "对照实验：一次改变一个因素，其余条件保持一致",
    assumption:
      "假设种子在15–30°C适宜范围内萌发；是条件示意，不能推断真实发芽率、萌发天数或所有物种阈值。图中每组仅示意一粒，真实实验应有足量种子和重复。",
  },
  {
    ...natureTopics[4],
    params: [
      f("day", "时段：0 夜晚 / 1 白昼", 0, 1, 1, 1),
      f("contrast", "海陆温差示意", 0, 10, 1, 6),
    ],
    chapters: [
      c(
        "白昼的海风",
        "白昼陆地升温较快，陆地近地面空气上升，海上较凉空气在近地面流向陆地。",
        "追踪一粒空气标记经过完整环流。",
        { day: 1, contrast: 6 },
      ),
      c(
        "夜晚的陆风",
        "夜间陆地降温较快，海面相对温暖，近地面风由陆地吹向海洋。",
        "比较高空与近地面的方向。",
        { day: 0, contrast: 6 },
      ),
      c(
        "温差减小",
        "局地热力差异减弱时，环流示意也减弱。",
        "将温差降至0，检查箭头与粒子是否停止。",
        { day: 1, contrast: 0 },
      ),
      c(
        "完整闭合环流",
        "上升、上空水平运动、下沉和近地面回流组成环流；不能只画一根海风箭头。",
        "切换昼夜，判断两侧上升和下沉位置。",
        { day: 1, contrast: 10 },
      ),
    ],
    formula: "海陆热力差异 → 空气升降 → 同一高度气压差 → 水平运动",
    assumption:
      "理想局地海陆风示意，忽略大尺度背景风、地转偏向力和地形。温差指数不对应风速；并非所有海岸每天都出现规则环流。",
  },
  {
    ...natureTopics[5],
    params: [
      f("slope", "坡度指数", 1, 10, 1, 6),
      f("flow", "水量指数", 10, 100, 5, 65),
      f("grain", "粒径等级（小 → 大）", 1, 8, 1, 3),
    ],
    chapters: [
      c(
        "坡陡与搬运",
        "较大的坡度和水量通常增强流水搬运能力。",
        "播放，观察颗粒能否沿河道继续移动。",
        { slope: 8, flow: 80, grain: 3 },
      ),
      c(
        "流速减弱与沉积",
        "模型中坡度减小，搬运能力降低，颗粒落到河床。",
        "减小坡度，对比运动轨迹。",
        { slope: 2, flow: 50, grain: 3 },
      ),
      c(
        "粗颗粒更早沉积",
        "同样的水流条件下，大颗粒较难继续搬运。",
        "依次比较粒径1与8。",
        { slope: 5, flow: 70, grain: 8 },
      ),
      c(
        "水量改变河流作用",
        "水量是影响河流搬运的因素之一。真实河道还受形态、粗糙度和泥沙性质影响。",
        "保持坡度和粒径，改变水量。",
        { slope: 5, flow: 95, grain: 3 },
      ),
    ],
    formula: "搬运能力减弱 → 难以搬运的颗粒沉积",
    assumption:
      "定性阈值模型，指数没有物理单位，不是实测流速或泥沙输移公式；忽略黏性细颗粒、紊流与再悬浮。图中地貌为示意，不用于工程预测。",
  },
];

// Final chapters add a contrasting observation rather than duplicate presets.
const closingChapters = [
  c(
    "同时缺少两个条件",
    "只有温度达到着火点仍不足以燃烧；恢复可燃物后，若仍隔绝氧气也不能维持燃烧。",
    "先恢复可燃物，再恢复氧气，逐项解释结果。",
    { fuel: 0, oxygen: 0, heat: 1 },
  ),
  c(
    "纯水通过滤纸",
    "没有不溶性固体与溶解盐时，理想过滤不产生滤渣，也不产生新溶质。",
    "比较纯水与盐水两节，不能仅凭透明程度判断成分。",
    { sand: 0, salt: 0 },
  ),
  c(
    "一个完整的呼吸周期",
    "从呼气末的状态开始，观察吸气再到呼气；膈肌与肺的变化是连续的。",
    "播放完整周期，比较开始和结束时的轮廓。",
    { depth: 50 },
  ),
  c(
    "温度过高也不适宜",
    "适宜温度不等于越高越好。此假设种子在40°C条件下不出现萌发示意。",
    "只调温度至25°C，重新播放比较。",
    { water: 1, air: 1, temperature: 40 },
  ),
  c(
    "较强温差下的夜间环流",
    "昼夜只改变热力环流方向，温差改变示意强弱，两者不是同一变量。",
    "与较弱夜间温差比较，保持时段不变。",
    { day: 0, contrast: 10 },
  ),
  c(
    "细颗粒也会失去搬运条件",
    "在模型的极弱水流条件下，即使最细的颗粒也无法继续搬运。",
    "保持粒径不变，增加水量和坡度，找到示意模型的转变条件。",
    { slope: 1, flow: 10, grain: 1 },
  ),
];
natureLessons.forEach((lesson, i) => lesson.chapters.push(closingChapters[i]));

natureLessons.push(...extensionLessons);

// Comparison chapters start at the same observation endpoint; the first chapter
// retains the full process from its beginning. Replay remains available.
for (const lesson of natureLessons) {
  if (
    ["filtration", "germination", "rusting", "crystallization"].includes(
      lesson.id,
    )
  ) {
    lesson.chapters.forEach((chapter, index) => {
      if (index > 0) chapter.time = 6;
    });
  }
  if (lesson.id === "rock-cycle") {
    lesson.chapters.forEach((chapter, index) => {
      if (index > 0) chapter.time = 3;
    });
  }
}
