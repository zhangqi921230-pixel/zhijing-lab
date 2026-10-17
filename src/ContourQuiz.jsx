import React, { useMemo, useState } from "react";
import { terrainTriangles, terrainHeightAt } from "./models.mjs";
import { TEACHING_BASIN } from "./terrainWorld.mjs";
import { contourQuestions, gradeContourAnswers } from "./contourQuiz.mjs";
export default function ContourQuiz({ onObserve }) {
  const questions = useMemo(() => {
    let peak = 0;
    for (const tri of terrainTriangles)
      for (const p of tri) peak = Math.max(peak, p[1]);
    return contourQuestions(
      peak,
      terrainHeightAt(TEACHING_BASIN.x, TEACHING_BASIN.z),
    );
  }, []);
  const [index, setIndex] = useState(0),
    [answers, setAnswers] = useState({}),
    [finished, setFinished] = useState(false);
  const q = questions[index],
    choice = answers[q.id],
    score = gradeContourAnswers(questions, answers);
  if (finished)
    return (
      <section className="geo-quiz" aria-label="随堂检测结果">
        <h3>完成本组练习</h3>
        <p className="geo-quiz-score">
          {score.correct} / {score.total}
        </p>
        <p>
          {score.wrong.length
            ? "可以回看下面的题目和解释，再重新练习。"
            : "本组全部答对。可以结合地形向同伴解释判断依据。"}
        </p>
        {questions.map((item, i) => (
          <button
            key={item.id}
            onClick={() => {
              setIndex(i);
              setFinished(false);
            }}
          >
            {answers[item.id] === item.correct ? "✓" : "○"} 第 {i + 1} 题 ·{" "}
            {item.explanation}
          </button>
        ))}
        <button
          onClick={() => {
            setAnswers({});
            setIndex(0);
            setFinished(false);
          }}
        >
          重新练习
        </button>
        <p>本次结果仅用于当前页面自查，不上传、不作为正式成绩。</p>
      </section>
    );
  return (
    <section className="geo-quiz" aria-label="等高线随堂检测">
      <p className="geo-quiz-progress">
        第 {index + 1} / {questions.length} 题 · 已作答 {score.answered}
      </p>
      <h3>{q.question}</h3>
      <button className="geo-observe" onClick={() => onObserve(q.view)}>
        观察对应地形 ↗
      </button>
      <div role="group" aria-label="答案选项">
        {q.options.map((option, i) => (
          <button
            key={option}
            disabled={choice !== undefined}
            aria-pressed={choice === i}
            onClick={() => setAnswers((old) => ({ ...old, [q.id]: i }))}
          >
            <span>{String.fromCharCode(65 + i)}.</span> {option}
          </button>
        ))}
      </div>
      {choice !== undefined && (
        <p className="geo-quiz-feedback" role="status">
          {choice === q.correct
            ? "回答正确。"
            : "本题正确答案为 " + String.fromCharCode(65 + q.correct) + "。"}
          {q.explanation}
        </p>
      )}
      <div className="geo-quiz-nav">
        <button disabled={index === 0} onClick={() => setIndex(index - 1)}>
          上一题
        </button>
        <button
          disabled={choice === undefined}
          onClick={() =>
            index === questions.length - 1
              ? setFinished(true)
              : setIndex(index + 1)
          }
        >
          {index === questions.length - 1 ? "查看结果" : "下一题"}
        </button>
      </div>
      <p>选择后显示解析；离开本章或刷新会清空本轮作答。</p>
    </section>
  );
}
