import React from "react";
import { lens } from "./models.mjs";
import "./LensPositions.css";
export const lensPositions = [
  [0.8, "焦点内"],
  [1, "焦点上"],
  [1.2, "焦点外"],
  [2, "二倍焦距"],
  [3, "三倍焦距"],
];
export default function LensPositions({ p, onPrepare }) {
  const q = lens(p.u, p.f);
  const kind =
    q.v === null
      ? "无有限距离像"
      : q.v < 0
        ? "正立、放大虚像"
        : Math.abs(Math.abs(q.m) - 1) < 1e-9
          ? "倒立、等大实像"
          : Math.abs(q.m) > 1
            ? "倒立、放大实像"
            : "倒立、缩小实像";
  return (
    <section className="lens-positions" aria-label="跨越焦点对照">
      <strong>跨越焦点，看成像如何改变</strong>
      <div role="group" aria-label="相对焦距位置">
        {lensPositions.map(([ratio, name]) => {
          const u = Math.round(p.f * ratio * 1e8) / 1e8;
          return (
            <button
              key={ratio}
              disabled={u < 5 || u > 60}
              aria-pressed={Math.abs(p.u - u) < 1e-8}
              onClick={() => onPrepare({ u })}
            >
              {name}
              <small>
                {ratio}f · {u} cm
              </small>
            </button>
          );
        })}
      </div>
      <p className="lens-position-result">{kind}</p>
      <p>
        只移动物体，光屏保持原位。实像需重新对焦；虚像与焦点处均不能在光屏上得到清晰像，但原因不同。超出物距行程的位置不可选。
      </p>
    </section>
  );
}
