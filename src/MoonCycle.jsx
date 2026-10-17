import MoonPhasePair from "./MoonPhasePair.jsx";
import React from "react";
import { moonState, moonLitPath } from "./explorationModels.mjs";
import "./MoonCycle.css";
const phases = Array.from({ length: 8 }, (_, i) => ({
  angle: i * 45,
  ...moonState(i * 45),
}));
const curve = Array.from(
  { length: 181 },
  (_, i) =>
    `${i ? "L" : "M"}${40 + (i / 180) * 640},${130 - moonState(i * 2).fraction * 96}`,
).join(" ");
export default function MoonCycle({ angle, onChange, chapter = 0 }) {
  const q = moonState(angle),
    phase = angle % 360;
  return (
    <section className="moon-cycle" aria-label="月相周期图谱">
      <header>
        <strong>一轮月相 · 从位置到所见</strong>
        <span>
          {phase === 0
            ? "新一轮起点"
            : phase === 180
              ? "亮面达到最大"
              : phase < 180
                ? "盈：亮面逐渐增加"
                : "亏：亮面逐渐减少"}
        </span>
      </header>
      <div className="moon-cycle-phases" role="group" aria-label="选择八个月相">
        {phases.map((p) => (
          <button
            key={p.angle}
            aria-label={`选择${p.name}，周期角${p.angle}度`}
            aria-pressed={Math.abs(q.angle - p.angle) < 0.1}
            onClick={() => onChange("angle", p.angle)}
          >
            <svg viewBox="0 0 64 64" aria-hidden="true">
              <g transform="translate(32 32)">
                <circle r="25" fill="#17232d" stroke="#71848c" />
                <path d={moonLitPath(p.angle, 24)} fill="#e7deca" />
              </g>
            </svg>
            <b>{p.name}</b>
            <small>{p.angle}°</small>
          </button>
        ))}
      </div>
      <svg
        className="moon-cycle-curve"
        viewBox="0 0 720 182"
        role="img"
        aria-label={`月相亮面比例曲线，当前${(q.fraction * 100).toFixed(1)}%`}
      >
        <text x="40" y="20">
          可见圆盘亮面 / %
        </text>
        {[0, 0.5, 1].map((f) => (
          <g key={f}>
            <line x1="40" x2="680" y1={130 - f * 96} y2={130 - f * 96} />
            <text x="32" y={135 - f * 96} textAnchor="end">
              {f * 100}
            </text>
          </g>
        ))}
        <path d={curve} />
        <line
          className="moon-cycle-cursor"
          x1={40 + (angle / 360) * 640}
          x2={40 + (angle / 360) * 640}
          y1="34"
          y2="130"
        />
        <circle
          cx={40 + (angle / 360) * 640}
          cy={130 - q.fraction * 96}
          r="5"
          fill="var(--ui-gold)"
        />
        {[0, 90, 180, 270, 360].map((a) => (
          <text key={a} x={40 + (a / 360) * 640} y="153" textAnchor="middle">
            {a}°
          </text>
        ))}
        <text x="360" y="177" textAnchor="middle">
          从新月起的周期角
        </text>
      </svg>
      <p>
        选择缩略图会暂停并定位轨道、月面和曲线。上弦与下弦亮面都约50%，但亮侧及接下来的变化方向不同；月相圆缺不是地球阴影造成的。月面朝向沿用本页北半球常见示意，不表示任意地点任意时刻的视野方向。
      </p>
      {chapter === 4 && <MoonPhasePair angle={angle} onChange={onChange} />}
    </section>
  );
}
