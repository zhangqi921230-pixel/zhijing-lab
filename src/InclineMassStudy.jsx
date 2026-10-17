import React from "react";
import { incline } from "./advancedModels.mjs";
import Button from "./LabButton.jsx";
import "./InclineMassStudy.css";
export default function InclineMassStudy({ p, t, onMass }) {
  const reference = incline({ ...p, mass: 1 }, t),
    current = incline(p, t);
  return (
    <section className="incline-mass-study" aria-label="同斜面不同质量对照">
      <h3>力随质量增加，加速度也增加吗？</h3>
      <p>
        两物体使用相同倾角、摩擦系数与主动画时刻。参照固定为1
        kg；只改变当前物体质量后，可重新播放上方实验。
      </p>
      <div className="incline-mass-actions">
        {[1, 2, 4].map((mass) => (
          <Button
            key={mass}
            aria-pressed={p.mass === mass}
            onClick={() => onMass(mass)}
          >
            当前质量 {mass} kg
          </Button>
        ))}
      </div>
      <div
        className="incline-mass-scroll"
        role="region"
        tabIndex="0"
        aria-label="双物体位移与力的同尺度对照，可横向滚动"
      >
        <svg
          viewBox="0 0 740 430"
          role="img"
          aria-label="同条件不同质量的沿坡位移、重力与沿坡合力"
        >
          {[
            [reference, 1, 95],
            [current, p.mass, 205],
          ].map(([q, mass, y], i) => (
            <g key={i}>
              <text x="24" y={y - 42}>
                {i ? "当前 B" : "参照 A"} · {mass} kg
              </text>
              <path
                d={`M165 ${y}H650`}
                stroke="var(--ui-line)"
                strokeWidth="3"
              />
              <path
                d={`M650 ${y - 26}V${y + 12}`}
                stroke="var(--ui-muted)"
                strokeWidth="5"
              />
              <rect
                data-testid="mass-comparison-block"
                x={165 + (q.s / 4) * 470 - 12}
                y={y - 24}
                width="24"
                height="24"
                rx="3"
                fill={i ? "var(--ui-gold)" : "var(--ui-primary)"}
              />
              <text x="165" y={y + 26}>
                0 m
              </text>
              <text x="630" y={y + 26}>
                4 m
              </text>
              <text x="24" y={y + 4}>
                {q.s.toFixed(2)} m
              </text>
            </g>
          ))}
          <text x="24" y="272">
            固定力标尺 · 0—50 N
          </text>
          {[
            ["重力 A", reference.gravity, 307],
            ["重力 B", current.gravity, 339],
            ["沿坡合力 A", reference.a, 371],
            ["沿坡合力 B", p.mass * current.a, 403],
          ].map(([label, value, y]) => (
            <g key={label}>
              <text x="24" y={y + 5}>
                {label}
              </text>
              <rect
                x="165"
                y={y - 12}
                width="400"
                height="18"
                fill="var(--ui-paper)"
                stroke="var(--ui-line)"
              />
              <rect
                data-testid="mass-force-bar"
                x="165"
                y={y - 12}
                width={(value / 50) * 400}
                height="18"
                fill={
                  label.endsWith("A") ? "var(--ui-primary)" : "var(--ui-gold)"
                }
              />
              <text x="590" y={y + 5}>
                {value.toFixed(2)} N
              </text>
            </g>
          ))}
        </svg>
      </div>
      <p>
        参照加速度 <strong>{reference.a.toFixed(2)} m/s²</strong>；当前加速度{" "}
        <strong>{current.a.toFixed(2)} m/s²</strong>。
        {current.phase === "sliding"
          ? "滑动期间 a = g(sinθ − μₖcosθ)，质量在合力除以质量时约去。"
          : current.phase === "static"
            ? "两物体均保持静止；是否起滑取决于倾角与静摩擦系数，不取决于质量。"
            : "两物体均已被挡板停止；此处显示停止后的平衡合力，不是碰撞冲击峰值。"}
      </p>
      <p>
        同尺度位移图将斜面展为水平距离轴，不表示水平运动。忽略空气阻力，假设摩擦系数不随质量改变；固定标尺仅用于本对照，主受力图仍自动缩放以便辨认方向。
      </p>
    </section>
  );
}
