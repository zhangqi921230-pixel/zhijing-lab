import React, { useState } from "react";
import Button from "./LabButton.jsx";
import { radianState } from "./signalLessons.mjs";
import "./RadianComparison.css";
export function radianComparisonCases(mode) {
  return [1, 2, 3].map((radius) => ({
    radius,
    angle: mode === "arc" ? 180 / radius : 90,
  }));
}
export default function RadianComparison({ p, chapter, onChange }) {
  const [mode, setMode] = useState(chapter === 4 ? "angle" : "arc");
  const cases = radianComparisonCases(mode);
  return (
    <section className="radian-comparison" aria-label="三只圆的弧长对照">
      <span>一次只改变一个条件</span>
      <h3>
        {mode === "arc"
          ? "一样长的圆弧，需要多大的角？"
          : "一样大的角，截出多长的圆弧？"}
      </h3>
      <div
        className="radian-comparison-actions"
        role="group"
        aria-label="选择保持不变的量"
      >
        <Button
          aria-pressed={mode === "arc"}
          primary={mode === "arc"}
          onClick={() => setMode("arc")}
        >
          固定弧长 π cm
        </Button>
        <Button
          aria-pressed={mode === "angle"}
          primary={mode === "angle"}
          onClick={() => setMode("angle")}
        >
          固定圆心角 90°
        </Button>
      </div>
      <p>
        三只圆使用相同长度比例。金色表示所取圆弧，下方线段表示把它拉直后的长度；绿色两条半径标出圆心角。
      </p>
      <div
        className="radian-comparison-scroll"
        role="region"
        aria-label="同尺度圆弧比较，可横向滚动"
        tabIndex="0"
      >
        <svg
          viewBox="0 0 900 435"
          role="img"
          aria-label={
            mode === "arc"
              ? "弧长均为π厘米，半径1、2、3厘米对应180、90、60度"
              : "圆心角均为90度，半径1、2、3厘米对应弧长π/2、π、3π/2厘米"
          }
        >
          {cases.map((sample, i) => {
            const q = radianState(sample),
              cx = 150 + i * 300,
              cy = 190,
              r = sample.radius * 40;
            const path = Array.from(
              { length: 91 },
              (_, j) =>
                `${j ? "L" : "M"}${cx + r * Math.cos((q.theta * j) / 90)},${cy - r * Math.sin((q.theta * j) / 90)}`,
            ).join(" ");
            return (
              <g key={sample.radius}>
                <text x={cx} y="30" textAnchor="middle">
                  r = {sample.radius} cm
                </text>
                <circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="none"
                  stroke="var(--ui-line)"
                  strokeWidth="2"
                />
                <path
                  d={`M${cx + r} ${cy}H${cx}L${cx + r * Math.cos(q.theta)} ${cy - r * Math.sin(q.theta)}`}
                  fill="none"
                  stroke="var(--ui-primary)"
                  strokeWidth="2"
                />
                <path
                  d={path}
                  fill="none"
                  stroke="var(--ui-gold)"
                  strokeWidth="6"
                />
                <circle cx={cx} cy={cy} r="4" fill="var(--ui-ink)" />
                <text x={cx} y={cy + 28} textAnchor="middle">
                  {sample.angle}°
                </text>
                <path
                  d={`M${cx - q.length * 20} 335h${q.length * 40}`}
                  stroke="var(--ui-gold)"
                  strokeWidth="5"
                />
                <text x={cx} y="374" textAnchor="middle">
                  s = {q.length.toFixed(3)} cm
                </text>
                <text x={cx} y="411" textAnchor="middle">
                  θ = {q.theta.toFixed(3)} rad
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <div
        className="radian-comparison-actions"
        role="group"
        aria-label="载入对照条件"
      >
        {cases.map((sample) => (
          <Button
            key={sample.radius}
            primary={p.radius === sample.radius && p.angle === sample.angle}
            aria-pressed={
              p.radius === sample.radius && p.angle === sample.angle
            }
            onClick={() => onChange({ ...p, ...sample })}
          >
            载入 r={sample.radius} cm、{sample.angle}°
          </Button>
        ))}
      </div>
      <p className="radian-comparison-conclusion">
        {mode === "arc"
          ? "弧长固定：θ = s/r，半径加倍，圆心角减半。"
          : "角度固定：s = rθ，半径加倍，弧长加倍。"}
      </p>
      <p>
        这是固定条件对照，微调主画面不会改写这三组样本。点击“载入”会暂停演示并保留展开进度；主画面与这里的图各有比例尺，只比较本组内部的长度。
      </p>
    </section>
  );
}
