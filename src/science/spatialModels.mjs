// Teaching geometries. Dimensions are normalized, not engineering dimensions.
export const spatialParts = {
  rocket: [
    ["payload", "载荷", "卫星等任务载荷位于整流罩内部。"],
    ["fairing", "整流罩", "在稠密大气上升阶段保护载荷，任务结束后抛离。"],
    ["upper", "二级", "一级分离后继续加速，具有自己的贮箱和发动机。"],
    ["oxidizer", "一级氧化剂贮箱", "独立携带氧化剂；与燃料分开储存。"],
    ["fuel", "一级燃料贮箱", "燃料通过供给系统进入燃烧室。"],
    ["engine", "一级发动机", "推进剂反应后，气体经喷管向后加速排出。"],
  ],
  volcano: [
    ["surface", "火山锥", "多次喷发的熔岩和碎屑物可以逐渐堆积成山体。"],
    [
      "chamber",
      "岩浆储存区",
      "地下可能有多个岩浆储存区，不是一个通向地心的大空洞。",
    ],
    ["conduit", "岩浆通道", "岩浆通过裂隙和通道向地表移动。"],
    ["vent", "火山口", "火山物质从这里或侧面的裂隙喷出。"],
  ],
  "flower-fruit": [
    ["petals", "花瓣", "吸引传粉者等作用因植物而异。"],
    ["stamens", "雄蕊", "花药产生花粉。"],
    ["stigma", "柱头和花柱", "花粉落到柱头后，合适条件下萌发花粉管。"],
    ["ovary", "子房", "受精后通常发育成果实；某些植物也有其他花部参与。"],
    ["ovules", "胚珠", "胚珠通常发育为种子。"],
  ],
  eye: [
    ["wall", "眼球壁", "保持眼球形态并围成内部空间。"],
    ["cornea", "角膜", "光进入眼睛时的重要折射界面。"],
    ["lens", "晶状体", "形状调整参与对不同距离物体的调焦。"],
    ["retina", "视网膜", "感光细胞把光转化为生物电信号。"],
    ["nerve", "视神经", "把视觉信息送往大脑。"],
  ],
  "tape-measure": [
    ["case", "外壳", "支承中心轴，并容纳尺带与卷簧。"],
    ["spring", "卷簧", "拉出尺带时储存弹性势能。"],
    ["reel", "尺带盘", "尺带绕卷在轴附近。"],
    ["blade", "尺带", "弧形截面帮助尺带在伸出时保持一定挺度。"],
    ["lock", "锁止件", "按压后限制尺带移动，释放后才回收。"],
  ],
  "air-conditioner": [
    [
      "case",
      "机组外壳",
      "外壳包围机组结构；此模型拉开间距展示循环连接，非施工布局。",
    ],
    ["indoor", "室内换热器", "制冷模式下，制冷剂在这里吸收室内热量。"],
    ["compressor", "压缩机", "消耗电能，提高制冷剂蒸气的压力。"],
    ["outdoor", "室外换热器", "向室外放出吸收的热量和输入的能量。"],
    ["valve", "节流装置", "降低压力，为下一次吸热创造条件。"],
    [
      "pipes",
      "制冷剂管路",
      "制冷剂在闭合回路内循环，不是把室外冷风直接吹进来。",
    ],
  ],
  airplane: [
    ["body", "机身", "容纳乘员或货物，承接机翼等结构。"],
    ["cabin", "舱内结构", "剖开机身可见舱内地板与座位位置，布局为通用示意。"],
    ["wing", "机翼", "改变周围气流与压力分布，产生升力。"],
    ["engines", "发动机", "提供推力，抵抗阻力并维持需要的运动。"],
    ["tail", "尾翼", "帮助保持稳定并控制姿态。"],
  ],
  "wind-turbine": [
    ["housing", "机舱外壳", "保护传动与发电结构；展开后可追踪主轴至发电机。"],
    ["blades", "叶片", "气流与叶片作用，产生使转子旋转的力矩。"],
    ["shaft", "主轴", "把转子的转动传给传动系统。"],
    ["gearbox", "齿轮箱", "本模型为带齿轮箱机型，用来改变转速和力矩。"],
    ["generator", "发电机", "将机械能转化为电能。"],
    ["tower", "塔架", "支承机舱，并容纳电缆和检修通道。"],
  ],
};
export function buildSpatial(THREE, id, variant = "geared") {
  const root = new THREE.Group(),
    parts = {};
  const materials = [];
  const geometries = [];
  const mat = (color, metalness = 0.25) => {
    const m = new THREE.MeshStandardMaterial({
      color,
      metalness,
      roughness: 0.38,
    });
    materials.push(m);
    return m;
  };
  const add = (
    key,
    geometry,
    position,
    color,
    rotation = [0, 0, 0],
    shell = false,
  ) => {
    geometries.push(geometry);
    const m = new THREE.Mesh(geometry, mat(color));
    m.position.set(...position);
    m.rotation.set(...rotation);
    m.userData = { part: key, home: position, shell };
    m.castShadow = true;
    m.receiveShadow = true;
    root.add(m);
    (parts[key] ??= []).push(m);
    return m;
  };
  const box = (key, p, s, c, shell = false) =>
    add(key, new THREE.BoxGeometry(...s), p, c, [0, 0, 0], shell);
  const cylinder = (key, p, r, h, c, rot = [0, 0, 0], shell = false) =>
    add(key, new THREE.CylinderGeometry(r, r, h, 40), p, c, rot, shell);
  const ball = (key, p, r, c, scale = [1, 1, 1], shell = false) => {
    const m = add(
      key,
      new THREE.SphereGeometry(r, 40, 24),
      p,
      c,
      [0, 0, 0],
      shell,
    );
    m.scale.set(...scale);
    return m;
  };
  const tube = (key, points, r, c) => {
    const curve = new THREE.CatmullRomCurve3(
      points.map((p) => new THREE.Vector3(...p)),
    );
    return add(
      key,
      new THREE.TubeGeometry(curve, 48, r, 10, false),
      [0, 0, 0],
      c,
    );
  };
  if (id === "rocket") {
    cylinder("fuel", [0, -1.4, 0], 0.56, 1.8, 0xd8ad69);
    cylinder("oxidizer", [0, 0.05, 0], 0.56, 1.05, 0x8bb9d4);
    cylinder("fuel", [0, -1.4, 0], 0.63, 1.8, 0xdce3e6, [0, 0, 0], true);
    cylinder("oxidizer", [0, 0.05, 0], 0.63, 1.05, 0xdce3e6, [0, 0, 0], true);
    cylinder("upper", [0, 1.05, 0], 0.46, 0.45, 0xd8ad69);
    cylinder("upper", [0, 1.55, 0], 0.46, 0.45, 0x8bb9d4);
    add(
      "upper",
      new THREE.CylinderGeometry(0.1, 0.22, 0.3, 32),
      [0, 0.64, 0],
      0x47515d,
    );
    cylinder("upper", [0, 0.69, 0], 0.51, 0.13, 0x3c4c5b);
    add(
      "engine",
      new THREE.CylinderGeometry(0.17, 0.39, 0.65, 40),
      [0, -2.65, 0],
      0x47515d,
    );
    cylinder("engine", [0, -2.26, 0], 0.26, 0.2, 0x8794a1);
    box("payload", [0, 2.2, 0], [0.55, 0.55, 0.55], 0xe1bd68);
    box("payload", [0.48, 2.2, 0], [0.36, 0.45, 0.04], 0x294766);
    box("payload", [-0.48, 2.2, 0], [0.36, 0.45, 0.04], 0x294766);
    add(
      "fairing",
      new THREE.ConeGeometry(0.64, 1.2, 40),
      [0, 2.55, 0],
      0xe4e8e9,
      [0, 0, 0],
      true,
    );
    tube(
      "fuel",
      [
        [0.22, -0.6, 0.42],
        [0.22, -2.1, 0.42],
        [0, -2.4, 0],
      ],
      0.035,
      0xc6a569,
    );
    tube(
      "oxidizer",
      [
        [-0.28, 0.3, 0.43],
        [-0.28, -2.1, 0.43],
        [0, -2.4, 0],
      ],
      0.035,
      0x6ba4ca,
    );
  } else if (id === "volcano") {
    add(
      "surface",
      new THREE.ConeGeometry(2.4, 3.2, 64, 1, true, 0, Math.PI * 1.5),
      [0, 0, 0],
      0x735b49,
      [0, 0, 0],
      true,
    );
    ball("chamber", [0, -1.5, 0], 0.8, 0xe47a39, [1.5, 0.55, 1]);
    tube(
      "conduit",
      [
        [0, -1.5, 0],
        [0.2, -0.3, 0],
        [0, 1.5, 0],
      ],
      0.16,
      0xd85726,
    );
    cylinder("vent", [0, 1.5, 0], 0.31, 0.15, 0x4d3330);
  } else if (id === "flower-fruit") {
    cylinder("stigma", [0, 0.4, 0], 0.09, 1.4, 0x87ad67);
    ball("stigma", [0, 1.1, 0], 0.17, 0xe7bd68);
    ball("ovary", [0, -0.6, 0], 0.67, 0x8faf65, [1, 0.8, 1], true);
    for (let i = 0; i < 5; i++) {
      const a = (i * Math.PI * 2) / 5;
      ball(
        "petals",
        [Math.cos(a) * 1.1, 0.0, Math.sin(a) * 1.1],
        0.72,
        0xecc0cd,
        [0.8, 0.22, 1.2],
      );
      ball(
        "ovules",
        [Math.cos(a) * 0.25, -0.6, Math.sin(a) * 0.25],
        0.11,
        0xf0dca4,
      );
      cylinder(
        "stamens",
        [Math.cos(a) * 0.6, 0.5, Math.sin(a) * 0.6],
        0.025,
        0.7,
        0xe3c994,
      );
      ball(
        "stamens",
        [Math.cos(a) * 0.6, 0.9, Math.sin(a) * 0.6],
        0.1,
        0xc89445,
      );
    }
  } else if (id === "eye") {
    ball("wall", [0, 0, 0], 1.6, 0xeee8df, [1, 1, 1], true);
    ball("cornea", [0, 0, 1.5], 0.65, 0xa6d5df, [1, 1, 0.35]);
    ball("lens", [0, 0, 0.85], 0.45, 0xa7d8d8, [1, 1, 0.3]);
    add(
      "retina",
      new THREE.SphereGeometry(
        1.53,
        40,
        24,
        0,
        Math.PI * 2,
        Math.PI * 0.65,
        Math.PI * 0.35,
      ),
      [0, 0, 0],
      0xc47566,
      [Math.PI / 2, 0, 0],
    );
    tube(
      "nerve",
      [
        [0.3, 0, -1.4],
        [0.5, 0, -2.3],
        [0.9, 0, -2.7],
      ],
      0.19,
      0xd3af87,
    );
  } else if (id === "tape-measure") {
    box("case", [0, 0, 0], [2.4, 2.2, 0.9], 0xe0b754, true);
    cylinder("reel", [0, 0, 0], 0.85, 0.4, 0xc3c8cb, [Math.PI / 2, 0, 0]);
    const pts = Array.from({ length: 150 }, (_, i) => {
      const a = i * 0.18,
        r = 0.08 + i * 0.004;
      return [Math.cos(a) * r, Math.sin(a) * r, 0.28];
    });
    tube("spring", pts, 0.025, 0x5b6774);
    box("blade", [1.8, -0.7, 0], [2.8, 0.08, 0.5], 0xe5d595);
    box("lock", [0.8, -0.5, 0.1], [0.35, 0.4, 0.5], 0x343d48);
  } else if (id === "air-conditioner") {
    box("case", [-1.8, 0.8, 0], [1.9, 1.2, 1.1], 0xe0e5e3, true);
    box("case", [1.8, -0.5, 0], [1.8, 3.0, 1.1], 0xcfd8d7, true);
    box("indoor", [-1.8, 0.8, 0], [1.7, 1.05, 0.6], 0x9fc8d2);
    box("outdoor", [1.8, 0.2, 0], [1.5, 1.6, 0.7], 0xb9c0c1);
    for (let i = 0; i < 10; i++) {
      box("indoor", [-2.5 + i * 0.15, 0.8, 0.4], [0.035, 0.8, 0.05], 0x4e8f9a);
      box(
        "outdoor",
        [1.17 + i * 0.14, 0.3, 0.45],
        [0.035, 1.3, 0.05],
        0x9d7761,
      );
    }
    cylinder("compressor", [1.8, -1.3, 0], 0.35, 0.7, 0x445865);
    box("valve", [-1.8, -1.3, 0], [0.5, 0.3, 0.4], 0xa88a53);
    tube(
      "pipes",
      [
        [-1.8, 0.8, 0],
        [-0.7, 0.8, 0],
        [-0.7, -1.3, 0],
        [1.8, -1.3, 0],
        [2.9, -1.3, 0],
        [2.9, 0.3, 0],
        [1.8, 0.3, 0],
        [1.8, 1.8, 0],
        [-2.9, 1.8, 0],
        [-2.9, -1.3, 0],
        [-1.8, -1.3, 0],
        [-1.8, 0.8, 0],
      ],
      0.06,
      0xb77a56,
    );
  } else if (id === "airplane") {
    ball("body", [0, 0, 0], 1, 0xd7e0e4, [0.43, 0.45, 2.6], true);
    box("cabin", [0, -0.13, 0], [0.7, 0.04, 3.6], 0xa3b1b5);
    for (let i = 0; i < 6; i++)
      for (const x of [-0.2, 0.2]) {
        box("cabin", [x, 0, -1.2 + i * 0.45], [0.16, 0.12, 0.2], 0x567d8b);
        box("cabin", [x, 0.13, -1.3 + i * 0.45], [0.16, 0.23, 0.04], 0x567d8b);
      }
    box("wing", [0, -0.05, 0.1], [5.8, 0.1, 0.9], 0xa9bbc4);
    ball("engines", [-1.3, -0.4, 0.25], 0.38, 0x6c7b86, [0.8, 0.8, 1.8]);
    ball("engines", [1.3, -0.4, 0.25], 0.38, 0x6c7b86, [0.8, 0.8, 1.8]);
    box("tail", [0, 0.15, -1.9], [2.1, 0.1, 0.55], 0xc0ccd1);
    box("tail", [0, 0.7, -1.9], [0.1, 1.2, 0.7], 0x3d8291);
  } else if (id === "wind-turbine") {
    box("housing", [0, 0.9, -0.1], [1.55, 1.55, 2.2], 0xd8e1df, true);
    cylinder("tower", [0, -1.1, 0], 0.2, 3.7, 0xd8dfe2);
    if (variant === "direct") {
      cylinder("generator", [0, 0.9, 0], 0.7, 0.8, 0xbb9867, [
        Math.PI / 2,
        0,
        0,
      ]);
    } else {
      box("gearbox", [0, 0.9, 0.15], [0.55, 0.6, 0.8], 0x848f98);
      box("generator", [0, 0.9, -0.7], [0.7, 0.6, 0.7], 0xbb9867);
    }
    cylinder("shaft", [0, 0.9, 0.8], 0.13, 1.4, 0x738490, [Math.PI / 2, 0, 0]);
    for (let i = 0; i < 3; i++) {
      const a = (i * Math.PI * 2) / 3;
      const m = ball(
        "blades",
        [Math.sin(a) * 1.05, 0.9 + Math.cos(a) * 1.05, 1.35],
        1,
        0xe5e9e8,
        [0.15, 1.1, 0.07],
      );
      m.rotation.z = -a;
      m.userData.bladeAngle = -a;
    }
    ball("blades", [0, 0.9, 1.35], 0.23, 0xaebfc6);
  }
  return {
    root,
    parts,
    dispose() {
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
    },
  };
}
