// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { expect, it } from "vitest";
import InquiryPrompt from "../src/InquiryPrompt.jsx";
import { cellInquiry } from "../src/cellInquiry.mjs";
import { solidsInquiry } from "../src/solidsInquiry.mjs";
import { moleculeInquiry } from "../src/moleculeInquiry.mjs";
import { microscopeInquiry } from "../src/microscopeInquiry.mjs";
import { functionsInquiry } from "../src/functionsInquiry.mjs";
import { lensInquiry } from "../src/lensInquiry.mjs";
import { lensChapters } from "../src/lensChapters.mjs";
import { microscopeChapters } from "../src/microscopeChapters.mjs";
import { topicChapters } from "../src/topicChapters.mjs";

it.each([
  ["cell", cellInquiry],
  ["solids", solidsInquiry],
  ["molecule", moleculeInquiry],
  ["microscope", microscopeInquiry],
  ["functions", functionsInquiry],
  ["lens", lensInquiry],
])(
  "gives every %s chapter a distinct prompt and collapses explanations on chapter changes",
  async (id, inquiries) => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    expect(inquiries).toHaveLength(
      (id === "microscope"
        ? microscopeChapters
        : id === "lens"
          ? lensChapters
          : topicChapters[id]
      ).length,
    );
    expect(new Set(inquiries.map((q) => q.question)).size).toBe(
      inquiries.length,
    );
    const host = document.createElement("div"),
      root = createRoot(host);
    try {
      for (const [index, inquiry] of inquiries.entries()) {
        await act(() =>
          root.render(<InquiryPrompt key={index} {...inquiry} />),
        );
        const button = host.querySelector("button"),
          answer = host.querySelector(".answer");
        expect(host.textContent).toContain(inquiry.question);
        expect(button.getAttribute("aria-expanded")).toBe("false");
        expect(answer.hidden).toBe(true);
        expect(button.getAttribute("aria-controls")).toBe(answer.id);
        await act(() => button.click());
        expect(answer.hidden).toBe(false);
        expect(answer.textContent).toBe(inquiry.explanation);
      }
    } finally {
      await act(() => root.unmount());
    }
  },
);
