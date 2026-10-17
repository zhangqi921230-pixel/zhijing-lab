// Each chapter specifies a learning question, relevant controls, and reproducible comparisons.
// Scenarios start from the lesson defaults so hidden variables cannot invalidate a comparison.
const scenario = (label, p, time) => ({
  label,
  p,
  ...(time === undefined ? {} : { time }),
});
const chapter = (title, text, task, keys, scenarios, view = "perspective") => ({
  title,
  text,
  task: typeof task === "string" ? task : task.action,
  explanation: typeof task === "string" ? undefined : task.explanation,
  keys,
  scenarios,
  view,
});
export const topicChapters = {
  conics: [
    chapter(
      "从圆到椭圆",
      "不经过顶点，截平面从水平逐渐倾斜，圆变为椭圆。",
      "切换圆和椭圆，再旋转模型观察斜截面。",
      ["tilt", "offset"],
      [
        scenario("圆", { tilt: 0, offset: 0.9 }),
        scenario("椭圆", { tilt: 35, offset: 0.9 }),
      ],
    ),
    chapter(
      "母线与抛物线",
      "平面平行于圆锥母线时，离心率等于 1。",
      "选择抛物线，比较临界角两侧的截线。",
      ["tilt", "alpha"],
      [
        scenario("临界角之前", { tilt: 55 }),
        scenario("抛物线", { tilt: 60 }),
        scenario("临界角之后", { tilt: 65 }),
      ],
    ),
    chapter(
      "双曲线的两支",
      "平面同时穿过双圆锥的上下两部分，出现两支曲线。",
      "选择双曲线并旋转，观察两支分别位于哪个锥面。",
      ["tilt", "offset"],
      [
        scenario("斜截双曲线", { tilt: 75, offset: 0.2 }),
        scenario("竖直截面", { tilt: 90, offset: 0.45 }),
      ],
    ),
    chapter(
      "离心率与开口",
      "截线类型由倾角和半顶角共同决定，不能只看平面倾角。",
      "固定倾角 60°，比较不同半顶角的截线。",
      ["alpha", "tilt"],
      [
        scenario("半顶角 20°", { tilt: 60, alpha: 20 }),
        scenario("半顶角 30°", { tilt: 60, alpha: 30 }),
        scenario("半顶角 40°", { tilt: 60, alpha: 40 }),
      ],
    ),
    chapter(
      "经过顶点的退化",
      "经过顶点时，交线会退化为点、直线或两条相交直线。",
      "把截面距顶点设为零，再改变倾角观察退化情形。",
      ["offset", "tilt"],
      [
        scenario("一个点", { offset: 0, tilt: 35 }),
        scenario("一条直线", { offset: 0, tilt: 60 }),
        scenario("两条相交直线", { offset: 0, tilt: 75 }),
      ],
    ),
    chapter(
      "焦点的几何意义",
      "蓝色点为当前截线的焦点，随截平面共同变化。",
      "对照圆、椭圆与双曲线；接近抛物线时，一个焦点逐渐远离，抛物线保留一个有限焦点。",
      ["tilt", "offset", "showFocus"],
      [
        scenario("椭圆焦点", { tilt: 35, offset: 0.7 }),
        scenario("抛物线焦点", { tilt: 60, offset: 0.3 }),
        scenario("双曲线焦点", { tilt: 90, offset: 0.5 }),
      ],
    ),
    chapter(
      "Dandelin 双球",
      "球与截平面的切点就是焦点；同一点引出的两条球切线等长。",
      "应用双球情境，旋转模型观察相切圆，再移动 P 对比 PF 和 PT。",
      ["tilt", "offset", "showSpheres"],
      [
        scenario("椭圆双球", {
          tilt: 25,
          offset: 0.45,
          showSpheres: 1,
          showGuides: 0,
        }),
        scenario("双曲线双球", {
          tilt: 90,
          offset: 0.4,
          showSpheres: 1,
          showGuides: 0,
        }),
        scenario("抛物线单球", {
          tilt: 60,
          offset: 0.3,
          showSpheres: 1,
          showGuides: 0,
        }),
      ],
    ),
  ],
  fractions: [
    chapter(
      "整体与等分",
      "分母表示把一个整体平均分成几份；比较时整体大小必须相同。",
      "保持取出 1 份，比较不同等分数；也可点击圆盘选取。",
      ["d", "n"],
      [
        scenario("二等分", { n: 1, d: 2 }),
        scenario("四等分", { n: 1, d: 4 }),
        scenario("八等分", { n: 1, d: 8 }),
      ],
    ),
    chapter(
      "等值分数",
      "分子与分母同时扩大相同倍数，分数大小不变。",
      "切换三种表示，对照圆盘覆盖范围和数轴位置。",
      ["n", "d"],
      [
        scenario("1/2", { n: 1, d: 2 }),
        scenario("2/4", { n: 2, d: 4 }),
        scenario("4/8", { n: 4, d: 8 }),
      ],
    ),
    chapter(
      "跨过一个整体",
      "分子大于分母时，需要多个同样大小的整体表示。",
      "比较 7/8、8/8 和 9/8，找出数轴上的 1。",
      ["n", "d"],
      [
        scenario("7/8", { n: 7, d: 8 }),
        scenario("一个整体", { n: 8, d: 8 }),
        scenario("9/8", { n: 9, d: 8 }),
      ],
    ),
    chapter(
      "同分母比较",
      "整体相同，分母相同则每份一样大，取出的份数越多，分数越大。",
      "保留3/8为对照A，再把取出份数调到5。观察B分数条增加了几份，并读出大小关系。",
      ["n"],
      [scenario("3/8", { n: 3, d: 8 }), scenario("5/8", { n: 5, d: 8 })],
    ),
    chapter(
      "同分子比较",
      "整体相同，取出份数相同，分得越细，每份越小；不要只看分母数字的大小。",
      "保留3/4为对照A，只把平均分成的份数调为8。比较相同3份覆盖的长度，并用乘法核对。",
      ["d"],
      [scenario("3/4", { n: 3, d: 4 }), scenario("3/8", { n: 3, d: 8 })],
    ),
  ],
  pythagoras: [
    chapter(
      "认识三边与面积",
      "直角三角形两直角边的平方和等于斜边的平方。",
      "改变两条直角边，核对三个正方形面积。",
      ["a", "b"],
      [
        scenario("3、4、5", { a: 3, b: 4, arrange: 0 }),
        scenario("等腰直角", { a: 3, b: 3, arrange: 0 }),
      ],
    ),
    chapter(
      "保持面积的拼合",
      "重排四个全等三角形后，底板总面积和三角形总面积均不变。",
      "拖动重排进度，或点击播放；点击编号对照同一块三角板。",
      ["arrange"],
      [
        scenario("重排前", { a: 3, b: 4, arrange: 0 }),
        scenario("重排后", { a: 3, b: 4, arrange: 100 }),
      ],
    ),
    chapter(
      "改变边长验证",
      "拼合法适用于不同边长的直角三角形。动画投影中的重叠不参与面积相加。",
      "比较两种边长，记录 a²、b² 与 c²。",
      ["a", "b", "arrange"],
      [scenario("1 与 2", { a: 1, b: 2 }), scenario("5 与 6", { a: 5, b: 6 })],
    ),
    chapter(
      "从拼图到代数",
      "相同底板扣去相同四块三角板，剩余面积相等；展开(a+b)²后，交叉项2ab恰好抵消。",
      "依次点击三个推理步骤，读取底板、三角板合计和剩余面积，最后把数字与字母公式对应。",
      ["a", "b", "arrange"],
      [
        scenario("3、4直角边", { a: 3, b: 4, arrange: 100 }),
        scenario("2、3直角边", { a: 2, b: 3, arrange: 100 }),
      ],
    ),
    chapter(
      "放大图形，关系不变",
      "直角边同比例放大，长度随倍数变化，各块面积随倍数的平方变化；勾股关系始终成立。",
      "比较1.5、2与3、4两组边长。边长加倍，核对三角板和剩余面积是否都变为4倍；画面会自动适配，请用标注判断实际长度。",
      ["a", "b"],
      [
        scenario("原图：1.5与2", { a: 1.5, b: 2, arrange: 100 }),
        scenario("放大2倍：3与4", { a: 3, b: 4, arrange: 100 }),
      ],
    ),
  ],
  linear: [
    chapter(
      "斜率与增减",
      "y=kx+b 中，k 决定 x 增大时 y 的变化方向与快慢。",
      "保持 b=0，比较上升、下降与水平图像；拖动观察点。",
      ["k", "x"],
      [
        scenario("上升", { k: 1, b: 0 }),
        scenario("下降", { k: -1, b: 0 }),
        scenario("水平", { k: 0, b: 0 }),
      ],
    ),
    chapter(
      "截距与平移",
      "b 是图像与纵轴交点的纵坐标。保持 k 不变，改变 b 得到平行直线。",
      "比较截距 -2、0、2，再拖动纵轴截距手柄。",
      ["b", "x"],
      [
        scenario("向下", { k: 1, b: -2 }),
        scenario("过原点", { k: 1, b: 0 }),
        scenario("向上", { k: 1, b: 2 }),
      ],
    ),
    chapter(
      "读点与代入",
      "图像上的点同时满足横坐标与函数计算值。",
      "固定函数 y=2x−1，依次读取三个点，再自行移动探针核对。",
      ["x"],
      [
        scenario("x=-1", { k: 2, b: -1, x: -1 }),
        scenario("x=0", { k: 2, b: -1, x: 0 }),
        scenario("x=2", { k: 2, b: -1, x: 2 }),
      ],
    ),
    chapter(
      "由两点还原直线",
      "两个横坐标不同的点可确定 y=kx+b。先求 k=Δy/Δx，再求 b=y₁−kx₁。",
      "把 P 保留为 A，再移动 P，对照变化量；让两点重合，观察为什么不能再用这组点求斜率。",
      ["x", "k", "b"],
      [
        scenario("上升直线两点", { k: 1, b: 1, x: 2 }),
        scenario("下降直线两点", { k: -2, b: 1, x: 1 }),
      ],
    ),
    chapter(
      "横轴交点与函数正负",
      "k不为0时，y=0对应x=−b/k；函数在哪一侧为正取决于斜率方向。k=0时单独判断。",
      "把观察点移到零点，再沿横轴移动；对照斜率反向、水平直线和与横轴重合。",
      ["k", "b", "x"],
      [
        scenario("零点在x=2", { k: 1, b: -2, x: 2 }),
        scenario("斜率反向", { k: -1, b: 2, x: 0 }),
        scenario("无零点", { k: 0, b: 2, x: 0 }),
        scenario("处处为零", { k: 0, b: 0, x: 0 }),
      ],
    ),
  ],
  waves: [
    chapter(
      "振动与传播",
      "波形向前，质点在原位置上下振动。",
      "播放后观察虚线上的质点，并对照下方一个周期的振动图。上图横轴是位置，下图横轴是时间；调节观察位置，区分振动方向与传播方向。",
      ["probe", "amplitude"],
      [
        scenario("观察3m处", { mode: 0, probe: 3 }, 0.5),
        scenario("观察7m处", { mode: 0, probe: 7 }, 0.5),
      ],
    ),
    chapter(
      "波长、频率与波速",
      "波速固定时，频率越大，波长越短，v=fλ。",
      "固定波速2m/s，对照两种频率，数一数12m中包含多少个波长。",
      ["frequency", "speed"],
      [
        scenario("高频1Hz", { mode: 0, frequency: 1, speed: 2 }, 0.5),
        scenario("低频0.5Hz", { mode: 0, frequency: 0.5, speed: 2 }, 0.5),
      ],
    ),
    chapter(
      "相长叠加",
      "相同初相位的同向相干波，合成振幅为单列的两倍。",
      "对照三行曲线和标记点位移，验证两项相加。",
      ["amplitude", "phase"],
      [
        scenario("同相", { mode: 1, phase: 0 }, 0.5),
        scenario("相差90度", { mode: 1, phase: 90 }, 0.5),
      ],
    ),
    chapter(
      "相消叠加",
      "等振幅相干波相差180度时，位移处处相消。",
      "先观察合成线为零，再微调相位，看它如何离开零线。",
      ["phase"],
      [
        scenario("完全相消", { mode: 1, phase: 180 }, 0.5),
        scenario("偏离相消", { mode: 1, phase: 150 }, 0.5),
      ],
    ),
    chapter(
      "驻波与波节",
      "两列等频等幅反向波叠加，形成位置固定的波节与波腹。",
      "播放并观察x=2m的波节与x=3m的波腹。默认λ=4m，相邻波节相距2m。",
      ["probe", "frequency"],
      [
        scenario(
          "观察波节",
          { mode: 2, phase: 0, frequency: 0.5, speed: 2, probe: 2 },
          0.25,
        ),
        scenario(
          "观察波腹",
          { mode: 2, phase: 0, frequency: 0.5, speed: 2, probe: 3 },
          0.25,
        ),
      ],
    ),
  ],
  buoyancy: [
    chapter(
      "浸入与排水",
      "排开的液体越多，浮力越大。",
      "播放逐渐浸入，观察排水体积和浮力一起增加；杆提供保持位置所需的外力。",
      ["immersion", "volume"],
      [
        scenario("浸入一半", { mode: 0, immersion: 50 }),
        scenario("完全浸没", { mode: 0, immersion: 100 }),
      ],
    ),
    chapter(
      "液体密度的影响",
      "排水体积相同时，液体密度越大，浮力越大。",
      "保持完全浸没，比较800与1200kg/m³液体，核对浮力比例。",
      ["liquid"],
      [
        scenario("较轻液体", { mode: 0, immersion: 100, liquid: 800 }),
        scenario("较重液体", { mode: 0, immersion: 100, liquid: 1200 }),
      ],
    ),
    chapter(
      "物重与浮力分开看",
      "完全浸没时，相同体积物体受相同浮力，重力可以不同。",
      "只改变物体密度，比较箭头与保持位置的外力方向；在下方曲线定位两力相等，判断较重物体是否也能找到交点。",
      ["solid"],
      [
        scenario("较轻物体", { mode: 0, immersion: 100, solid: 600 }),
        scenario("较重物体", { mode: 0, immersion: 100, solid: 1400 }),
      ],
    ),
    chapter(
      "漂浮时排开多少水",
      "漂浮平衡满足浮力等于重力，浸入比例为物体密度与液体密度之比。",
      "对照400与800kg/m³物体，核对40%与80%的浸入比例。",
      ["solid", "liquid"],
      [
        scenario("轻质块", { mode: 1, solid: 400, liquid: 1000 }),
        scenario("较密块", { mode: 1, solid: 800, liquid: 1000 }),
      ],
    ),
    chapter(
      "漂浮、悬浮和沉底",
      "小于、等于、大于液体密度时，最终状态分别可能为漂浮、悬浮、沉底。",
      "比较三种平衡，沉底时还需要槽底支持力，不能只看重力与浮力。",
      ["solid", "liquid"],
      [
        scenario("漂浮", { mode: 1, solid: 600 }),
        scenario("悬浮", { mode: 1, solid: 1000 }),
        scenario("沉底", { mode: 1, solid: 1400 }),
      ],
    ),
  ],
  circle: [
    chapter(
      "半径与周长",
      "圆的周长为 2πr，周长随半径同比例变化。",
      "先播放圆周展开或拖动展开进度，再调整圆盘半径，比较厘米刻度和蓝色直径尺：一圈始终比 3 个直径多一点，周长与直径的比值为 π。",
      ["r"],
      [
        scenario("半径 2 cm", { r: 2, unroll: 0 }),
        scenario("半径 4 cm", { r: 4, unroll: 0 }),
      ],
    ),
    chapter(
      "扇形交错重排",
      "扇形交错拼合后，上下边仍有圆弧；有限分割不是精确矩形。",
      "切换原圆与重排，打开极限矩形参照，增加分割数观察边缘怎样接近长 πr、宽 r 的矩形。",
      ["parts", "rearrange", "limitRectangle"],
      [
        scenario("原圆", { parts: 16, rearrange: 0 }),
        scenario("16 等分拼合", { parts: 16, rearrange: 100 }),
        scenario("48 等分拼合", { parts: 48, rearrange: 100 }),
      ],
    ),
    chapter(
      "面积与平方关系",
      "面积为 πr²。半径加倍时面积变为四倍。",
      "保留参照半径，点击两倍半径，再播放缩放；比较同尺度双圆、周长比和面积比。半径加倍，周长变为两倍，面积变为四倍。",
      ["r"],
      [scenario("半径 2 cm", { r: 2 }), scenario("半径 4 cm", { r: 4 })],
    ),
    chapter(
      "弧边怎样变平",
      "相同半径下，分割越细，每段圆弧与弦之间的最大距离越小。",
      "比较固定8等分和当前分割的放大弧边，再依次切换16、32、48等分。观察弧高读数下降；下方放大图按弦等宽展示，不代表实际弦长相同。",
      ["parts", "r"],
      [
        scenario("16等分观察", {
          r: 3,
          parts: 16,
          rearrange: 100,
          limitRectangle: 1,
        }),
        scenario("48等分观察", {
          r: 3,
          parts: 48,
          rearrange: 100,
          limitRectangle: 1,
        }),
      ],
    ),
    chapter(
      "近似与精确的区别",
      "完整扇形重排不损失面积；用弦替代圆弧得到的内接多边形则会少掉一圈弧边间隙。",
      "从8等分增加到48等分，比较圆面积、多边形面积和未覆盖比例。说明为什么间隙越来越小，但有限多边形面积仍小于圆面积。",
      ["parts"],
      [
        scenario("8边形", {
          r: 3,
          parts: 8,
          rearrange: 100,
          limitRectangle: 0,
        }),
        scenario("32边形", {
          r: 3,
          parts: 32,
          rearrange: 100,
          limitRectangle: 0,
        }),
      ],
    ),
  ],
  cube: [
    chapter(
      "从平面到立体",
      "六个正方形沿共用边折叠形成正方体。",
      "切换三个折叠阶段，旋转观察折痕与面的位置。",
      ["fold"],
      [
        scenario("完全展开", { fold: 0 }),
        scenario("折到一半", { fold: 50 }),
        scenario("闭合", { fold: 100 }),
      ],
    ),
    chapter(
      "寻找相对面",
      "相对面互相平行，没有共用边。展开时远近不能直接判断相对关系。",
      "选择一组相对面，再来回折叠核对；可直接点击模型面。",
      ["pair", "fold"],
      [
        scenario("A 与 F", { pair: 1, fold: 75 }),
        scenario("B 与 D", { pair: 2, fold: 75 }),
        scenario("C 与 E", { pair: 3, fold: 75 }),
      ],
    ),
    chapter(
      "棱长与空间大小",
      "表面积随棱长平方变化，体积随棱长立方变化。",
      "保持闭合，比较 1 cm 与 2 cm；俯视核对形状。",
      ["edge"],
      [
        scenario("棱长 1 cm", { edge: 1, fold: 100 }),
        scenario("棱长 2 cm", { edge: 2, fold: 100 }),
      ],
      "top",
    ),
    chapter(
      "每面分格与表面积",
      "六个相同正方形，每面分成n²格，总计6n²格。小格边长a/n，六面的总面积仍为6a²。",
      "旋转或折叠观察正反面的网格，比较每棱2等分和4等分：格数变多，但总面积不变。",
      ["divisions", "fold", "edge"],
      [
        scenario("每棱2等分", { detail: 1, divisions: 2, fold: 30, edge: 2 }),
        scenario("每棱4等分", { detail: 1, divisions: 4, fold: 30, edge: 2 }),
      ],
    ),
    chapter(
      "逐层填满体积",
      "每层n²块，共n层，所以共有n³个小方块。每块体积为(a/n)³，总体积为a³。",
      "从空框播放填充，或点击逐层按钮。先数每层，再数层数；改变棱长后核对每个小方块对应的立方厘米。",
      ["fill", "divisions", "edge"],
      [
        scenario("每棱3等分", {
          detail: 2,
          divisions: 3,
          fold: 100,
          fill: 0,
          edge: 3,
        }),
        scenario("每棱4等分", {
          detail: 2,
          divisions: 4,
          fold: 100,
          fill: 25,
          edge: 4,
        }),
      ],
    ),
  ],
  functions: [
    chapter(
      "比较函数形态",
      "八类常用函数具有不同形态和定义域，可用相同坐标单位进行比较。",
      "切换函数形式，再移动探针；反比例奇点不能连线。",
      ["type", "probe"],
      [
        scenario("二次", { type: 0 }),
        scenario("正弦", { type: 1 }),
        scenario("绝对值", { type: 2 }),
        scenario("反比例", { type: 3 }),
        scenario("三次", { type: 4 }),
        scenario("平方根", { type: 5 }),
      ],
    ),
    chapter(
      "平移图像",
      "y=a·f(k(x−h))+b 中，h 控制左右平移，b 控制上下平移。",
      "保持 a=1，比较原函数、右移和上移，并打开原函数对照。",
      ["shift", "b", "probe"],
      [
        scenario("原位置", { type: 0, shift: 0, b: 0 }),
        scenario("向右 2", { type: 0, shift: 2, b: 0 }),
        scenario("向上 2", { type: 0, shift: 0, b: 2 }),
      ],
    ),
    chapter(
      "伸缩与翻折",
      "系数 a 改变图像相对 y=b 的竖直距离。保持 b 不变，把 a 改成其相反数时，图像关于 y=b 翻折；b=0 时才是横轴。",
      "比较 a=1、2、-1，读取相同横坐标处的值；改变 b，对照绿色参照线 y=b，观察翻折轴怎样移动。",
      ["a", "b", "probe"],
      [
        scenario("a=1", { a: 1 }),
        scenario("a=2", { a: 2 }),
        scenario("a=-1", { a: -1 }),
      ],
    ),
    chapter(
      "反比例的间断",
      "反比例函数在 x=h 处无定义；不能用连续曲线跨过该位置。",
      "移动探针靠近左右两侧，再调整 h 观察间断位置。",
      ["shift", "a", "probe"],
      [
        scenario("原点两侧", { type: 3, shift: 0, probe: -1 }),
        scenario("奇点右移", { type: 3, shift: 2, probe: 3 }),
      ],
    ),
    chapter(
      "指数与对数",
      "底数为 2 的指数函数与对数函数互为反函数；未变换时，(0,1) 与 (1,0)、(1,2) 与 (2,1) 分别对应。",
      "切换两种函数，移动探针读数，再平移图像观察渐近线。指数图像的水平渐近线是 y=b；对数图像的竖直渐近线是 x=h（a≠0）。",
      ["type", "shift", "b", "probe"],
      [
        scenario("指数 2ˣ", { type: 6, probe: 1 }),
        scenario("对数 log₂x", { type: 7, probe: 2 }),
        scenario("对数右移", { type: 7, shift: 2, probe: 4 }),
      ],
    ),
    chapter(
      "定义域与端点",
      "平方根要求 x≥h，包含起点；对数要求 x>h，不包含边界。乘以零也不改变原表达式的定义域。",
      "把探针移到边界两侧，观察数值是否存在；将 a 设为 0，比较射线端点的实心与空心。",
      ["type", "a", "shift", "probe"],
      [
        scenario("平方根起点", { type: 5, probe: 0 }),
        scenario("对数边界", { type: 7, probe: 0 }),
        scenario("零系数平方根", { type: 5, a: 0, probe: 0 }),
        scenario("零系数对数", { type: 7, a: 0, probe: 0 }),
      ],
    ),
    chapter(
      "横向伸缩与翻折",
      "当 k≠0 时，图像上的横坐标先除以 k 再加 h。|k|>1 时横向压缩，0<|k|<1 时横向拉伸，k<0 时还包含左右翻折。",
      "比较正弦周期；再切换对数，观察 k 为负时定义域转到边界左侧。k=0 要单独判断原函数在 0 处是否有定义。",
      ["type", "k", "shift", "probe"],
      [
        scenario("正弦原图", { type: 1, k: 1 }),
        scenario("压缩一半", { type: 1, k: 2 }),
        scenario("拉伸两倍", { type: 1, k: 0.5 }),
        scenario("对数左右翻折", { type: 7, k: -1, probe: -2 }),
        scenario("零系数输入", { type: 7, k: 0, probe: 0 }),
      ],
    ),
    chapter(
      "割线趋近切线",
      "割线斜率等于两点的平均变化率。当 Δx 趋近 0 且导数存在时，割线斜率趋近该点的导数。Δx=0 本身不能代入差商。",
      "用下方左右差商表比较逐渐缩小的间距，点击数值同步主图；再切换绝对值尖点，对比左右差商为何不同。蓝虚线是割线，紫实线是切线。",
      ["analysis", "probe", "dx", "type"],
      [
        scenario("间距 1", { type: 0, analysis: 1, probe: 1, dx: 1 }),
        scenario("间距 0.1", { type: 0, analysis: 1, probe: 1, dx: 0.1 }),
        scenario("从左趋近", { type: 0, analysis: 1, probe: 1, dx: -0.1 }),
        scenario("尖点右侧", { type: 2, analysis: 1, probe: 0, dx: 0.5 }),
        scenario("尖点左侧", { type: 2, analysis: 1, probe: 0, dx: -0.5 }),
      ],
    ),
    chapter(
      "单位圆与正弦",
      "单位圆上点的纵坐标是 sin θ；函数的输入角为 θ=k(x−h)，再经过纵向伸缩和平移得到 y。",
      "先选择单位圆正弦，在圆周上拖动点或点选关键角。比较单位圆高度和曲线探针；再把振幅加倍，区分单位圆上的值与变换后函数值。",
      ["probe", "a", "k", "shift", "b"],
      [
        scenario("单位圆正弦", {
          type: 1,
          a: 1,
          k: 1,
          shift: 0,
          b: 0,
          probe: 0,
          analysis: 0,
        }),
        scenario("振幅加倍", {
          type: 1,
          a: 2,
          k: 1,
          shift: 0,
          b: 0,
          probe: 1.5707963267948966,
          analysis: 0,
        }),
      ],
    ),
    chapter(
      "零点与二分法",
      "连续函数在区间两端异号时，区间内至少有一个零点。不断保留两端异号的半区间，可以逐步缩小零点范围。",
      "先对 x²−2 使用区间 [0,2]，每次折半观察蓝色区间缩小，再查看逐步计算。比较两端同号与跨间断的例子：不满足条件时不能继续二分。",
      ["type", "b", "shift"],
      [
        scenario("求 √2", {
          type: 0,
          a: 1,
          k: 1,
          b: -2,
          shift: 0,
          analysis: 0,
        }),
        scenario("三次零点", {
          type: 4,
          a: 1,
          k: 1,
          b: -2,
          shift: 0,
          analysis: 0,
        }),
        scenario("无实零点", {
          type: 0,
          a: 1,
          k: 1,
          b: 1,
          shift: 0,
          analysis: 0,
        }),
        scenario("跨越间断", {
          type: 3,
          a: 1,
          k: 1,
          b: 0,
          shift: 1,
          analysis: 0,
        }),
      ],
    ),
  ],
  solids: [
    chapter(
      "同底同高对照",
      "同底同高圆锥的体积是圆柱的三分之一。",
      "改变共同的底面半径和高，核对两种体积。",
      ["radius", "height"],
      [
        scenario("较矮实体", { height: 1.5 }),
        scenario("较高实体", { height: 3 }),
      ],
    ),
    chapter(
      "水平截面",
      "圆柱各水平截面等大，圆锥截面从底面到顶点逐渐缩小。",
      "比较底面、半高与顶点；截面积比不同于总体积比。",
      ["slice"],
      [
        scenario("底面", { slice: 0 }),
        scenario("半高", { slice: 50 }),
        scenario("顶点", { slice: 100 }),
      ],
      "top",
    ),
    chapter(
      "半径的平方效应",
      "保持高不变，半径加倍会使体积变为四倍。",
      "比较半径 0.8 与 1.6 cm，再记录体积。",
      ["radius", "height"],
      [
        scenario("半径 0.8 cm", { radius: 0.8, height: 3 }),
        scenario("半径 1.6 cm", { radius: 1.6, height: 3 }),
      ],
    ),
    chapter(
      "侧面展开与面积",
      "圆柱侧面展开为矩形，圆锥侧面展开为扇形；对应边长等于底面周长。",
      "在下方切换两种展开图，调整半径和高，比较母线与高。",
      ["radius", "height"],
      [
        scenario("瘦高圆锥", { radius: 0.8, height: 3.5 }),
        scenario("矮宽圆锥", { radius: 2, height: 1 }),
      ],
    ),
    chapter(
      "从截面累积体积",
      "相同高度以下的体积由全部下部截面共同决定；半高的圆锥下部包含总体积的 7/8。",
      "拖动截面高度或播放扫描，比较着色实体、体积条与高度—累计体积曲线。观察圆锥曲线为何越来越平；到顶点时，圆锥总体积才是圆柱的三分之一。进阶可对照8层与32层，切换内接、外接，观察两个估算值夹住精确体积。",
      ["slice", "radius", "height"],
      [
        scenario("比较半高", { slice: 50 }),
        scenario("比较总体积", { slice: 100 }),
      ],
    ),
    chapter(
      "按体积寻找切面",
      "圆柱的体积比例等于高度比例；圆锥底部更宽，切出一半体积需要的高度不到一半。",
      "点击下方圆锥二分之一体积，观察切面约在总高20.630%处；再对照圆柱半体积位置，最后寻找圆锥四分之一和四分之三体积。",
      ["slice", "radius", "height"],
      [
        scenario("圆锥半体积", { slice: 100 * (1 - Math.cbrt(0.5)) }),
        scenario("圆柱半体积", { slice: 50 }),
      ],
    ),
  ],
  refraction: [
    chapter(
      "从法线量角",
      "入射角和折射角都从法线量起，不从介质表面量起。",
      "比较垂直入射与斜入射；拖动光源改变入射角。",
      ["angle"],
      [
        scenario("垂直入射", { angle: 0, n1: 1, n2: 1.5 }),
        scenario("斜入射", { angle: 40, n1: 1, n2: 1.5 }),
      ],
    ),
    chapter(
      "介质与偏折",
      "光进入折射率更大的介质时偏向法线，反向传播时偏离法线。",
      "保持入射角 30°，交换两侧介质。",
      ["n1", "n2", "angle"],
      [
        scenario("空气进入玻璃", { angle: 30, n1: 1, n2: 1.5 }),
        scenario("玻璃进入空气", { angle: 30, n1: 1.5, n2: 1 }),
      ],
    ),
    chapter(
      "临界角与全反射",
      "只有从较大折射率介质射向较小折射率介质，才可能全反射。",
      "比较 30° 与 50°；使用图中的临界角按钮检查边界。",
      ["angle"],
      [
        scenario("仍有折射", { angle: 30, n1: 1.5, n2: 1 }),
        scenario("发生全反射", { angle: 50, n1: 1.5, n2: 1 }),
      ],
    ),
    chapter(
      "临界角前后",
      "临界角处折射角达到90度；再增大入射角，没有进入第二介质的传播折射光。",
      "在下方依次点击临界角前1度、恰好临界角和后1度，同时比较上方光路与曲线选点。播放角度扫描可连续观察临界附近变化。",
      ["angle"],
      [
        scenario("临界角前", {
          n1: 1.5,
          n2: 1,
          angle: (Math.asin(1 / 1.5) * 180) / Math.PI - 1,
        }),
        scenario("临界角后", {
          n1: 1.5,
          n2: 1,
          angle: (Math.asin(1 / 1.5) * 180) / Math.PI + 1,
        }),
      ],
    ),
    chapter(
      "折射定律的正弦关系",
      "相等的是n₁sin i和n₂sin r，而不是角度本身；折射率相同时光路不偏折。",
      "拖动曲线核对两个正弦乘积；点击“沿折射光反向验证”，比较入射角与折射角是否互换，再点击一次回到原条件。",
      ["angle", "n1", "n2"],
      [
        scenario("空气到玻璃", { n1: 1, n2: 1.5, angle: 60 }),
        scenario("相同折射率", { n1: 1.5, n2: 1.5, angle: 60 }),
      ],
    ),
    chapter(
      "水下物体的视深",
      "观察者沿折射光线反向延长，会把水下物体判断在较浅的位置；近轴视深是实际深度乘以上方与下方介质折射率之比。",
      "在下方视深图中对照近轴、20°和40°，观察延长线交点为何移动；改变实深，核对两个深度的比例。发生全反射时不显示透射像。",
      ["angle", "n1", "n2"],
      [
        scenario("水下观察", { angle: 20, n1: 1.33, n2: 1 }),
        scenario("相同介质对照", { angle: 20, n1: 1.33, n2: 1.33 }),
      ],
    ),
  ],
  lever: [
    chapter(
      "力与力臂",
      "力矩由力与垂直力臂决定；支点到作用点的距离不总等于力臂。",
      "先比较斜向力观察器的0°、30°、90°，区分杆上距离与垂直力臂；开启力的分解，再比较30°与150°，用垂直分力乘杆长核对同一个力矩。最后播放上方竖直重物模型，观察倾斜后的水平投影。",
      ["l1", "l2"],
      [
        scenario("右侧较近", { f1: 10, l1: 1, f2: 5, l2: 1 }),
        scenario("右侧较远", { f1: 10, l1: 1, f2: 5, l2: 2 }),
      ],
    ),
    chapter(
      "调节到平衡",
      "左右力矩相等时满足平衡条件。",
      "固定左侧，用右侧作用力找平衡，也可使用图中的平衡按钮核对。",
      ["f2", "l2"],
      [
        scenario("右侧力不足", { f1: 10, l1: 1, f2: 4, l2: 2 }),
        scenario("恰好平衡", { f1: 10, l1: 1, f2: 5, l2: 2 }),
        scenario("右侧力偏大", { f1: 10, l1: 1, f2: 6, l2: 2 }),
      ],
    ),
    chapter(
      "省力与距离",
      "较长力臂可以用较小的力产生相同力矩。",
      "比较等臂与长臂方案，在下方逐步改变观察转角。对照两端高度变化与圆弧路程，核对右侧做功和左侧重力势能增加相等。",
      ["f1", "l1", "f2", "l2"],
      [
        scenario("等臂等力", { f1: 10, l1: 1, f2: 10, l2: 1 }),
        scenario("长臂省力", { f1: 10, l1: 1, f2: 5, l2: 2 }),
      ],
    ),
    chapter(
      "相同力矩，不同转动惯量",
      "合力矩相同，质量离支点越远，转动惯量越大，初始角加速度越小。",
      "对照两种固定载荷布局：重力矩都相差 5 N·m。单步释放，比较角加速度；这是高中进阶观察。",
      ["f1", "l1", "f2", "l2"],
      [
        scenario("较重载荷靠近支点", { f1: 20, l1: 0.5, f2: 10, l2: 0.5 }),
        scenario("较轻载荷远离支点", { f1: 10, l1: 1, f2: 5, l2: 1 }),
      ],
    ),
    chapter(
      "停止，一定是平衡吗",
      "达到机械限位后，挡块提供约束力矩；停止不代表两侧重力矩相等。",
      "先预测下降方向，再释放到限位，比较两侧力矩和约束力矩。使用平衡曲线调整后重新释放，区分两种静止。",
      ["f1", "f2"],
      [
        scenario("右侧下降至限位", { f1: 5, l1: 1, f2: 10, l2: 1 }),
        scenario("重力矩相等", { f1: 10, l1: 1, f2: 10, l2: 1 }),
      ],
    ),
  ],
  projectile: [
    chapter(
      "平抛的两个方向",
      "忽略空气阻力，水平方向匀速，竖直方向做自由落体。",
      "选择高台平抛，播放并暂停；打开投影与速度分量。",
      ["speed", "height"],
      [
        scenario("较慢平抛", { speed: 10, angle: 0, height: 5 }),
        scenario("较快平抛", { speed: 20, angle: 0, height: 5 }),
      ],
    ),
    chapter(
      "斜抛的最高点",
      "最高点竖直速度为零，水平速度仍不为零。",
      "选择斜抛，用时间轴定位最高点附近，比较速度箭头。",
      ["angle", "speed"],
      [
        scenario("30° 发射", { angle: 30, height: 0 }),
        scenario("60° 发射", { angle: 60, height: 0 }),
      ],
    ),
    chapter(
      "角度与射程",
      "同速且等高起落时，互余发射角射程相同，45° 射程最大。",
      "保持速度与高度不变，对照 30°、45°、60° 的落点。",
      ["angle"],
      [
        scenario("30°", { speed: 15, angle: 30, height: 0 }),
        scenario("45°", { speed: 15, angle: 45, height: 0 }),
        scenario("60°", { speed: 15, angle: 60, height: 0 }),
      ],
    ),
    chapter(
      "速度加倍，射程怎样变",
      "等高起落、角度固定时，射程与初速度的平方成正比，飞行时间与初速度成正比。",
      "先保留 10 m/s 的轨迹，再切换 20 m/s；在同尺度图中比较落点，核对射程为四倍、飞行时间为两倍。",
      ["speed"],
      [
        scenario("10 m/s 地面发射", { speed: 10, angle: 45, height: 0 }),
        scenario("20 m/s 地面发射", { speed: 20, angle: 45, height: 0 }),
      ],
    ),
    chapter(
      "高台发射还选 45° 吗",
      "落地面低于发射点时，最大射程角小于45°；互余角等射程的结论不再适用。",
      "保留高台 45° 的轨迹，再对比 36°；观察射程和飞行时间。回到地面时重做对照，分清结论成立的条件。",
      ["angle", "height"],
      [
        scenario("高台 45°", { speed: 15, angle: 45, height: 10 }),
        scenario("高台 36°", { speed: 15, angle: 36, height: 10 }),
        scenario("地面 45°", { speed: 15, angle: 45, height: 0 }),
      ],
    ),
  ],
  incline: [
    chapter(
      "分解重力",
      "重力沿斜面和平行于法线的分量共同决定支持力与运动趋势。",
      "先忽略摩擦，在下方重力分解图比较两种倾角；切换实际受力，区分重力的垂直分量与斜面的支持力。",
      ["angle", "mass"],
      [
        scenario("15° 无摩擦", { angle: 15, mu: 0, muStatic: 0 }),
        scenario("40° 无摩擦", { angle: 40, mu: 0, muStatic: 0 }),
      ],
    ),
    chapter(
      "摩擦与起滑",
      "静摩擦能阻止起滑；超过 μₛN 后开始下滑，滑动摩擦按 μₖN 计算。",
      "在同一倾角比较静止与下滑情境，播放验证。",
      ["muStatic", "mu", "angle"],
      [
        scenario("可以下滑", { angle: 25, mu: 0.2, muStatic: 0.3 }),
        scenario("保持静止", { angle: 25, mu: 0.2, muStatic: 0.6 }),
        scenario("临界角下方", { angle: 26, mu: 0.2, muStatic: 0.5 }),
        scenario("临界角上方", { angle: 27, mu: 0.2, muStatic: 0.5 }),
      ],
    ),
    chapter(
      "质量与加速度",
      "此简化模型的加速度不依赖质量，但重力、支持力和摩擦力依赖质量。",
      "保持倾角与摩擦系数，在下方固定力标尺对照中选择1、2、4 kg；播放并比较两条位移轨迹和加速度，解释为什么合力增加并不意味着加速度增加。",
      ["mass"],
      [scenario("1 kg", { mass: 1 }), scenario("4 kg", { mass: 4 })],
    ),
    chapter(
      "势能如何转化",
      "相同下降高度释放相同重力势能；有摩擦时，一部分转为内能，动能更少。",
      "分别选择光滑和粗糙斜面，定位行程一半，对比能量条。保持质量与倾角相同，比较势能减少量和动能。",
      ["mu", "muStatic"],
      [
        scenario("光滑斜面", { angle: 35, mass: 2, mu: 0, muStatic: 0 }),
        scenario("粗糙斜面", { angle: 35, mass: 2, mu: 0.2, muStatic: 0.3 }),
      ],
    ),
    chapter(
      "挡板停止与能量去向",
      "停止时动能归零，但能量没有消失；模型把停止过程耗散单独列出。",
      "先定位行程一半，再到达挡板，观察动能颜色转为停止过程耗散，并核对四项总和。再切换不滑动的情境，说明静摩擦不做功。",
      ["angle", "muStatic"],
      [
        scenario("滑向挡板", { angle: 35, mass: 2, mu: 0.1, muStatic: 0.3 }),
        scenario("静摩擦保持静止", {
          angle: 15,
          mass: 2,
          mu: 0.1,
          muStatic: 0.3,
        }),
      ],
    ),
  ],
  capacitor: [
    chapter(
      "电容充电",
      "充电时电容电压逐渐接近电源电压，电流逐渐减小。",
      "应用充电情境，播放后在曲线中比较电压与电流。",
      ["u", "trace", "currentArrows"],
      [
        scenario("6 V 充电", { mode: 0, u: 6 }),
        scenario("12 V 充电", { mode: 0, u: 12 }),
      ],
    ),
    chapter(
      "电容放电",
      "放电从预先充电的电容开始；这里使用给定初始电压。",
      "切换放电，观察开关支路与电容电压下降。",
      ["mode", "u", "trace", "currentArrows"],
      [scenario("充电支路", { mode: 0 }), scenario("放电支路", { mode: 1 })],
    ),
    chapter(
      "时间常数 RC",
      "时间常数 τ=RC，增大 R 或 C 会使充放电过程变慢。",
      "每次从初态播放，对照相同时间下的电压；极板展示尺寸不用于求电容。",
      ["r", "c", "currentArrows"],
      [
        scenario("τ=1 s", { r: 500, c: 2 }),
        scenario("τ=2 s", { r: 500, c: 4 }),
        scenario("τ=4 s", { r: 1000, c: 4 }),
      ],
    ),
    chapter(
      "能量去了哪里",
      "电源做功、电容储能与电阻耗散共同满足能量守恒；放电时由电容的初始能量供给。",
      "选择充电或放电，再用初始、1τ、5τ 对照两条等长的能量条。改变电阻比较快慢，改变电压比较能量。",
      ["u", "r", "c", "mode", "currentArrows"],
      [
        scenario("观察充电能量", { mode: 0, u: 6, r: 1000, c: 4 }),
        scenario("观察放电能量", { mode: 1, u: 6, r: 1000, c: 4 }),
      ],
    ),
    chapter(
      "回路电压如何分配",
      "按充电方向规定电流正方向，理想回路满足 U回路电源=IR+Uc；放电时电源不在回路，电流符号反向。",
      "从初始到1τ、3τ、5τ观察同尺度电压条；比较充电与放电，说明电压的正负与方向有关。",
      ["u", "r", "c", "mode", "currentArrows"],
      [
        scenario("充电分压", {
          mode: 0,
          u: 9,
          r: 500,
          c: 4,
          chargeInitialRatio: 0,
        }),
        scenario("放电反向", {
          mode: 1,
          u: 9,
          r: 500,
          c: 4,
          initialRatio: 100,
        }),
      ],
    ),
  ],
  molecule: [
    chapter(
      "水分子的折线结构",
      "水分子包含两个氢原子和一个氧原子，球棍模型用来识别组成与空间排布。",
      "旋转水分子，对比正视与立体；展示尺度不代表化学键伸缩。",
      ["spread", "annotations", "scaffold"],
      [
        scenario("标准球棍", { type: 0, ensemble: 0, spread: 1 }),
        scenario("展开观察", { type: 0, ensemble: 0, spread: 1.4 }),
      ],
    ),
    chapter(
      "直线与四面体",
      "CO₂ 呈直线形，CH₄ 中四个氢原子围绕碳原子排成四面体。",
      "切换分子并旋转，避免只凭平面投影判断键角。",
      ["type", "spread", "annotations", "scaffold"],
      [
        scenario("二氧化碳", { type: 1, ensemble: 0 }),
        scenario("甲烷", { type: 2, ensemble: 0 }),
      ],
    ),
    chapter(
      "孤电子对与分子形状",
      "甲烷、氨和水的中心原子都有四个电子域，但孤电子对数不同，分子形状与键角不同。",
      "依次比较三种分子，打开孤电子对示意与几何辅助面，区分电子域与原子核构成的分子形状。紫色区域不是实测电子云。",
      ["type", "lonePairs", "scaffold", "annotations"],
      [
        scenario("甲烷 · 0 对孤电子对", {
          lonePairs: 1,
          type: 2,
          ensemble: 0,
          scaffold: 1,
          spread: 1,
        }),
        scenario("氨 · 1 对孤电子对", {
          lonePairs: 1,
          type: 3,
          ensemble: 0,
          scaffold: 1,
          spread: 1,
        }),
        scenario("水 · 2 对孤电子对", {
          lonePairs: 1,
          type: 0,
          ensemble: 0,
          scaffold: 1,
          spread: 1,
        }),
      ],
    ),
    chapter(
      "多个分子的运动",
      "多分子视图帮助区分单个分子结构与分子群体；轨迹为示意。",
      "切换观察方式，比较四种物质的分子组成，不将间距当作密度测量。",
      ["type", "ensemble"],
      [
        scenario("水分子群", { type: 0, ensemble: 1 }),
        scenario("CO₂ 分子群", { type: 1, ensemble: 1 }),
        scenario("单个分子", { type: 0, ensemble: 0 }),
      ],
    ),
    chapter(
      "空间结构与平面投影",
      "屏幕显示的是三维结构的投影，投影角会随观察方向改变，真实键角保持不变。",
      "拖动投影角度，比较水、甲烷、氨与二氧化碳；旋转到90°观察重叠或退化，避免把投影角当作键角。",
      ["type", "annotations", "scaffold"],
      [
        scenario("水的投影", { type: 0, ensemble: 0, spread: 1 }),
        scenario("甲烷的投影", { type: 2, ensemble: 0, spread: 1 }),
        scenario("氨的投影", { type: 3, ensemble: 0, spread: 1 }),
        scenario("CO₂ 的投影", { type: 1, ensemble: 0, spread: 1 }),
      ],
    ),
  ],
  conservation: [
    chapter(
      "识别反应前后",
      "2H₂+O₂→2H₂O，反应改变原子的组合，不改变原子种类和数量。",
      "比较反应前与一个批次之后，逐一清点 H、O 原子。",
      ["progress"],
      [
        scenario("反应前", { h2: 4, o2: 2, progress: 0 }),
        scenario("一批反应后", { h2: 4, o2: 2, progress: 1 }),
      ],
    ),
    chapter(
      "恰好反应的比例",
      "氢气与氧气按分子个数比 2:1 恰好反应。",
      "比较两组同比例投料，再将反应批次数调到足够大。",
      ["h2", "o2", "progress"],
      [
        scenario("2 H₂ + 1 O₂", { h2: 2, o2: 1, progress: 4 }),
        scenario("8 H₂ + 4 O₂", { h2: 8, o2: 4, progress: 4 }),
      ],
    ),
    chapter(
      "过量与剩余",
      "一种反应物耗尽后，另一种即使有剩余也不能继续生成水。",
      "分别让氢气和氧气过量，核对反应物剩余和生成物数量。",
      ["h2", "o2", "progress"],
      [
        scenario("氢气过量", { h2: 8, o2: 1, progress: 4 }),
        scenario("氧气过量", { h2: 2, o2: 4, progress: 4 }),
      ],
    ),
    chapter(
      "分子数一定守恒吗？",
      "原子重新组合时，分子总数可以改变。一批反应由3个反应物分子生成2个水分子，原子种类和数量都没有改变。",
      "播放一批，追踪同编号原子；在计数表里对照原子数和分子总数。",
      ["progress"],
      [
        scenario("3个分子反应前", { h2: 2, o2: 1, progress: 0 }),
        scenario("2个分子反应后", { h2: 2, o2: 1, progress: 1 }),
      ],
    ),
    chapter(
      "个数比与质量比不同",
      "2H₂+O₂→2H₂O 的分子个数比为2:1:2；取相对原子质量 H≈1、O≈16，质量比为1:8:9。",
      "核对相对质量总和；把投料增为两倍，比较总量变化与比例不变。",
      ["h2", "o2", "progress"],
      [
        scenario("两批质量对照", { h2: 4, o2: 2, progress: 2 }),
        scenario("一批质量对照", { h2: 2, o2: 1, progress: 1 }),
      ],
    ),
  ],
  precipitation: [
    chapter(
      "观察沉淀生成",
      "铜离子与氢氧根离子生成氢氧化铜沉淀，颗粒为可视化示意。",
      "固定硫酸铜投料，增加 NaOH，点击播放观察滴加过程。",
      ["base"],
      [
        scenario("少量 NaOH", { copper: 50, base: 20 }),
        scenario("较多 NaOH", { copper: 50, base: 40 }),
      ],
    ),
    chapter(
      "恰好反应",
      "Cu²⁺+2OH⁻→Cu(OH)₂。本实验两种溶液浓度为 0.1 和 0.2 mol/L，等体积恰好配比。",
      "比较达到化学计量配比前、恰好配比和碱过量时的沉淀量。",
      ["base", "copper"],
      [
        scenario("碱不足", { copper: 50, base: 25 }),
        scenario("恰好配比", { copper: 50, base: 50 }),
        scenario("碱过量", { copper: 50, base: 75 }),
      ],
    ),
    chapter(
      "限制反应物",
      "已耗尽的反应物决定产物上限，继续增加另一种反应物不再增加沉淀。",
      "固定 NaOH 为 50 mL，对照两种硫酸铜投料并记录结果。",
      ["copper"],
      [
        scenario("铜盐 50 mL", { copper: 50, base: 50 }),
        scenario("铜盐 100 mL", { copper: 100, base: 50 }),
      ],
    ),
    chapter(
      "无色上清液里还有什么？",
      "钠离子与硫酸根没有进入氢氧化铜沉淀。上清液即使无色，仍含溶解的离子。",
      "对照恰好配比与碱过量；看下方离子条，哪些读数继续增加，哪些保持不变？",
      ["base"],
      [
        scenario("恰好反应后", { copper: 50, base: 50 }, 8),
        scenario("碱过量后", { copper: 50, base: 75 }, 8),
      ],
    ),
    chapter(
      "沉降不是继续生成沉淀",
      "滴加结束后，颗粒由悬浮逐渐沉降。固体总量不因静置而增加，位置变化与化学变化要分开判断。",
      "切换滴加完成与静置终点，比较三维分布和固相读数；再回到滴加前，追踪离子进入固体的过程。",
      ["volumeGuide"],
      [
        scenario("静置终点 · 看沉降", { copper: 50, base: 50 }, 20),
        scenario("滴加完成 · 看悬浮", { copper: 50, base: 50 }, 8),
      ],
    ),
  ],
  cell: [
    chapter(
      "细胞外形与剖面",
      "由外向内辨认细胞壁、细胞膜和细胞质。剖口的金色细线标出膜的位置，颜色和厚度为教学强调；虚拟剖面不代表自然状态的切口。",
      "改变剖切开放程度，旋转观察内外层关系。",
      ["cut"],
      [
        scenario("完整外形", { part: 0, cut: 0 }),
        scenario("打开剖面", { part: 0, cut: 80 }),
      ],
    ),
    chapter(
      "细胞核与液泡",
      "细胞核与遗传信息有关，成熟植物细胞常有较大的中央液泡。",
      {
        action:
          "进入细胞核近景，分开观察核膜与核孔、染色质与核仁，再恢复完整剖面。隐藏仅便于观察，不表示真实结构消失。也可切换到液泡，对照完整外形与虚拟剖面。",
        explanation:
          "液泡膜包围含溶解物质的细胞液，参与储存与渗透平衡。剖切面不是自由液面，膜厚及颜色为示意，不模拟膨压变化。",
      },
      ["part", "nucleusMode", "vacuoleSection"],
      [
        scenario("观察细胞核", { part: 1, cut: 80, nucleusMode: 0 }),
        scenario("单看核膜与核孔", { part: 1, cut: 100, nucleusMode: 1 }),
        scenario("单看染色质与核仁", { part: 1, cut: 100, nucleusMode: 2 }),
        scenario("观察液泡", { part: 2, cut: 100, vacuoleSection: 1 }),
      ],
    ),
    chapter(
      "叶绿体与整体",
      "叶绿体是光合作用的重要场所；并非所有植物细胞都有叶绿体。",
      {
        action:
          "先选“单看膜系统”，比较基粒堆叠与基质片层；再选“观察基质”寻找淀粉粒，最后恢复完整结构。",
        explanation:
          "各组层数、颜色和间距为教学示意，并非某个叶绿体的实测结果。隐藏仅为分层观察，不表示结构在真实细胞中消失。",
      },
      ["chloroplastMode", "part"],
      [
        scenario("观察叶绿体", { part: 3, cut: 100, chloroplastMode: 0 }),
        scenario("单看膜系统", { part: 3, cut: 100, chloroplastMode: 1 }),
        scenario("观察基质", { part: 3, cut: 100, chloroplastMode: 2 }),
        scenario("对照细胞全景", { part: 0, cut: 80 }),
      ],
    ),
    chapter(
      "线粒体与能量转换",
      "植物细胞也有线粒体。其内膜向内部折叠形成嵴，扩大膜的表面积；有氧呼吸的多个过程分别发生在基质和内膜上。",
      {
        action:
          "切换“内膜与嵴”和“双层膜”，辨认嵴从哪层膜折入；再选“基质细节”寻找 DNA 与核糖体，最后恢复完整结构。使用下方叶绿体与线粒体对照切换近景，解释为什么植物细胞也需要呼吸作用。",
        explanation:
          "嵴上的金色成对结构表示 ATP 合酶，头部朝向基质；它利用跨内膜的质子电化学梯度参与合成 ATP。蛋白、DNA 和核糖体均为放大示意，数量不代表实测。分层隐藏仅便于观察，颜色、膜厚和间距均为教学调整。",
      },
      ["mitochondrionMode", "part"],
      [
        scenario("观察线粒体", { part: 4, cut: 100, mitochondrionMode: 0 }),
        scenario("内膜与嵴", { part: 4, cut: 100, mitochondrionMode: 1 }),
        scenario("双层膜", { part: 4, cut: 100, mitochondrionMode: 2 }),
        scenario("基质细节", { part: 4, cut: 100, mitochondrionMode: 3 }),
        scenario("对比叶绿体", { part: 3, cut: 100 }),
      ],
    ),
    chapter(
      "高尔基体与物质分选",
      "高尔基体由扁平膜囊和周围囊泡组成，参与蛋白质加工、分选，也参与植物细胞壁部分多糖的合成。",
      {
        action:
          "先看膜囊堆叠，再看囊泡与出芽，辨认仍有细颈相连的芽体与已分离的囊泡，最后恢复完整结构。",
        explanation:
          "顺面接收来自内质网的物质，反面参与分选输出；出芽的细颈与囊泡是静态形态示意，并非真实时间序列或固定运输轨道。囊泡模式保留母体膜囊的细轮廓，帮助定位附着边缘；轮廓不是新增结构。植物细胞可有多个分散的高尔基体堆叠，这里只放大展示一个。",
      },
      ["golgiMode", "part"],
      [
        scenario("观察高尔基体", { part: 5, cut: 100, golgiMode: 0 }),
        scenario("单看膜囊", { part: 5, cut: 100, golgiMode: 1 }),
        scenario("囊泡与出芽", { part: 5, cut: 100, golgiMode: 2 }),
        scenario("回到细胞全景", { part: 0, cut: 100 }),
      ],
    ),
    chapter(
      "粗面与光面内质网",
      "内质网是相连的膜囊与管道网络。粗面内质网的细胞质侧附着核糖体；光面区域缺少这些附着颗粒。",
      {
        action:
          "依次选择“单看粗面”和“单看光面”，比较表面颗粒与管网，再恢复完整连接。",
        explanation:
          "核糖体以大小两个亚基的轮廓表示，大亚基靠近膜；不是原子级结构。隐藏仅用于观察，不表示结构消失。粗面区域参与分泌蛋白和膜蛋白的合成、加工，光面区域参与脂质合成等过程。此为局部放大示意，未绘出与核膜的完整连接；表面纹理不代表真实分子排列。",
      },
      ["erMode", "part"],
      [
        scenario("完整连接", { part: 6, cut: 100, erMode: 0 }),
        scenario("单看粗面", { part: 6, cut: 100, erMode: 1 }),
        scenario("单看光面", { part: 6, cut: 100, erMode: 2 }),
        scenario("对照高尔基体", { part: 5, cut: 100 }),
      ],
    ),
    chapter(
      "分泌蛋白运输",
      "跟随货物标记，串联粗面内质网、高尔基体与细胞膜，理解细胞内膜系统的协作。",
      {
        action:
          "选择阶段停下来观察，或播放完整过程；拖动进度可重复比较运输前后的位置。",
        explanation:
          "这是可溶性分泌蛋白的简化运输示意。金色标记用于透视追踪，虚线不是固定轨道，进度不是实测时间；出芽、膜融合与加工细节未作分子尺度模拟。",
      },
      ["secretoryProgress"],
      [
        scenario("从内质网开始", {
          part: 0,
          cut: 100,
          secretoryMode: 1,
          secretoryProgress: 0,
        }),
        scenario("高尔基体加工", {
          part: 0,
          cut: 100,
          secretoryMode: 1,
          secretoryProgress: 50,
        }),
        scenario("观察胞吐结果", {
          part: 0,
          cut: 100,
          secretoryMode: 1,
          secretoryProgress: 100,
        }),
      ],
    ),
    chapter(
      "细胞骨架与空间组织",
      "细胞骨架是蛋白质纤维组成的动态网络。皮层微管位于细胞膜内侧，肌动蛋白丝参与细胞内组织与运输。",
      {
        action:
          "分别显示金色微管和浅蓝色肌动蛋白丝，再同时观察。旋转模型，从侧面辨认它们与细胞边界、中央液泡的空间关系。",
        explanation:
          "这里选取部分皮层纤维作空间示意，直径、间距与颜色经过教学放大，不代表实测数量或固定排列。植物皮层微管不画成从动物细胞中心体放射的星状结构。微管参与纤维素沉积方向的组织；肌动蛋白丝与肌球蛋白参与细胞内运输。本视图不模拟聚合解聚或物质流速。",
      },
      ["cytoskeleton", "labels"],
      [
        scenario("皮层微管", { part: 0, cut: 100, cytoskeleton: 1 }),
        scenario("肌动蛋白丝", { part: 0, cut: 100, cytoskeleton: 2 }),
        scenario("两类纤维对照", { part: 0, cut: 100, cytoskeleton: 3 }),
      ],
    ),
  ],
  photosynthesis: [
    chapter(
      "光照的影响",
      "在其他条件相同时，光照会影响模型中的光合作用相对速率。",
      "固定 CO₂ 和温度，对照弱光与强光；这里不是实测生理曲线。",
      ["light"],
      [
        scenario("弱光", { light: 20, co2: 70, temp: 25 }),
        scenario("强光", { light: 80, co2: 70, temp: 25 }),
      ],
    ),
    chapter(
      "CO₂ 的限制",
      "增加一种资源不一定无限提高速率，另一种资源可能成为限制。",
      "保持光照充足，比较低与高 CO₂ 供给。",
      ["co2"],
      [
        scenario("CO₂ 较低", { light: 80, co2: 20, temp: 25 }),
        scenario("CO₂ 较高", { light: 80, co2: 80, temp: 25 }),
      ],
    ),
    chapter(
      "温度与模型边界",
      "温度响应是用于理解限制因素的简化曲线，不代表所有植物的适温。",
      "固定光照与 CO₂，对照三个温度并记录相对速率。",
      ["temp"],
      [
        scenario("10°C", { temp: 10 }),
        scenario("25°C", { temp: 25 }),
        scenario("40°C", { temp: 40 }),
      ],
    ),
    chapter(
      "共同限制与对照曲线",
      "光照充足也不能替代 CO₂。这个定性模型将光照、CO₂ 和温度的响应相乘，多个因素共同影响总光合速率。",
      "先在低 CO₂ 下保留曲线，再仅增加 CO₂ 供给，比较两条响应曲线。随后查看下方四组对照，固定温度，分别比较低、高 CO₂ 时光照20%到80%的速率增量；每次只点一个因素按钮，说明为什么不能把多因素差异归因于光照。",
      ["light", "co2"],
      [
        scenario("低 CO₂ 对照", { light: 80, co2: 10, temp: 25 }),
        scenario("高 CO₂ 对照", { light: 80, co2: 80, temp: 25 }),
      ],
    ),
    chapter(
      "控制变量与证据边界",
      "改变多个条件后出现速率差异，不能把差异全部归因于其中一个条件。模型最适温度预设为25°C，真实植物需实验测定。",
      "先记录25°C条件，再仅改变温度并记录。查看表中改变的因素；随后同时改变光照与温度，解释为什么不能把差异只归因于温度。扫描温度观察峰值，说明模型总光合与净光合的区别。",
      ["temp", "light"],
      [
        scenario("充足光照下测温", { light: 80, co2: 70, temp: 25 }),
        scenario("弱光下测温", { light: 20, co2: 70, temp: 25 }),
      ],
    ),
    chapter(
      "总光合、呼吸与补偿点",
      "植物的总光合作用与净光合不是同一概念；扣除呼吸消耗后，净收支可能为正、零或负。",
      "在下方收支图给定呼吸消耗，依次观察黑暗、弱光和补偿点；播放光照扫描，对照固定呼吸假设下的净光合曲线。不要把补偿点误解为所有生理活动停止。",
      ["light", "co2", "temp"],
      [
        scenario("光照收支对照", { light: 5, co2: 70, temp: 25 }),
        scenario("低CO₂下的收支", { light: 5, co2: 2, temp: 25 }),
      ],
    ),
  ],
  inheritance: [
    chapter(
      "配子与组合",
      "概率方格列出两亲本配子的可能组合，每格代表一个组合。",
      "比较纯合亲本与杂合亲本产生的子代组合。",
      ["parent1", "parent2"],
      [
        scenario("AA × aa", { parent1: 0, parent2: 2 }),
        scenario("Aa × aa", { parent1: 1, parent2: 2 }),
      ],
    ),
    chapter(
      "杂合子互交",
      "在完全显性等模型条件下，Aa×Aa 的基因型概率为 1:2:1。",
      "查看四格中的 AA、Aa、aa；切换基因型与显隐性性状统计，观察 1:2:1 如何合并成 3:1。分类切换不改变样本。",
      ["parent1", "parent2"],
      [
        scenario("Aa × Aa", { parent1: 1, parent2: 1 }),
        scenario("AA × Aa", { parent1: 0, parent2: 1 }),
      ],
    ),
    chapter(
      "用测交辨别",
      "与 aa 测交时，AA 与 Aa 产生不同的理论子代概率。",
      "只改变亲本一，比较两组概率，解释为何实际抽样会有波动。",
      ["parent1"],
      [
        scenario("AA 测交", { parent1: 0, parent2: 2 }),
        scenario("Aa 测交", { parent1: 1, parent2: 2 }),
      ],
    ),
    chapter(
      "少量后代的随机波动",
      "理论概率描述重复试验的规律，不能保证每四个子代恰好出现一个 AA、两个 Aa 和一个 aa。",
      "固定Aa×Aa，先抽样20个，观察aa累计频率曲线与25%理论线。再连续抽样，留意偏差是否每一步都缩小；清空重做，比较另一条轨迹。",
      ["parent1", "parent2"],
      [
        scenario("杂合子抽样", { parent1: 1, parent2: 1 }),
        scenario("测交抽样", { parent1: 1, parent2: 2 }),
      ],
    ),
    chapter(
      "样本量与概率证据",
      "大量独立抽样的频率通常更接近理论概率，但偏差不会随着每次抽样都单调减小。一次没有观察到隐性后代，不能直接证明亲本是 AA。",
      "先抽样，再对照 1、4、10、20 个均为显性时两种假设的预测。样本量滑条只改变假设计算，不增加后代；未见隐性不能直接证明 AA。",
      ["parent1", "parent2"],
      [
        scenario("Aa 测交证据", { parent1: 1, parent2: 2 }),
        scenario("AA 测交预测", { parent1: 0, parent2: 2 }),
      ],
    ),
    chapter(
      "从配子到受精",
      "每个亲本在一个常染色体基因位点有两个等位基因，配子只携带其中一个；结合后子代的两个等位基因分别来自两个亲本。",
      "先选组合并播放，追踪字母的来源；再对照 AA×aa 和 Aa×Aa，区分两个来源位置与两种配子。过程演示不增加随机样本。",
      ["parent1", "parent2"],
      [
        scenario("纯合亲本的配子", { parent1: 0, parent2: 2 }),
        scenario("杂合亲本的配子", { parent1: 1, parent2: 1 }),
      ],
    ),
    chapter(
      "显性后代中，谁是杂合子",
      "已知后代表现显性时，要在符合条件的组合中重新计算杂合子概率。Aa×Aa 的三个显性组合中，有两个是 Aa。",
      "先看全部组合，再选“只看显性后代”。对照分子和分母；切换 aa×aa，检查没有显性后代时为什么不能相除。",
      ["parent1", "parent2"],
      [
        scenario("Aa×Aa：观察条件", { parent1: 1, parent2: 1 }),
        scenario("Aa×aa：测交对照", { parent1: 1, parent2: 2 }),
        scenario("aa×aa：条件不可能", { parent1: 2, parent2: 2 }),
      ],
    ),
    chapter(
      "四个子代一定是三显一隐吗",
      "每个子代独立获得等位基因。3∶1 是显隐性概率比，不保证每四个后代恰好三显一隐。",
      "点选一个隐性个数，再逐个揭示其排列。比较某一排列与整类结果的概率；切换测交或纯合亲本，查看分布怎样改变。",
      ["parent1", "parent2"],
      [
        scenario("Aa×Aa：四个子代", { parent1: 1, parent2: 1 }),
        scenario("Aa×aa：一半概率", { parent1: 1, parent2: 2 }),
        scenario("aa×aa：全为隐性", { parent1: 2, parent2: 2 }),
      ],
    ),
  ],
  foodweb: [
    chapter(
      "逐级传递",
      "能量沿营养级传递时只有一部分进入下一级，其余用于代谢等过程。",
      "固定效率，比较生产者固定能量不同的两条链。",
      ["energy"],
      [
        scenario("3000 kJ", { energy: 3000, eff: 15 }),
        scenario("6000 kJ", { energy: 6000, eff: 15 }),
      ],
    ),
    chapter(
      "效率与累积差异",
      "同一传递效率会在多个营养级重复作用，能量不是逐级减去固定数。",
      "先保留10%情境为参照，再切换15%、20%，比较每级倍数；起点能量保持不变。",
      ["eff"],
      [
        scenario("10%", { energy: 5000, eff: 10 }),
        scenario("15%", { energy: 5000, eff: 15 }),
        scenario("20%", { energy: 5000, eff: 20 }),
      ],
    ),
    chapter(
      "能量账本",
      "能量流动具有方向，不能把模型中的未传递能量当成消失。",
      "记录两组起始能量与效率，逐级用乘法核对结果。",
      ["energy", "eff"],
      [
        scenario("低输入高效率", { energy: 3000, eff: 20 }),
        scenario("高输入低效率", { energy: 6000, eff: 10 }),
      ],
    ),
    chapter(
      "两级效率为什么相乘",
      "连续经过两个摄食环节，末级获得起点能量的 η²；15%×15%=2.25%，不是30%。",
      "保留10%为参照，再将效率改为20%；用两组对照核对初级消费者2倍、次级消费者4倍。",
      ["eff"],
      [
        scenario("两级各10%", { energy: 5000, eff: 10 }),
        scenario("两级各20%", { energy: 5000, eff: 20 }),
      ],
    ),
    chapter(
      "未传递的能量去了哪里",
      "没有进入下一营养级的能量并非全部消失或立即变成热，其中一部分进入碎屑和分解途径，也可能在统计时段内暂留本营养级。能量不会像物质一样在生态系统中循环。",
      "在去向图中依次追踪呼吸、碎屑分解与暂留本级；切换草→兔、兔→狐，比较未传递总量。分项份额未知，不能按线条估算。",
      ["energy", "eff"],
      [
        scenario("5000 kJ 的去向", { energy: 5000, eff: 15 }),
        scenario("10000 kJ 的去向", { energy: 10000, eff: 15 }),
      ],
    ),
    chapter(
      "多一次传递",
      "n个营养级之间有n−1次传递。在统一效率假设下，末级能量等于起点能量乘效率的n−1次方。",
      "逐级延长到五级，数一数传递次数；再比较10%和20%效率。用末环节放大条区分本次传递比例与占起点的比例。",
      ["energy", "eff"],
      [
        scenario("每次10%", { energy: 10000, eff: 10 }),
        scenario("每次20%", { energy: 10000, eff: 20 }),
      ],
    ),
  ],
  biodiversity: [
    chapter(
      "清点示例种",
      "四类生物各代表一个示例种；模型丰富度不代表真实地区物种调查。",
      "俯视样方，改变个体数，比较只含植物和含四个示例种的情境。",
      ["plants", "insects", "birds", "fungi"],
      [
        scenario("只有植物示例种", {
          plants: 12,
          insects: 0,
          birds: 0,
          fungi: 0,
        }),
        scenario("四个示例种", { plants: 8, insects: 8, birds: 8, fungi: 8 }),
      ],
      "top",
    ),
    chapter(
      "均匀度与优势种",
      "物种数相同，个体分配也可能很不均匀。",
      "比较均匀群落与优势种明显的群落，核对指数和数量。",
      ["plants", "insects", "birds", "fungi"],
      [
        scenario("均匀分配", { plants: 8, insects: 8, birds: 8, fungi: 8 }),
        scenario("优势种明显", { plants: 20, insects: 2, birds: 1, fungi: 1 }),
      ],
    ),
    chapter(
      "缺失一种生物",
      "减少一个示例种会改变丰富度与比例，但模型不预测真实生态后果。",
      "固定其余数量，对照有鸟和无鸟；可播放观察示意活动。",
      ["birds"],
      [
        scenario("有鸟", { plants: 8, insects: 8, birds: 8, fungi: 8 }),
        scenario("无鸟", { plants: 8, insects: 8, birds: 0, fungi: 8 }),
      ],
    ),
    chapter(
      "同样总数，不同分配",
      "保持总计数和示例种数相同，改变各示例种的比例，可以单独观察均匀程度对 Shannon 指数的影响。",
      "保存均匀样方为 A，再把四组计数改为20、4、4、4。核对总数仍为32，比较组成条与 H′。",
      ["plants", "insects", "birds", "fungi"],
      [
        scenario("32个均匀分配", { plants: 8, insects: 8, birds: 8, fungi: 8 }),
        scenario("32个偏向植物", {
          plants: 20,
          insects: 4,
          birds: 4,
          fungi: 4,
        }),
      ],
      "top",
    ),
    chapter(
      "数量翻倍，比例不变",
      "四组计数同时翻倍，物种数和比例都不变，本模型的 Shannon 指数也不变。因此不能把个体更多直接等同于多样性更高。",
      "保存各4个的样方，再选择各8个；在下方对照图切换“按计数比较”和“按占比比较”。解释为什么计数条加倍，但占比条与 H′不变。",
      ["plants", "insects", "birds", "fungi"],
      [
        scenario("每种4个", { plants: 4, insects: 4, birds: 4, fungi: 4 }),
        scenario("每种8个", { plants: 8, insects: 8, birds: 8, fungi: 8 }),
      ],
      "top",
    ),
  ],
  seasons: [
    chapter(
      "公转位置与四季",
      "地轴倾斜与公转共同造成太阳直射纬度的周期变化。",
      "比较四个近似节气位置，旋转观察地轴方向。",
      ["day"],
      [
        scenario("春分附近", { day: 0 }),
        scenario("夏至附近", { day: 91 }),
        scenario("秋分附近", { day: 183 }),
        scenario("冬至附近", { day: 274 }),
      ],
    ),
    chapter(
      "南北半球对照",
      "相同公转位置，南北半球的昼长变化方向相反。",
      "固定北半球夏至附近，比较南北纬 40°。",
      ["lat"],
      [
        scenario("北纬 40°", { day: 91, lat: 40 }),
        scenario("南纬 40°", { day: 91, lat: -40 }),
      ],
    ),
    chapter(
      "高纬度昼长",
      "纬度越高，季节性昼长差异通常越明显；极圈内可能出现极昼极夜。",
      "在下方五纬度昼夜带中切换春分、夏至和冬至；播放公转，观察赤道与南北高纬度的差异。点击纬度同步查看主图与全年曲线，解释极昼、极夜平台。",
      ["lat", "day"],
      [
        scenario("赤道夏至", { day: 91, lat: 0 }),
        scenario("北纬 70° 夏至", { day: 91, lat: 70 }),
        scenario("北纬 70° 冬至", { day: 274, lat: 70 }),
      ],
    ),
    chapter(
      "春秋分：昼长相近，高度不同",
      "忽略大气折射等因素，春秋分各纬度昼长约12小时，但正午太阳高度仍随纬度改变。昼长相同不代表太阳高度相同。",
      "固定春分位置，对照赤道与北纬60°，同时读取昼长和正午高度。",
      ["lat", "day"],
      [
        scenario("赤道春分", { day: 0, lat: 0 }),
        scenario("北纬60°春分", { day: 0, lat: 60 }),
      ],
    ),
    chapter(
      "读一整年的昼长曲线",
      "对称南北纬度的昼长曲线季节相反；赤道附近变化小，高纬度变化大。气温还受海陆、海拔等条件影响，不能仅用昼长换算。",
      "播放公转观察选日线，或点按全年曲线选日。比较北纬30°与70°，寻找高纬度平台对应的极昼、极夜。",
      ["lat", "day"],
      [
        scenario("北纬30°全年", { day: 0, lat: 30 }),
        scenario("北纬70°全年", { day: 91, lat: 70 }),
      ],
    ),
    chapter(
      "正午日影与太阳高度",
      "同一根竖杆在水平地面的正午影长随太阳高度改变；不能把昼长相同理解为影长相同。",
      "固定1m杆，比较北纬40°春分、夏至和冬至；再播放公转观察影长。选择赤道春分观察零影长，改变杆高验证比例。",
      ["day", "lat"],
      [
        scenario("北纬40°春分", { day: 0, lat: 40 }),
        scenario("北纬40°夏至", { day: 91, lat: 40 }),
        scenario("北纬40°冬至", { day: 274, lat: 40 }),
        scenario("赤道春分直射", { day: 0, lat: 0 }),
      ],
    ),
  ],
  daynight: [
    chapter(
      "朝向太阳的一侧",
      "球面受光的一侧为昼，背光的一侧为夜。自转让地点交替进入两侧。",
      "切换半周前后，并拖动自转时间观察昼夜边界。",
      ["hour"],
      [scenario("转动起点", { hour: 0 }), scenario("半周后", { hour: 12 })],
    ),
    chapter(
      "一周的周期",
      "这个简化模型以 24 小时为一周，时间不是任意地点的当地钟表时刻。",
      "比较 0、6、12、18 小时的位置，再连续播放。",
      ["hour"],
      [
        scenario("0 h", { hour: 0 }),
        scenario("6 h", { hour: 6 }),
        scenario("12 h", { hour: 12 }),
        scenario("18 h", { hour: 18 }),
      ],
    ),
    chapter(
      "纬度与观察点",
      "不同纬度的点沿不同大小的纬线圈运动；本主题与四季主题的条件不同。",
      "保持相同时间，比较赤道和高纬度观察点。",
      ["lat", "hour"],
      [
        scenario("赤道", { lat: 0, hour: 8 }),
        scenario("北纬 60°", { lat: 60, hour: 8 }),
        scenario("南纬 60°", { lat: -60, hour: 8 }),
      ],
    ),
    chapter(
      "晨昏线与地平线",
      "观察地点穿过晨昏线时，理想点状太阳位于当地地平线上。太阳高度由负变正是日出，由正变负是日落。",
      "依次选择6 h、12 h和18 h，核对地球上的观察点与一天太阳高度曲线。",
      ["hour", "lat"],
      [
        scenario("日出交界", { hour: 6, lat: 30 }),
        scenario("正午", { hour: 12, lat: 30 }),
        scenario("日落交界", { hour: 18, lat: 30 }),
      ],
    ),
    chapter(
      "自转模型不等于四季模型",
      "本主题固定太阳直射赤道，设定纬度昼夜各12小时。要研究季节性昼长差异，需要在公转主题中改变太阳直射纬度。",
      "固定正午，比较赤道和北纬60°的曲线峰值；再选择日出，核对两处都在地平线。",
      ["lat", "hour"],
      [
        scenario("赤道正午", { hour: 12, lat: 0 }),
        scenario("北纬60°正午", { hour: 12, lat: 60 }),
      ],
    ),
    chapter(
      "经度与地方时",
      "同一时刻，偏东的经线先转到朝向太阳的位置；经度每相差15°，理想地方太阳时相差1小时。",
      "对照面板先选向东45°，核对相差3小时；再让B到正午，观察A的时钟。将A调到23时，观察跨零点的日序提示。",
      ["hour", "lat"],
      [
        scenario("同一时刻比较", { hour: 9, lat: 30 }),
        scenario("跨过地方时零点", { hour: 23, lat: 30 }),
      ],
    ),
  ],
  water: [
    chapter(
      "降水的分配",
      "本模型将降水分为下渗、蒸散与径流，不计储水变化。",
      "固定分配比例，对照两种降水量；在下方水量分流图逐项聚焦径流、下渗、蒸散，核对带宽和三项之和。",
      ["rain"],
      [
        scenario("降水 50 mm", { rain: 50, infil: 40, evap: 15 }),
        scenario("降水 150 mm", { rain: 150, infil: 40, evap: 15 }),
      ],
    ),
    chapter(
      "下渗与径流",
      "降水与蒸散相同时，更多水下渗会减少地表径流。",
      "比较较低和较高下渗比例，观察水量读数变化。",
      ["infil"],
      [
        scenario("下渗较少", { rain: 100, infil: 20, evap: 15 }),
        scenario("下渗较多", { rain: 100, infil: 70, evap: 15 }),
      ],
    ),
    chapter(
      "蒸散与水量平衡",
      "水量守恒要求各分量之和与输入一致；比例不是实际气象预测。",
      "固定降水和下渗，仅改变蒸散，再自行记录验证。",
      ["evap", "rain"],
      [
        scenario("蒸散 5%", { rain: 100, infil: 40, evap: 5 }),
        scenario("蒸散 20%", { rain: 100, infil: 40, evap: 20 }),
      ],
    ),
    chapter(
      "同一场雨，两种下渗条件",
      "把下渗比例作为人为设定的情境条件，比较相同降水的分配。植被显隐仅改变画面，不自动改变下渗。",
      "保留下渗20%的状态为对照A，再把下渗滑块调到70%，检查径流减少量是否等于下渗增加量。",
      ["infil"],
      [
        scenario("低下渗情境", { rain: 100, infil: 20, evap: 10 }),
        scenario("高下渗情境", { rain: 100, infil: 70, evap: 10 }),
      ],
      "front",
    ),
    chapter(
      "比例相同，水量不同",
      "分配比例相同不代表水量相同。本模型中降水加倍，各分量也加倍；它没有描述土壤饱和、洪峰或滞后过程。",
      "先保留50mm降水的对照，再把降水调到100mm。用面积按钮比较同样雨深覆盖不同面积的体积；切换升与立方米核对换算，最后设为0验证输入与输出。",
      ["rain"],
      [
        scenario("降水50mm", { rain: 50, infil: 40, evap: 10 }),
        scenario("降水100mm", { rain: 100, infil: 40, evap: 10 }),
        scenario("无降水输入", { rain: 0, infil: 40, evap: 10 }),
      ],
    ),
    chapter(
      "铺装与透水地表",
      "同样面积、同样降水，地表条件会影响水量分配。本节用下渗10%和70%的两种假设地表进行对照，蒸散均为10%。",
      "在下方切换全部铺装与全部透水，观察地块颜色、径流条和三维路径；核对少掉的径流是否转为下渗。",
      ["infil"],
      [
        scenario("全部铺装", { rain: 100, infil: 10, evap: 10 }),
        scenario("全部透水", { rain: 100, infil: 70, evap: 10 }),
      ],
      "front",
    ),
    chapter(
      "校园地表改造",
      "将部分铺装改为透水地表，用面积加权求整块地表的下渗比例。总面积和降水保持相同；格子展示面积占比，不表示真实校园布局。",
      "把透水面积从25%提高到75%，观察100格地块与水量条。播放可连续扫描比例；手动调整会暂停。",
      ["infil"],
      [
        scenario("透水面积25%", { rain: 100, infil: 25, evap: 10 }),
        scenario("透水面积75%", { rain: 100, infil: 55, evap: 10 }),
      ],
    ),
    chapter(
      "径流目标挑战",
      "在假设条件下，尝试让径流不超过30mm。降雨变大时，单靠替换地表不一定足够；这不是实际排水设计标准。",
      "调整透水面积使方案达标，再查看刚好达标的边界。依次尝试50、100、200mm降水，解释为什么有的情境无法达标。",
      ["rain", "infil"],
      [
        scenario("降水50mm挑战", { rain: 50, infil: 40, evap: 10 }),
        scenario("降水100mm挑战", { rain: 100, infil: 40, evap: 10 }),
        scenario("降水200mm挑战", { rain: 200, infil: 40, evap: 10 }),
      ],
    ),
    chapter(
      "径流输入与调蓄",
      "相同径流总量在不同历时输入同一个调蓄单元，出流峰值会不同。输入停止后，暂存水量仍可继续流出。",
      "先固定0.5小时输入作对照，再切到4小时，比较两条出流曲线和峰值；定位参照峰值与输入刚结束，核对累计输入=累计出流+暂存水量。",
      ["rain", "infil", "evap"],
      [
        scenario("100mm降水的径流", { rain: 100, infil: 40, evap: 10 }),
        scenario("无降水输入", { rain: 0, infil: 40, evap: 10 }),
      ],
    ),
  ],
  plates: [
    chapter(
      "张裂边界",
      "相邻板块相对远离，模型用几何运动显示边界关系。",
      "应用张裂情境，从起点播放并观察裂谷变化。",
      ["progress"],
      [
        scenario("张裂起点", { type: 0, progress: 0 }),
        scenario("张裂后", { type: 0, progress: 100 }),
      ],
    ),
    chapter(
      "大陆碰撞",
      "大陆板块相向运动可造成挤压与隆起，动画不是实际地质时间尺度。",
      "比较碰撞前后，再调整进度观察中间过程。",
      ["progress"],
      [
        scenario("碰撞前", { type: 1, progress: 0 }),
        scenario("碰撞后", { type: 1, progress: 100 }),
      ],
    ),
    chapter(
      "水平错动",
      "转换边界两侧以水平相对滑动为主要运动方式。",
      "俯视比较错动前后，再切换三种边界识别运动方向。",
      ["type", "progress"],
      [
        scenario("错动前", { type: 2, progress: 0 }),
        scenario("错动后", { type: 2, progress: 100 }),
      ],
      "top",
    ),
    chapter(
      "拉伸与挤压的地层柱",
      "同一材料柱在模型中拉伸变薄、挤压增厚，局部宽度比与厚度比互为倒数。地表起伏不等同于整层厚度。",
      "比较张裂和碰撞，再在下方选择靠近边界、板块中部与远离边界，观察变形强弱和面积比。",
      ["type", "progress"],
      [
        scenario("张裂地层柱", { type: 0, progress: 100 }),
        scenario("碰撞地层柱", { type: 1, progress: 100 }),
      ],
      "front",
    ),
    chapter(
      "用地表标记识别错动",
      "地表金线是跨越边界的材料标记。水平错动时两侧的标记错开，但该模型没有拉伸或压缩地层柱。",
      "俯视对照错动前后，再播放运动；切换地层柱位置，验证宽度和厚度比均为1。金线不是现实中的道路或断层测量数据。",
      ["progress"],
      [
        scenario("标记已错开", { type: 2, progress: 100 }),
        scenario("标记原本相连", { type: 2, progress: 0 }),
      ],
      "top",
    ),
  ],
  volcano: [
    chapter(
      "外形与内部通道",
      "剖面展示岩浆储集区、通道与火山口之间的空间联系。",
      "切换完整外观和内部剖面，旋转观察通道连接。",
      ["cut"],
      [scenario("完整外观", { cut: 0 }), scenario("内部剖面", { cut: 1 })],
    ),
    chapter(
      "两种喷发形态",
      "溢流式与爆发式用于对比流动与喷出物的可见形态，不覆盖所有火山类型。",
      "两种情境均定位到8秒，先对照喷出物，再播放观察；手动更改形态会暂停并保留当前时刻。",
      ["type"],
      [
        scenario("溢流式", { type: 0, intensity: 3, cut: 0 }, 8),
        scenario("爆发式", { type: 1, intensity: 3, cut: 0 }, 8),
      ],
    ),
    chapter(
      "演示强度与过程",
      "强度参数只控制教学表现，不是火山爆发指数或灾害预测。",
      "分别播放较弱和较强的演示，暂停观察喷出物与剖面。",
      ["intensity", "cut"],
      [
        scenario("较弱演示", { type: 1, intensity: 1, cut: 1 }, 8),
        scenario("较强演示", { type: 1, intensity: 5, cut: 1 }, 8),
      ],
    ),
    chapter(
      "分开看三类喷发现象",
      "熔岩沿地表流动，较大碎屑沿抛射路径运动，火山灰羽流向上扩散。分层观察可减少遮挡，但并不表示实际过程彼此独立。",
      "三组情境都停在8秒：分别观察熔岩、碎屑与火山灰，再用下方显示按钮组合它们，核对各自的位置和运动方式。",
      ["showLava", "showAsh", "showEjecta"],
      [
        scenario(
          "只看熔岩",
          {
            type: 1,
            cut: 0,
            intensity: 3,
            showLava: 1,
            showAsh: 0,
            showEjecta: 0,
          },
          8,
        ),
        scenario(
          "只看碎屑",
          {
            type: 1,
            cut: 0,
            intensity: 3,
            showLava: 0,
            showAsh: 0,
            showEjecta: 1,
          },
          8,
        ),
        scenario(
          "只看火山灰",
          {
            type: 1,
            cut: 0,
            intensity: 3,
            showLava: 0,
            showAsh: 1,
            showEjecta: 0,
          },
          8,
        ),
      ],
    ),
    chapter(
      "从流动到结壳",
      "熔岩流推进后表面逐渐变暗、出现结壳外观。颜色是定性示意，不能直接换算温度；表面变暗也不代表内部已经冷却。",
      "对照同一溢流情境的8秒与20秒，再回到16.5秒观察过渡。播放时关注流迹位置与表面颜色，区分地表流动和外观变化。",
      ["cut", "showLava"],
      [
        scenario(
          "流动阶段 · 8s",
          {
            type: 0,
            cut: 0,
            intensity: 3,
            showLava: 1,
            showAsh: 0,
            showEjecta: 0,
          },
          8,
        ),
        scenario(
          "结壳流迹 · 20s",
          {
            type: 0,
            cut: 0,
            intensity: 3,
            showLava: 1,
            showAsh: 0,
            showEjecta: 0,
          },
          20,
        ),
      ],
    ),
  ],
  earthquake: [
    chapter(
      "震源与震中",
      "震源位于地下，震中是其在地表的对应位置；震源深度是竖直距离。",
      "固定震中距，比较浅与深震源的位置。",
      ["depth"],
      [
        scenario("深度 5 km", { depth: 5, distance: 40 }),
        scenario("深度 25 km", { depth: 25, distance: 40 }),
      ],
    ),
    chapter(
      "P 波与 S 波",
      "同一介质模型中 P 波比 S 波传播更快，台站先记录到 P 波。P 波的质点沿传播方向振动，S 波的质点垂直于传播方向振动。",
      "播放并在两次到达之间暂停，对照波前与台站。观察下方实心质点与空心平衡位置：波前向前，质点在原位附近振动。",
      ["distance"],
      [
        scenario("近台站", { depth: 15, distance: 20 }),
        scenario("远台站", { depth: 15, distance: 70 }),
      ],
    ),
    chapter(
      "到时差与距离",
      "均匀介质中到时差与传播路程有关；单个台站不能独立确定完整震源位置。",
      "固定深度，仅改变震中距，记录两类波的到时差。",
      ["distance", "depth"],
      [
        scenario("30 km", { depth: 15, distance: 30 }),
        scenario("60 km", { depth: 15, distance: 60 }),
      ],
    ),
    chapter(
      "停在两次到达之间",
      "P波到达后、S波到达前，台站只接收到先到的P波。路程—时间图的两条直线与台站距离线相交于不同时间。",
      "点击“两次到站之间”，对照三维波前、台站提示和图中交点；再分别定位到P波和S波刚到达的时刻。",
      ["distance"],
      [
        scenario("较远台站", { depth: 20, distance: 60 }),
        scenario("较近台站", { depth: 20, distance: 20 }),
      ],
      "station",
    ),
    chapter(
      "单台站定位的边界",
      "到时差约束震源到台站的路程，不能单独给出深度与方位。两种深度和震中距的组合可能具有相同震源距。",
      "比较两种50km震源距：30km深度与40km震中距、14km深度与48km震中距。观察剖面改变，但两类波到时不变。",
      ["depth", "distance"],
      [
        scenario("深30 · 距40", { depth: 30, distance: 40 }),
        scenario("深14 · 距48", { depth: 14, distance: 48 }),
      ],
      "front",
    ),
    chapter(
      "多个台站怎样缩小范围",
      "已知深度、均匀介质的理想条件下，到时差可换算为震源距，再换算成地表距离圆。逐个加入台站，观察候选位置怎样减少。",
      "在下方定位图中依次加入 A、B、C 台站；比较两个交点，再用第三个圆判断。再用三台站到时图定位各站P、S波到达，比较接收状态。保持台站位置、改变深度，观察到时差改变而地表圆不变。",
      ["depth", "distance"],
      [
        scenario("浅源对照", { depth: 5, distance: 40 }),
        scenario("深源对照", { depth: 25, distance: 40 }),
      ],
      "front",
    ),
  ],
};
