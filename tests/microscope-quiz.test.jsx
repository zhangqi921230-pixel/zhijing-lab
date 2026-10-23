// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import MicroscopeQuiz from "../src/MicroscopeQuiz.jsx";
import { microscopeQuiz } from "../src/microscopeQuiz.mjs";
it("quiz counts submitted answers once, retains review, and resets explicitly", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const node = document.createElement("div");
  document.body.append(node);
  const root = createRoot(node),
    review = vi.fn();
  const button = (text) =>
    [...node.querySelectorAll("button")].find((b) => b.textContent === text);
  try {
    await act(async () => root.render(<MicroscopeQuiz onReview={review} />));
    expect(button("提交答案").disabled).toBe(true);
    for (let i = 0; i < 6; i++) {
      const choice = i === 0 ? 0 : microscopeQuiz[i].answer;
      await act(async () =>
        node.querySelectorAll('input[type="radio"]')[choice].click(),
      );
      expect(node.textContent).toContain(`已提交 ${i} 题`);
      await act(async () => button("提交答案").click());
      expect(
        [...node.querySelectorAll("input")].every((el) => el.disabled),
      ).toBe(true);
      if (i < 5) await act(async () => button("下一题").click());
    }
    expect(node.textContent).toContain("本次完成 6 题，答对 5 题");
    await act(async () => button("回到相关知识点 →").click());
    expect(review).toHaveBeenCalledWith(5);
    await act(async () => button("上一题").click());
    expect(node.textContent).toContain("答对 5 题");
    await act(async () => button("重新练习").click());
    expect(node.textContent).toContain("已提交 0 题 · 答对 0 题");
    expect(button("提交答案").disabled).toBe(true);
  } finally {
    await act(async () => root.unmount());
    node.remove();
    delete globalThis.IS_REACT_ACT_ENVIRONMENT;
  }
});
