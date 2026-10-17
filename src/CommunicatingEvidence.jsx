import React from "react";
import Button from "./LabButton.jsx";
import { communicatingState } from "./insightModels.mjs";
import "./CommunicatingEvidence.css";
const n = (value) => Number(value.toFixed(2));
export default function CommunicatingEvidence({ p, time, onRatio, onSeek }) {
  const q = communicatingState(p, time),
    mean = (p.left + p.right) / 2;
  return (
    <section
      className="communicating-evidence"
      aria-label="连通器体积与液面证据"
    >
      <h3>液面变了，液体去了哪里？</h3>
      <p>
        金色短虚线标出初始液面，金色带标出每管液面的变化区间。两管宽度按截面积比绘制，带状区域面积相等，对应同一份转移液体。
      </p>
      <div className="communicating-evidence-grid">
        {[
          { name: "左管", area: 10, initial: p.left, current: q.left },
          {
            name: "右管",
            area: 10 * p.ratio,
            initial: p.right,
            current: q.right,
          },
        ].map((row) => {
          const delta = row.current - row.initial;
          return (
            <article key={row.name}>
              <h4>
                {row.name} · 截面积 {row.area} cm²
              </h4>
              <p>
                初始 {row.initial} cm → 当前{" "}
                <strong>{n(row.current)} cm</strong>
              </p>
              <p>
                {Math.abs(delta) < 1e-8
                  ? "液面未变"
                  : delta > 0
                    ? "上升"
                    : "下降"}{" "}
                <strong>{n(Math.abs(delta))} cm</strong>
              </p>
              <p>
                {delta > 1e-8 ? "流入" : delta < -1e-8 ? "流出" : "净转移"}{" "}
                {row.area} × {n(Math.abs(delta))} ≈{" "}
                <strong>{n(Math.abs(delta) * row.area)} cm³</strong>
              </p>
            </article>
          );
        })}
      </div>
      <p>
        同一份液体：10 × |Δh₁| = {10 * p.ratio} ×
        |Δh₂|。管子越宽，同体积引起的液面变化越小；数值显示经过舍入。
      </p>
      <div
        className="motion-shortcuts"
        role="group"
        aria-label="保持初始液面比较管径"
      >
        <span>保持初始液面，查看不同管径的最终状态：</span>
        {[1, 2, 4].map((ratio) => (
          <Button
            key={ratio}
            primary={p.ratio === ratio && time === 6}
            aria-pressed={p.ratio === ratio && time === 6}
            onClick={() => onRatio(ratio)}
          >
            右管截面积 {ratio} 倍
          </Button>
        ))}
      </div>
      <div className="communicating-average">
        <h4>最终液面为什么不一定是算术平均数？</h4>
        <p>
          两竖管体积守恒：10 × {p.left} + {10 * p.ratio} × {p.right} = (10 +{" "}
          {10 * p.ratio}) × h。
        </p>
        <p>
          共同液面 <strong>{n(q.equilibrium)} cm</strong>；初始液面的算术平均数{" "}
          <strong>{n(mean)} cm</strong>。
        </p>
        <p>
          {p.left === p.right
            ? "初始已经等高，无论管径怎样改变，都保持这个高度。"
            : p.ratio === 1
              ? "两侧截面积相同，此时共同液面恰好等于算术平均数。"
              : "右管更宽，共同液面更接近右管初始液面。不能直接把两个高度相加除以二。"}
        </p>
        <Button onClick={() => onSeek(0)}>回到初始液面重看</Button>
      </div>
    </section>
  );
}
