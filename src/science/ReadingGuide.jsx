import React from "react";
import { readingGuides } from "./readingGuides.mjs";
export default function ReadingGuide({ id, hiddenAnswers = false }) {
  const g = readingGuides[id];
  if (!g) return null;
  return (
    <section
      className="science-reading-guide"
      aria-label="读图与推理导读"
      data-topic={id}
    >
      <h2>把画面和原理连起来</h2>
      <p>
        <strong>先看哪里：</strong>
        {g.focus}
      </p>
      <p>
        <strong>为什么会这样：</strong>
        {g.explanation}
      </p>
      <details
        key={`${id}:${hiddenAnswers}`}
        className="science-guide-question"
      >
        <summary>再想一步：{g.question}</summary>
        {hiddenAnswers ? (
          <p>讲解模式已隐藏答案。可在下方选择“允许显示答案”后查看。</p>
        ) : (
          <p>{g.answer}</p>
        )}
      </details>
    </section>
  );
}
