import React, { useState } from "react";
import Button from "./LabButton.jsx";
import "./ObservableScene.css";
export function coneSliceBounds(p, n) {
  const dz = p.height / n;
  const slices = Array.from({ length: n }, (_, i) => ({
    z: i * dz,
    height: dz,
    inner: p.radius * (1 - (i + 1) / n),
    outer: p.radius * (1 - i / n),
  }));
  const sum = (key) =>
    slices.reduce((v, s) => v + Math.PI * s[key] ** 2 * dz, 0);
  return {
    slices,
    lower: sum("inner"),
    upper: sum("outer"),
    exact: (Math.PI * p.radius ** 2 * p.height) / 3,
  };
}
export default function ConeSlices({ p, time, guides = true, onSeek }) {
  const [count, setCount] = useState(8),
    q = coneSliceBounds(p, count);
  const shown = Math.min(
    count,
    Math.floor((Math.max(0, time) / 6) * count + 1e-9),
  );
  const scale = 38,
    base = 420,
    top = base - p.height * scale;
  return (
    <div>
      <div className="motion-shortcuts" role="group" aria-label="薄片数量">
        {[4, 8, 16, 32].map((n) => (
          <Button
            key={n}
            aria-pressed={count === n}
            primary={count === n}
            onClick={() => {
              setCount(n);
              onSeek?.(6);
            }}
          >
            {n} 层
          </Button>
        ))}
      </div>
      <svg
        className="motion-diagram observable-scene"
        viewBox="0 0 900 620"
        role="img"
        aria-label="内接与外接薄圆柱夹逼圆锥体积"
      >
        <text x="35" y="40" className="observable-title">
          用两组薄圆柱，把圆锥夹在中间
        </text>
        <text x="35" y="78">
          轴截面示意：每个矩形代表一片薄圆柱，不是长方体
        </text>
        {[
          {
            x: 230,
            key: "inner",
            name: "内接：总是偏小",
            color: "var(--ui-primary)",
          },
          {
            x: 650,
            key: "outer",
            name: "外接：总是偏大",
            color: "var(--ui-gold)",
          },
        ].map(({ x, key, name, color }) => (
          <g key={key}>
            <text x={x - 120} y="125">
              {name}
            </text>
            <path
              d={`M${x - p.radius * scale} ${base}L${x} ${top}L${x + p.radius * scale} ${base}Z`}
              fill="var(--ui-primary)"
              fillOpacity=".04"
              stroke="var(--ui-muted)"
              strokeWidth="2"
              strokeDasharray="6 5"
            />
            {q.slices.slice(0, shown).map((s, i) => (
              <rect
                key={i}
                x={x - s[key] * scale}
                y={base - (s.z + s.height) * scale}
                width={2 * s[key] * scale}
                height={s.height * scale}
                fill={color}
                fillOpacity=".22"
                stroke={color}
                strokeWidth="1"
              />
            ))}
            {guides && (
              <path
                d={`M${x} ${top}V${base}H${x + p.radius * scale}`}
                fill="none"
                stroke="var(--ui-muted)"
                strokeDasharray="3 5"
              />
            )}
            <text x={x - 125} y="465">
              完整 {count} 层：
              {(key === "inner" ? q.lower : q.upper).toFixed(2)} cm³
            </text>
          </g>
        ))}
        <text x="35" y="510">
          {q.lower.toFixed(2)} ≤ 真实体积 {q.exact.toFixed(2)} ≤{" "}
          {q.upper.toFixed(2)} cm³
        </text>
        <text x="35" y="550">
          上下界间距：{(q.upper - q.lower).toFixed(2)} cm³　层厚：
          {(p.height / count).toFixed(3)} cm
        </text>
        <text x="35" y="590">
          已显示 {shown}/{count} 层；薄片越细，两侧越接近 πr²h / 3
        </text>
      </svg>
    </div>
  );
}
