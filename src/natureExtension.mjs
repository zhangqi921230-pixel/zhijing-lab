import { extensionTopics } from "./natureExtensionTopics.mjs";
export { extensionTopics };
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
export const extensionLessons = [
  {
    ...extensionTopics[0],
    params: [
      f("salt", "初始溶质质量", 10, 36, 1, 30, "g"),
      f("evaporation", "最终蒸发水量", 0, 80, 5, 70, "g"),
    ],
    chapters: [
      c(
        "水减少，盐还在",
        "保持温度不变，逐渐移走水分；溶质不会随水蒸气离开。",
        "播放并比较溶解与结晶两部分质量。",
        { salt: 30, evaporation: 70 },
      ),
      c(
        "尚未达到饱和",
        "较少的蒸发量不足以析出晶体。",
        "观察结束时是否有晶体。",
        { salt: 20, evaporation: 20 },
      ),
      c(
        "刚好达到饱和",
        "模型中每100 g水最多溶解36 g盐。",
        "比较蒸发开始前和开始后。",
        { salt: 36, evaporation: 40 },
      ),
      c(
        "降低初始浓度",
        "同样蒸发水量，较稀的溶液析晶更晚。",
        "与第一节比较出现晶体的时刻。",
        { salt: 10, evaporation: 70 },
      ),
      c(
        "停止蒸发",
        "无水损失时，不会仅因时间推移自动析晶。",
        "保持水量，解释质量读数。",
        { salt: 30, evaporation: 0 },
      ),
    ],
    formula: "溶解的盐 + 析出的盐 = 初始盐质量",
    assumption:
      "固定温度的理想平衡模型，采用36 g/100 g水的近似溶解度，不模拟加热温变、过饱和、晶核形成或真实时间。水蒸气不可见，蓝点仅为水分示踪。",
  },
  {
    ...extensionTopics[1],
    params: [
      f("water", "水分：0 干燥 / 1 潮湿", 0, 1, 1, 1),
      f("oxygen", "氧气：0 隔绝 / 1 接触", 0, 1, 1, 1),
      f("coating", "涂层：0 裸露 / 1 完整", 0, 1, 1, 0),
    ],
    chapters: [
      c(
        "潮湿空气中的铁",
        "水和氧气共同接触铁时，可逐渐出现锈斑。",
        "比较左侧固定对照与右侧实验。",
        { water: 1, oxygen: 1, coating: 0 },
      ),
      c(
        "除去水分",
        "干燥条件排除了生锈所需的水分。",
        "只改变水分，观察两根铁钉。",
        { water: 0, oxygen: 1, coating: 0 },
      ),
      c(
        "隔绝氧气",
        "理想除氧并隔绝空气条件下，不出现锈斑。",
        "解释有水为什么仍不能生锈。",
        { water: 1, oxygen: 0, coating: 0 },
      ),
      c("完整涂层", "完整涂层隔开铁与水、氧气。", "去掉涂层并重新播放比较。", {
        water: 1,
        oxygen: 1,
        coating: 1,
      }),
      c(
        "同时缺少水和氧气",
        "一次改变两个因素，不能判断哪一个因素起作用。",
        "恢复一个变量，设计有效对照。",
        { water: 0, oxygen: 0, coating: 0 },
      ),
    ],
    formula: "铁 + 水 + 氧气接触 → 生锈条件；完整涂层阻断接触",
    assumption:
      "时间压缩的定性模型；锈斑比例不等于反应速率或铁质量损失。隔氧指理想去除溶解氧且不重新进入氧气；不模拟盐度、电化学及涂层破损。",
  },
  {
    ...extensionTopics[2],
    params: [
      f("opening", "气孔开度", 0, 100, 10, 70, "%"),
      f("humidity", "空气相对湿度", 20, 100, 10, 40, "%"),
    ],
    chapters: [
      c(
        "根到叶的水分通路",
        "根吸收水分，水经茎中的导管运输，主要从叶片气孔散失。",
        "跟随蓝点，区分液态运输与水蒸气。",
        { opening: 70, humidity: 40 },
      ),
      c(
        "气孔关闭",
        "关闭气孔可显著减少经气孔的水分散失。",
        "比较关闭前后的示踪点。",
        { opening: 0, humidity: 40 },
      ),
      c(
        "气孔充分开放",
        "在其他条件相同时，开度增大可增加水分散失。",
        "保持湿度不变比较。",
        { opening: 100, humidity: 40 },
      ),
      c(
        "潮湿空气",
        "空气越潮湿，水分散失的驱动力越小。",
        "与第一节保持相同气孔开度。",
        { opening: 70, humidity: 90 },
      ),
      c(
        "饱和空气的理想对照",
        "叶温与气温相同时，饱和空气中没有该模型的水汽梯度。",
        "说明模型为什么显示零通量。",
        { opening: 70, humidity: 100 },
      ),
    ],
    formula: "水分路径：根毛 → 导管 → 叶片 → 气孔",
    assumption:
      "示踪点为水分路径，不是可见气泡；蒸腾指数=气孔开度比例×(1−相对湿度)，仅用于同温、供水充足下的定性比较，忽略角质层蒸腾和植物反馈。",
  },
  {
    ...extensionTopics[3],
    params: [
      f("pollen", "花粉：0 未到达 / 1 到达柱头", 0, 1, 1, 1),
      f("compatible", "花粉相容：0 不相容 / 1 相容", 0, 1, 1, 1),
    ],
    chapters: [
      c(
        "传粉不是受精",
        "花粉落到柱头叫传粉；受精发生在胚珠内。",
        "播放，观察两者发生位置。",
        { pollen: 1, compatible: 1 },
      ),
      c(
        "没有花粉到达",
        "未传粉时，这个正常有性生殖模型不能继续。",
        "补充相容花粉，重新播放。",
        { pollen: 0, compatible: 1 },
      ),
      c(
        "不相容的花粉",
        "到达柱头并不保证成功受精。",
        "比较花粉在柱头后的变化。",
        { pollen: 1, compatible: 0 },
      ),
      c(
        "花粉管向胚珠生长",
        "相容花粉萌发后，花粉管经花柱向胚珠生长。",
        "暂停在受精前，指出花柱与胚珠。",
        { pollen: 1, compatible: 1 },
        2.5,
      ),
      c(
        "子房与胚珠的去向",
        "受精后，子房发育成果实，胚珠发育成种子。",
        "在结束画面对照两者来源。",
        { pollen: 1, compatible: 1 },
        6,
      ),
    ],
    formula: "传粉 → 花粉管生长 → 受精 → 果实与种子形成",
    assumption:
      "典型被子植物的简化纵剖示意，压缩数日过程；不展示双受精细节、无融合生殖或单性结实。只画一个胚珠，不代表所有花只有一个胚珠。",
  },
  {
    ...extensionTopics[4],
    params: [
      f("height", "山顶高度", 500, 3000, 250, 2500, "m"),
      f("cloudbase", "凝结开始高度", 500, 2500, 250, 1000, "m"),
      f("wind", "来风：0 从右侧 / 1 从左侧", 0, 1, 1, 1),
    ],
    chapters: [
      c(
        "迎风坡抬升",
        "湿空气沿迎风坡抬升，冷却到凝结条件后可形成云和降水。",
        "跟随气流从山前移动至山后。",
        { height: 2500, cloudbase: 1000, wind: 1 },
      ),
      c(
        "低山不一定下雨",
        "若抬升高度不足以达到凝结条件，不产生本模型的地形雨。",
        "比较山顶与凝结高度线。",
        { height: 750, cloudbase: 1000, wind: 1 },
      ),
      c(
        "较干空气需要更高抬升",
        "凝结开始高度提高，形成云雨的坡段缩短。",
        "保持山高，调高凝结高度。",
        { height: 2500, cloudbase: 2250, wind: 1 },
      ),
      c(
        "风向改变，坡面角色交换",
        "迎风与背风取决于风向，不固定在山的左侧或右侧。",
        "切换风向，观察云雨移到另一侧。",
        { height: 2500, cloudbase: 1000, wind: 0 },
      ),
      c(
        "背风侧的雨影",
        "降水损失水分后，空气下沉增温，常形成相对少雨区。",
        "比较高山两侧，注意相对少雨不等于永不下雨。",
        { height: 3000, cloudbase: 750, wind: 1 },
      ),
    ],
    formula: "抬升冷却 → 凝结降水；背风下沉增温 → 相对少雨",
    assumption:
      "理想二维地形示意，凝结高度为给定条件，雨量用相对指数表示；不计算天气预报、气温递减率、锋面与复杂风场。",
  },
  {
    ...extensionTopics[5],
    params: [
      f(
        "process",
        "转化路径（1 冷凝 / 2 风化 / 3 成岩 / 4 变质 / 5 熔融）",
        1,
        5,
        1,
        1,
      ),
    ],
    chapters: [
      c("岩浆冷凝", "岩浆冷却凝固，形成岩浆岩。", "追踪亮点从岩浆到岩浆岩。", {
        process: 1,
      }),
      c(
        "风化与搬运",
        "暴露于地表的岩石可被风化、侵蚀，碎屑被搬运并沉积。",
        "观察岩石碎屑进入沉积区。",
        { process: 2 },
      ),
      c(
        "压实与胶结",
        "沉积物经过成岩作用形成沉积岩。",
        "比较松散颗粒与层状岩石。",
        { process: 3 },
      ),
      c(
        "变质不等于熔化",
        "岩石在未整体熔融条件下受温度、压力影响发生变质。",
        "观察层理形变，区分液态岩浆。",
        { process: 4 },
      ),
      c(
        "熔融回到岩浆",
        "岩石熔融后成为岩浆，进入新的转化路径。",
        "说明循环为什么没有唯一的起点和固定路线。",
        { process: 5 },
      ),
    ],
    formula: "岩石循环是多条路径构成的网络，并非唯一的五步顺序",
    assumption:
      "展示代表性路径；不同岩石均可能风化、变质或熔融，实际须满足相应条件。动画秒数与地质时间无对应关系；粒子只是追踪标记。",
  },
];
export const isExtension = (id) => extensionTopics.some((x) => x.id === id);
export function extensionState(id, p, t = 0) {
  const progress = Math.max(0, Math.min(1, t / 6));
  if (id === "crystallization") {
    const water = 100 - p.evaporation * progress;
    const dissolved = Math.min(p.salt, 0.36 * water);
    return { progress, water, dissolved, crystal: p.salt - dissolved };
  }
  if (id === "rusting")
    return { progress, rust: p.water && p.oxygen && !p.coating ? progress : 0 };
  if (id === "transpiration")
    return { progress, flux: (p.opening / 100) * (1 - p.humidity / 100) };
  if (id === "pollination")
    return {
      progress,
      tube:
        p.pollen && p.compatible
          ? Math.max(0, Math.min(1, (progress - 0.18) / 0.47))
          : 0,
      fruit: !!(p.pollen && p.compatible && progress >= 0.8),
      fruitGrowth:
        p.pollen && p.compatible ? Math.max(0, (progress - 0.8) / 0.2) : 0,
    };
  if (id === "rain-shadow")
    return { progress, rain: Math.max(0, (p.height - p.cloudbase) / 2500) };
  return { progress, process: p.process };
}
export function extensionReadouts(id, p, t) {
  const q = extensionState(id, p, t);
  if (id === "crystallization")
    return [
      ["剩余水", q.water.toFixed(1) + " g"],
      ["溶解的盐", q.dissolved.toFixed(1) + " g"],
      ["析出的盐", q.crystal.toFixed(1) + " g"],
    ];
  if (id === "rusting")
    return [
      ["固定对照", "潮湿、接触氧气、裸露"],
      ["实验组", q.rust > 0 ? "出现锈斑" : "未出现锈斑"],
      ["观察时序", (q.progress * 100).toFixed(0) + "%（时间压缩）"],
    ];
  if (id === "transpiration")
    return [
      ["蒸腾相对指数", q.flux.toFixed(2)],
      ["气孔开度", p.opening + "%"],
      ["空气湿度", p.humidity + "%"],
    ];
  if (id === "pollination")
    return [
      ["花粉", p.pollen ? "已到达柱头" : "未传粉"],
      [
        "过程",
        q.fruit
          ? "果实与种子形成"
          : q.tube === 1
            ? "已到达胚珠"
            : q.tube > 0
              ? "花粉管生长"
              : p.pollen && p.compatible
                ? "花粉准备萌发"
                : "等待相容花粉",
      ],
      ["观察", "典型有性生殖示意"],
    ];
  if (id === "rain-shadow")
    return [
      ["迎风侧", p.wind ? "左侧" : "右侧"],
      ["抬升超出凝结高度", Math.max(0, p.height - p.cloudbase) + " m"],
      ["示意降水", q.rain > 0 ? "迎风坡出现降水" : "抬升不足"],
    ];
  return [
    [
      "当前路径",
      ["", "冷凝", "风化、侵蚀与沉积", "压实与胶结", "变质", "熔融"][p.process],
    ],
    ["时间", "地质过程压缩"],
    ["学习重点", "识别转化条件"],
  ];
}
