import { chemistryCatalog } from "./chemistryCatalog.mjs";
const chapter = (title, text, task, preset, time = 0) => ({
  title,
  text,
  task,
  preset,
  time,
});
export const chemistryTopics = [
  {
    ...chemistryCatalog.find((topic) => topic.id === "flame"),
    chapters: [
      chapter(
        "认识特征焰色",
        "受热激发后，发光粒子回到较低能级时发出特定波长的光。焰色可辅助识别元素；这一步发光本身不是化学反应。",
        "依次选择钠、锂、钾和铜，对照火焰颜色。",
        { sample: "sodium", contamination: 0 },
      ),
      chapter(
        "对比四种样品",
        "钠呈黄色，锂呈红色，钾呈淡紫色，铜盐常呈蓝绿色；颜色受样品与火焰条件影响。",
        "选择钾，再选择铜，比较色调。",
        { sample: "potassium", contamination: 0 },
      ),
      chapter(
        "钠污染的干扰",
        "微量钠产生的强黄光可能掩盖较弱的焰色。只凭肉眼看颜色，不能可靠鉴定混合物。",
        "增加钠污染，观察淡紫色被黄光覆盖。",
        { sample: "potassium", contamination: 0.65 },
      ),
      chapter(
        "清洁与复核",
        "清洁取样工具并做空白对照，可减少上一份样品造成的干扰。",
        "点击清洁工具，重新选择样品验证。",
        { sample: "lithium", contamination: 0.2 },
      ),
      chapter(
        "同一样品的清洁对照",
        "并排观察同一样品的清洁参考和污染状态，比记住单一颜色更容易发现干扰。",
        "先比较铜盐的两幅参考，再清洁复测；改用钠盐，解释为什么不能凭黄光判断是否混入了外来钠。",
        { sample: "copper", contamination: 0.5 },
      ),
      chapter(
        "一次只改变一个条件",
        "先保留一份观察，再切换样品或调整污染。一次只改变一个条件，有助于解释颜色差异；同时改变两个条件则不能单独归因。",
        "保留清洁锂盐作为参考，换成清洁钾盐比较；更新参考后增加钠污染，再清洁复核。切换章节会清除保留参考。",
        { sample: "lithium", contamination: 0 },
      ),
      chapter(
        "从激发到发光",
        "发光粒子由较高能级回到较低能级时可发射光子，光子能量对应两能级之差。单色光的波长越短，单个光子的能量越高。",
        "在主舞台逐步播放，再比较 450 nm 与 670 nm；不要把波长滑块当作具体盐样品的真实光谱。继续在下方比较钠黄光双线，缩小响应宽度，观察两个峰分开而中心波长不变。",
        { sample: "sodium", contamination: 0 },
        1,
      ),
    ],
    formula: "ΔE = hν；焰色是发射光的颜色",
    boundary:
      "颜色为显示器近似示意，不是光谱测量；污染滑块只表示视觉混光比例，不对应浓度。器材为虚拟教学演示。",
    source:
      "https://edu.rsc.org/resources/flame-tests-using-metal-salts/1875.article",
  },
  {
    ...chemistryCatalog.find((topic) => topic.id === "displacement"),
    chapters: [
      chapter(
        "铁片上的红色析出物",
        "铁与硫酸铜溶液反应，铜析出在铁表面。蓝色逐渐减弱，并出现亚铁离子的浅绿色。",
        "先切到三维器材并点“观察金属表面”，再用反应前、中间过程、完全反应逐步核对铜析出与溶液颜色；颗粒和表面纹理为示意。",
        { metal: "iron", mass: 0.56 },
      ),
      chapter(
        "锌片与铁片对照",
        "锌也能置换铜；形成的硫酸锌溶液近于无色。动画速度仅作示意，不能据此比较真实速率。",
        "在下方三杯对照中比较相同10 mmol的铁、锌与铜；定位反应前、中间和完全反应。再选择主模型观察，核对颜色、质量与析出铜。",
        { metal: "zinc", mass: 0.65 },
        60,
      ),
      chapter(
        "铜放入硫酸铜",
        "相同金属与其盐溶液在本模型条件下不发生净置换反应。",
        "播放主时间轴，观察下方对照中的铜片和蓝色溶液保持不变；与铁、锌杯中新析出铜的数值比较。",
        { metal: "copper", mass: 0.56 },
        60,
      ),
      chapter(
        "反应物与限量",
        "初始溶液含 10 mmol Cu²⁺。析出铜的量同时受金属用量与铜离子含量限制。",
        "减小金属质量，比较最终剩余铜离子。观察原金属片变薄、耗尽后消失，析出的铜仍留在杯中；夹持杆不是反应物。",
        { metal: "iron", mass: 0.2 },
        60,
      ),
      chapter(
        "镀了铜，固体一定增重吗",
        "每溶解1 mol铁或锌，析出1 mol铜；摩尔质量不同，固体总质量变化也不同。铁反应后总固体增重，锌反应后总固体减轻。",
        "本节已定位反应结束；分别选择铁和锌后，再将进度拖到结束观察，比较溶解质量与析出铜质量。称量比较假定铜全部保留且固体洗净干燥。",
        { metal: "iron", mass: 0.84 },
        60,
      ),
      chapter(
        "铜离子怎样变成铜",
        "铁、锌原子失去两个电子成为二价离子，铜离子得到两个电子成为铜。电子得失数相等，净反应保持电荷守恒。",
        "使用主图下方的电子记账演示，先看反应前再看反应后；比较铁、锌与铜。记账图不是实际电子路径。",
        { metal: "iron", mass: 0.56 },
        0,
      ),
    ],
    formula: "Fe + CuSO₄ → FeSO₄ + Cu；Zn + CuSO₄ → ZnSO₄ + Cu",
    boundary:
      "理想化充分接触模型，忽略钝化和副反应。进度按演示时间推进，不预测真实反应速率；颜色、金属片变薄和铜颗粒沉积为示意，不预测真实腐蚀形貌或沉降速度。",
    source:
      "https://openstax.org/books/chemistry-2e/pages/4-2-classifying-chemical-reactions",
  },
  {
    ...chemistryCatalog.find((topic) => topic.id === "electrolysis"),
    chapters: [
      chapter(
        "接通电源",
        "惰性电极、适量不参与主要电极反应的电解质条件下，阴极产生氢气，阳极产生氧气。",
        "先沿蓝色线找到负端与阴极，沿红色线找到正端与阳极；再接通电源，观察两极气泡与集气。颜色只是本器材的识别约定，判断极性以正负标识为准。",
        { current: 1 },
      ),
      chapter(
        "体积比 2∶1",
        "同温同压下，两极气体物质的量之比等于体积比。氢气体积为氧气的两倍。",
        "先观察预置的240秒状态，比较两支等内径集气管：气液界面以上的氢气柱约为氧气柱的两倍。气泡数量是示意，定量比较以气体读数为准。",
        { current: 1.5 },
        240,
      ),
      chapter(
        "电流与产气量",
        "理想电流效率为 100% 时，n(H₂)=It/(2F)，n(O₂)=It/(4F)。",
        "相同时间下改变电流，对照产气量。",
        { current: 0.5 },
        240,
      ),
      chapter(
        "断电后会怎样",
        "停止供电后，电解不再继续产生气体；已经收集的气体保留在管中。",
        "进入本节已暂停在通电240秒后的状态。检查已有气体保留；接通后再断开，核对停止增长。",
        { current: 2 },
        240,
      ),
      chapter(
        "体积比不是质量比",
        "同温同压下，氢氧体积比为2比1；按相对分子质量2和32近似，质量比为1比8。",
        "先观察预置的240秒状态，在下方切换体积与质量，观察条带大小反转。用气体物质的量乘以摩尔质量解释差异。",
        { current: 0.8 },
        240,
      ),
      chapter(
        "倒置集气管怎样读数",
        "气体从封闭顶部向下积累，体积刻度从顶部零点向下增加。等内径管中，气体体积正比于气柱高度。",
        "在下方放大刻度图中先估读，再显示精确数值核对；比较0、300、600秒的界面位置。不要把剩余水柱当成气体柱。",
        { current: 1.2 },
        300,
      ),
    ],
    formula: "2H₂O → 2H₂↑ + O₂↑（通电）；Q = It",
    boundary:
      "恒流源、惰性电极；按 25 °C、1 atm 的干燥理想气体计算，忽略溶解、泄漏和水蒸气。不是食盐水电解，不演示气体点燃。",
    source:
      "https://chem.libretexts.org/Bookshelves/General_Chemistry/Chem1_%28Lower%29/16%3A_Electrochemistry/16.10%3A_Electrolytic_Cells_and_Electrolysis",
  },
  {
    ...chemistryCatalog.find((topic) => topic.id === "distillation"),
    chapters: [
      chapter(
        "认识蒸馏装置",
        "蒸馏利用组分挥发性不同实现分离。蒸汽从支管进入冷凝管，冷却水从低端进入、高端流出。",
        "观察蒸馏瓶、温度计、冷凝管与接收瓶。蓝色箭头表示夹套内冷却水从低端流向高端，与内管蒸汽的行进方向相反；箭头不是水分子或实际流速。",
        { power: 400, cooling: true },
      ),
      chapter(
        "加热到沸腾",
        "加热先提高水温，达到近似沸点后，继续供热主要用于汽化。",
        "本节定位到120秒，已出现沸腾；复位后重新加热，观察从升温到汽化的转折。",
        { power: 600, cooling: true },
        120,
      ),
      chapter(
        "冷凝与收集",
        "冷凝水带走热量，使水蒸气凝结成液滴。理想收集时，减少的水与馏出水质量相等。",
        "拖动进度观察液滴和接收瓶液面。",
        { power: 800, cooling: true },
        240,
      ),
      chapter(
        "冷却水的重要性",
        "关闭冷却水后，本模型不再收集馏出水，蒸汽计为未收集损失。盐仍留在原瓶。",
        "关闭冷却水，比较收集量与蒸发量。",
        { power: 600, cooling: false },
        240,
      ),
      chapter(
        "功率与等待时间",
        "较低功率需要更久才能达到沸点；演示期间没有馏出水，不一定是装置故障。",
        "先定位演示结束，观察200 W时尚未沸腾；开启400 W参照曲线，把当前功率提高至800 W，比较到达同一100°C平台的时间。再定位刚到沸点和演示结束，解释为什么功率改变升温速度而不是本模型的沸点。",
        { power: 200, cooling: true },
        240,
      ),
      chapter(
        "蒸馏前后，盐去了哪里",
        "盐不随理想水蒸气离开原瓶；水逐渐减少，盐的质量不变，盐的质量分数增大。",
        "先定位演示结束，再在下方切换同一时刻的冷却对照。比较瓶内水、馏出水与未收集蒸汽，核对总质量202克以及原瓶盐始终2克。",
        { power: 800, cooling: true },
        240,
      ),
    ],
    formula: "Q₁ = mcΔT；Q₂ = m汽化L；盐不随水蒸气馏出",
    boundary:
      "200 g 水 + 2 g 不挥发盐；常压稀溶液近似沸点 100 °C，忽略沸点升高、器壁热容与散热。冷却开关表示理想完全冷凝或不收集。只演示部分蒸馏，不蒸干。",
    source:
      "https://www.chem.rochester.edu/notvoodoo/pages/purification/simple_distillation.php",
  },
];
export const flameSamples = {
  sodium: { name: "钠盐", color: "#ffbd28", label: "明亮黄色" },
  lithium: { name: "锂盐", color: "#f14c74", label: "红色" },
  potassium: { name: "钾盐", color: "#c29bff", label: "淡紫色" },
  copper: { name: "铜盐", color: "#3de0b8", label: "蓝绿色" },
};
export const FARADAY = 96485.33212;
export function electrolysisState(current, time) {
  const charge = Math.max(0, current) * Math.max(0, time);
  const h = charge / (2 * FARADAY),
    o = h / 2;
  return {
    charge,
    hydrogen: ((h * 8.314462618 * 298.15) / 101325) * 1e6,
    oxygen: ((o * 8.314462618 * 298.15) / 101325) * 1e6,
  };
}
export function displacementState(metal, mass, progress) {
  const molar = metal === "zinc" ? 65.38 : 55.845;
  const extent =
    metal === "copper"
      ? 0
      : Math.min(0.01, Math.max(0, mass) / molar) *
        Math.max(0, Math.min(1, progress));
  return {
    extent,
    copper: extent * 63.546,
    remaining: Math.max(0, 0.01 - extent),
    fraction: extent / 0.01,
  };
}
export function distillationState(power, time, cooling = true) {
  const energy = Math.max(0, power) * Math.max(0, time),
    heat = 200 * 4.18 * 80;
  const evaporated = Math.min(60, Math.max(0, energy - heat) / 2257);
  return {
    temperature: Math.min(100, 20 + energy / (200 * 4.18)),
    evaporated,
    collected: cooling ? evaporated : 0,
    lost: cooling ? 0 : evaporated,
    remaining: 200 - evaporated,
    salt: 2,
    boiling: energy >= heat,
  };
}
