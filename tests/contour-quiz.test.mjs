import { it, expect } from "vitest";
import { contourQuestions, gradeContourAnswers } from "../src/contourQuiz.mjs";
it("relative-height exercise derives its options from the current integer elevations", () => {
  const questions = contourQuestions(2203.4, 225.4),
    q = questions.find((q) => q.id === "height");
  expect(q.options[q.correct]).toBe("1978 m");
  expect(
    contourQuestions(1900, 310).find((q) => q.id === "height").options[2],
  ).toBe("1590 m");
});
it("grading distinguishes unanswered, wrong and correct and ignores unknown answers", () => {
  const q = contourQuestions(2203, 225),
    answers = { slope: 2, interval: 0, summit: 99, unknown: 0 };
  expect(gradeContourAnswers(q, answers)).toEqual({
    answered: 2,
    correct: 1,
    total: 6,
    wrong: ["interval"],
  });
  const all = Object.fromEntries(q.map((q) => [q.id, q.correct]));
  expect(gradeContourAnswers(q, all).correct).toBe(6);
});
