import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { it, expect } from "vitest";
import {
  dissectionPoses,
  dissectionVertices,
} from "../src/pythagorasDissection.mjs";
import VisualProofScene from "../src/VisualProofScene.jsx";
import { visualProofLessons } from "../src/visualProofLessons.mjs";
it("every moving piece preserves perpendicular legs and area through the full motion", () => {
  for (const a of [2, 3, 6])
    for (const b of [2, 4, 6])
      for (let t = 0; t <= 6; t += 0.25) {
        for (const pose of dissectionPoses(a, b, t)) {
          const [o, u, v] = dissectionVertices(a, b, pose);
          const ux = u[0] - o[0],
            uy = u[1] - o[1],
            vx = v[0] - o[0],
            vy = v[1] - o[1];
          expect(Math.hypot(ux, uy)).toBeCloseTo(a, 10);
          expect(Math.hypot(vx, vy)).toBeCloseTo(b, 10);
          expect(ux * vx + uy * vy).toBeCloseTo(0, 10);
          expect(Math.abs(ux * vy - uy * vx) / 2).toBeCloseTo((a * b) / 2, 10);
        }
      }
});
it("final pieces tile exactly the complement of a-square and b-square for unequal and equal legs", () => {
  const inside = (x, y, [o, u, v]) => {
    const ux = u[0] - o[0],
      uy = u[1] - o[1],
      vx = v[0] - o[0],
      vy = v[1] - o[1],
      px = x - o[0],
      py = y - o[1],
      det = ux * vy - uy * vx;
    const m = (px * vy - py * vx) / det,
      n = (ux * py - uy * px) / det;
    return m >= 0 && n >= 0 && m + n <= 1;
  };
  for (const a of [2, 3, 6])
    for (const b of [2, 4, 6]) {
      const pieces = dissectionPoses(a, b, 6).map((p) =>
          dissectionVertices(a, b, p),
        ),
        l = a + b;
      for (let i = 0; i < 23; i++)
        for (let j = 0; j < 23; j++) {
          const x = ((i + 0.317) * l) / 23,
            y = ((j + 0.193) * l) / 23;
          const blank = (x > a && y < b) || (x < a && y > b);
          expect(pieces.filter((p) => inside(x, y, p)).length).toBe(
            blank ? 0 : 1,
          );
        }
    }
});
it("sixth chapter routes to rigid rearrangement and switches endpoint explanations", () => {
  expect(visualProofLessons[0].chapters[5].title).toBe("同样四块，换一种拼法");
  expect(visualProofLessons[0].chapters[5].preset).toEqual(
    visualProofLessons[0].chapters[0].preset,
  );
  for (const time of [0, 3, 6]) {
    const html = renderToStaticMarkup(
      <VisualProofScene
        id="pythagoras-proof"
        p={{ a: 3, b: 4 }}
        time={time}
        chapter={5}
      />,
    );
    expect(html.match(/data-piece=/g)).toHaveLength(4);
    expect(html).toContain(
      time === 0 ? "中央留下一个" : time === 6 ? "重新拼排" : "搬运过程允许",
    );
  }
});
it("measurement toggle hides angle marks and dimensions without hiding or deforming pieces", () => {
  const render = (guides) =>
    renderToStaticMarkup(
      <VisualProofScene
        id="pythagoras-proof"
        p={{ a: 3, b: 4 }}
        time={6}
        chapter={5}
        guides={guides}
      />,
    );
  expect(render(true).match(/dissection-right-angle/g)).toHaveLength(4);
  const hidden = render(false);
  expect(hidden).not.toContain("dissection-right-angle");
  expect(hidden).not.toContain("外框边长");
  expect(hidden.match(/data-piece=/g)).toHaveLength(4);
});
