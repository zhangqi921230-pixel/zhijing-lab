export function contourQuestions(peak, basin) {
  const high = Math.round(peak),
    low = Math.round(basin),
    difference = high - low;
  return [
    {
      id: "slope",
      chapter: 3,
      view: "top",
      question: "同一幅地图中，等高距相同时，等高线越密集的地方有什么特点？",
      options: ["海拔一定越高", "河流一定越宽", "坡度越陡"],
      correct: 2,
      explanation:
        "相同水平距离内，高程变化越大，坡度越陡。疏密本身不能确定海拔。",
    },
    {
      id: "interval",
      chapter: 3,
      view: "top",
      question: "连续三条等高线标为 450 m、500 m、550 m，等高距是多少？",
      options: ["100 m", "50 m", "500 m"],
      correct: 1,
      explanation: "等高距是相邻等高线的高度差：500 − 450 = 50 m。",
    },
    {
      id: "summit",
      chapter: 4,
      view: "perspective",
      question:
        "一组闭合等高线，外围为 700 m，向内依次为 800 m、900 m，表示哪种地形？",
      options: ["山顶", "洼地", "无法根据数值判断"],
      correct: 0,
      explanation: "高程向闭合圈内部增大，表示中间高、四周低的山顶。",
    },
    {
      id: "basin",
      chapter: 4,
      view: "basin",
      question:
        "观察西南侧盆地。如果闭合等高线外围为 400 m，内侧为 300 m，应怎样判断？",
      options: ["中间高、四周低", "中间低、四周高", "所有点海拔相同"],
      correct: 1,
      explanation:
        "向内部高程降低，说明中间较低。盆底与主河道中的湖泊是两个不同位置。",
    },
    {
      id: "height",
      chapter: 2,
      view: "perspective",
      question: `按当前模型显示的整数标高，主峰 ${high} m、盆底 ${low} m，两者相对高度是多少？`,
      options: [`${high + low} m`, `${high} m`, `${difference} m`],
      correct: 2,
      explanation: `相对高度是两点海拔之差：${high} − ${low} = ${difference} m。这里按图示整数标高计算。`,
    },
    {
      id: "valley",
      chapter: 5,
      view: "top",
      question: "在山谷处，等高线通常向什么方向凸出？",
      options: ["高处", "低处", "总是向地图北方"],
      correct: 0,
      explanation:
        "山谷等高线通常向高处凸出，河流沿谷地流向低处。地图北方与高低方向没有固定关系。",
    },
  ];
}
export function gradeContourAnswers(questions, answers) {
  let answered = 0,
    correct = 0;
  const wrong = [];
  for (const q of questions) {
    const choice = answers[q.id];
    if (!Number.isInteger(choice) || choice < 0 || choice >= q.options.length)
      continue;
    answered++;
    if (choice === q.correct) correct++;
    else wrong.push(q.id);
  }
  return { answered, correct, total: questions.length, wrong };
}
