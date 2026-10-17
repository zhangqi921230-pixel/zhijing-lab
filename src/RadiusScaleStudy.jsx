import React, { useState, useId } from "react";
import Button from "./LabButton.jsx";
import "./RadiusScaleStudy.css";
export function circleScale(r, reference) {
  return {
    length: r / reference,
    area: (r / reference) ** 2,
    circumference: 2 * Math.PI * r,
    surface: Math.PI * r * r,
  };
}
export default function RadiusScaleStudy({
  p,
  onChange,
  maxRadius = 5,
  instruction = "播放下方‘演示半径缩放’，或调节右侧半径。",
}) {
  const [reference, setReference] = useState(2),
    uid = useId().replace(/:/g, "");
  const q = circleScale(p.r, reference),
    fmt = (n) => Number(n.toFixed(3));
  return (
    <section
      className="radius-scale-study"
      aria-label="半径与周长面积的同尺度对照"
    >
      <header>
        <span>圆的缩放 · 同尺度比较</span>
        <h2>长度跟着半径变，面积跟着平方变。</h2>
      </header>
      <div className="radius-scale-actions">
        <Button
          onClick={() => {
            onChange("r", p.r);
            setReference(p.r);
          }}
        >
          保留当前半径为参照
        </Button>
        <Button onClick={() => onChange("r", reference)}>恢复参照大小</Button>
        <Button
          disabled={reference * 2 > maxRadius}
          onClick={() => onChange("r", reference * 2)}
        >
          半径变为参照的 2 倍
        </Button>
        <Button
          onClick={() => {
            onChange("r", p.r);
            setReference(2);
          }}
        >
          参照设为 2 cm
        </Button>
      </div>
      {reference * 2 > maxRadius && (
        <p>两倍参照半径超出本课 {maxRadius} cm 上限，可先将参照设为 2 cm。</p>
      )}
      <div
        className="radius-scale-canvas"
        tabIndex="0"
        role="region"
        aria-label="同尺度双圆，可横向滚动"
      >
        <svg
          viewBox="0 0 800 400"
          role="img"
          aria-label={`参照半径${fmt(reference)}厘米，当前半径${fmt(p.r)}厘米，两图尺度相同`}
        >
          <defs>
            <pattern
              id={uid}
              width="28"
              height="28"
              patternUnits="userSpaceOnUse"
            >
              <path d="M28 0H0V28" stroke="var(--ui-line)" fill="none" />
            </pattern>
          </defs>
          {[
            {
              cx: 195,
              r: reference,
              title: "参照圆 A",
              color: "var(--ui-muted)",
            },
            { cx: 595, r: p.r, title: "当前圆 B", color: "var(--ui-primary)" },
          ].map(({ cx, r, title, color }) => (
            <g key={title}>
              <rect
                x={cx - 168}
                y="49"
                width="336"
                height="308"
                fill={`url(#${uid})`}
              />
              <text x={cx} y="29" textAnchor="middle">
                {title}
              </text>
              <circle
                cx={cx}
                cy="210"
                r={r * 28}
                fill={color}
                fillOpacity=".13"
                stroke={color}
                strokeWidth="3"
              />
              <path
                d={`M${cx} 210H${cx + r * 28}`}
                stroke="var(--ui-gold)"
                strokeWidth="3"
              />
              <circle cx={cx} cy="210" r="3" fill="var(--ui-ink)" />
              <text x={cx} y="378" textAnchor="middle">
                r = {fmt(r)} cm · S ≈ {(Math.PI * r * r).toFixed(2)} cm²
              </text>
            </g>
          ))}
          <text x="400" y="72" textAnchor="middle">
            1 格 = 1 cm
          </text>
          <text x="400" y="101" textAnchor="middle">
            同一缩放比例
          </text>
        </svg>
      </div>
      <div className="radius-scale-results">
        <div>
          <span>半径比 B/A</span>
          <strong>{fmt(q.length)} 倍</strong>
        </div>
        <div>
          <span>周长比 B/A</span>
          <strong>{fmt(q.length)} 倍</strong>
        </div>
        <div>
          <span>面积比 B/A</span>
          <strong>{fmt(q.area)} 倍</strong>
        </div>
      </div>
      <div className="radius-scale-equations">
        <p>Cᴮ / Cᴬ = 2πrᴮ / 2πrᴬ = {fmt(q.length)}</p>
        <p>
          Sᴮ / Sᴬ = (rᴮ / rᴬ)² = {fmt(q.length)}² ≈ {fmt(q.area)}
        </p>
      </div>
      <p>
        {instruction}
        双圆每厘米使用相同像素数；网格用于估读，边界格不能当作整格。参照仅在本节当前页面保留，圆面积使用
        πr² 计算，小数均为近似值。
      </p>
    </section>
  );
}
