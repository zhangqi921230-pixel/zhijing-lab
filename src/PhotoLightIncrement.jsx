import React from "react";
import { photo } from "./models.mjs";
import Button from "./LabButton.jsx";
export function photoLightIntervals(p) {
  return [
    [10, 30],
    [70, 90],
  ].map(([start, end]) => ({
    start,
    end,
    from: photo({ ...p, light: start }),
    to: photo({ ...p, light: end }),
  }));
}
export default function PhotoLightIncrement({ p, onChange }) {
  const rows = photoLightIntervals(p);
  return (
    <section className="photo-evidence" aria-label="等量加光的增量对照">
      <h3>同样加光 20 个百分点，增加得一样多吗？</h3>
      <p>
        固定 CO₂ 供给 {p.co2}%、温度 {p.temp}
        °C。分别比较弱光区间与强光区间；每次点击只改变光照，带动上方仪器和曲线选点。
      </p>
      <div
        className="photo-increment-scroll"
        role="region"
        tabIndex="0"
        aria-label="等量加光速率区间图，可横向滚动"
      >
        <svg
          viewBox="0 0 680 300"
          role="img"
          aria-label="同一百分比刻度上的加光前后速率，空心圆为起点，实心圆为终点"
        >
          {[0, 25, 50, 75, 100].map((v) => (
            <g key={v}>
              <path d={`M${65 + v * 5.2} 65V235`} stroke="var(--ui-line)" />
              <text x={65 + v * 5.2} y="260" textAnchor="middle">
                {v}
              </text>
            </g>
          ))}
          {rows.map((row, i) => {
            const y = 95 + i * 100,
              x1 = 65 + row.from * 5.2,
              x2 = 65 + row.to * 5.2;
            return (
              <g key={row.start}>
                <text x="65" y={y - 25}>
                  光照 {row.start}% → {row.end}%
                </text>
                <path
                  d={`M${x1} ${y}H${x2}`}
                  stroke="var(--ui-gold)"
                  strokeWidth="7"
                />
                <circle
                  cx={x1}
                  cy={y}
                  r="6"
                  fill="var(--ui-surface)"
                  stroke="var(--ui-primary)"
                  strokeWidth="2"
                />
                <circle cx={x2} cy={y} r="5" fill="var(--ui-primary)" />
                <text x="65" y={y + 30}>
                  {row.from.toFixed(2)}% → {row.to.toFixed(2)}%　增加{" "}
                  {(row.to - row.from).toFixed(2)} 个百分点
                </text>
              </g>
            );
          })}
          <text x="325" y="292" textAnchor="middle">
            总光合相对速率 / %　·　空心起点 → 实心终点
          </text>
        </svg>
      </div>
      {rows.map((row) => (
        <div className="photo-light-interval" key={row.start}>
          <strong>
            光照 {row.start}% → {row.end}%
          </strong>
          <div className="photo-scan-controls">
            <Button
              primary={p.light === row.start}
              aria-pressed={p.light === row.start}
              onClick={() => onChange(row.start)}
            >
              观察 {row.start}% 光照
            </Button>
            <Button
              primary={p.light === row.end}
              aria-pressed={p.light === row.end}
              onClick={() => onChange(row.end)}
            >
              观察 {row.end}% 光照
            </Button>
          </div>
          <p>
            总光合相对速率 {row.from.toFixed(2)}% → {row.to.toFixed(2)}%；增加{" "}
            <strong>{(row.to - row.from).toFixed(2)} 个百分点</strong>。
          </p>
        </div>
      ))}
      <p>
        {p.co2 === 0
          ? "当前 CO₂ 供给为零，两组模型速率均为零；仅增加光照不能替代 CO₂。"
          : "本模型中，强光区间再加同样的光照，增量更小。它描述逐渐趋缓，不代表存在一个固定光照值，此后速率完全不变。"}
      </p>
      <p>
        这是定性响应模型的比较，不用于预测真实作物产量；显示总光合，未扣除呼吸消耗。
      </p>
    </section>
  );
}
