// Editorial helper; every explanation and observation is authored per topic.
export function record(
  summary,
  steps,
  deeper,
  misconception,
  application,
  question,
  choices,
  answer,
  explanation,
  sources,
  scene,
  related = [],
) {
  return {
    summary,
    chapters: steps.map(([title, goal, text], i) => [
      i === 0 ? "observe" : `step-${i + 1}`,
      title,
      goal,
      text,
    ]),
    deeper,
    misconception,
    application,
    quiz: { question, choices, answer, explanation },
    sources: sources.map(([title, url]) => ({ title, url })),
    scene,
    related,
    boundary: scene.boundary || "教学示意；尺寸、颜色与过程速度不代表实测值。",
    review: { status: "编辑稿，待独立科学编审", revised: "2026-10-21" },
  };
}
