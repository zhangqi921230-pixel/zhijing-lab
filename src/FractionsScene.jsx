import React, { useState, useRef, useEffect } from "react";
export function fractionLayout(n, d) {
  const wholes = Math.max(1, Math.ceil(n / d)),
    columns = Math.min(3, wholes),
    rows = Math.ceil(wholes / columns),
    radius = wholes === 1 ? 133 : Math.min(64, 125 / rows);
  return {
    wholes,
    columns,
    rows,
    radius,
    ticks: wholes * d,
    marker: 90 + (n / (wholes * d)) * 720,
  };
}
export function sectorPath(cx, cy, r, index, count) {
  if (count === 1)
    return `M${cx} ${cy - r}A${r} ${r} 0 1 1 ${cx} ${cy + r}A${r} ${r} 0 1 1 ${cx} ${cy - r}Z`;
  const a = (index * 2 * Math.PI) / count - Math.PI / 2,
    b = ((index + 1) * 2 * Math.PI) / count - Math.PI / 2;
  return `M${cx} ${cy}L${cx + r * Math.cos(a)} ${cy + r * Math.sin(a)}A${r} ${r} 0 ${count === 2 ? 0 : b - a > Math.PI ? 1 : 0} 1 ${cx + r * Math.cos(b)} ${cy + r * Math.sin(b)}Z`;
}
export default function FractionsScene({ p, onChange }) {
  const host = useRef(null),
    [compact, setCompact] = useState(false);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) =>
      setCompact(entry.contentRect.width < 600),
    );
    observer.observe(host.current);
    return () => observer.disconnect();
  }, []);
  const q = fractionLayout(p.n, p.d),
    take = (i) =>
      i < 12 &&
      onChange("n", Math.max(0, Math.min(12, p.n === i + 1 ? i : i + 1)));
  const tile = (i) => ({
    role: "button",
    tabIndex: i < 12 ? 0 : -1,
    "aria-disabled": i >= 12,
    "aria-label": `选取到第 ${i + 1} 份`,
    "aria-pressed": i < p.n,
    onClick: () => take(i),
    onKeyDown: (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        take(i);
      }
    },
  });
  return (
    <div className="fraction-studio" ref={host}>
      <svg
        viewBox={compact ? "0 0 540 670" : "0 0 900 570"}
        aria-label="分数教具，圆形、分数条和数轴联动"
        role="group"
      >
        <defs>
          <linearGradient id="fraction-ivory" x2=".8" y2="1">
            <stop stopColor="#fcf8e9" />
            <stop offset="1" stopColor="#e2d7bd" />
          </linearGradient>
          <linearGradient id="fraction-teal" x2=".8" y2="1">
            <stop stopColor="#326d61" />
            <stop offset="1" stopColor="#15483e" />
          </linearGradient>
          <filter id="fraction-shadow" x="-.3" y="-.3" width="1.6" height="1.7">
            <feDropShadow
              dx="3"
              dy="7"
              stdDeviation="5"
              floodColor="#65553a"
              floodOpacity=".25"
            />
          </filter>
          <pattern
            id="fraction-grain"
            width="13"
            height="11"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M1 3h2M7 8h1M10 1h2"
              stroke="#836b44"
              strokeOpacity=".09"
              strokeWidth=".5"
            />
          </pattern>
        </defs>
        <rect width="900" height="700" fill="var(--ui-paper)" />
        <text
          x="55"
          y="35"
          fill="#6c7969"
          fontSize={compact ? 18 : 12}
          letterSpacing="2"
        >
          把一个整体，平均分成相同的份
        </text>
        <g
          transform={
            compact
              ? `translate(${q.wholes === 1 ? -80 : -20},-10) scale(${q.wholes === 1 ? 0.9 : 0.75})`
              : undefined
          }
        >
          {Array.from({ length: q.wholes }, (_, whole) => {
            const cx =
                q.wholes === 1
                  ? 300
                  : 290 +
                    ((whole % q.columns) - (q.columns - 1) / 2) *
                      (380 / q.columns),
              cy =
                q.wholes === 1
                  ? 205
                  : 100 + Math.floor(whole / q.columns) * (245 / q.rows);
            return (
              <g key={whole}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={q.radius + 9}
                  fill="#d5c4a3"
                  filter="url(#fraction-shadow)"
                />
                <circle
                  cx={cx}
                  cy={cy}
                  r={q.radius + 6}
                  fill="url(#fraction-ivory)"
                  stroke="#b39d75"
                  strokeWidth="1"
                />
                {Array.from({ length: p.d }, (_, piece) => {
                  const i = whole * p.d + piece;
                  return (
                    <path
                      key={piece}
                      {...tile(i)}
                      className="fraction-piece"
                      d={sectorPath(cx, cy, q.radius, piece, p.d)}
                      fill={`url(#fraction-${i < p.n ? "teal" : "ivory"})`}
                      stroke="#baad91"
                      strokeWidth="1.2"
                    />
                  );
                })}
                <circle
                  cx={cx}
                  cy={cy}
                  r={q.radius}
                  fill="url(#fraction-grain)"
                  pointerEvents="none"
                />
                <circle
                  cx={cx}
                  cy={cy}
                  r={q.radius + 2}
                  fill="none"
                  stroke="#fffaf0"
                  strokeWidth="1.5"
                  pointerEvents="none"
                />
              </g>
            );
          })}
        </g>
        <g
          transform={compact ? "translate(-245,0)" : undefined}
          fill="#163f35"
          textAnchor="middle"
          fontFamily="Georgia,serif"
        >
          <text x="665" y="143" fontSize="85">
            {p.n}
          </text>
          <path d="M624 165H706" stroke="var(--ui-ink)" strokeWidth="4" />
          <text x="665" y="246" fontSize="85">
            {p.d}
          </text>
          <text x="665" y="294" fontSize="27" fill="#667264">
            {Math.abs(p.n / p.d - Number((p.n / p.d).toFixed(4))) > 1e-10
              ? "≈ "
              : ""}
            {Number((p.n / p.d).toFixed(4))}
          </text>
          <text x="665" y="330" fontSize="25" fill="#667264">
            {Math.abs(
              (p.n / p.d) * 100 - Number(((p.n / p.d) * 100).toFixed(2)),
            ) > 1e-10
              ? "≈ "
              : ""}
            {Number(((p.n / p.d) * 100).toFixed(2))}%
          </text>
        </g>
        <g transform={compact ? "translate(-395,110)" : undefined}>
          <rect
            x="558"
            y="348"
            width="214"
            height="67"
            rx="8"
            fill="var(--ui-surface)"
          />
          <text
            x="665"
            y="375"
            textAnchor="middle"
            fill="#254d40"
            fontSize="16"
          >
            每个整体平均分成 {p.d} 份
          </text>
          <text
            x="665"
            y="399"
            textAnchor="middle"
            fill="#587363"
            fontSize="14"
          >
            选取 {p.n} 份，每份是 1/{p.d}
          </text>
        </g>
        <g transform={compact ? "translate(-35,0)" : undefined}>
          {Array.from({ length: q.wholes }, (_, whole) => {
            const columns = q.wholes > 4 ? 2 : 1,
              rows = Math.ceil(q.wholes / columns),
              width = 420 / columns - 8,
              h = Math.min(40, 74 / rows - 3),
              x = 90 + (whole % columns) * 210,
              y = 365 + Math.floor(whole / columns) * (h + 3);
            return (
              <g key={whole}>
                <rect
                  x={x - 4}
                  y={y - 4}
                  width={width + 8}
                  height={h + 8}
                  rx="3"
                  fill="#d5c4a3"
                  stroke="#b2a083"
                />
                {Array.from({ length: p.d }, (_, i) => (
                  <rect
                    key={i}
                    {...tile(whole * p.d + i)}
                    className="fraction-piece"
                    x={x + (i * width) / p.d}
                    y={y}
                    width={width / p.d - 1}
                    height={h}
                    rx="1"
                    fill={`url(#fraction-${whole * p.d + i < p.n ? "teal" : "ivory"})`}
                    stroke="#b5aa90"
                    strokeWidth=".8"
                  />
                ))}
              </g>
            );
          })}
        </g>
        <text
          x={compact ? 55 : 90}
          y={compact ? 548 : 453}
          fill="#6d796c"
          fontSize={compact ? 16 : 12}
        >
          点击一份选取到该份 · 再点末份减少一份
        </text>
        <g
          transform={compact ? "translate(0,95)" : undefined}
          role="slider"
          tabIndex="0"
          aria-label="数轴上的取出份数"
          aria-valuemin="0"
          aria-valuemax="12"
          aria-valuenow={p.n}
          onKeyDown={(e) => {
            if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) {
              e.preventDefault();
              onChange(
                "n",
                e.key === "Home"
                  ? 0
                  : e.key === "End"
                    ? 12
                    : Math.max(
                        0,
                        Math.min(12, p.n + (e.key === "ArrowRight" ? 1 : -1)),
                      ),
              );
            }
          }}
        >
          <path
            d={compact ? "M55 492H475" : "M90 492H810"}
            stroke="var(--ui-muted)"
            strokeWidth="1.8"
          />
          {Array.from({ length: q.ticks + 1 }, (_, i) => (
            <g key={i}>
              <path
                d={`M${(compact ? 55 : 90) + (i * (compact ? 420 : 720)) / q.ticks} 485v14`}
                stroke="var(--ui-muted)"
              />
              {(q.ticks <= 12 || i % p.d === 0) && (
                <text
                  x={
                    (compact ? 55 : 90) + (i * (compact ? 420 : 720)) / q.ticks
                  }
                  y="530"
                  textAnchor="middle"
                  fill="#526757"
                  fontSize={compact ? 18 : 14}
                >
                  {i % p.d === 0 ? i / p.d : `${i}/${p.d}`}
                </text>
              )}
            </g>
          ))}
          <circle
            cx={compact ? 55 + (p.n / q.ticks) * 420 : q.marker}
            cy="492"
            r="8"
            fill="#d99b3d"
            stroke="#fffaf0"
            strokeWidth="2"
          />
        </g>
      </svg>
    </div>
  );
}
