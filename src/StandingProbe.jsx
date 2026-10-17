import React, { useMemo } from "react";
import Button from "./LabButton.jsx";
import { standingState } from "./oscillationModels.mjs";
import "./StandingProbe.css";
export default function StandingProbe({ p, time, onPosition, onSeek }) {
  const q = standingState(p, time),
    period = 60 / q.frequency,
    phase = (time / period) % 1;
  const amplitude = Math.abs(q.envelope) < 1e-9 ? 0 : Math.abs(q.envelope);
  const d = useMemo(
    () =>
      Array.from(
        { length: 121 },
        (_, i) =>
          `${i ? "L" : "M"}${45 + i * 3.5},${110 - (standingState(p, (i / 120) * period).y / p.amplitude) * 65}`,
      ).join(" "),
    [p, period],
  );
  return (
    <section className="standing-probe" aria-label="驻波观察点的时间变化">
      <h2>固定一个位置，观察一整个周期</h2>
      <p>
        观察点 x/L={(p.probe / 100).toFixed(4)}，局部振幅 {amplitude.toFixed(2)}{" "}
        mm。
        {amplitude === 0
          ? "这里是波节，位移始终为零。"
          : "曲线显示这个点随时间上下运动，而不是弦的空间形状。"}
      </p>
      <svg
        viewBox="0 0 530 230"
        role="img"
        aria-label="观察点一周期位移曲线与当前相位"
      >
        <path d="M45 35V185M45 110H465" stroke="var(--ui-muted)" fill="none" />
        {[0, 0.25, 0.5, 0.75, 1].map((v) => (
          <g key={v}>
            <line
              x1={45 + 420 * v}
              x2={45 + 420 * v}
              y1="35"
              y2="185"
              stroke="var(--ui-line)"
            />
            <text x={45 + 420 * v} y="211" textAnchor="middle">
              {v === 0 ? "0" : `${v} T`}
            </text>
          </g>
        ))}
        <text x="4" y="48">
          {p.amplitude}
        </text>
        <text x="15" y="115">
          0
        </text>
        <text x="1" y="179">
          −{p.amplitude}
        </text>
        <path d={d} stroke="var(--ui-primary)" strokeWidth="3" fill="none" />
        <line
          x1={45 + phase * 420}
          x2={45 + phase * 420}
          y1="35"
          y2="185"
          stroke="var(--ui-gold)"
          strokeDasharray="4 4"
        />
        <circle
          cx={45 + phase * 420}
          cy={110 - (q.y / p.amplitude) * 65}
          r="5"
          fill="var(--ui-gold)"
        />
      </svg>
      <p>
        位移单位 mm；物理周期 T={(1000 / q.frequency).toFixed(2)} ms，演示周期为{" "}
        {period.toFixed(3)} s。纵轴固定为当前波腹振幅，波节与波腹可以直接比较。
      </p>
      <h3>精确选择波节</h3>
      <div className="motion-shortcuts">
        {Array.from({ length: p.mode + 1 }, (_, i) => (
          <Button
            key={i}
            aria-pressed={Math.abs(p.probe - (100 * i) / p.mode) < 1e-8}
            onClick={() => onPosition((100 * i) / p.mode)}
          >
            波节 {i + 1} · {i}/{p.mode} L
          </Button>
        ))}
      </div>
      <h3>精确选择波腹</h3>
      <div className="motion-shortcuts">
        {Array.from({ length: p.mode }, (_, i) => (
          <Button
            key={i}
            aria-pressed={
              Math.abs(p.probe - (100 * (2 * i + 1)) / (2 * p.mode)) < 1e-8
            }
            onClick={() => onPosition((100 * (2 * i + 1)) / (2 * p.mode))}
          >
            波腹 {i + 1} · {2 * i + 1}/{2 * p.mode} L
          </Button>
        ))}
      </div>
      <div className="motion-shortcuts">
        {[0, 0.25, 0.5, 0.75].map((v) => (
          <Button key={v} onClick={() => onSeek(v * period)}>
            相位 {v === 0 ? "0" : `${v} T`}
          </Button>
        ))}
      </div>
      <p>
        选点后暂停并保留当前时刻；相邻波腹在同一时刻方向相反。相位按钮定位第一个周期，便于比较。
      </p>
    </section>
  );
}
