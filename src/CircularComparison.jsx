import React, { useId } from "react";
import { circularComparison } from "./observableModels.mjs";
export default function CircularComparison({ p, time, chapter, guides }) {
  const uid = useId().replace(/:/g, "");
  const q = circularComparison(p, chapter, time);
  const names = { speed: "线速度", radius: "半径", mass: "质量" };
  const rows = [
    {
      p: q.reference,
      q: q.referenceState,
      label: "参照组",
      x: 240,
      color: "var(--ui-muted)",
    },
    {
      p,
      q: q.currentState,
      label: "当前组",
      x: 660,
      color: "var(--ui-primary)",
    },
  ];
  return (
    <svg
      className="motion-diagram observable-scene"
      viewBox="0 0 900 720"
      role="img"
      aria-label="圆周运动控制变量同屏对照"
    >
      <defs>
        <marker
          id={`${uid}-arrow`}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M0 0L10 5L0 10Z" fill="context-stroke" />
        </marker>
      </defs>
      <text x="35" y="42" className="observable-title">
        只改变{names[q.key]}，其他条件相同
      </text>
      <text x="35" y="78">
        同一时间 · 同一空间比例尺 · 从右端同时出发
      </text>
      <path d="M450 112V565" stroke="var(--ui-line)" />
      {rows.map((row, i) => {
        const x = row.x + row.q.x * 44,
          y = 330 - row.q.y * 44;
        const forceLength = Math.min(60, row.p.radius * 44 * 0.8);
        return (
          <g key={row.label} data-comparison={i}>
            <text
              x={row.x}
              y="122"
              textAnchor="middle"
              className="observable-number"
            >
              {row.label}
            </text>
            <text x={row.x} y="158" textAnchor="middle">
              r {row.p.radius} m · v {row.p.speed} m/s · m {row.p.mass} kg
            </text>
            <circle
              cx={row.x}
              cy="330"
              r={row.p.radius * 44}
              fill={row.color}
              fillOpacity=".04"
              stroke={row.color}
              strokeWidth="2"
            />
            <circle
              cx={row.x + row.p.radius * 44}
              cy="330"
              r="5"
              fill="var(--ui-surface)"
              stroke={row.color}
            />
            <circle cx={row.x} cy="330" r="4" fill="var(--ui-ink)" />
            {guides && (
              <>
                <path
                  d={`M${row.x} 330L${x} ${y}`}
                  stroke="var(--ui-muted)"
                  strokeDasharray="6 5"
                />
                <path
                  d={`M${x} ${y}l${row.q.vx * 18} ${-row.q.vy * 18}`}
                  stroke="var(--ui-primary)"
                  strokeWidth="3"
                  markerEnd={`url(#${uid}-arrow)`}
                />
                <path
                  d={`M${x} ${y}l${-Math.cos(row.q.angle) * forceLength} ${Math.sin(row.q.angle) * forceLength}`}
                  stroke="var(--ui-gold)"
                  strokeWidth="3"
                  markerEnd={`url(#${uid}-arrow)`}
                />
              </>
            )}
            <circle
              data-comparison-ball={i}
              cx={x}
              cy={y}
              r="11"
              fill={row.color}
              stroke="var(--ui-surface)"
              strokeWidth="3"
            />
            <text x={row.x} y="506" textAnchor="middle">
              a = {row.q.acceleration.toFixed(2)} m/s² · T ={" "}
              {row.q.period.toFixed(2)} s
            </text>
            <text x={row.x} y="540" textAnchor="middle">
              经过 {(time / row.q.period).toFixed(2)} 周
            </text>
          </g>
        );
      })}
      <text x="35" y="589">
        向心合力 · 两条长度共用 0—48 N 刻度
      </text>
      {rows.map((row, i) => (
        <g key={i}>
          <text x="35" y={624 + i * 34}>
            {row.label}
          </text>
          <path
            d={`M126 ${617 + i * 34}H510`}
            stroke="var(--ui-line)"
            strokeWidth="12"
          />
          <path
            data-force-bar={i}
            d={`M126 ${617 + i * 34}h${row.q.force * 8}`}
            stroke={row.color}
            strokeWidth="12"
          />
          <text x="540" y={624 + i * 34}>
            {row.q.force.toFixed(2)} N
          </text>
        </g>
      ))}
      <text x="700" y="624">
        当前 / 参照
      </text>
      <text x="700" y="660" className="observable-number">
        {q.ratio.toFixed(2)} 倍
      </text>
      <text x="35" y="703">
        金色箭头仅示方向；力的大小比较下方横条。当前时间 {time.toFixed(2)} s
      </text>
    </svg>
  );
}
