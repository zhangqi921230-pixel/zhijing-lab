import { transportReading } from "./TransportReading.mjs";
import { homeReading } from "./HomeReading.mjs";
import { processReading } from "./ProcessReading.mjs";
const biology = {
  title: "OpenStax · Pollination and Fertilization",
  url: "https://openstax.org/books/biology-2e/pages/32-2-pollination-and-fertilization",
};
const review = "结构与图文编辑复核；待独立科学编审";
const part = (name, short, detail, x, y) => ({ name, short, detail, x, y });
const structure = (name, file, alt, scope, sources, parts) => ({
  name,
  file: `science/supplements/${file}.webp`,
  alt,
  scope,
  sources: sources.map((s) => [s.title, s.url]),
  parts,
  review,
});
const story = (id, mode, file, splitY, boundary, sources, steps) => ({
  id,
  mode,
  kind: "illustration",
  file: `science/supplements/${file}.webp`,
  splitY,
  boundary,
  sources,
  review: { status: review, date: "2026-10-22" },
  steps: steps.map(([title, text], i) => ({
    title,
    text,
    frame: i,
    alt: title + "的分步教学示意",
  })),
});
export const supplementalVisuals = {
  ...processReading,
  ...homeReading,
  ...transportReading,
  germination: {
    label: "种子内部",
    type: "structure",
    reason: "先认清内部部件，再追踪萌发时各部分的去向。",
    entry: structure(
      "菜豆种子内部",
      "germination-inside",
      "打开的典型菜豆种子：外侧种皮、两片肥厚子叶与内侧胚轴",
      "典型菜豆的剖开示意。子叶本身也是胚的一部分；剖开角度与胚轴大小用于观察，不作为物种鉴定或比例测量。",
      [biology],
      [
        part(
          "种皮",
          "保护内部的薄外层。",
          "沿红褐色外缘找到种皮。它是保护结构，不是长成幼叶的部分。",
          9,
          55,
        ),
        part(
          "子叶",
          "两片肥厚组织储存养分。",
          "左右两大片是子叶，为菜豆早期生长提供储存物质。不能把谷物的胚乳结构直接套在这里。",
          29,
          49,
        ),
        part(
          "胚芽",
          "位于胚轴上端的幼小芽。",
          "中间上部可以辨认幼小叶样结构，随后参与形成幼茎和叶；并非种子内藏了一株完整成树。",
          53,
          29,
        ),
        part(
          "胚根",
          "胚轴下端，萌发时先伸出。",
          "沿中间细长胚轴向下看尖端。萌发后它发育为根系的起始部分，不要与上方胚芽混淆。",
          51,
          66,
        ),
      ],
    ),
  },
  "flower-fruit": {
    label: "花到果实",
    type: "story",
    reason: "用连续剖面追踪子房壁和胚珠，分清硬核与种子。",
    entry: story(
      "flower-fruit-process",
      "从花到典型核果",
      "flower-fruit-process",
      494 / 1024,
      "泛化核果发育路线，不是特定物种的连续实拍。花粉管与受精发生在内部，本组没有显示细胞过程，请结合原理互动；不把花瓣萎蔫单独当作已成功受精的证据。",
      [biology],
      [
        [
          "先找子房和胚珠",
          "花中央下部的绿色腔室是子房，内部浅色小结构是胚珠。先记住这两个位置，再比较后面两幅果实剖面；花瓣位于外侧，不会直接整体变成果肉。",
        ],
        [
          "进入果实发育",
          "在通常的传粉受精等条件满足后，子房开始发育，其他花部可能萎缩。这里表现外观过渡，不能仅凭花瓣变蔫就判断受精是否成功。",
        ],
        [
          "幼果里的两条路线",
          "外围子房壁形成果皮，里面的胚珠形成种子。在这一典型核果路线中，内果皮逐渐形成硬核，把种子包在内部；硬核不是种子本身。",
        ],
        [
          "成熟后再对应",
          "最外层薄皮、周围果肉与硬核都属于果皮分化出的部分，硬核里的浅色结构才是种子。红色仅表现本例成熟外观，不代表所有果实都由绿变红。",
        ],
      ],
    ),
  },
  popcorn: {
    label: "爆开的过程",
    type: "story",
    reason: "补上果皮维持压力到破裂膨胀的中间环节。",
    entry: story(
      "popcorn-process",
      "受热、破裂与定形",
      "popcorn-process",
      457 / 1024,
      "前两幅的剖开窗口只为看内部，真实爆制前果皮需要足够完整。颗粒、孔隙与体积均为示意，不按图推算压力、温度或膨胀倍数。",
      [
        {
          title:
            "Purdue University · What’s under the shell of this popular snack?",
          url: "https://ag.purdue.edu/news/2020/02/whats-under-the-shell-of-this-popular-snack.html",
        },
      ],
      [
        [
          "完整外壳与储备",
          "外侧果皮包住富含淀粉、含有一定水分的内部。观察窗口不是真实破洞：水分分布在组织中，不是一只装满水的小气球。",
        ],
        [
          "受热但尚未破裂",
          "内部水分与淀粉状态随受热改变，压力上升，果皮暂时维持压力差。图中的小孔用于提示内部变化，不是逐颗测得的气泡。",
        ],
        [
          "破裂后迅速展开",
          "果皮失去约束后，内部水蒸气迅速膨胀，使软化的淀粉组织展开；棕色薄片是保留下来的果皮碎片，白色部分并不是一团纯空气。",
        ],
        [
          "多孔结构被留下",
          "膨胀后的淀粉组织冷却定形，许多孔隙使整体蓬松。并非所有玉米品种都同样适合爆制，水分与果皮状态也会影响结果。",
        ],
      ],
    ),
  },
  zipper: {
    label: "滑块内部",
    type: "structure",
    reason: "打开上盖后，看清两路链齿如何经过Y形通道汇合。",
    entry: structure(
      "拉链滑块内部通道",
      "zipper-channel",
      "去除上盖的拉链滑块：两条分叉入口经过中央隔开结构汇合为一条出口",
      "金属链齿拉链的通道概念剖面，省略上盖和拉片以便观察。齿的微小凹凸配合被简化，不作为制造尺寸或装配图；动态开合请看原理互动。",
      [
        {
          title: "YKK · Structure of a zipper",
          url: "https://www.ykk.com/english/ykk/tech/01.html",
        },
      ],
      [
        part(
          "分开的链齿",
          "分别从两侧进入通道。",
          "上方左右两列链齿各连在一侧布带上。先辨认两列，再沿着通道向中间追踪。",
          35,
          23,
        ),
        part(
          "中央分隔结构",
          "形成Y形分叉的内侧边界。",
          "中央楔形区域把两路分开；反向移动时，通道引导已经扣合的两列齿分离。",
          50,
          32,
        ),
        part(
          "汇合区域",
          "两路在这里逐渐靠拢。",
          "在中央结构下端附近，两列链齿受引导逐渐交错配合；滑块不是把链齿熔成一体。",
          50,
          52,
        ),
        part(
          "闭合链条",
          "齿的配合保持两侧连接。",
          "下方离开滑块的链齿保持扣合。真正抵抗两侧分离的是链齿结构，拉片只传递手的操作。",
          50,
          78,
        ),
      ],
    ),
  },
};
