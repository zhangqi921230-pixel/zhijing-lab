import React, { useState } from "react";
import Button from "./LabButton.jsx";
import { triangleAngles, triangleAngleRadius } from "./insightModels.mjs";
import "./TriangleProof.css";
export function angleSector(x, y, r, start, end) {
  return `M${x} ${y}L${x + r * Math.cos(start)} ${y + r * Math.sin(start)}A${r} ${r} 0 0 1 ${x + r * Math.cos(end)} ${y + r * Math.sin(end)}Z`;
}
export default function TriangleProof({ p }) {
  const [step, setStep] = useState(0),
    q = triangleAngles(p),
    s = 42,
    ax = 95,
    ay = 330,
    bx = ax + p.base * s,
    cx = ax + p.offset * s,
    cy = ay - p.height * s;
  const radius = triangleAngleRadius(p, s, 42);
  const colors = ["#ca8830", "#3589ac", "#a16bc2"];
  const notes = [
    "过顶点 C 作一条与底边 AB 平行的直线。A、B 两点处的角保持原位。",
    "AC 截两条平行线：C 左侧的金色角与 ∠A 是内错角，因此相等。",
    "BC 截两条平行线：C 右侧的蓝色角与 ∠B 是内错角，因此相等。",
    "C 点下方的三个角组成平角；以相等的 ∠A、∠B 代换，得到 ∠A + ∠C + ∠B = 180°。",
  ];
  return (
    <section className="triangle-proof" aria-label="平行线证明内角和">
      <h3>从“看见”走向“证明”</h3>
      <p>逐步添加辅助线和等角标记。改变右侧顶点参数，证明关系仍然成立。</p>
      <div className="motion-shortcuts" role="group" aria-label="证明步骤">
        {["1 作平行线", "2 对照 ∠A", "3 对照 ∠B", "4 得出结论"].map(
          (label, i) => (
            <Button
              key={label}
              primary={step === i}
              aria-pressed={step === i}
              onClick={() => setStep(i)}
            >
              {label}
            </Button>
          ),
        )}
      </div>
      <div
        className="triangle-proof-scroll"
        tabIndex="0"
        role="region"
        aria-label="证明图，可横向滚动"
      >
        <svg
          viewBox="0 0 600 440"
          role="img"
          aria-label={`平行线证明第 ${step + 1} 步`}
          style={{
            fill: "var(--ui-ink)",
            fontSize: 18,
            fontFamily: "Microsoft YaHei, sans-serif",
          }}
        >
          <path
            d={`M40 ${cy}H555M40 ${ay}H555`}
            fill="none"
            stroke="var(--ui-muted)"
            strokeWidth="2"
          />
          <path
            d={`M490 ${cy - 5}l8 5l-8 5M490 ${ay - 5}l8 5l-8 5`}
            fill="none"
            stroke="var(--ui-primary)"
            strokeWidth="2"
          />
          <path
            d={`M${ax} ${ay}L${cx} ${cy}L${bx} ${ay}Z`}
            fill="var(--ui-primary)"
            fillOpacity=".06"
            stroke="var(--ui-ink)"
            strokeWidth="2"
          />
          <path
            d={angleSector(ax, ay, radius, -q.a, 0)}
            fill={colors[0]}
            fillOpacity=".6"
          />
          <path
            d={angleSector(bx, ay, radius, -Math.PI, -Math.PI + q.b)}
            fill={colors[1]}
            fillOpacity=".6"
          />
          <path
            d={angleSector(cx, cy, radius, q.b, Math.PI - q.a)}
            fill={colors[2]}
            fillOpacity=".6"
          />
          {step >= 1 && (
            <path
              data-angle="A-copy"
              d={angleSector(cx, cy, radius, Math.PI - q.a, Math.PI)}
              fill={colors[0]}
              fillOpacity=".6"
            />
          )}
          {step >= 2 && (
            <path
              data-angle="B-copy"
              d={angleSector(cx, cy, radius, 0, q.b)}
              fill={colors[1]}
              fillOpacity=".6"
            />
          )}
          <text x={ax - 5} y={ay + 28}>
            A
          </text>
          <text x={bx - 5} y={ay + 28}>
            B
          </text>
          <text x={cx - 5} y={cy - 20}>
            C
          </text>
          {step >= 1 && (
            <text x={cx - 80} y={cy + 28}>
              ∠A
            </text>
          )}
          {step >= 2 && (
            <text x={cx + 65} y={cy + 28}>
              ∠B
            </text>
          )}
          <text x="40" y="55">
            两条水平线平行 · 横纵同尺度
          </text>
          <text x="40" y="402">
            {step === 3 ? "∠A + ∠C + ∠B = 180°" : "平行线的内错角相等"}
          </text>
        </svg>
      </div>
      <p className="triangle-proof-explanation" role="status">
        {notes[step]}
      </p>
      <p>
        当前 ∠A ≈ {((q.a * 180) / Math.PI).toFixed(1)}°，∠B ≈{" "}
        {((q.b * 180) / Math.PI).toFixed(1)}°，∠C ≈{" "}
        {((q.c * 180) / Math.PI).toFixed(1)}°。数值是验证，平行线性质给出证明。
      </p>
    </section>
  );
}
