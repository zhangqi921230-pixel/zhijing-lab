const field = (key, label, min, max, step, unit = "") => ({
  key,
  label,
  min,
  max,
  step,
  unit,
});
const chapter = (title, text, task, preset, time = 2) => ({
  title,
  text,
  task,
  preset,
  time,
});
const polar = (shape, petals = 3, radius = 2) => ({ shape, petals, radius });
const shot = (angle, height = 0, gravity = 9.8, speed = 18) => ({
  angle,
  height,
  gravity,
  speed,
});
export const visualLessons = [
  {
    id: "polar",
    subject: "math",
    title: "极坐标与玫瑰线",
    description: "角度决定方向，带符号的极径决定位置；每一点都由公式生成。",
    params: [
      field("shape", "曲线类型：0 圆 / 1 心形 / 2 玫瑰", 0, 2, 1),
      field("radius", "尺度 a", 0.5, 3, 0.1),
      field("petals", "玫瑰线参数 n", 1, 6, 1),
    ],
    chapters: [
      chapter(
        "恒定极径画出圆",
        "极径 r=a 不变，角度旋转一周，描迹点形成圆。",
        "播放并观察射线与点；改变尺度，看圆半径变化。",
        polar(0),
      ),
      chapter(
        "心形线的远点与尖点",
        "r=a(1+cosθ)。θ=0 时 r=2a；θ=π 时 r=0。",
        "拖动进度到 3 秒，观察曲线回到极点。",
        polar(1),
        3,
      ),
      chapter(
        "三瓣玫瑰与负极径",
        "r=a cos(3θ)。极径为负时，点位于射线的反方向。",
        "观察虚线射线和实线极径，解释点为何走到另一侧。",
        polar(2, 3),
        1,
      ),
      chapter(
        "四瓣玫瑰与偶数参数",
        "r=a cos(2θ) 形成四瓣；整数 n 为偶数时有 2n 瓣，奇数时有 n 瓣。",
        "比较 n=2、3、4；留意奇数情形转一周会重复描绘。",
        polar(2, 2),
        4,
      ),
      chapter(
        "曲线的缩放与对称",
        "只改变 a，所有点到极点的距离按同一比例缩放，瓣数不变。",
        "固定 n=5，把 a 从 1 调到 2，比较固定网格中的大小。",
        polar(2, 5, 1),
        5,
      ),
    ],
    formula: "圆 r=a；心形 r=a(1+cosθ)；玫瑰 r=a cos(nθ)",
    assumption:
      "二维解析曲线，横纵同尺度；6 秒对应 θ 从 0 到 2π。虚线表示正向射线；负极径沿相反方向。曲线类型用按钮选择；n 只作用于玫瑰线。参数仅在本页保留。",
  },
  {
    id: "ballistics",
    subject: "physics",
    title: "抛体运动与轨迹对比",
    description: "同一比例尺下观察运动合成，实线为当前轨迹，虚线为互余角参考。",
    params: [
      field("speed", "初速度", 5, 25, 1, "m/s"),
      field("angle", "抛射角", 0, 90, 1, "°"),
      field("height", "发射高度", 0, 15, 0.5, "m"),
      field("gravity", "重力加速度", 1.6, 12, 0.1, "m/s²"),
    ],
    chapters: [
      chapter(
        "平抛：水平与竖直分解",
        "平抛初始竖直速度为零，水平匀速，竖直自由落体。",
        "播放并比较等时间间隔轨迹点：水平等距，竖直间距逐渐增大。",
        shot(0, 10),
      ),
      chapter(
        "斜抛：上升与下降",
        "上升时竖直速度减小，到最高点为零；此时水平速度仍存在。",
        "逐步拖动进度，在最高点观察速度分量。",
        shot(45),
        3,
      ),
      chapter(
        "互余角为何同射程",
        "同速、同高发射和落地、忽略阻力时，30° 与 60° 射程相等，但高度和飞行时间不同。",
        "打开辅助线，比较实线与虚线轨迹；改变高度后检验等射程条件。",
        shot(30),
        4,
      ),
      chapter(
        "竖直上抛的特殊情况",
        "90° 时水平速度为零，轨迹退化为竖直线。最高点速度瞬时为零，加速度仍向下。",
        "观察水平位移读数，再将角度减小至 85°。",
        shot(90),
        3,
      ),
      chapter(
        "重力变小会发生什么？",
        "初速度不变时，重力越小，飞行时间和最大高度通常越大。视图保持横纵同尺度并自动容纳轨迹。",
        "将 g 从 1.6 调回 9.8，对照射程与飞行时间，不要只比较屏幕长度。",
        shot(45, 0, 1.6),
        2,
      ),
    ],
    formula: "x=v₀cosα·t；y=h+v₀sinα·t−½gt²",
    assumption:
      "质点、均匀重力、无空气阻力、水平地面；到地面停止，不模拟反弹。6 秒演示映射完整飞行，实际时间见读数。速度箭头使用独立比例，不与位置坐标混用；互余角轨迹不是第二个同步物体。",
  },
];
