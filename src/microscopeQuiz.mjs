export const microscopeQuiz = [
  {
    id: "magnification",
    prompt: "目镜为 10×，物镜为 40×，总放大倍数是多少？",
    choices: ["40×", "50×", "400×"],
    answer: 2,
    explanation: "总放大倍数 = 目镜倍数 × 物镜倍数，因此为 10 × 40 = 400 倍。",
    chapter: 4,
  },
  {
    id: "field",
    prompt: "同一目镜下，物镜从 10× 换为 40×，视野直径变为原来的多少？",
    choices: ["1/4", "1/16", "4 倍"],
    answer: 0,
    explanation:
      "视野直径与物镜倍率成反比，所以直径是原来的 1/4；视野面积才是原来的 1/16。",
    chapter: 4,
  },
  {
    id: "motion",
    prompt: "视野中的物像偏在左下方，要移到中央，玻片应向哪里移动？",
    choices: ["右上方", "左下方", "左上方"],
    answer: 1,
    explanation: "玻片向左下方移动时，倒像向右上方移动，逐渐回到视野中央。",
    chapter: 3,
  },
  {
    id: "focus",
    prompt: "换到高倍物镜后，物像略微模糊，应优先怎样操作？",
    choices: ["大幅转动粗准焦", "直接移动目镜", "小幅调整细准焦"],
    answer: 2,
    explanation:
      "高倍下应以细准焦微调。先在低倍下找到目标并居中，再换高倍，更容易观察。",
    chapter: 2,
  },
  {
    id: "light",
    prompt: "光源关闭后视野变暗，首先应检查什么？",
    choices: ["把物镜换到最高倍", "照明开关与亮度", "重新计算总放大倍数"],
    answer: 1,
    explanation: "先确认照明已开启并调至适当亮度。倍率和调焦不能替代照明。",
    chapter: 1,
  },
  {
    id: "photo",
    prompt:
      "载入未标定的本地显微照片并数字放大 2×，能否直接用它精确测量细胞长度？",
    choices: [
      "不能，需要可靠的尺度标定",
      "能，数字倍率就是光学倍率",
      "能，所有照片比例尺都相同",
    ],
    answer: 0,
    explanation:
      "未标定照片缺少可靠的像素与实际长度换算关系；数字缩放也不会增加原始光学分辨率。",
    chapter: 5,
  },
];
