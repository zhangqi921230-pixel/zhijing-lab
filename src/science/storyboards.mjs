// Curated per-topic observations. Photos retain their original provenance.
export const storyboards = {
  "sky-blue": {
    id: "sky-blue",
    mode: "现象对照",
    boundary:
      "天空颜色是定性示意，不是实测色值。 棱镜用于展示阳光的颜色组成，不能把棱镜色散等同于空气散射。",
    kind: "illustration",
    file: "science/stories/sky-blue.webp",
    thumbnail: "science/stories/sky-blue-thumb.webp",
    sources: [
      {
        title: "NASA Space Place · Why is the sky blue?",
        url: "https://spaceplace.nasa.gov/blue-sky/en/",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "侧方的蓝天",
        text: "眼睛接收到从其他方向散射来的阳光。",
        frame: 0,
        alt: "Clear blue daytime sky above a green meadow, sun outside frame.",
      },
      {
        title: "傍晚的暖色",
        text: "直射光经过较长空气路径后，各颜色比例改变。",
        frame: 1,
        alt: "Same meadow under a low orange sunset, sun outside frame.",
      },
      {
        title: "白光并非单色",
        text: "棱镜把不同波长的光分开。",
        frame: 2,
        alt: "A glass prism splitting a narrow white light beam into a small spectrum on a dark laboratory table.",
      },
      {
        title: "缺少大气",
        text: "没有明显空气散射时，白天背景也可以很黑。",
        frame: 3,
        alt: "Moon-like airless rocky horizon under a black sky, daylight on rocks, no stars visible.",
      },
    ],
  },
  sunset: {
    id: "sunset",
    mode: "时刻对照",
    boundary: "不同画面隔离太阳高度；真实天气还受云和颗粒影响。",
    kind: "illustration",
    file: "science/stories/sunset.webp",
    thumbnail: "science/stories/sunset-thumb.webp",
    sources: [
      {
        title: "NASA Space Place · 天空颜色",
        url: "https://spaceplace.nasa.gov/blue-sky/en/",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "正午",
        text: "太阳较高，阳光穿过空气的路径通常较短。",
        frame: 0,
        alt: "Same coastal landscape at midday, blue sky sun outside frame.",
      },
      {
        title: "太阳降低",
        text: "斜着穿过大气的路径变长。",
        frame: 1,
        alt: "Same coast late afternoon, lower warm light.",
      },
      {
        title: "日落附近",
        text: "短波光更多散出直射方向，剩余光偏暖。",
        frame: 2,
        alt: "Same coast at sunset, orange-red horizon, sun not in frame.",
      },
      {
        title: "云也参与",
        text: "云的高度、厚度和颗粒使每天晚霞不同。",
        frame: 3,
        alt: "Same coast sunset with patchy high clouds receiving pink light.",
      },
    ],
  },
  rainbow: {
    id: "rainbow",
    mode: "观察视角",
    boundary: "虹来自观察几何；图片不用于读取精确角度。",
    kind: "illustration",
    file: "science/stories/rainbow.webp",
    thumbnail: "science/stories/rainbow-thumb.webp",
    sources: [
      {
        title: "美国国家气象局 · How Do Rainbows Form?",
        url: "https://www.weather.gov/fgz/Rainbow",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "先看圆弧",
        text: "主虹通常外红内紫。",
        frame: 0,
        alt: "Natural primary rainbow over rainy meadow with red outside violet inside, sun behind viewer.",
      },
      {
        title: "先认识一滴水",
        text: "近球形水滴是主虹光路的载体。这里展示形状；进入、内部反射和离开的光路，请在原理互动中逐段追踪。",
        frame: 1,
        alt: "A single transparent water droplet on neutral dark background with no invented ray lines.",
      },
      {
        title: "观察者参与",
        text: "太阳在背后，前方水滴把部分光送入眼睛。",
        frame: 2,
        alt: "Rain curtain in sunshine over countryside, observer viewed from behind looking toward rain, sun behind observer.",
      },
      {
        title: "高处看圆",
        text: "地面常遮住圆的下部；合适条件下可以看见整圈。",
        frame: 3,
        alt: "Full circular primary rainbow seen from high above cloud droplets around antisolar point, no second rainbow.",
      },
    ],
    splitY: 0.4765625,
  },
  clouds: {
    id: "clouds",
    mode: "厚薄对照",
    boundary: "只比较可见明暗，不能仅凭颜色判断是否下雨。",
    kind: "illustration",
    file: "science/stories/clouds.webp",
    thumbnail: "science/stories/clouds-thumb.webp",
    sources: [
      {
        title: "美国国家气象局 · JetStream 气象教育",
        url: "https://www.weather.gov/jetstream/",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "薄云受光",
        text: "云滴把多种颜色的光散射出来，常显白色。",
        frame: 0,
        alt: "Thin white cumulus under blue sky seen in sunlight.",
      },
      {
        title: "向阳的云侧",
        text: "同一团云的受光面可以很亮。",
        frame: 1,
        alt: "Large thick cumulus side illuminated bright white.",
      },
      {
        title: "厚云底部",
        text: "更多光被散射到别处，底部接收到的光较少。",
        frame: 2,
        alt: "Same large cloud viewed from below with dark shaded base.",
      },
      {
        title: "边缘透光",
        text: "厚度与照明方向共同影响亮暗。",
        frame: 3,
        alt: "Cloud edge with a shaft of sunlight passing beside it.",
      },
    ],
  },
  raindrops: {
    id: "raindrops",
    mode: "形态对照",
    boundary: "不同雨滴被等大展示，尺寸及形变为教学示意。",
    kind: "illustration",
    file: "science/stories/raindrops.webp",
    thumbnail: "science/stories/raindrops-thumb.webp",
    sources: [
      {
        title: "美国国家气象局 · JetStream 气象教育",
        url: "https://www.weather.gov/jetstream/",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "小雨滴",
        text: "表面张力使它接近球形。",
        frame: 0,
        alt: "Single small nearly spherical airborne water droplet macro against sky.",
      },
      {
        title: "雨滴变大",
        text: "空气作用让下部变平。",
        frame: 1,
        alt: "Medium falling raindrop oblate sphere with slightly flattened bottom, no pointed tail.",
      },
      {
        title: "更大的雨滴",
        text: "常呈扁圆形，并不是上尖下圆。",
        frame: 2,
        alt: "Large airborne droplet flattened bottom rounded top, hamburger bun shape without pointed tail.",
      },
      {
        title: "不稳定时",
        text: "形变过大会使雨滴破碎；图中不表示固定阈值。",
        frame: 3,
        alt: "Oversized unstable droplet breaking into several smaller round droplets in air.",
      },
    ],
  },
  "fog-dew-frost": {
    id: "fog-dew-frost",
    mode: "实景辨识",
    boundary:
      "雾为悬浮小水滴，露为液态水，霜为冰晶；不是同一种状态。 霜通常由水汽凝华形成；液态露水结冰是冻露，不能仅凭白色外观混同。",
    kind: "illustration",
    file: "science/stories/fog-dew-frost.webp",
    thumbnail: "science/stories/fog-dew-frost-thumb.webp",
    sources: [
      {
        title: "美国国家气象局 · JetStream 气象教育",
        url: "https://www.weather.gov/jetstream/",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "雾",
        text: "许多小水滴悬在近地面空气里。",
        frame: 0,
        alt: "Low morning fog made of suspended droplets among tree trunks.",
      },
      {
        title: "露",
        text: "水汽在较冷物体表面凝结成液滴。",
        frame: 1,
        alt: "Macro round liquid dew beads on grass blade.",
      },
      {
        title: "霜",
        text: "水汽在足够冷的表面形成冰晶。",
        frame: 2,
        alt: "Macro white feathery frost ice crystals on dry grass.",
      },
      {
        title: "看位置和形态",
        text: "悬浮还是附着、液滴还是晶体，比只看白不白更可靠。",
        frame: 3,
        alt: "Side by side within this panel a dew covered smooth leaf and a frost covered leaf, no labels.",
      },
    ],
  },
  snowflakes: {
    id: "snowflakes",
    mode: "放大观察",
    boundary: "晶体外观为典型示意，不是每片雪花都完整对称。",
    kind: "illustration",
    file: "science/stories/snowflakes.webp",
    thumbnail: "science/stories/snowflakes-thumb.webp",
    sources: [
      {
        title: "美国国家气象局 · JetStream 气象教育",
        url: "https://www.weather.gov/jetstream/",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "六向生长",
        text: "许多雪晶体现六角结构。",
        frame: 0,
        alt: "Macro single six-arm dendritic snow crystal.",
      },
      {
        title: "不一定有长枝",
        text: "也能长成六角薄板。",
        frame: 1,
        alt: "Macro hexagonal plate ice crystal.",
      },
      {
        title: "不只有平面",
        text: "某些条件下形成柱状晶体。",
        frame: 2,
        alt: "Macro slender hexagonal ice column crystal.",
      },
      {
        title: "自然有例外",
        text: "碰撞、融化和聚合会改变完整形状。",
        frame: 3,
        alt: "Macro broken and aggregated snow crystals on dark wool.",
      },
    ],
    splitY: 0.4765625,
  },
  thunder: {
    id: "thunder",
    mode: "过程分镜",
    boundary: "定格画面不表示传播速度；具体延迟在原理互动中比较。",
    kind: "illustration",
    file: "science/stories/thunder.webp",
    thumbnail: "science/stories/thunder-thumb.webp",
    sources: [
      {
        title: "美国国家气象局 · JetStream 气象教育",
        url: "https://www.weather.gov/jetstream/",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "闪电发生",
        text: "发光与雷声都来自同一次放电过程。",
        frame: 0,
        alt: "Distant lightning bolt illuminating storm landscape, observer sheltered indoors.",
      },
      {
        title: "先收到光",
        text: "光传播很快，远处闪电很快被看见。",
        frame: 1,
        alt: "Same storm seen through window immediately lit by flash.",
      },
      {
        title: "再听到雷",
        text: "声音经过空气到达需要更长时间。",
        frame: 2,
        alt: "Person indoors listening by window after flash, outside dark storm.",
      },
      {
        title: "距离越远",
        text: "光声到达间隔通常越大；不能把图当作安全距离表。",
        frame: 3,
        alt: "Wider view from indoors showing a distant storm beyond empty plain, no measuring marks.",
      },
    ],
  },
  wind: {
    id: "wind",
    mode: "昼夜对照",
    boundary: "海陆风是局地简化情景，实际风还受大尺度天气影响。",
    kind: "illustration",
    file: "science/stories/wind.webp",
    thumbnail: "science/stories/wind-thumb.webp",
    sources: [
      {
        title: "美国国家气象局 · JetStream 气象教育",
        url: "https://www.weather.gov/jetstream/",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "白天地面受热",
        text: "陆地表面常比邻近海水升温快。",
        frame: 0,
        alt: "Sunny coastline with warm dry sand and cool blue sea, beach vegetation.",
      },
      {
        title: "近地面海风",
        text: "在合适条件下，空气从海面吹向陆地。",
        frame: 1,
        alt: "Same daytime coast sea breeze bending coastal grasses inland.",
      },
      {
        title: "夜间冷却",
        text: "陆地表面常更快降温。",
        frame: 2,
        alt: "Same coastline at night, land dark and sea calm.",
      },
      {
        title: "清晨的海岸",
        text: "画面呈现清晨海岸，不能仅凭草叶或海浪判断风向。夜间至清晨陆地可能比海面冷，形成陆风；实际风还受大尺度天气影响。",
        frame: 3,
        alt: "Same coast dawn land breeze bending light grasses toward sea, subtle not hurricane.",
      },
    ],
  },
  "mountain-cold": {
    id: "mountain-cold",
    mode: "沿高度观察",
    boundary: "对流层通常随高度降低温度；逆温和天气条件会造成例外。",
    kind: "illustration",
    file: "science/stories/mountain-cold.webp",
    thumbnail: "science/stories/mountain-cold-thumb.webp",
    sources: [
      {
        title: "美国国家气象局 · JetStream 气象教育",
        url: "https://www.weather.gov/jetstream/",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "从山脚到山顶",
        text: "常能观察到植被和积雪变化。",
        frame: 0,
        alt: "Mountain from warm green valley to snowy summit in one landscape.",
      },
      {
        title: "地面加热空气",
        text: "阳光先使地表吸收能量，地表再影响附近空气。",
        frame: 1,
        alt: "Close view of sunlit ground warming air just above it with subtle heat shimmer.",
      },
      {
        title: "上升会膨胀",
        text: "空气到较低气压处膨胀，温度可能下降。",
        frame: 2,
        alt: "Mountain slope with rising cumulus clouds at higher altitude.",
      },
      {
        title: "山谷里的雾",
        text: "山谷可能聚集冷空气，出现低处比高处更冷的逆温。雾景本身不能证明逆温，需要比较不同高度的温度。",
        frame: 3,
        alt: "Mountain valley covered by low fog under clear warmer-looking ridge, temperature inversion scene.",
      },
    ],
  },
  "sea-blue": {
    id: "sea-blue",
    mode: "光程对照",
    boundary: "颜色为定性示意；深度、光程、表面反射不可混为一项。",
    kind: "illustration",
    file: "science/stories/sea-blue.webp",
    thumbnail: "science/stories/sea-blue-thumb.webp",
    sources: [
      {
        title: "NOAA · Why is the ocean blue?",
        url: "https://oceanservice.noaa.gov/facts/oceanblue.html",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "一杯水",
        text: "光程短，微弱的颜色差异不容易察觉。",
        frame: 0,
        alt: "Small clear glass of pure water on white table, almost colorless.",
      },
      {
        title: "水中路程更长",
        text: "红光等波段衰减较多，水色更明显。",
        frame: 1,
        alt: "Long tank of very clear water viewed end-on with faint blue tint, no dye.",
      },
      {
        title: "开阔海面",
        text: "水体吸收与散射、表面反射共同影响所见。",
        frame: 2,
        alt: "Open deep blue ocean in sunlight with no green particles.",
      },
      {
        title: "近岸多变化",
        text: "颗粒、浮游生物和海底都可能改变颜色。",
        frame: 3,
        alt: "Coastal greenish turbid water beside pale sandy shallow bottom and a small sky reflection patch.",
      },
    ],
    splitY: 0.4736328125,
  },
  "salty-sea": {
    id: "salty-sea",
    mode: "路径图解",
    boundary: "不是所有盐都只来自河流；示意突出水与溶解盐的不同去向。",
    kind: "illustration",
    file: "science/stories/salty-sea.webp",
    thumbnail: "science/stories/salty-sea-thumb.webp",
    sources: [
      {
        title: "USGS · Saline Water and Salinity",
        url: "https://www.usgs.gov/water-science-school/science/saline-water-and-salinity",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "雨水接触岩石",
        text: "风化和溶解让一些离子进入水。",
        frame: 0,
        alt: "Rain falling on weathered mountain rock.",
      },
      {
        title: "河流输送",
        text: "河水也含溶解物，只是通常浓度较低。",
        frame: 1,
        alt: "River carrying clear water over rocks toward estuary.",
      },
      {
        title: "蒸发带走水",
        text: "大部分盐不会随水分子一起蒸发。",
        frame: 2,
        alt: "Wide ocean under sunlight with subtle evaporation haze, no salt crystals flying.",
      },
      {
        title: "蒸发后的残留",
        text: "少量海水蒸干可留下盐类，海洋还有盐的移出过程。",
        frame: 3,
        alt: "Salt crystals remaining in a shallow evaporated seawater dish, warm natural light.",
      },
    ],
  },
  tides: {
    id: "tides",
    mode: "水位对照",
    boundary: "同一海岸不同时刻的示意；潮时潮差由月日引力和当地条件共同决定。",
    kind: "illustration",
    file: "science/stories/tides.webp",
    thumbnail: "science/stories/tides-thumb.webp",
    sources: [
      {
        title: "NOAA · Tides and currents",
        url: "https://oceanservice.noaa.gov/facts/tidescurrents.html",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "低潮",
        text: "同一岸边露出较多地面。",
        frame: 0,
        alt: "Fixed view of tidal harbor at low tide with exposed mud and moored boat.",
      },
      {
        title: "涨潮",
        text: "水位随时间升高。",
        frame: 1,
        alt: "Same harbor rising mid tide water covering mud.",
      },
      {
        title: "高潮",
        text: "这次涨潮达到较高水位。",
        frame: 2,
        alt: "Same harbor high tide boat afloat water near quay.",
      },
      {
        title: "退潮",
        text: "水位重新降低；不能把四幅画当作等间隔潮汐预报。",
        frame: 3,
        alt: "Same harbor falling tide with wet shoreline reappearing.",
      },
    ],
  },
  waves: {
    id: "waves",
    mode: "跟踪同一物体",
    boundary:
      "近似深水波情景；存在漂移、破碎和海流，水并非绝对不前进。 画面视角有变化，不能据此量出浮标的净位移；用固定坐标的波动模型追踪。",
    kind: "illustration",
    file: "science/stories/waves.webp",
    thumbnail: "science/stories/waves-thumb.webp",
    sources: [
      {
        title: "NOAA Ocean Exploration · What causes ocean waves?",
        url: "https://oceanexplorer.noaa.gov/ocean-fact/waves/",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "波峰靠近",
        text: "跟踪同一个浮标，不只追着波峰看。",
        frame: 0,
        alt: "Side view small ocean wave with one orange buoy on rising face.",
      },
      {
        title: "浮标抬高",
        text: "水体随波运动。",
        frame: 1,
        alt: "Same orange buoy near wave crest.",
      },
      {
        title: "波峰过去",
        text: "浮标下降，波形继续向前。",
        frame: 2,
        alt: "Same orange buoy on falling face after crest passes.",
      },
      {
        title: "比较位置",
        text: "波传播的距离可以远大于水体单次摆动的距离。",
        frame: 3,
        alt: "Same orange buoy near trough, wave crest farther right, consistent sea background.",
      },
    ],
  },
  meanders: {
    id: "meanders",
    mode: "形态与变化",
    boundary: "弯道侵蚀和沉积为典型趋势，不能由单张图推断流速数值。",
    kind: "illustration",
    file: "science/stories/meanders.webp",
    thumbnail: "science/stories/meanders-thumb.webp",
    sources: [
      {
        title: "USGS · Water Science School",
        url: "https://www.usgs.gov/special-topics/water-science-school",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "先看河弯",
        text: "外岸与内岸的地形往往不同。",
        frame: 0,
        alt: "Aerial natural meandering river with sandy inner bank and steep outer bank.",
      },
      {
        title: "外岸侵蚀",
        text: "流水可带走岸边材料。",
        frame: 1,
        alt: "Close view eroded steep outer bank roots exposed.",
      },
      {
        title: "内岸沉积",
        text: "搬运条件变化时，一部分颗粒堆积成滩。",
        frame: 2,
        alt: "Close view sandy point bar on inner bend.",
      },
      {
        title: "长期变化",
        text: "河弯可迁移，有时形成裁弯和牛轭湖。",
        frame: 3,
        alt: "Aerial oxbow lake beside straighter active river, clear former meander shape.",
      },
    ],
  },
  pebbles: {
    id: "pebbles",
    mode: "沿程对照",
    boundary: "颗粒变化受岩性、能量与搬运时间影响，并非所有沙都来自同一条河。",
    kind: "illustration",
    file: "science/stories/pebbles.webp",
    thumbnail: "science/stories/pebbles-thumb.webp",
    sources: [
      {
        title: "USGS · Water Science School",
        url: "https://www.usgs.gov/special-topics/water-science-school",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "风化破碎",
        text: "大岩石可变成较小碎块。",
        frame: 0,
        alt: "Fresh angular rock fragments at mountain cliff base.",
      },
      {
        title: "搬运与碰撞",
        text: "流水携带颗粒，碰撞和磨蚀改变形状。",
        frame: 1,
        alt: "Streambed with subrounded stones in flowing water.",
      },
      {
        title: "圆滑卵石",
        text: "长期磨蚀可能使边角变圆。",
        frame: 2,
        alt: "River beach with smooth rounded pebbles.",
      },
      {
        title: "沙粒来源多",
        text: "沙可来自岩石、生物碎屑等，不能仅凭大小判断来历。",
        frame: 3,
        alt: "Macro coastal sand grains of varied minerals on beach.",
      },
    ],
  },
  caves: {
    id: "caves",
    mode: "过程图解",
    boundary: "溶蚀和沉积发生条件不同，生长时间显著压缩。",
    kind: "illustration",
    file: "science/stories/caves.webp",
    thumbnail: "science/stories/caves-thumb.webp",
    sources: [
      {
        title: "USGS · Water Science School",
        url: "https://www.usgs.gov/special-topics/water-science-school",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "水进入裂隙",
        text: "含二氧化碳的水可溶解部分石灰岩。",
        frame: 0,
        alt: "Limestone landscape with rain entering small cracks.",
      },
      {
        title: "通道扩大",
        text: "持续作用可能形成溶洞。",
        frame: 1,
        alt: "Realistic limestone cave corridor carved by water.",
      },
      {
        title: "滴水沉积",
        text: "条件变化时碳酸钙可沉积下来。",
        frame: 2,
        alt: "Macro water drop hanging from stalactite tip above cave floor.",
      },
      {
        title: "慢慢长大",
        text: "顶上为钟乳石，地面为石笋，相接可成石柱。",
        frame: 3,
        alt: "Stalactite above stalagmite with a separate joined column nearby, no dramatic instant growth.",
      },
    ],
  },
  earthquakes: {
    id: "earthquakes",
    mode: "过程分镜",
    boundary:
      "地层变形夸张，不能据图预测地震时刻或震级。 断层滑动概念模型，不代表某一特定断层类型或测量比例。",
    kind: "illustration",
    file: "science/stories/earthquakes.webp",
    thumbnail: "science/stories/earthquakes-thumb.webp",
    sources: [
      {
        title: "USGS · Earthquake Hazards Program",
        url: "https://www.usgs.gov/programs/earthquake-hazards",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "断层两侧",
        text: "岩体长期受力，可能积累形变。",
        frame: 0,
        alt: "Geological block with two rock masses along a vertical strike-slip fault, road across surface initially straight.",
      },
      {
        title: "暂时锁住",
        text: "接触面并不总是平滑连续滑动。",
        frame: 1,
        alt: "Same fault blocks with subtle elastic bending of a fence crossing fault, intact surface.",
      },
      {
        title: "突然滑动",
        text: "释放的一部分能量以地震波传播。",
        frame: 2,
        alt: "Same fault with clear horizontal offset of road, no vertical gap to earth core.",
      },
      {
        title: "留下错动",
        text: "地表位移和摇晃不是同一个概念，强弱也因地而异。",
        frame: 3,
        alt: "Close view of offset road and displaced fence after event, no people or injuries.",
      },
    ],
  },
  "autumn-leaves": {
    id: "autumn-leaves",
    mode: "季节对照",
    boundary:
      "以常见阔叶变化示意；不同物种和环境的色素变化不同。 颜色对照不是所有树叶必经的绿、黄、红顺序。",
    kind: "illustration",
    file: "science/stories/autumn-leaves.webp",
    thumbnail: "science/stories/autumn-leaves-thumb.webp",
    sources: [
      {
        title: "US Forest Service · Why Leaves Change Color",
        url: "https://www.fs.usda.gov/Internet/FSE_DOCUMENTS/stelprd3817419.pdf",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "生长期",
        text: "叶绿素让叶片常显绿色。",
        frame: 0,
        alt: "One healthy green maple-like leaf on neutral warm background.",
      },
      {
        title: "绿色减弱",
        text: "叶绿素减少，其他色素更显眼。",
        frame: 1,
        alt: "Same leaf partly yellow-green in autumn.",
      },
      {
        title: "黄色与红色",
        text: "类胡萝卜素和花青素参与，但各树种不同。",
        frame: 2,
        alt: "Same leaf bright yellow and red autumn pigments.",
      },
      {
        title: "落叶之后",
        text: "组织干枯褐变不是单纯换一种鲜艳色素。",
        frame: 3,
        alt: "Same leaf brown dry fallen on soil.",
      },
    ],
  },
  "lotus-leaf": {
    id: "lotus-leaf",
    mode: "尺度观察",
    boundary: "表面微结构为放大示意，不是电子显微镜照片。",
    kind: "illustration",
    file: "science/stories/lotus-leaf.webp",
    thumbnail: "science/stories/lotus-leaf-thumb.webp",
    sources: [
      {
        title: "University of Bonn · Lotus effect",
        url: "https://www.uni-bonn.de/en/news/cyanobacteria-use-the-lotus-effect",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "水珠成团",
        text: "荷叶表面不容易被水铺开。",
        frame: 0,
        alt: "Macro round water bead on real lotus leaf.",
      },
      {
        title: "倾斜时滚动",
        text: "滚动水珠可能带走部分污物。",
        frame: 1,
        alt: "Macro water bead rolling on tilted lotus leaf with tiny dust specks.",
      },
      {
        title: "放大表面",
        text: "微小突起和表面蜡质共同影响润湿。",
        frame: 2,
        alt: "Scientific realistic enlarged lotus leaf surface covered in tiny papillae and wax roughness, no water pool inside leaf.",
      },
      {
        title: "比较铺展",
        text: "换一种表面，水滴形状会改变。",
        frame: 3,
        alt: "Comparison ordinary wet smooth leaf with spread water film.",
      },
    ],
  },
  "seed-travel": {
    id: "seed-travel",
    mode: "传播方式",
    boundary: "不同种子与果实采用不同传播方式；图为典型结构示意。",
    kind: "illustration",
    file: "science/stories/seed-travel.webp",
    thumbnail: "science/stories/seed-travel-thumb.webp",
    sources: [
      {
        title: "Kew · Seed dispersal",
        url: "https://www.kew.org/read-and-watch/plant-seed-dispersal-animal-poo",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "借风远行",
        text: "冠毛增加空气作用，让某些种子较慢落下。",
        frame: 0,
        alt: "Dandelion seed with feathery pappus airborne macro.",
      },
      {
        title: "带翅旋落",
        text: "翅果的形状影响下降方式。",
        frame: 1,
        alt: "Winged maple samara descending above ground.",
      },
      {
        title: "搭动物便车",
        text: "钩刺可以附着在毛或衣物上。",
        frame: 2,
        alt: "Burdock hooked fruit attached to animal fur close-up.",
      },
      {
        title: "借水漂流",
        text: "某些果实的外层有助漂浮；并非所有种子都适合泡水。",
        frame: 3,
        alt: "Coconut floating in tropical water with intact fibrous husk.",
      },
    ],
  },
  germination: {
    id: "germination",
    mode: "生长分镜",
    boundary: "以菜豆为例，时间压缩；幼苗阶段先依靠种子储存物质。",
    kind: "illustration",
    file: "science/stories/germination.webp",
    thumbnail: "science/stories/germination-thumb.webp",
    sources: [
      {
        title: "OpenStax · Pollination and Fertilization",
        url: "https://openstax.org/books/biology-2e/pages/32-2-pollination-and-fertilization",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "先吸水，再启动生长",
        text: "种皮吸水后膨胀，胚的活动逐渐恢复。图中展示的是可见外形，不能直接看到内部代谢。切换“种子内部”，找到子叶中的储备和即将伸出的胚根；仅有水还不够，也需要适宜温度和氧气。",
        frame: 0,
        alt: "Dry kidney bean seed on moist soil, macro.",
      },
      {
        title: "胚根先突破种皮",
        text: "先伸出来的白色尖端是胚根，它逐渐形成幼根。观察方向与颜色，再和下一图比较位置：不是先长出叶片。幼苗初期主要利用种子内的储备，根逐渐承担吸收水和无机盐的任务。",
        frame: 1,
        alt: "Same bean seed swollen split seed coat tiny radicle emerging downward.",
      },
      {
        title: "幼苗向上展开",
        text: "以常见菜豆型萌发为例，下胚轴伸长并弯曲拱出土面，把子叶带到地上。根仍在下方生长。不同植物方式并不相同，例如豌豆的子叶通常留在地下，不能把本图套用到所有种子。",
        frame: 2,
        alt: "Same bean root longer and curved hypocotyl pushing cotyledons upward out of soil.",
      },
      {
        title: "真叶接过制造养分的任务",
        text: "真叶逐渐展开，幼苗的光合作用增强；子叶中的储备被利用后常逐渐萎缩。时间轴压缩了真实生长时间，不是固定天数的测量。比较叶片出现前后，想一想幼苗的物质和能量从哪里来。",
        frame: 3,
        alt: "Same young bean seedling with two cotyledons and first pair green leaves, roots visible in clear soil-side teaching view.",
      },
    ],
    splitY: 0.3662109375,
  },
  honeycomb: {
    id: "honeycomb",
    mode: "形状对照",
    boundary:
      "示意比较规则铺排；蜂巢建造并不是蜜蜂在做显式数学计算。 图中不同形状未按相等面积绘制，不能直接比较用料；等面积周长比较见原理互动。",
    kind: "illustration",
    file: "science/stories/honeycomb.webp",
    thumbnail: "science/stories/honeycomb-thumb.webp",
    sources: [
      {
        title: "Scientific Reports · Construction behavior and hexagonal cells",
        url: "https://www.nature.com/articles/srep28341",
      },
      {
        title: "Communications Biology · Comb architecture",
        url: "https://www.nature.com/articles/s42003-022-03328-6",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "常见巢房",
        text: "这是常见巢房的形态示意，很多巢房紧密相邻，共用部分壁面。",
        frame: 0,
        alt: "Real honeybee wax comb close-up regular hexagonal cells, open cells visible.",
      },
      {
        title: "圆形难铺满",
        text: "规则圆形并排会留下空隙。",
        frame: 1,
        alt: "Loose identical circular wax cups on ivory plane with visible spaces between.",
      },
      {
        title: "方形也能铺满",
        text: "没有空隙不是六边形独有的性质。",
        frame: 2,
        alt: "Tightly tiled square wax cells equal depth on same plane.",
      },
      {
        title: "还要比较用料",
        text: "在特定等面积规则铺排条件下，六边形具有较短总边长的优势。",
        frame: 3,
        alt: "Tightly tiled hexagonal wax cells equal depth on same plane, a bee at edge.",
      },
    ],
  },
  "bat-echo": {
    id: "bat-echo",
    mode: "往返过程",
    boundary: "声波不可见，图只展示对象位置；回声时间在原理互动中演示。",
    kind: "illustration",
    file: "science/stories/bat-echo.webp",
    thumbnail: "science/stories/bat-echo-thumb.webp",
    sources: [
      {
        title: "NPS · Echolocation",
        url: "https://www.nps.gov/subjects/bats/echolocation.htm",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "主动发声",
        text: "许多蝙蝠发出用于回声定位的声音。",
        frame: 0,
        alt: "Naturalistic small insectivorous bat flying toward a moth at dusk, mouth open.",
      },
      {
        title: "声音到达目标",
        text: "目标可反射部分声能。",
        frame: 1,
        alt: "Same bat and moth farther apart in a dark forest clearing.",
      },
      {
        title: "接收回声",
        text: "返回时间等线索帮助判断距离与方向。",
        frame: 2,
        alt: "Same bat turning ears toward moth, separated at same distance.",
      },
      {
        title: "调整飞行",
        text: "回声定位与其他感觉共同参与，不是所有蝙蝠方式都一样。",
        frame: 3,
        alt: "Same bat turning toward flying moth through open gap between branches.",
      },
    ],
  },
  "bird-flight": {
    id: "bird-flight",
    mode: "动作分解",
    boundary: "典型扑翼的定格示意；鸟种、速度及飞行阶段都会改变动作。",
    kind: "illustration",
    file: "science/stories/bird-flight.webp",
    thumbnail: "science/stories/bird-flight-thumb.webp",
    sources: [
      {
        title: "Cornell Bird Academy · All About Feathers",
        url: "https://academy.allaboutbirds.org/features/all-about-feathers/what-feathers-do.php",
      },
      {
        title: "Minnesota DNR · How Do Birds Fly?",
        url: "https://files.dnr.state.mn.us/mcvmagazine/young_naturalists/young-naturalists-article/bird_flight/bird_flight",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "抬翼准备",
        text: "翅膀在一个拍动周期内改变位置和形状。",
        frame: 0,
        alt: "Side view pigeon flying wings raised before downstroke.",
      },
      {
        title: "下拍",
        text: "翼推动空气，空气也对鸟产生力。",
        frame: 1,
        alt: "Same pigeon wings sweeping down with broad feather surface.",
      },
      {
        title: "上收",
        text: "回程并非简单逆放，羽毛和关节会调整。",
        frame: 2,
        alt: "Same pigeon wings recovering upward with changed feather orientation.",
      },
      {
        title: "滑翔",
        text: "即使不扑翼，只要有合适相对气流，机翼形状仍可产生气动力。",
        frame: 3,
        alt: "Same pigeon gliding with wings extended, no arrows.",
      },
    ],
  },
  "fish-gills": {
    id: "fish-gills",
    mode: "流动与交换",
    boundary: "硬骨鱼鳃为概念放大；水流与血流的路径由原理图明确标示。",
    kind: "illustration",
    file: "science/stories/fish-gills.webp",
    thumbnail: "science/stories/fish-gills-thumb.webp",
    sources: [
      {
        title: "OpenStax · Gas Exchange across Respiratory Surfaces",
        url: "https://openstax.org/books/biology-2e/pages/39-1-systems-of-gas-exchange",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "水从口进入",
        text: "鱼把水送过鳃部。",
        frame: 0,
        alt: "Side view freshwater bony fish mouth open underwater.",
      },
      {
        title: "鳃盖下的鳃",
        text: "鳃弓支持许多鳃丝。",
        frame: 1,
        alt: "Same fish operculum gently opened to reveal red gill arches, tasteful scientific cutaway.",
      },
      {
        title: "展开接触面积",
        text: "鳃丝上还有更细的结构。",
        frame: 2,
        alt: "Isolated fish gill arch with many parallel red filaments, naturalistic.",
      },
      {
        title: "气体交换",
        text: "溶解在水中的氧跨过薄界面进入血液，不是把水吸进肺。",
        frame: 3,
        alt: "Close enlarged delicate gill lamellae on filament with water around, no invented holes or bubbles entering blood.",
      },
    ],
  },
  whales: {
    id: "whales",
    mode: "同功能对照",
    boundary: "外形相似不能代替分类依据；这里比较典型鱼类与鲸类。",
    kind: "illustration",
    file: "science/stories/whales.webp",
    thumbnail: "science/stories/whales-thumb.webp",
    sources: [
      {
        title: "NOAA · Are dolphins fish?",
        url: "https://oceanservice.noaa.gov/facts/dolphin.html",
      },
      {
        title: "NOAA · Marine mammals",
        url: "https://www.noaa.gov/education/resource-collections/marine-life/marine-mammals",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "鲸豚用肺",
        text: "需要到水面换气。",
        frame: 0,
        alt: "Dolphin surfacing with blowhole above water, exhaled mist small.",
      },
      {
        title: "鱼主要用鳃",
        text: "从水中获得溶解氧。",
        frame: 1,
        alt: "Fish swimming underwater with visible gill cover.",
      },
      {
        title: "亲代与幼仔",
        text: "图中是成年鲸和幼仔共同游动，并未展示哺乳。鲸用肺呼吸并以乳汁哺育幼仔，这些特征需要结合结构与生活史判断。",
        frame: 2,
        alt: "Whale mother swimming close beside a smaller calf.",
      },
      {
        title: "尾部也是线索",
        text: "鲸豚尾鳍通常水平，许多鱼尾鳍垂直；应综合判断。",
        frame: 3,
        alt: "Fish vertical tail fin beside dolphin horizontal flukes, two accurate silhouettes shown as realistic animals.",
      },
    ],
  },
  ants: {
    id: "ants",
    mode: "路线观察",
    boundary: "以依赖化学路线的蚂蚁为例；路线信息不可见，图中不画成实体道路。",
    kind: "illustration",
    file: "science/stories/ants.webp",
    thumbnail: "science/stories/ants-thumb.webp",
    sources: [
      {
        title: "Max Planck Society · Orientation of ants",
        url: "https://www.mpg.de/5187096/orientation_ants",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "找到食物",
        text: "个体探索可提供新的路线线索。",
        frame: 0,
        alt: "Several naturalistic ants moving along irregular trail toward small food crumb.",
      },
      {
        title: "信息被利用",
        text: "某些蚂蚁通过化学物质影响同伴行动。",
        frame: 1,
        alt: "Same ants meeting near crumb and returning.",
      },
      {
        title: "道路改变",
        text: "遇到障碍时会出现探索和绕行。",
        frame: 2,
        alt: "Same ground with small twig blocking old route, ants exploring around it.",
      },
      {
        title: "新的路线",
        text: "化学线索会变化和消散，蚂蚁也可利用其他导航线索。",
        frame: 3,
        alt: "Ants forming a new curved route around twig toward same food.",
      },
    ],
  },
  gecko: {
    id: "gecko",
    mode: "尺度放大",
    boundary: "刚毛与更细末端为增强示意，并非实拍电镜图。",
    kind: "illustration",
    file: "science/stories/gecko-audit.webp",
    thumbnail: "science/stories/gecko-audit-thumb.webp",
    sources: [
      {
        title: "UC Berkeley · Gecko Project",
        url: "https://people.eecs.berkeley.edu/~ronf/Gecko/gecko.html",
      },
      {
        title: "UC Berkeley · Gecko adhesion",
        url: "https://newsarchive.berkeley.edu/news/media/releases/2002/09/rfull/future.html",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "先看脚趾",
        text: "壁虎足底有特殊结构。",
        frame: 0,
        alt: "Realistic gecko climbing smooth glass seen from side.",
      },
      {
        title: "层层细分",
        text: "趾下片扩大可接触的区域。",
        frame: 1,
        alt: "Macro underside gecko toe showing transverse lamellae.",
      },
      {
        title: "细小刚毛",
        text: "许多毛状结构可以贴近表面。",
        frame: 2,
        alt: "Scientific magnification many dense flexible fine hairs growing from toe lamella.",
      },
      {
        title: "末端接触",
        text: "大量细小接触作用累积帮助附着，并非靠吸盘或胶水。",
        frame: 3,
        alt: "Further magnification branching hairs with flattened tiny spatula tips contacting smooth surface, no suction cups.",
      },
    ],
  },
  flavour: {
    id: "flavour",
    mode: "感官对照",
    boundary:
      "正常感官过程示意，不用于诊断嗅觉或味觉异常。 白雾是微小液滴，不是肉眼可见的气味分子。",
    kind: "illustration",
    file: "science/stories/flavour.webp",
    thumbnail: "science/stories/flavour-thumb.webp",
    sources: [
      {
        title: "NIDCD · Taste and Smell",
        url: "https://www.nidcd.nih.gov/health/taste-smell",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "先闻气味",
        text: "挥发性物质可从鼻孔进入鼻腔。",
        frame: 0,
        alt: "Bowl of warm soup releasing faint steam on kitchen table.",
      },
      {
        title: "吃的时候也闻到",
        text: "口中释放的气味也能经后方通路到达鼻腔。",
        frame: 1,
        alt: "Person smelling soup with nose above spoon, natural side profile.",
      },
      {
        title: "两类信息合作",
        text: "味觉与嗅觉共同组成风味体验。",
        frame: 2,
        alt: "Scientific sagittal head silhouette showing oral and nasal cavities connected behind palate, no labels.",
      },
      {
        title: "鼻腔受阻",
        text: "香气线索减少，但甜咸等基本味觉不会因此全部消失。",
        frame: 3,
        alt: "Same person gently pinching nose while tasting a small safe spoonful, seated.",
      },
    ],
  },
  sweat: {
    id: "sweat",
    mode: "条件对照",
    boundary:
      "画面展示表面状态；不能用汗珠多少直接判断散热量。 静态皮肤画面不能显示湿度和散热速率；湿度影响需在变量对照中观察。",
    kind: "illustration",
    file: "science/stories/sweat.webp",
    thumbnail: "science/stories/sweat-thumb.webp",
    sources: [
      {
        title: "OpenStax · Anatomy and Physiology",
        url: "https://openstax.org/books/anatomy-and-physiology-2e/pages/24-6-energy-and-heat-balance",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "汗液来到表面",
        text: "液态汗水留在皮肤上。",
        frame: 0,
        alt: "Macro sweat bead on human forearm in warm light.",
      },
      {
        title: "蒸发带走能量",
        text: "水变成水汽的过程需要吸收热量。",
        frame: 1,
        alt: "Same forearm with fewer beads in dry breezy environment.",
      },
      {
        title: "潮湿空气",
        text: "蒸发较难，出很多汗也不一定散热充分。",
        frame: 2,
        alt: "Same forearm with persistent sweat beads in humid still environment.",
      },
      {
        title: "空气流动",
        text: "通风可改变蒸发条件，但效果还取决于环境温湿度。",
        frame: 3,
        alt: "Wet fabric on arm drying under gentle moving air, no temperature symbols.",
      },
    ],
    splitY: 0.484375,
  },
  hiccups: {
    id: "hiccups",
    mode: "动作示意",
    boundary: "膈肌与声门动作只作正常生理机制说明，不提供治疗建议。",
    kind: "illustration",
    file: "science/stories/hiccups.webp",
    thumbnail: "science/stories/hiccups-thumb.webp",
    sources: [
      {
        title: "MedlinePlus · Hiccups",
        url: "https://medlineplus.gov/hiccups.html",
      },
      {
        title: "NLM MeSH · Hiccup",
        url: "https://meshb.nlm.nih.gov/record/ui?name=Hiccup",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "平静呼吸",
        text: "膈肌参与改变胸腔容积。",
        frame: 0,
        alt: "Simplified accurate torso side cutaway lungs above dome-shaped diaphragm at rest.",
      },
      {
        title: "突然收缩",
        text: "打嗝涉及膈肌等呼吸肌的不自主动作。",
        frame: 1,
        alt: "Same torso diaphragm suddenly lowered and flattened slightly, lungs expanded.",
      },
      {
        title: "声门快速关闭",
        text: "动作伴随特征性的短促声音。",
        frame: 2,
        alt: "Close educational view of larynx with vocal folds nearly closed, non-graphic.",
      },
      {
        title: "回到原状态",
        text: "图中是动作分解，持续时间和诱因因人而异。",
        frame: 3,
        alt: "Same torso returned relaxed domed diaphragm, clean neutral background.",
      },
    ],
  },
  healing: {
    id: "healing",
    mode: "修复阶段",
    boundary: "表浅小伤口的概念过程；阶段可重叠，图中不提供疗程或诊断。",
    kind: "illustration",
    file: "science/stories/healing.webp",
    thumbnail: "science/stories/healing-thumb.webp",
    sources: [
      {
        title: "OpenStax · Anatomy and Physiology",
        url: "https://openstax.org/books/anatomy-and-physiology-2e/pages/4-6-tissue-injury-and-aging",
      },
      {
        title: "OpenStax · Wound Healing",
        url: "https://openstax.org/books/fundamentals-nursing/pages/24-4-wound-healing",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "先止血",
        text: "凝血过程帮助封住受损小血管。",
        frame: 0,
        alt: "Small shallow clean scratch on skin surface, minimal red mark no gore.",
      },
      {
        title: "暂时保护",
        text: "表面覆盖物不能等同于下面已修复。",
        frame: 1,
        alt: "Same scratch with tiny dry clot over surface, macro skin.",
      },
      {
        title: "组织修复",
        text: "细胞迁移、生长和重建逐渐填补缺口。",
        frame: 2,
        alt: "Scientific shallow skin cross section showing new tissue filling small gap and epithelial edge growing inward, non-graphic.",
      },
      {
        title: "继续重塑",
        text: "表面闭合后，内部组织仍可能继续调整。",
        frame: 3,
        alt: "Same skin healed with faint narrow line, normal texture.",
      },
    ],
  },
  bread: {
    id: "bread",
    mode: "发酵与定型",
    boundary: "以酵母面团为例；不同配方和膨松方法不能混为一谈。",
    kind: "illustration",
    file: "science/stories/bread.webp",
    thumbnail: "science/stories/bread-thumb.webp",
    sources: [
      {
        title: "Exploratorium · Bread Science",
        url: "https://annex.exploratorium.edu/cooking/bread/",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "起始面团",
        text: "揉好的面团里已经混入一些空气。酵母利用可发酵糖产生二氧化碳，气体进入并扩大这些小气泡；面粉和水形成的网络帮助留住气体。观察下一幅体积的变化，不要把面团变大理解成酵母本身长成了面包。",
        frame: 0,
        alt: "Small unrisen bread dough ball in clear bowl.",
      },
      {
        title: "发酵产气",
        text: "发酵后面团膨大，是许多气泡共同撑开内部结构的结果。温度、时间和面团配方都会影响膨胀；这两幅是过程示意，没有提供同一配方的计时测量，不能据图推算发酵速度。",
        frame: 1,
        alt: "Same dough increased in volume in same bowl.",
      },
      {
        title: "成品切面中的气室",
        text: "这一幅已经是烘烤后成品的切面。孔洞是气室留下的痕迹，周围的固体结构把它们保留下来。它帮助我们理解蓬松从哪里来，但不是生面团内部的显微照片，也不能从孔洞大小直接判断酵母数量。",
        frame: 2,
        alt: "Cut view risen dough with many small gas pockets, realistic.",
      },
      {
        title: "加热定型",
        text: "加热时气体膨胀，水也产生蒸气；随后淀粉和蛋白质发生变化，使结构定形。面包表面失水、褐变形成外皮，馒头的蒸制条件则不同。比较成品与第一幅，分别找出体积、气室和表面发生的变化。",
        frame: 3,
        alt: "Baked bread cut open with porous crumb on kitchen board.",
      },
    ],
  },
  egg: {
    id: "egg",
    mode: "受热对照",
    boundary: "温度与时间为定性比较；不把凝固简化成蛋白质凭空增多。",
    kind: "illustration",
    file: "science/stories/egg.webp",
    thumbnail: "science/stories/egg-thumb.webp",
    sources: [
      {
        title: "Exploratorium · Science of Eggs",
        url: "https://annex.exploratorium.edu/cooking/eggs/kitchenlab.html",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "生蛋白",
        text: "生蛋清可以流动，其中有水和多种蛋白质。图中能看到的是整体状态；蛋白质分子的形状需要用另外的微观示意解释，不能把透明蛋清理解成没有蛋白质。",
        frame: 0,
        alt: "Raw cracked egg in white dish with transparent albumen.",
      },
      {
        title: "开始受热",
        text: "受热区域逐渐变白、变稠。加热使蛋白质原来的结构发生变化，并相互连接，形成能够限制水流动的网络；光的散射也随结构改变。留意凝固区域的位置，而不要把白色当作温度计。",
        frame: 1,
        alt: "Same egg gently heating, outer albumen turning opaque white.",
      },
      {
        title: "逐渐凝固",
        text: "蛋清已经明显定形，但蛋黄的状态可能不同。凝固并不是水全部蒸发了，熟鸡蛋仍含大量水。不同部位、加热方式和持续时间会影响结果，这组图不能用来判断食品是否达到安全食用条件。",
        frame: 2,
        alt: "Same egg fully cooked with opaque firm white and set yolk.",
      },
      {
        title: "比较另一种熟制样本",
        text: "最后展示的是另一个煮熟后切开的样本，方便看蛋清与蛋黄的位置，并非上一幅煎蛋自动变成带壳鸡蛋。比较生熟样本能说明宏观状态改变，不能据此读出精确凝固温度或加热时间。",
        frame: 3,
        alt: "Clean half of hard-boiled egg showing white and yolk cut surface.",
      },
    ],
  },
  apple: {
    id: "apple",
    mode: "处理对照",
    boundary:
      "同类切面在相同条件下作示意比较；实际褐变速度取决于品种与条件。 这是处理情境示意，并非同批苹果、同时间条件下的实验照片。",
    kind: "illustration",
    file: "science/stories/apple.webp",
    thumbnail: "science/stories/apple-thumb.webp",
    sources: [
      {
        title: "ACS · Slowing Apple Browning",
        url: "https://www.acs.org/content/dam/acsorg/education/outreach/celebrating-chemistry/2021-ncw/2021-ncw-celebrating-chemistry-english.pdf",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "新鲜切开",
        text: "切开会破坏细胞结构，使原本分隔的酶和相关物质有机会接触，空气中的氧也能参与反应。先观察新切面的颜色，再看暴露后的变化；不是氧气直接给苹果涂上一层棕色。",
        frame: 0,
        alt: "Freshly cut pale apple half on clean board.",
      },
      {
        title: "接触氧气",
        text: "酶参与的一系列反应逐渐形成褐色物质。品种、成熟程度、温度和暴露时间都会影响速度。示意图只展示常见外观，不能凭颜色反推出放置了多久，也不能据颜色单独判断能否食用。",
        frame: 1,
        alt: "Matching apple half left exposed visibly browned.",
      },
      {
        title: "改变酸度",
        text: "这里改为另一个用柠檬处理的样本，用来比较减缓褐变的办法，不是把上一幅褐色苹果瞬间复原。酸性环境及柠檬中的还原性成分可能影响相关反应，效果还取决于用量和接触条件。",
        frame: 2,
        alt: "Matching fresh apple slice with a small lemon wedge and clear drops on surface, still pale.",
      },
      {
        title: "改变氧接触",
        text: "这是浸水处理的另一组样本。水可以减少切面与空气直接接触，但水中仍有溶解氧，不能保证完全停止褐变。若自己比较，应使用同一苹果的相近切片，并保持观察时间等条件一致；这组插图不等于受控实验结果。",
        frame: 3,
        alt: "Matching apple slices in clear water in small bowl, light pale surfaces.",
      },
    ],
  },
  "milk-foam": {
    id: "milk-foam",
    mode: "形成与稳定",
    boundary: "以牛奶泡沫示意；配方、温度和脂肪也影响结果。",
    kind: "illustration",
    file: "science/stories/milk-foam.webp",
    thumbnail: "science/stories/milk-foam-thumb.webp",
    sources: [
      {
        title:
          "Kamath 等 · The composition of interfacial material from skim milk foams",
        url: "https://pubmed.ncbi.nlm.nih.gov/21605740/",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "原来是液体",
        text: "牛奶里有水、蛋白质、脂肪等成分。仅静置并不会形成大量稳定泡沫，还需要把气体带入液体。先记住液面，再比较搅打后增加的体积，增加的空间主要来自气泡。",
        frame: 0,
        alt: "Milk in transparent jug with smooth flat surface.",
      },
      {
        title: "引入空气",
        text: "搅打把空气分散成许多气泡。部分蛋白质能够吸附在气液界面，帮助形成保护气泡的薄层；并非每个气泡都不会破。打发结果还与成分、温度和操作方式有关。",
        frame: 1,
        alt: "Same milk being aerated with small handheld frother, no giant splash.",
      },
      {
        title: "界面被稳定",
        text: "细小气泡使泡沫看起来均匀细腻。这里的放大图展示气泡排列，肉眼并不能看到单个蛋白质分子。观察泡壁和泡间液体，理解泡沫是气体分散在液体中的结构，而不是牛奶变成了固体。",
        frame: 2,
        alt: "Macro fine milk foam many tightly packed bubbles.",
      },
      {
        title: "放置会变化",
        text: "放置后，液体会排出泡壁，气体也可能在泡间转移，气泡可能合并或破裂。较大的气泡提示结构发生变化，却不能仅凭这张示意图区分每一种机制或估算经过的分钟数。比较前后气泡大小，比只看泡沫高度更有帮助。",
        frame: 3,
        alt: "Same foam after standing with larger bubbles and some drainage at bottom.",
      },
    ],
  },
  detergent: {
    id: "detergent",
    mode: "宏观与微观",
    boundary: "微观小球和尾链是概念模型，不是真实分子外形或数量比例。",
    kind: "illustration",
    file: "science/stories/detergent.webp",
    thumbnail: "science/stories/detergent-thumb.webp",
    sources: [
      {
        title: "ACI · The Chemistry of Cleaning",
        url: "https://www.cleaninginstitute.org/understanding-products/science-soap/chemistry-cleaning",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "油水分层",
        text: "油和水通常不容易均匀混合，会形成分层。单纯冲水可能带走一部分松散污物，却难以清除附着的油膜。图中的上下分层只是典型情形，不能代表所有油品和密度条件。",
        frame: 0,
        alt: "Clear glass bowl with separate floating golden oil layer above water.",
      },
      {
        title: "油分散为小滴",
        text: "这一幅展示油被分散成小滴的状态。洗洁精中的表面活性剂配合搅动，能帮助油滴形成并较稳定地留在水中；画面不是记录倒入洗洁精的瞬间，也不是油变成了水。",
        frame: 1,
        alt: "Same bowl after adding a small drop detergent, small oil droplets dispersing.",
      },
      {
        title: "分子两端不同",
        text: "放大示意中，亲水部分朝向周围的水，亲油部分靠近油。许多分子共同作用于油水界面。球和短线是人为放大的分子符号，不是真实颜色、尺寸或固定数量；图示油滴也不应一概等同于单个胶束。",
        frame: 2,
        alt: "Scientific stylized realistic isolated oil droplet surrounded by surfactant molecules: hydrophilic small blue spheres outside, thin gold tails pointing inward toward oil.",
      },
      {
        title: "水流带走",
        text: "擦洗使油污从表面脱离，含有分散油滴的水再被冲走。清洁需要界面作用与机械运动共同参与，泡沫多并不直接等于去油能力强。回看前三幅，追踪的是油去了哪里，而不是油是否凭空消失。",
        frame: 3,
        alt: "Oil stained ceramic plate being rinsed clean with water and dispersed tiny droplets.",
      },
    ],
  },
  "floating-ice": {
    id: "floating-ice",
    mode: "沉浮对照",
    boundary:
      "情景示意：冰大部分浸在水中。画面不是测量记录，不据图计算浸没百分比或精确水位；微观结构与浮力请结合原理互动。",
    kind: "illustration",
    file: "science/stories/floating-ice-audit.webp",
    thumbnail: "science/stories/floating-ice-audit-thumb.webp",
    sources: [
      {
        title: "OpenStax · Density and Pressure",
        url: "https://openstax.org/books/university-physics-volume-1/pages/14-1-fluids-density-and-pressure",
      },
      {
        title: "USGS · Water Density",
        url: "https://www.usgs.gov/water-science-school/science/water-density",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "冰在水面",
        text: "冰块大部分浸在水中。",
        frame: 0,
        alt: "Clear ice cube floating in glass of water, most of cube below waterline.",
      },
      {
        title: "排水支持",
        text: "浮力与冰块重量达到平衡。",
        frame: 1,
        alt: "Close side view floating ice cube crossing water surface.",
      },
      {
        title: "冰融化",
        text: "尺寸逐渐减小，漂浮状态随之变化。",
        frame: 2,
        alt: "Same glass after ice partially melted with smaller floating cube.",
      },
      {
        title: "完全融化以后",
        text: "在不加水、不洒出且忽略蒸发和温度引起的体积变化时，漂浮的纯水冰融化后，水位基本不变。",
        frame: 3,
        alt: "Same glass after ice completely melted, consistent water level approximately unchanged.",
      },
    ],
    splitY: 0.486328125,
  },
  soda: {
    id: "soda",
    mode: "开盖前后",
    boundary: "气泡数量只是示意；压力、温度和成核位置都会影响现象。",
    kind: "illustration",
    file: "science/stories/soda.webp",
    thumbnail: "science/stories/soda-thumb.webp",
    sources: [
      {
        title: "ACS · The Secret Science of Soda Pop",
        url: "https://www.acs.org/education/whatischemistry/adventures-in-chemistry/secret-science-stuff/soda-pop.html",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "密封状态",
        text: "密封瓶内较高的二氧化碳压力有利于更多气体溶在饮料里。液面上方仍有气体，瓶中也可能存在少量气泡；没有大量冒泡不代表没有二氧化碳。",
        frame: 0,
        alt: "Unbranded sealed transparent sparkling water bottle with clear liquid, few small bubbles.",
      },
      {
        title: "打开瓶盖",
        text: "开盖后液面上方压力降低，原先溶解的二氧化碳逐渐逸出。它常在瓶壁微小缺陷或颗粒等位置形成气泡，并不是外面的空气进入后变成二氧化碳。",
        frame: 1,
        alt: "Same bottle cap loosened with fine bubbles beginning to rise.",
      },
      {
        title: "气泡长大",
        text: "气泡形成后可以长大、上浮并在液面破裂。摇晃、温度和成核位置会影响冒泡的样子；这几幅不是同一瓶汽水的定量录像，不能用画出的气泡数计算释放速度。",
        frame: 2,
        alt: "Same opened bottle many bubbles rising from interior wall spots.",
      },
      {
        title: "逐渐减少",
        text: "随着更多二氧化碳逸出，可继续形成气泡的条件发生变化，冒泡通常减弱。饮料里仍可能含有溶解气体，气泡少并不等于一滴也没有。把开盖前后联系起来，关键变化是压力与气体溶解状态。",
        frame: 3,
        alt: "Same bottle after standing with fewer bubbles, cap beside bottle.",
      },
    ],
  },
  straw: {
    id: "straw",
    mode: "压力过程",
    boundary: "不画成吸力把水向上拉；液体运动由内外压力差解释。",
    kind: "illustration",
    file: "science/stories/straw-audit.webp",
    thumbnail: "science/stories/straw-audit-thumb.webp",
    sources: [
      {
        title: "OpenStax · Fluids, Density, and Pressure",
        url: "https://openstax.org/books/university-physics-volume-1/pages/14-1-fluids-density-and-pressure",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "先认识吸管",
        text: "吸管两端相通。把下端放入水中后，未吸气时管内外液面高度相近。",
        frame: 0,
        alt: "Clear drinking glass filled with water, transparent straw above water.",
      },
      {
        title: "下端浸入水",
        text: "吸管下端要浸入水里，上端与口腔连通；吸气时管内气体可以被移走一部分。",
        frame: 1,
        alt: "Same glass with straw dipped, equal liquid levels inside and outside.",
      },
      {
        title: "压力差推动",
        text: "管内压力降低后，外界压力把水推向较低压力处。",
        frame: 2,
        alt: "Person using transparent straw, visible continuous water column rising in straw, ordinary safe scene.",
      },
      {
        title: "漏气会改变",
        text: "吸管上部漏气时，难以维持同样压力差。",
        frame: 3,
        alt: "Side view straw with pinhole above waterline and little water rising, small air bubbles near hole.",
      },
    ],
  },
  scissors: {
    id: "scissors",
    mode: "动作与力臂",
    boundary: "普通剪刀仅有两片刀体与枢轴，不添加隐藏齿轮。",
    kind: "illustration",
    file: "science/stories/scissors.webp",
    thumbnail: "science/stories/scissors-thumb.webp",
    sources: [
      {
        title: "Fiskars · 剪刀杠杆与结构说明",
        url: "https://cuix-prod.fiskars.com/en-gb/scissors-shears/products/heavy-duty-scissors",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "找到枢轴",
        text: "两片刀体绕连接处相对转动。",
        frame: 0,
        alt: "Ordinary simple steel scissors open on paper, pivot clearly visible.",
      },
      {
        title: "靠近枢轴剪",
        text: "在相同手部用力条件下，较短输出力臂有利于较大剪切力。",
        frame: 1,
        alt: "Same scissors cutting paper close to pivot with blade contact visible.",
      },
      {
        title: "移到尖端",
        text: "输出力臂变长，剪同样材料可能更费力。",
        frame: 2,
        alt: "Same scissors cutting paper near blade tips.",
      },
      {
        title: "刃口配合",
        text: "两刃相对运动切开材料，杠杆只是解释的一部分。",
        frame: 3,
        alt: "Same scissors closed beside a neatly cut strip of paper.",
      },
    ],
  },
  bicycle: {
    id: "bicycle",
    mode: "齿轮对照",
    boundary: "固定前链轮比较后飞轮；齿数与运动由互动模型定量说明。",
    kind: "illustration",
    file: "science/stories/bicycle.webp",
    thumbnail: "science/stories/bicycle-thumb.webp",
    sources: [
      {
        title: "Exploratorium · Pedaling and Cadence",
        url: "https://annex.exploratorium.edu/cycling/gears3.html",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "后齿轮较大",
        text: "先找链条实际搭在哪片后齿轮上，而不是只看整组飞轮的大小。固定前盘并保持传动接合时，较大的后齿轮会使脚踏一圈对应的后轮转数减少。图片只用于辨认相对位置，生成图上的齿形、链线与齿数不能用于装配或定量测量。",
        frame: 0,
        alt: "Close view bicycle rear cassette with chain on large rear sprocket.",
      },
      {
        title: "后齿轮较小",
        text: "较小的后齿轮用较少齿就能转一圈，因此同样前盘转角可带来更多后轮转动。比较条件要相同：前盘齿数不变、后轮与飞轮接合。原理互动明确采用40齿前盘与16或32齿后齿轮，数值来自模型，不来自这幅图片。",
        frame: 1,
        alt: "Same rear cassette chain on small rear sprocket.",
      },
      {
        title: "上坡选择",
        text: "上坡时常需要较大的驱动力，较低的传动比让骑行者以更多脚踏圈数换取合适的力矩与踏频。这幅是上坡情境示意，无法从姿势直接判断实际用力、挡位或速度，也不能说换挡就消除了爬升所需的能量。",
        frame: 2,
        alt: "Side view cyclist climbing gentle hill on bicycle.",
      },
      {
        title: "不是白得能量",
        text: "平路与上坡是不同骑行情境，不能把两幅图当作同一功率的计时比赛。理想传动中力矩与角速度相互交换，不会同时无代价得到更省力和每圈更远。进入互动推进到100，比较两种齿比各自的一圈脚踏结果，再恢复初始状态。",
        frame: 3,
        alt: "Same bicycle travelling on flat road, detailed chain visible.",
      },
    ],
  },
  ship: {
    id: "ship",
    mode: "排水对照",
    boundary: "比较相近材料在不同整体形状下的排水；水面位置为示意。",
    kind: "illustration",
    file: "science/stories/ship.webp",
    thumbnail: "science/stories/ship-thumb.webp",
    sources: [
      {
        title: "OpenStax · Archimedes’ Principle",
        url: "https://openstax.org/books/university-physics-volume-1/pages/14-4-archimedes-principle-and-buoyancy",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "实心钢块",
        text: "实心钢块也受水的浮力，但完全浸没时排开的水的重量通常小于它自身重量，所以会下沉。画面里它已接触容器底，底面支撑也参与受力，不能把此时的静止理解成单靠浮力平衡。图中没有称量数据。",
        frame: 0,
        alt: "Solid compact steel block submerged at bottom of clear tank.",
      },
      {
        title: "空心船体",
        text: "换成空心形状后，内部空间使较少的金属可以围出较大的排水空间。船体未进水、稳定漂浮时，浮力平衡整体重量。两幅不是同一块钢的实测改形记录；不能据图假定材料质量完全相等或用像素计算密度。",
        frame: 1,
        alt: "Hollow bowl shaped steel hull floating in tank with open top above water.",
      },
      {
        title: "加入载荷",
        text: "增加载荷后，新的平衡通常需要更大的排水体积，所以水线相对船体升高，船体浸入更深。这里比较静态位置，不能据画面读取真实载重量。原理互动将载荷分格，并保持同一格载荷对应同一个平衡位置。",
        frame: 2,
        alt: "Same hull loaded with small uniform blocks, sitting lower but floating.",
      },
      {
        title: "有承载限度",
        text: "继续加重会使船舷更接近水面，进水与稳定性问题也会变得重要。图中显示干舷变小的情境，不是给出可安全承载的最大块数。浮得起来与不容易倾覆是不同问题，本页的竖直平衡模型没有计算波浪、倾斜或重心变化。",
        frame: 3,
        alt: "Same hull heavily loaded with rim at waterline, no people.",
      },
    ],
    splitY: 0.5,
  },
  bridges: {
    id: "bridges",
    mode: "结构对照",
    boundary: "桥型示意不作为工程计算；受力方向在原理互动中显示。",
    kind: "illustration",
    file: "science/stories/bridges.webp",
    thumbnail: "science/stories/bridges-thumb.webp",
    sources: [
      {
        title: "WGBH/PBS · Bridge Basics",
        url: "https://www.pbs.org/wgbh/buildingbig/bridge/basics.html",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "梁桥",
        text: "桥面与梁把载荷传到支座。",
        frame: 0,
        alt: "Simple beam bridge crossing stream with straight deck and supports.",
      },
      {
        title: "拱桥",
        text: "拱形结构把力传向两端，需要合适支撑。",
        frame: 1,
        alt: "Stone arch bridge with clear curved arch crossing same stream.",
      },
      {
        title: "悬索桥",
        text: "桥面荷载经吊索和主缆传到塔与锚固系统。",
        frame: 2,
        alt: "Suspension bridge with main cables towers and vertical hangers over wider river.",
      },
      {
        title: "共同点",
        text: "每一类都要把力传到地基，形状好看不等于结构安全。",
        frame: 3,
        alt: "Close detail of bridge expansion bearing beneath deck at pier.",
      },
    ],
  },
  expansion: {
    id: "expansion",
    mode: "温差对照",
    boundary:
      "变形量夸张；连续焊接轨道有约束与温度应力，不能解释成所有轨道都留大缝。",
    kind: "illustration",
    file: "science/stories/expansion.webp",
    thumbnail: "science/stories/expansion-thumb.webp",
    sources: [
      {
        title: "OpenStax · Thermal Expansion",
        url: "https://openstax.org/books/university-physics-volume-2/pages/1-3-thermal-expansion",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "接缝可移动",
        text: "部分桥梁用伸缩装置适应变形。",
        frame: 0,
        alt: "Close interlocking finger expansion joint on bridge deck with moderate gaps.",
      },
      {
        title: "温度升高",
        text: "材料通常膨胀，接缝状态随约束变化。",
        frame: 1,
        alt: "Same finger joint on warmer day narrower gaps, same geometry.",
      },
      {
        title: "温度降低",
        text: "材料通常收缩。",
        frame: 2,
        alt: "Same joint on cooler day wider gaps, same geometry.",
      },
      {
        title: "轨道另有设计",
        text: "连续焊接轨道通过约束等措施处理温度影响，不都依靠大缝。",
        frame: 3,
        alt: "Continuous welded railway track on sleepers with fastenings visible, no artificial large gaps.",
      },
    ],
  },
  satellite: {
    id: "satellite",
    mode: "运动对照",
    boundary: "轨道不按比例；真实轨道判断需要位置、速度与引力条件。",
    kind: "illustration",
    file: "science/stories/satellite.webp",
    thumbnail: "science/stories/satellite-thumb.webp",
    sources: [
      {
        title: "NASA Space Place · What Is an Orbit?",
        url: "https://spaceplace.nasa.gov/orbits/en/",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "卫星仍受引力",
        text: "绕地球运动不是因为那里没有重力。",
        frame: 0,
        alt: "Earth curvature with small satellite at low orbital altitude, sunlit blue planet.",
      },
      {
        title: "向前同时下落",
        text: "切向运动与引力共同使轨迹弯曲。",
        frame: 1,
        alt: "Same satellite above Earth farther along curved horizon, no rocket exhaust.",
      },
      {
        title: "与抛落比较",
        text: "普通物体也会在引力作用下改变运动。",
        frame: 2,
        alt: "Scientific scene small ball falling near Earth's surface, local horizon.",
      },
      {
        title: "保持合适轨道",
        text: "要有相应速度与高度；不是只飞得够高就能绕行。",
        frame: 3,
        alt: "Satellite above Earth with solar panels deployed, Earth occupies most frame.",
      },
    ],
  },
  weightlessness: {
    id: "weightlessness",
    mode: "共同下落",
    boundary:
      "空间站内微重力是轨道自由落体状态，仍存在地球引力。 透明下落舱是思想实验示意，并非真实高空试验照片。",
    kind: "illustration",
    file: "science/stories/weightlessness.webp",
    thumbnail: "science/stories/weightlessness-thumb.webp",
    sources: [
      {
        title: "NASA · What is Microgravity?",
        url: "https://www.nasa.gov/centers-and-facilities/glenn/what-is-microgravity/",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "地面有支撑",
        text: "地板对身体的支撑使人感到重量。",
        frame: 0,
        alt: "Astronaut standing on floor inside ground training mockup, feet on floor.",
      },
      {
        title: "一起自由下落",
        text: "人与周围物体可相对悬浮。",
        frame: 1,
        alt: "Simple transparent falling cabin with person and loose small ball both floating relative to cabin, educational illustration no distress.",
      },
      {
        title: "轨道舱内",
        text: "空间站与人共同绕地球自由落体。",
        frame: 2,
        alt: "Astronaut floating inside realistic space station beside floating water sphere.",
      },
      {
        title: "外面仍有地球",
        text: "失重不是离开了引力范围。",
        frame: 3,
        alt: "Space station orbiting above Earth's limb, no gravity labels.",
      },
    ],
    splitY: 0.4765625,
  },
  "moon-phases": {
    id: "moon-phases",
    mode: "受光对照",
    boundary: "从北半球常见观看方向示意；月相不是地球影子遮住月亮。",
    kind: "illustration",
    file: "science/stories/moon-phases.webp",
    thumbnail: "science/stories/moon-phases-thumb.webp",
    sources: [
      {
        title: "NASA Space Place · Moon Phases",
        url: "https://spaceplace.nasa.gov/moon-phases/en/",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "娥眉月",
        text: "从地球只能看到较少受光面。",
        frame: 0,
        alt: "Thin waxing crescent Moon with right edge illuminated against dark sky.",
      },
      {
        title: "上弦月",
        text: "可见圆面大约一半明亮。",
        frame: 1,
        alt: "First-quarter Moon right half illuminated.",
      },
      {
        title: "满月",
        text: "朝向我们的可见面大多受太阳照亮。",
        frame: 2,
        alt: "Full Moon detailed realistic craters.",
      },
      {
        title: "下弦月",
        text: "相对位置继续变化；亮面方向受观看方位影响。",
        frame: 3,
        alt: "Third-quarter Moon left half illuminated.",
      },
    ],
    splitY: 0.4638671875,
  },
  eclipses: {
    id: "eclipses",
    mode: "遮挡对照",
    boundary: "天体大小和间距不按比例；日月食几何必须与月相分开。",
    kind: "illustration",
    file: "science/stories/eclipses.webp",
    thumbnail: "science/stories/eclipses-thumb.webp",
    sources: [
      {
        title: "NASA · Eclipses",
        url: "https://science.nasa.gov/eclipses/",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "日全食所见",
        text: "月球遮住太阳明亮的光球时，周围日冕可能显现。几何关系是月球位于太阳与地球之间，月影落到地球局部。",
        frame: 0,
        alt: "Conceptual aligned Sun on left Moon in middle Earth right with narrow moon shadow toward Earth, no extra planets.",
      },
      {
        title: "日偏食所见",
        text: "太阳被月球遮挡一部分或全部，观察须使用专用安全方法。",
        frame: 1,
        alt: "Realistic partial solar eclipse disk obscured by Moon, seen through proper filtered astronomy image.",
      },
      {
        title: "月偏食所见",
        text: "月球部分进入地球本影时，可见明暗弧形边界；请切换原理互动查看日地月位置。",
        frame: 2,
        alt: "Conceptual aligned Sun left Earth middle Moon right inside Earth's shadow, no extra planets.",
      },
      {
        title: "月食所见",
        text: "全食时月面可能呈暗红色；普通月相不是月食。",
        frame: 3,
        alt: "Realistic dark reddish Moon during total lunar eclipse.",
      },
    ],
    splitY: 0.46875,
  },
  seasons: {
    id: "seasons",
    mode: "同地季节",
    boundary:
      "以北半球温带为例；四季的根本原因是地轴倾斜，不是距离太阳远近。 树木景象以北半球温带落叶树为例，不代表全球各地的四季。",
    kind: "illustration",
    file: "science/stories/seasons.webp",
    thumbnail: "science/stories/seasons-thumb.webp",
    sources: [
      {
        title: "NASA Space Place · What Causes the Seasons?",
        url: "https://spaceplace.nasa.gov/seasons/en/",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "春",
        text: "太阳高度和昼长逐渐改变。",
        frame: 0,
        alt: "Same temperate deciduous tree in spring with small green leaves.",
      },
      {
        title: "夏",
        text: "北半球朝向太阳较多时，日照条件有利于受热。",
        frame: 1,
        alt: "Same tree in summer full green foliage with high daylight.",
      },
      {
        title: "秋",
        text: "日照条件向相反方向变化。",
        frame: 2,
        alt: "Same tree in autumn orange foliage and lower sunlight.",
      },
      {
        title: "冬",
        text: "太阳高度较低、白昼较短；南北半球季节相反。",
        frame: 3,
        alt: "Same tree in winter bare branches with light snow.",
      },
    ],
  },
  meteors: {
    id: "meteors",
    mode: "身份与阶段",
    boundary: "对象尺寸不按比例；流星是发光现象，陨石是到达地面的物质。",
    kind: "illustration",
    file: "science/stories/meteors.webp",
    thumbnail: "science/stories/meteors-thumb.webp",
    sources: [
      {
        title: "NASA · Meteors and Meteorites",
        url: "https://science.nasa.gov/solar-system/meteors-meteorites/",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "在太空",
        text: "小行星等是绕太阳运行的天体。",
        frame: 0,
        alt: "Irregular rocky asteroid in space without flame.",
      },
      {
        title: "较小碎块",
        text: "可以称为流星体，名称与尺度和情境相关。",
        frame: 1,
        alt: "Small rocky meteoroid in space near Earth, no fire before atmosphere.",
      },
      {
        title: "进入大气",
        text: "高速进入时产生可见发光现象，称为流星。",
        frame: 2,
        alt: "Bright thin meteor streak in night atmosphere over landscape.",
      },
      {
        title: "落到地面",
        text: "未完全烧蚀的部分成为陨石。",
        frame: 3,
        alt: "Dark fusion-crusted meteorite resting on pale ground, no glowing flames.",
      },
    ],
  },
  "solar-system": {
    id: "solar-system",
    mode: "尺度对照图解",
    boundary:
      "直径与距离分别使用独立比例尺。距离图的圆点只是位置标记，不代表行星大小；同列对齐便于比较，不表示行星实际排成一列。数值为四舍五入的典型值。",
    kind: "diagram",
    file: "science/supplements/solar-diameters.svg",
    thumbnail: "science/supplements/solar-diameters.svg",
    sources: [
      {
        title: "NASA：行星大小与位置",
        url: "https://science.nasa.gov/solar-system/planet-sizes-and-locations-in-our-solar-system/",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "先比较直径",
        file: "science/supplements/solar-diameters.svg",
        alt: "八大行星直径按地球直径为一等比例绘制",
        text: "把地球直径定为 1，木星约为 11.21，水星约为 0.383。图中圆的直径使用同一尺度，才能直接比较大小。行星之间的空白只为排版，不代表它们的距离。",
        unit: "赤道直径比（地球 = 1；不含行星环）",
        values: [
          ["水星", "0.383"],
          ["金星", "0.949"],
          ["地球", "1"],
          ["火星", "0.532"],
          ["木星", "11.21"],
          ["土星", "9.45"],
          ["天王星", "4.01"],
          ["海王星", "3.88"],
        ],
      },
      {
        title: "再比较离太阳多远",
        file: "science/supplements/solar-distances.svg",
        alt: "八大行星平均日距在同一横向比例尺下的标记",
        text: "横向位置按平均日距排列，1 AU 约为地球到太阳的平均距离。水星、金星、地球和火星都挤在左边，海王星约在 30 AU。每行起点相同、长度尺度相同；圆点不是按真实直径绘制。",
        unit: "平均日距（AU）；每张图使用各自的距离比例尺",
        values: [
          ["水星", "0.387 AU"],
          ["金星", "0.723 AU"],
          ["地球", "1 AU"],
          ["火星", "1.524 AU"],
          ["木星", "5.203 AU"],
          ["土星", "9.58 AU"],
          ["天王星", "19.2 AU"],
          ["海王星", "30.05 AU"],
        ],
      },
      {
        title: "放大看内侧四颗行星",
        file: "science/supplements/solar-inner.svg",
        alt: "单独放大的水星金星地球火星平均日距对照",
        text: "单独放大 0 至约 1.5 AU，才能看清内侧四颗行星的间隔。此图换了比例尺，不能把这里的一厘米直接与上一图的一厘米相比较。轨道并非同心正圆，平均日距也不等于任意时刻的实际距离。",
        unit: "平均日距（AU）；每张图使用各自的距离比例尺",
        values: [
          ["水星", "0.387 AU"],
          ["金星", "0.723 AU"],
          ["地球", "1 AU"],
          ["火星", "1.524 AU"],
        ],
      },
    ],
  },
  mirror: {
    id: "mirror",
    mode: "对应关系",
    boundary:
      "以平面镜为例；镜像对应的是垂直镜面的方向关系，不能简单说镜子只交换左右。",
    kind: "illustration",
    file: "science/stories/mirror.webp",
    thumbnail: "science/stories/mirror-thumb.webp",
    sources: [
      {
        title: "OpenStax · 平面镜成像",
        url: "https://openstax.org/books/college-physics-ap-courses-2e/pages/25-7-image-formation-by-mirrors",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "物与像",
        text: "像看起来在镜面后方。",
        frame: 0,
        alt: "A red cube in front of a clean plane mirror, its reflection correctly behind mirror.",
      },
      {
        title: "对应动作",
        text: "抬哪只手，镜像对应的部位就移动。",
        frame: 1,
        alt: "A person raising their right hand in front of mirror viewed from behind, reflection lifts corresponding left side in image.",
      },
      {
        title: "前后对应",
        text: "垂直镜面的方向发生反射对应。",
        frame: 2,
        alt: "Close view arrow-shaped wooden object pointing toward plane mirror and reflection pointing back, no drawn symbols.",
      },
      {
        title: "转身的直觉",
        text: "把镜像想成一个转身面对你的人，容易误说成左右交换。",
        frame: 3,
        alt: "Same person turned to stand beside mirror, ordinary symmetrical scene no duplicated limbs.",
      },
    ],
  },
  refraction: {
    id: "refraction",
    mode: "入水前后",
    boundary: "画面为典型视位置示意；不同视角下偏折外观不同。",
    kind: "illustration",
    file: "science/stories/refraction.webp",
    thumbnail: "science/stories/refraction-thumb.webp",
    sources: [
      {
        title: "OpenStax · Refraction",
        url: "https://openstax.org/books/physics/pages/16-2-refraction",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "未入水",
        text: "从侧面看，筷子保持直线外观。",
        frame: 0,
        alt: "Straight wooden chopstick above empty clear glass on table.",
      },
      {
        title: "入水后",
        text: "水下部分看起来出现偏移。",
        frame: 1,
        alt: "Same straight chopstick partly immersed obliquely in water, apparent kink at water surface seen from side.",
      },
      {
        title: "改变视角",
        text: "进入眼睛的光路改变，视位置也改变。",
        frame: 2,
        alt: "Same immersed chopstick viewed from higher angle with changed apparent displacement.",
      },
      {
        title: "拿出来检查",
        text: "筷子并未真的折断，光在界面发生折射。",
        frame: 3,
        alt: "Chopstick removed from water still physically straight on table beside glass.",
      },
    ],
  },
  "soap-bubble": {
    id: "soap-bubble",
    mode: "膜厚变化",
    boundary: "颜色受膜厚、光谱与观察角度影响；不能从图反推纳米厚度。",
    kind: "illustration",
    file: "science/stories/soap-bubble.webp",
    thumbnail: "science/stories/soap-bubble-thumb.webp",
    sources: [
      {
        title: "OpenStax · Interference in Thin Films",
        url: "https://openstax.org/books/university-physics-volume-3/pages/3-4-interference-in-thin-films",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "先看色带",
        text: "透明薄膜也会呈现彩色。",
        frame: 0,
        alt: "Single soap bubble with broad rainbow interference bands against dark background.",
      },
      {
        title: "膜会变薄",
        text: "液体流动和蒸发改变局部膜厚。",
        frame: 1,
        alt: "Same soap bubble with changed thinner colorful bands and darker top.",
      },
      {
        title: "近看薄膜颜色",
        text: "画面展示薄膜颜色，不直接显示两束反射光。薄膜前后界面的反射光相叠加；到原理互动中改变膜厚，观察相位与颜色的关系。",
        frame: 2,
        alt: "Macro curved soap film showing flowing thin interference bands.",
      },
      {
        title: "变薄与破裂",
        text: "膜厚不均且不断变化，颜色随之改变。出现孔洞后薄膜会迅速退缩破裂，图示是短暂瞬间，不能保持为开口球壳。",
        frame: 3,
        alt: "Soap bubble nearly transparent with dark thin patch near top before rupture.",
      },
    ],
    splitY: 0.4296875,
  },
  glasses: {
    id: "glasses",
    mode: "成像对照",
    boundary: "镜片示意不用于验光或选择度数；只展示基本光学作用。",
    kind: "illustration",
    file: "science/stories/glasses.webp",
    thumbnail: "science/stories/glasses-thumb.webp",
    sources: [
      {
        title: "OpenStax · Vision Correction",
        url: "https://openstax.org/books/college-physics-2e/pages/26-2-vision-correction",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "凹透镜",
        text: "可使光束更发散，常用于近视矫正。",
        frame: 0,
        alt: "Concave eyeglass lens on neutral optical table, thin center visible edge-on.",
      },
      {
        title: "凸透镜",
        text: "可使光束更会聚，适用于不同成像条件。",
        frame: 1,
        alt: "Convex eyeglass lens on same table thick center visible edge-on.",
      },
      {
        title: "看清需要匹配",
        text: "并不是镜片越厚或越贵就一定更清楚。",
        frame: 2,
        alt: "Everyday pair of eyeglasses in front of blurred printed-free distant landscape, clear view within lens but no text.",
      },
      {
        title: "镜片与眼睛共同成像",
        text: "焦点位置要与视网膜对应，具体度数需专业验光。",
        frame: 3,
        alt: "Scientific eye cross section with external eyeglass lens in front, no ray lines.",
      },
    ],
    splitY: 0.48828125,
  },
  sound: {
    id: "sound",
    mode: "振动与传播",
    boundary: "空气疏密和振幅由原理图示意；真实空气分子不可见。",
    kind: "illustration",
    file: "science/stories/sound.webp",
    thumbnail: "science/stories/sound-thumb.webp",
    sources: [
      {
        title: "OpenStax · Sound",
        url: "https://openstax.org/books/physics/pages/14-1-speed-of-sound-frequency-and-wavelength",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "声源振动",
        text: "音叉、鼓膜或扬声器可使周围空气振动。",
        frame: 0,
        alt: "Tuning fork beside a small drum membrane on science table.",
      },
      {
        title: "看扬声器振膜",
        text: "振膜受驱动会往复振动。单张画面不能判断它正在向外还是向内运动，切换原理互动，追踪振膜与相邻空气的运动。",
        frame: 1,
        alt: "Macro speaker cone displaced slightly outward.",
      },
      {
        title: "换个角度看振膜",
        text: "这幅改变了观察角度，不能和上一幅当成精确的位移对照。声波传播时空气主要在平衡位置附近往复运动，不会一路随波跑到耳朵。",
        frame: 2,
        alt: "Same speaker cone displaced slightly inward.",
      },
      {
        title: "远处收到变化",
        text: "传播的是扰动，空气不会整团从音箱一直跑进耳朵。",
        frame: 3,
        alt: "Person listening a short distance from speaker with still air, no visible colored sound rays.",
      },
    ],
  },
  "noise-cancelling": {
    id: "noise-cancelling",
    mode: "声音叠加",
    boundary: "只对特定位置和频段有效；不能保证消除所有声音。",
    kind: "illustration",
    file: "science/stories/noise-cancelling.webp",
    thumbnail: "science/stories/noise-cancelling-thumb.webp",
    sources: [
      {
        title: "OpenStax · Wave Interaction",
        url: "https://openstax.org/books/physics/pages/13-3-wave-interaction-superposition-and-interference",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "先感知噪声",
        text: "麦克风采集相关声音。",
        frame: 0,
        alt: "Over-ear headphones on table beside a softly blurred airplane cabin background.",
      },
      {
        title: "计算补偿",
        text: "控制系统产生适当的反相信号。",
        frame: 1,
        alt: "Close headphone outer shell with small microphone opening.",
      },
      {
        title: "在耳边叠加",
        text: "两种声压变化部分抵消。",
        frame: 2,
        alt: "Headphone earcup cutaway showing internal speaker and soft cushion, no circuit pseudo-details.",
      },
      {
        title: "效果有限",
        text: "低频持续噪声通常较适合，突发声与佩戴漏声会影响结果。",
        frame: 3,
        alt: "Person seated wearing headphones in airplane cabin, relaxed eyes open.",
      },
    ],
  },
  "qr-code": {
    id: "qr-code",
    mode: "信息结构",
    boundary:
      "生成图只作生活场景，不作为可扫描或纠错验证图；实际二维码由程序生成。 图鉴中的码为AI形态示意，不可用于扫码；真实编码和纠错试验请切换原理互动。",
    kind: "illustration",
    file: "science/stories/qr-code.webp",
    thumbnail: "science/stories/qr-code-thumb.webp",
    sources: [
      {
        title: "DENSO WAVE · Error correction",
        url: "https://www.qrcode.com/en/about/error_correction.html",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "找到码区",
        text: "定位图形帮助识别方向和范围。",
        frame: 0,
        alt: "Smartphone camera facing a plain square blank white code label on a card, no invented QR pattern.",
      },
      {
        title: "读取模块",
        text: "黑白小格按编码规则表达信息。",
        frame: 1,
        alt: "Macro square white label with three dark corner locator squares only, deliberately no data modules.",
      },
      {
        title: "部分损伤",
        text: "纠错可以恢复一定损坏，但有条件和上限。",
        frame: 2,
        alt: "Blank white label partly covered by a fingertip, no fake data code.",
      },
      {
        title: "实际试扫",
        text: "切换原理互动，使用程序生成的真实二维码观察遮挡结果。",
        frame: 3,
        alt: "Smartphone beside printed-free small ticket and a plain code card, no interface text.",
      },
    ],
  },
  wifi: {
    id: "wifi",
    mode: "信息路径",
    boundary: "无线信号不可见；图片为设备关系示意，不按信号范围或速度比例。",
    kind: "illustration",
    file: "science/stories/wifi.webp",
    thumbnail: "science/stories/wifi-thumb.webp",
    sources: [
      {
        title: "Cisco · What Is a Wi-Fi Network?",
        url: "https://www.cisco.com/site/us/en/learn/topics/networking/what-is-a-wi-fi-network.html",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "先有数据",
        text: "设备把信息编码成信号。",
        frame: 0,
        alt: "Laptop connected by cable to home router on desk.",
      },
      {
        title: "无线这一段",
        text: "路由器和手机通过无线电交换数据。",
        frame: 1,
        alt: "Wi-Fi router and smartphone across same living room without drawn waves.",
      },
      {
        title: "墙和距离",
        text: "阻挡与环境会影响信号质量。",
        frame: 2,
        alt: "Same smartphone behind thick interior wall from router.",
      },
      {
        title: "还要连外网",
        text: "Wi-Fi连接正常并不等于互联网连接一定正常。",
        frame: 3,
        alt: "Router beside optical network terminal with fiber cable and Ethernet cable, unbranded.",
      },
    ],
  },
  navigation: {
    id: "navigation",
    mode: "距离约束",
    boundary:
      "卫星尺寸与距离不按比例；接收机时钟误差也必须处理。 卫星与手机是概念拼图，距离和大小未按比例；手机接收卫星广播，不向卫星发送测距请求。",
    kind: "illustration",
    file: "science/stories/navigation.webp",
    thumbnail: "science/stories/navigation-thumb.webp",
    sources: [
      {
        title: "GPS.gov · Trilateration",
        url: "https://www.gps.gov/trilateration",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "收到卫星信号",
        text: "已知卫星状态和传播时间提供距离信息。",
        frame: 0,
        alt: "Navigation satellite above curved Earth transmitting no visible beams.",
      },
      {
        title: "多条约束相交",
        text: "单颗卫星的距离不足以确定三维位置。",
        frame: 1,
        alt: "Person holding smartphone outdoors under open sky, no map text.",
      },
      {
        title: "建筑会干扰",
        text: "遮挡和反射会影响定位。",
        frame: 2,
        alt: "Same person in narrow street between tall buildings.",
      },
      {
        title: "来源可以融合",
        text: "手机还可能使用基站、Wi-Fi和传感器辅助，不能把一切都叫卫星定位。",
        frame: 3,
        alt: "Smartphone beside several distinct satellites shown separately in conceptual scale montage, no invented constellation count.",
      },
    ],
  },
  rust: {
    id: "rust",
    mode: "环境对照",
    boundary: "腐蚀速度为示意，不能从颜色直接判断强度损失。",
    kind: "illustration",
    file: "science/stories/rust.webp",
    thumbnail: "science/stories/rust-thumb.webp",
    sources: [
      {
        title: "ACS · Coastal Chemistry：腐蚀与保护氧化层",
        url: "https://www.acs.org/education/activities/coastal-chemistry.html",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "观察起始外观",
        text: "先用外观较完整的铁质样本作为示意起点。仅凭光亮外观无法判断它是否有镀层；这里讨论的是铁在水和氧等条件参与下发生腐蚀的典型机制，不把图当作已鉴定的实验样品。",
        frame: 0,
        alt: "Clean iron nail on dry neutral surface.",
      },
      {
        title: "有水和空气",
        text: "潮湿环境有利于常见铁锈的形成，盐等物质还可能加快腐蚀过程。锈斑出现的位置和速度受环境与表面情况影响，这幅图没有规定湿度或时间，不能据此预测真实物件何时生锈。",
        frame: 1,
        alt: "Similar iron nail partly wet with early brown rust specks.",
      },
      {
        title: "继续变化",
        text: "较多锈层并不意味着形成了可靠保护壳。普通铁锈通常疏松，不能像某些致密保护膜那样持续阻挡腐蚀。颜色和厚度示意只帮助比较外观，不能直接换算成金属损失量或强度。",
        frame: 2,
        alt: "Same type iron nail with more rust in moist air.",
      },
      {
        title: "隔绝与保护",
        text: "最后是另一个带涂层的样本，用来观察保护层受损的位置。涂层通常通过减少铁与环境接触发挥作用，破损后局部仍可能腐蚀。这不是把前一幅生锈铁钉直接涂红就恢复如新的过程。",
        frame: 3,
        alt: "Paint-coated iron nail with intact coating beside small scratched area rusting.",
      },
    ],
  },
  "stainless-steel": {
    id: "stainless-steel",
    mode: "材料对照",
    boundary: "钝化膜被夸张呈现；不锈钢并非在所有条件下永不腐蚀。",
    kind: "illustration",
    file: "science/stories/stainless-steel.webp",
    thumbnail: "science/stories/stainless-steel-thumb.webp",
    sources: [
      {
        title: "worldstainless · Corrosion properties",
        url: "https://worldstainless.org/about-stainless/properties/corrosion-properties/",
      },
      {
        title: "worldstainless · Corrosion properties",
        url: "https://worldstainless.org/about-stainless/properties/corrosion-properties/",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "同样含铁",
        text: "合金成分不同，耐腐蚀性也不同。",
        frame: 0,
        alt: "Plain steel spoon with surface rust beside clean stainless steel spoon.",
      },
      {
        title: "表面保护膜",
        text: "铬有助形成致密钝化层。 蓝色薄层为放大示意，实际钝化膜极薄且肉眼不可见。",
        frame: 1,
        alt: "Scientific metallic surface cross section with extremely thin translucent protective layer, exaggerated for visibility.",
      },
      {
        title: "合适条件可再形成",
        text: "新鲜表面可能重新钝化。",
        frame: 2,
        alt: "Stainless steel surface lightly scratched, smooth metal underneath.",
      },
      {
        title: "仍有边界",
        text: "氯化物等环境可导致局部腐蚀，不能理解为绝不生锈。",
        frame: 3,
        alt: "Macro stainless steel with small localized pitting in harsh salt environment.",
      },
    ],
  },
  "tempered-glass": {
    id: "tempered-glass",
    mode: "破裂对照",
    boundary: "仅展示预制样品，不引导敲击玻璃；破裂形态受类型和破坏条件影响。",
    kind: "illustration",
    file: "science/stories/tempered-glass.webp",
    thumbnail: "science/stories/tempered-glass-thumb.webp",
    sources: [
      {
        title: "Pilkington · Shaping and Strengthening",
        url: "https://www.pilkington.com/-/media/pilkington/site-content/global-website/about/education/datasheet6shapingandstrengthening.pdf",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "完整时难看出",
        text: "玻璃内部可以存在应力分布。",
        frame: 0,
        alt: "Intact plain glass pane with safe finished edges on display table.",
      },
      {
        title: "钢化的作用",
        text: "表层与内部形成相互平衡的应力。 图中分层是应力区域示意，不是额外粘合了两层玻璃。",
        frame: 1,
        alt: "Scientific glass cross section with outer layers and inner region clearly distinguished by subtle shading, no cracks.",
      },
      {
        title: "普通玻璃破裂",
        text: "可能形成较长尖锐碎片。",
        frame: 2,
        alt: "Pre-broken ordinary annealed glass sample with long sharp shards behind clear display shield.",
      },
      {
        title: "钢化玻璃破裂",
        text: "常形成较小颗粒，但碎片仍可造成伤害。",
        frame: 3,
        alt: "Pre-broken tempered glass sample with many small granular fragments behind display shield.",
      },
    ],
  },
  eraser: {
    id: "eraser",
    mode: "前后与放大",
    boundary: "纸面和石墨颗粒为放大示意，擦除并非把字漂白。",
    kind: "illustration",
    file: "science/stories/eraser.webp",
    thumbnail: "science/stories/eraser-thumb.webp",
    sources: [
      {
        title: "Tombow · How to erase characters with Plastic Eraser",
        url: "https://www.tombow.com/en/mamechishiki/e68/",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "铅笔留下什么",
        text: "铅笔经过纸面时，会留下含石墨等成分的细小痕迹。痕迹附着在纸纤维表面和凹处，并不是纸本身被永久染成了另一种材料。先观察线条，再放大看它附着在哪里。",
        frame: 0,
        alt: "Graphite pencil drawing a simple dark line on white paper, no letters.",
      },
      {
        title: "看纸面",
        text: "放大图把纸纤维和深色颗粒突出显示，便于理解接触关系；它不是按比例的显微照片。纸面的凹凸使部分痕迹较难清除，也解释了用力过大时纸面可能受损。",
        frame: 1,
        alt: "Macro paper fibers with dark graphite particles resting on fibers.",
      },
      {
        title: "橡皮接触",
        text: "橡皮摩擦纸面时，帮助使石墨痕迹从纸上脱离，并把一部分带入脱落的橡皮屑。不同橡皮配方作用有所差别，不能把擦除理解成把黑色化学漂白成白色。",
        frame: 2,
        alt: "Soft rubber eraser rubbing same graphite line with crumbs forming.",
      },
      {
        title: "留下擦屑",
        text: "擦过的区域变浅，深色碎屑留在旁边，说明物质发生了转移。仍可能残留浅痕，纸纤维也可能被磨损。比较纸面与橡皮屑的变化，比只看最终是否完全变白更能说明擦除机制。",
        frame: 3,
        alt: "Same paper lighter erased area and darkened eraser crumbs beside it.",
      },
    ],
  },
  plastics: {
    id: "plastics",
    mode: "物件与性能",
    boundary:
      "外观不能可靠确定树脂种类；分类标识不等于当地一定回收。 物件外观不能确定塑料种类，需核对材料标识与产品资料。",
    kind: "illustration",
    file: "science/stories/plastics.webp",
    thumbnail: "science/stories/plastics-thumb.webp",
    sources: [
      {
        title: "ACS · The World of Polymers and Plastics",
        url: "https://www.acs.org/education/resources/undergraduate/chemistryincontext/interactives/world-of-polymers-and-plastics.html",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "透明瓶",
        text: "一种用途对应若干性能要求。",
        frame: 0,
        alt: "Clear lightweight plastic beverage bottle unbranded without recycling marks.",
      },
      {
        title: "柔软薄膜",
        text: "柔韧性与加工方式和材料结构有关。",
        frame: 1,
        alt: "Flexible translucent plastic bag beside soft food container.",
      },
      {
        title: "坚硬外壳",
        text: "塑料不是单一种物质，添加剂也会影响性质。",
        frame: 2,
        alt: "Rigid opaque plastic electrical housing and a tough plastic chair fragment sample.",
      },
      {
        title: "分类要看规则",
        text: "不能仅凭透明度或手感判断材料，更不能把编号当作回收承诺。",
        frame: 3,
        alt: "Sorted clean plastic household items in separate trays, no universal recycle logos.",
      },
    ],
  },
  "tap-water": {
    id: "tap-water",
    mode: "城市水路径",
    boundary:
      "流程为常见组合；不同水源与水厂采用的具体工艺不同。 厂区为情景示意，不能凭池形或航拍外观区分净水与污水工艺；具体流程见路径互动。",
    kind: "illustration",
    file: "science/stories/tap-water.webp",
    thumbnail: "science/stories/tap-water-thumb.webp",
    sources: [
      {
        title: "CDC · How Water Treatment Works",
        url: "https://www.cdc.gov/drinking-water/about/how-water-treatment-works.html",
      },
      {
        title: "EPA · Primer for Municipal Wastewater Treatment Systems",
        url: "https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=20017KBE.TXT",
      },
    ],
    review: {
      status: "资料核对与图像编辑自查；待独立科学编审",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "取水",
        text: "原水来自合适的水源。",
        frame: 0,
        alt: "Reservoir and intake tower with raw water source landscape.",
      },
      {
        title: "净化与消毒",
        text: "去除颗粒和处理微生物风险，具体流程随水源而异。",
        frame: 1,
        alt: "Water treatment plant settling basin and filter beds viewed from above.",
      },
      {
        title: "配水到家",
        text: "净水通过供水管网送达。",
        frame: 2,
        alt: "Clean kitchen faucet filling glass with clear water, pipes not shown as sewage connection.",
      },
      {
        title: "污水另走",
        text: "使用后的水经排水系统收集处理，不能把污水管与饮水管画成直通。",
        frame: 3,
        alt: "Wastewater treatment plant aeration basins and clarifiers beside separate river outfall, no direct pipe into drinking glass.",
      },
    ],
  },
  "spring-flowers": {
    id: "spring-flowers",
    mode: "实拍样本对照",
    kind: "photo",
    boundary:
      "这些照片展示具体样本，不能代表全部品种。先看多个可见特征，遮挡或模糊时允许判断线索不足。",
    sources: [
      {
        title: "NC State · 桃的物种与照片资料",
        url: "https://plants.ces.ncsu.edu/plants/prunus-persica/",
      },
      {
        title: "NC State · 染井吉野樱类群",
        url: "https://plants.ces.ncsu.edu/plants/prunus-x-yedoensis/",
      },
      {
        title: "NC State · 欧洲梨",
        url: "https://plants.ces.ncsu.edu/plants/pyrus-communis/",
      },
      {
        title: "北京市园林绿化局 · 春花辨识资料",
        url: "https://yllhj.beijing.gov.cn/ztxx/bjhx/hhzs/201803/t20180328_118606.shtml",
      },
    ],
    review: {
      status: "按原来源记录身份；待独立物种与科学复核",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "桃",
        text: "右侧侧面花可见很短的花梗，靠近枝条；本图可见花沿枝条开放；不能仅凭局部推断整株；本样本浅粉色、单瓣；花色不能独立鉴别",
        alt: "桃花实拍：花基部贴近枝条，花瓣和花药可见",
        file: "science/peach-flower.jpg",
        species: "Prunus persica",
        author: "rukhsarvora",
        source: "https://plants.ces.ncsu.edu/plants/prunus-persica/",
        license: "CC BY-NC 4.0（非商业使用）",
        licenseUrl: "https://creativecommons.org/licenses/by-nc/4.0/",
        focus: [80, 48],
      },
      {
        title: "染井吉野樱类群",
        text: "花朵下方有明显的细梗，部分连接处被花遮挡；多朵花成簇，不能把一簇当成一朵；花瓣顶端可见缺刻；清晰度不足的部位不强行判断",
        alt: "Prunus × yedoensis 的成簇白花、花梗和花瓣",
        file: "science/cherry-yoshino.jpg",
        species: "Prunus × yedoensis",
        author: "Mark Kent",
        source: "https://plants.ces.ncsu.edu/plants/prunus-x-yedoensis/",
        license: "CC BY-SA 2.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
        focus: [48, 64],
      },
      {
        title: "欧洲梨",
        text: "左侧可见花梗，完整枝条连接处仍不清楚；图中多花聚生，但不能完整确认整簇排列；白色花瓣与深色花药是组合判断的辅助线索",
        alt: "欧洲梨花实拍：白色花瓣、深色花药及部分花梗和叶片",
        file: "science/pear.jpg",
        species: "Pyrus communis",
        author: "Opioła Jerzy (Poland)",
        source: "https://plants.ces.ncsu.edu/plants/pyrus-communis/",
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
        focus: [22, 36],
      },
    ],
  },
  roses: {
    id: "roses",
    mode: "实拍样本对照",
    kind: "photo",
    boundary:
      "这些照片展示具体样本，不能代表全部品种。先看多个可见特征，遮挡或模糊时允许判断线索不足。",
    sources: [
      {
        title: "NC State Plant Toolbox · rosa-chinensis",
        url: "https://plants.ces.ncsu.edu/plants/rosa-chinensis/",
      },
      {
        title: "NC State Plant Toolbox · rosa-rugosa",
        url: "https://plants.ces.ncsu.edu/plants/rosa-rugosa/",
      },
      {
        title: "NC State Plant Toolbox · rosa-multiflora",
        url: "https://plants.ces.ncsu.edu/plants/rosa-multiflora/",
      },
    ],
    review: {
      status: "按原来源记录身份；待独立物种与科学复核",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "月季样本",
        text: "本图重瓣粉花不能独立鉴定；叶片连接和枝条也是线索。",
        alt: "粉色重瓣花、枝条及部分复叶；未呈现完整枝刺。",
        file: "science/rosa-chinensis.jpg",
        species: "Rosa chinensis",
        author: "houroumono",
        source: "https://plants.ces.ncsu.edu/plants/rosa-chinensis/",
        license: "CC BY 2.0",
        licenseUrl: "http://creativecommons.org/licenses/by/2.0/legalcode",
        focus: [65, 40],
      },
      {
        title: "玫瑰样本",
        text: "小叶表面明显起伏；花色和瓣数只是本样本特征。",
        alt: "单瓣玫瑰与表面皱褶明显的小叶。",
        file: "science/rosa-rugosa-flower.jpg",
        species: "Rosa rugosa",
        author: "Claudia Daggett",
        source: "https://plants.ces.ncsu.edu/plants/rosa-rugosa/",
        license: "CC BY-NC 2.0",
        licenseUrl: "http://creativecommons.org/licenses/by-nc/2.0/",
        focus: [68, 65],
      },
      {
        title: "野蔷薇样本",
        text: "沿叶柄找到托叶与枝刺；这张照片没有花，不能推断花序。",
        alt: "复叶、小叶锯齿、枝刺及托叶位置。",
        file: "science/rosa-multiflora.jpg",
        species: "Rosa multiflora",
        author: "Cyn Slaughter",
        source: "https://plants.ces.ncsu.edu/plants/rosa-multiflora/",
        license: "CC BY 4.0",
        licenseUrl: "http://creativecommons.org/licenses/by/4.0/legalcode",
        focus: [45, 38],
      },
    ],
  },
  "yellow-flowers": {
    id: "yellow-flowers",
    mode: "实拍样本对照",
    kind: "photo",
    boundary:
      "这些照片展示具体样本，不能代表全部品种。先看多个可见特征，遮挡或模糊时允许判断线索不足。",
    sources: [
      {
        title: "NC State Plant Toolbox · jasminum-nudiflorum",
        url: "https://plants.ces.ncsu.edu/plants/jasminum-nudiflorum/",
      },
      {
        title: "NC State Plant Toolbox · forsythia-suspensa",
        url: "https://plants.ces.ncsu.edu/plants/forsythia-suspensa/",
      },
    ],
    review: {
      status: "按原来源记录身份；待独立物种与科学复核",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "迎春",
        text: "上方正面花可数花冠裂片；不能把交叠的两朵花一起计数。",
        alt: "黄色迎春花与绿色枝条。",
        file: "science/jasminum-nudiflorum.jpg",
        species: "Jasminum nudiflorum",
        author: "Amanda Slater",
        source: "https://plants.ces.ncsu.edu/plants/jasminum-nudiflorum/",
        license: "CC-BY-SA 2.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
        focus: [52, 17],
      },
      {
        title: "连翘栽培样本",
        text: "右侧近处花可查看四裂花冠；远处小花清晰度不足时不强行计数。",
        alt: "连翘枝条上的黄色花朵。",
        file: "science/forsythia-suspensa-detail.jpg",
        species: "Forsythia suspensa ‘Sieboldii’",
        author: "Photo by Leonora Enking",
        source: "https://plants.ces.ncsu.edu/plants/forsythia-suspensa/",
        license: "CC-BY-SA 2.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
        focus: [83, 41],
      },
    ],
  },
  conifers: {
    id: "conifers",
    mode: "实拍样本对照",
    kind: "photo",
    boundary:
      "这些照片展示具体样本，不能代表全部品种。先看多个可见特征，遮挡或模糊时允许判断线索不足。",
    sources: [
      {
        title: "NC State Plant Toolbox · pinus-thunbergii",
        url: "https://plants.ces.ncsu.edu/plants/pinus-thunbergii/",
      },
      {
        title: "NC State Plant Toolbox · cunninghamia-lanceolata",
        url: "https://plants.ces.ncsu.edu/plants/cunninghamia-lanceolata/",
      },
      {
        title: "NC State Plant Toolbox · platycladus-orientalis",
        url: "https://plants.ces.ncsu.edu/plants/platycladus-orientalis/",
      },
    ],
    review: {
      status: "按原来源记录身份；待独立物种与科学复核",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "黑松",
        text: "先找针叶基部；交叠处未必能看清一束的针叶数。",
        alt: "枝条上成束排列的长针叶。",
        file: "science/pinus-thunbergii.jpg",
        species: "Pinus thunbergii",
        author: "Tortie tude",
        source: "https://plants.ces.ncsu.edu/plants/pinus-thunbergii/",
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/deed.en",
        focus: [30, 65],
      },
      {
        title: "杉木栽培样本",
        text: "叶片逐片连在枝上，不是松属典型的数针一束。",
        alt: "枝上单生的较宽尖叶，基部清晰。",
        file: "science/cunninghamia-lanceolata.jpg",
        species: "Cunninghamia lanceolata ‘Glauca’",
        author: "Randy Harter",
        source: "https://plants.ces.ncsu.edu/plants/cunninghamia-lanceolata/",
        license: "CC BY 4.0",
        licenseUrl: "http://creativecommons.org/licenses/by/4.0/legalcode",
        focus: [45, 45],
      },
      {
        title: "侧柏",
        text: "放大左侧枝条看鳞叶；这不是所有带“柏”字植物的唯一叶形。",
        alt: "小枝上紧贴的鳞片状叶。",
        file: "science/platycladus-orientalis.jpg",
        species: "Platycladus orientalis",
        author: "Shang Ning",
        source: "https://plants.ces.ncsu.edu/plants/platycladus-orientalis/",
        license: "CC BY 4.0",
        licenseUrl: "http://creativecommons.org/licenses/by/4.0/legalcode",
        focus: [43, 46],
      },
    ],
  },
  moths: {
    id: "moths",
    mode: "实拍样本对照",
    kind: "photo",
    boundary:
      "这些照片展示具体样本，不能代表全部品种。先看多个可见特征，遮挡或模糊时允许判断线索不足。",
    sources: [
      {
        title: "Smithsonian · Moths",
        url: "https://www.si.edu/spotlight/buginfo/moths",
      },
    ],
    review: {
      status: "按原来源记录身份；待独立物种与科学复核",
      date: "2026-10-22",
    },
    steps: [
      {
        title: "帝王蝶",
        text: "头部上方触角末端膨大；花纹不能独立代替触角观察。",
        alt: "花上帝王蝶的棒状触角和合拢的翅膀。",
        file: "science/monarch-detail.jpg",
        species: "Danaus plexippus",
        author: "NPS / Daniel Peterson",
        source:
          "https://npgallery.nps.gov/AssetDetail/61aecb20-b48b-47c5-b33f-eefde3516a2f",
        license: "Public domain: Full Granting Rights",
        licenseUrl:
          "https://npgallery.nps.gov/AssetDetail/61aecb20-b48b-47c5-b33f-eefde3516a2f",
        focus: [52, 26],
      },
      {
        title: "月形天蚕蛾",
        text: "头部前方的触角分支明显；本样本不能代表所有蛾的触角形状。",
        alt: "绿色蛾的羽状触角与展开的翅膀。",
        file: "science/luna-moth.jpg",
        species: "Actias luna",
        author: "U.S. National Park Service",
        source:
          "https://npgallery.nps.gov/AssetDetail/594fd5808c324c5dafb215aace4435d2",
        license: "Public domain",
        licenseUrl:
          "https://npgallery.nps.gov/AssetDetail/594fd5808c324c5dafb215aace4435d2",
        focus: [41, 17],
      },
    ],
  },
};
