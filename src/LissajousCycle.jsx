import React from "react";
import Button from "./LabButton.jsx";
import { lissajousCycle } from "./oscillationModels.mjs";
import "./LissajousCycle.css";
export default function LissajousCycle({ p, time, onSeek }) {
  const q = lissajousCycle(p);
  const phases = [
    (2 * Math.PI * p.fx * time) / 6,
    (2 * Math.PI * p.fy * time) / 6 + (p.phase * Math.PI) / 180,
  ];
  return (
    <section className="lissajous-cycle" aria-label="两个振动的共同周期">
      <h2>何时同时回到原来的振动状态？</h2>
      <p>
        水平周期 {q.xPeriod.toFixed(2)} s，竖直周期 {q.yPeriod.toFixed(2)}{" "}
        s。最短共同周期为 <strong>{q.period.toFixed(2)} s</strong>：水平完成{" "}
        {q.xCycles} 次、竖直完成 {q.yCycles} 次振动。
      </p>
      <div
        className="lissajous-phase-scroll"
        role="region"
        aria-label="相位盘，可横向滚动"
        tabIndex="0"
      >
        <svg
          viewBox="0 0 640 250"
          role="img"
          aria-label="水平与竖直振动的相位盘，虚线为初相位"
        >
          {phases.map((angle, i) => {
            const cx = i ? 460 : 160,
              cy = 120,
              r = 70,
              initial = i ? (p.phase * Math.PI) / 180 : 0;
            return (
              <g key={i}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="none"
                  stroke="var(--ui-line)"
                  strokeWidth="2"
                />
                <path
                  d={`M${cx - r - 15} ${cy}H${cx + r + 15}M${cx} ${cy - r - 15}V${cy + r + 15}`}
                  stroke="var(--ui-line)"
                />
                <line
                  x1={cx}
                  y1={cy}
                  x2={cx + r * Math.cos(initial)}
                  y2={cy - r * Math.sin(initial)}
                  stroke="var(--ui-muted)"
                  strokeWidth="2"
                  strokeDasharray="5 5"
                />
                <line
                  x1={cx}
                  y1={cy}
                  x2={cx + r * Math.cos(angle)}
                  y2={cy - r * Math.sin(angle)}
                  stroke="var(--ui-primary)"
                  strokeWidth="3"
                />
                <circle
                  cx={cx + r * Math.cos(angle)}
                  cy={cy - r * Math.sin(angle)}
                  r="6"
                  fill="var(--ui-primary)"
                />
                <text x={cx} y="25" textAnchor="middle">
                  {i ? "竖直振动" : "水平振动"} · {i ? p.fy : p.fx} 次 / 6 s
                </text>
                <text x={cx} y="226" textAnchor="middle">
                  相位 {(((angle * 180) / Math.PI) % 360).toFixed(1)}°
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="motion-shortcuts">
        {[
          ["起始状态", 0],
          ["半个共同周期", q.period / 2],
          ["一个共同周期", q.period],
        ].map(([label, t]) => (
          <Button key={label} onClick={() => onSeek(t)}>
            {label}
          </Button>
        ))}
      </div>
      <p>
        圆盘表示相位，不是描迹点的位置；实线与各自初始虚线重合时，该方向回到原来的位置和运动方向。轨迹在交叉处经过同一点，不一定完成一个周期。
      </p>
      <p>
        改变初相位会改变曲线形状，但不改变这里的共同周期。比如2:4与1:2约分后相同，前者重复得更快；本模型只取整数振动次数。
      </p>
    </section>
  );
}
