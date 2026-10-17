import React from "react";
import Button from "./LabButton.jsx";
import { distillationState } from "./chemistryTopics.mjs";
import "./DistillationSalt.css";
export function saltBalance(power, time, cooling) {
  const q = distillationState(power, time, cooling);
  return {
    ...q,
    solution: q.remaining + q.salt,
    fraction: (100 * q.salt) / (q.remaining + q.salt),
    initial: (100 * 2) / 202,
  };
}
export default function DistillationSalt({ p, time, onApply, onSeek }) {
  const q = saltBalance(p.power, time, p.cooling);
  const portions = [
    { label: "原瓶留下", water: q.remaining, salt: 2 },
    { label: "接收瓶收集", water: q.collected, salt: 0 },
    { label: "未收集蒸汽", water: q.lost, salt: 0 },
  ];
  return (
    <section className="distillation-salt" aria-label="蒸馏中盐与水的去向">
      <h3>水离开原瓶，盐还在原处</h3>
      <p>
        每根柱以初始 202 g
        盐水为相同满刻度。蓝色是水，金色是盐；盐段只占很小比例，旁边用数值标出，不能把它画大后误认为等质量。
      </p>
      <div
        className="distillation-salt-scroll"
        tabIndex="0"
        role="region"
        aria-label="三处物质质量，可横向滚动"
      >
        <svg
          viewBox="0 0 760 330"
          role="img"
          aria-label={`原瓶水${q.remaining.toFixed(2)}克、盐2克；收集水${q.collected.toFixed(2)}克；未收集蒸汽${q.lost.toFixed(2)}克`}
        >
          {[0, 50, 100, 150, 202].map((v) => (
            <g key={v}>
              <path d={`M55 ${265 - v}H710`} stroke="var(--ui-line)" />
              <text x="45" y={270 - v} textAnchor="end">
                {v}
              </text>
            </g>
          ))}
          <text x="55" y="30">
            质量 / g
          </text>
          {portions.map((part, i) => {
            const x = 155 + i * 215;
            return (
              <g key={part.label}>
                <rect
                  x={x - 43}
                  y="63"
                  width="86"
                  height="202"
                  fill="var(--ui-paper)"
                  stroke="var(--ui-line)"
                />
                <rect
                  x={x - 43}
                  y={265 - part.water - part.salt}
                  width="86"
                  height={part.water}
                  fill="#5e9dac"
                />
                <rect
                  x={x - 43}
                  y={265 - part.salt}
                  width="86"
                  height={part.salt}
                  fill="var(--ui-gold)"
                />
                <text x={x} y="295" textAnchor="middle">
                  {part.label}
                </text>
                <text x={x} y="320" textAnchor="middle">
                  水 {part.water.toFixed(2)} g · 盐 {part.salt} g
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="distillation-salt-readings">
        <div>
          <span>初始盐的质量分数</span>
          <strong>{q.initial.toFixed(3)}%</strong>
          <small>2 ÷ 202 × 100%</small>
        </div>
        <div>
          <span>原瓶现在的质量分数</span>
          <strong>{q.fraction.toFixed(3)}%</strong>
          <small>2 ÷ {q.solution.toFixed(3)} × 100%</small>
        </div>
        <div>
          <span>接收瓶中盐的质量分数</span>
          <strong>{q.collected > 0 ? "0%" : "尚无馏出液"}</strong>
          <small>
            {q.collected > 0
              ? "本模型假设盐不挥发、不夹带"
              : "没有溶液时不计算质量分数"}
          </small>
        </div>
      </div>
      <div className="distillation-salt-actions">
        <Button onClick={() => onSeek(0)}>回到开始</Button>
        <Button onClick={() => onSeek(240)}>演示结束</Button>
        <Button aria-pressed={p.cooling} onClick={() => onApply(true)}>
          同一时刻 · 开启冷却
        </Button>
        <Button aria-pressed={!p.cooling} onClick={() => onApply(false)}>
          同一时刻 · 关闭冷却
        </Button>
      </div>
      <p>
        当前已汽化 {q.evaporated.toFixed(2)} g 水。
        {p.cooling
          ? "本模型将其全部冷凝收集。"
          : "本模型将其全部计为未收集蒸汽。"}
        改变这里的冷却对照保留当前功率与时刻，并暂停演示，重新计算两种理想条件的结果。
      </p>
      <p>
        总质量核对：原瓶 {q.solution.toFixed(2)} g + 接收瓶{" "}
        {q.collected.toFixed(2)} g + 未收集蒸汽 {q.lost.toFixed(2)} g = 202
        g。原瓶中盐的质量始终为 2 g，变大的是盐的质量分数。
      </p>
      <details>
        <summary>为什么不能说真实蒸馏水绝对没有杂质？</summary>
        <p>
          这里假设盐不挥发、液滴不被蒸汽夹带、器材不带入污染，且冷却只有理想完全收集与不收集两种状态，所以接收瓶的盐为0。真实分离效果还与物质挥发性、夹带和器材条件有关。本演示只作部分蒸馏，未计算盐析出和沸点升高，不模拟蒸干。
        </p>
      </details>
    </section>
  );
}
