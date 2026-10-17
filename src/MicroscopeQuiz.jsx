import React, { useState } from "react";
import { microscopeQuiz } from "./microscopeQuiz.mjs";
export default function MicroscopeQuiz({ onReview }) {
  const [index, setIndex] = useState(0),
    [answers, setAnswers] = useState({});
  const question = microscopeQuiz[index],
    response = answers[question.id];
  const submitted = !!response?.submitted;
  const complete = microscopeQuiz.filter(
    (q) => answers[q.id]?.submitted,
  ).length;
  const correct = microscopeQuiz.filter(
    (q) => answers[q.id]?.submitted && answers[q.id].choice === q.answer,
  ).length;
  return (
    <section className="microscope-quiz" aria-label="显微镜随堂检测">
      <p className="micro-quiz-progress">
        第 {index + 1} / {microscopeQuiz.length} 题 · 已提交 {complete} 题 ·
        答对 {correct} 题
      </p>
      <fieldset>
        <legend>{question.prompt}</legend>
        {question.choices.map((choice, i) => (
          <label
            key={choice}
            className={response?.choice === i ? "chosen" : ""}
          >
            <input
              type="radio"
              name={question.id}
              checked={response?.choice === i}
              disabled={submitted}
              onChange={() =>
                setAnswers((old) => ({
                  ...old,
                  [question.id]: { choice: i, submitted: false },
                }))
              }
            />
            <span>{choice}</span>
          </label>
        ))}
      </fieldset>
      {!submitted ? (
        <button
          className="btn"
          disabled={response?.choice === undefined}
          onClick={() =>
            setAnswers((old) => ({
              ...old,
              [question.id]: { ...old[question.id], submitted: true },
            }))
          }
        >
          提交答案
        </button>
      ) : (
        <div className="micro-quiz-feedback" role="status">
          <strong>
            {response.choice === question.answer ? "回答正确" : "再核对一下"}
          </strong>
          <p>{question.explanation}</p>
          <button
            type="button"
            className="text-button"
            onClick={() => onReview(question.chapter)}
          >
            回到相关知识点 →
          </button>
        </div>
      )}
      <div className="micro-step">
        <button disabled={index === 0} onClick={() => setIndex(index - 1)}>
          上一题
        </button>
        <button
          disabled={index === microscopeQuiz.length - 1}
          onClick={() => setIndex(index + 1)}
        >
          下一题
        </button>
      </div>
      {complete === microscopeQuiz.length && (
        <p role="status">
          本次完成 {complete} 题，答对 {correct}{" "}
          题。可回看解析与实验，再练习一次。
        </p>
      )}
      <button
        type="button"
        className="micro-quiz-restart"
        onClick={() => {
          setAnswers({});
          setIndex(0);
        }}
      >
        重新练习
      </button>
      <small>本次练习保留至离开实验页面；不作为正式成绩。</small>
    </section>
  );
}
