import React, { useMemo, useId } from "react";
import { polarPoint, projectileState } from "./visualModels.mjs";
export default function VisualMotionScene({ id, p, time, guides, trace }) {
  const uid = useId().replace(/:/g, "");
  const polar = id === "polar";
  const points = useMemo(
    () =>
      Array.from({ length: 241 }, (_, i) =>
        polar
          ? polarPoint(p, (i * Math.PI) / 120)
          : projectileState(p, i / 240),
      ),
    [polar, p],
  );
  const other = useMemo(
    () =>
      polar
        ? []
        : Array.from({ length: 121 }, (_, i) =>
            projectileState({ ...p, angle: 90 - p.angle }, i / 120),
          ),
    [polar, p],
  );
  const q = polar
    ? polarPoint(p, (time * Math.PI) / 3)
    : projectileState(p, time / 6);
  const extent = polar
    ? null
    : {
        x: Math.max(10, ...points.map((v) => v.x), ...other.map((v) => v.x)),
        y: Math.max(10, ...points.map((v) => v.y), ...other.map((v) => v.y)),
      };
  const scale = polar
    ? p.shape === 1
      ? 28
      : 56
    : Math.min(710 / extent.x, 300 / extent.y);
  const x = (v) => (polar ? 450 : 85) + v * scale,
    y = (v) => (polar ? 240 : 385) - v * scale;
  const path = (arr) =>
    arr.map((v, i) => `${i ? "L" : "M"}${x(v.x)},${y(v.y)}`).join(" ");
  const visible = points.slice(0, Math.floor((time / 6) * 240) + 1);
  return (
    <svg
      className="motion-diagram"
      viewBox="0 0 900 480"
      role="img"
      aria-label={
        polar ? "极坐标射线与解析曲线描迹" : "抛体轨迹、等时间点和速度分量"
      }
    >
      <defs>
        <marker
          id={uid}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M0 0L10 5L0 10Z" fill="var(--ui-primary)" />
        </marker>
      </defs>
      <rect width="900" height="480" fill="var(--ui-paper)" />
      {polar ? (
        <g fill="none" stroke="var(--ui-line)">
          {(p.shape === 1 ? [1, 2, 3, 4, 5, 6] : [1, 2, 3]).map((r) => (
            <circle key={r} cx="450" cy="240" r={r * scale} />
          ))}
          {Array.from({ length: 12 }, (_, i) => (
            <line
              key={i}
              x1="450"
              y1="240"
              x2={450 + 168 * Math.cos((i * Math.PI) / 6)}
              y2={240 - 168 * Math.sin((i * Math.PI) / 6)}
            />
          ))}
        </g>
      ) : (
        <g stroke="var(--ui-line)">
          {Array.from({ length: 6 }, (_, i) => (
            <g key={i}>
              <line x1="85" x2="825" y1={385 - i * 60} y2={385 - i * 60} />
              <text x="16" y={390 - i * 60} stroke="none">
                {((i * 60) / scale).toFixed(0)}
              </text>
            </g>
          ))}
        </g>
      )}
      <path
        d={polar ? "M240 240H660M450 60V420" : "M85 65V385H825"}
        fill="none"
        stroke="var(--ui-muted)"
      />
      <text x="30" y="35">
        {polar ? "极坐标 · θ 旋转 / r 伸缩" : "轨迹 · 横纵同尺度，单位 m"}
      </text>
      {!polar && (
        <>
          <text x="770" y="415">
            {(700 / scale).toFixed(1)} m
          </text>
          <text x="85" y="415">
            0
          </text>
        </>
      )}
      {(!polar || trace) && (
        <>
          <path
            d={path(points)}
            stroke="var(--ui-line)"
            fill="none"
            strokeWidth="2"
          />
          <path
            d={path(visible)}
            stroke="var(--ui-primary)"
            fill="none"
            strokeWidth="3"
          />
        </>
      )}
      {!polar && guides && (
        <>
          <path
            d={path(other)}
            stroke="var(--ui-muted)"
            strokeDasharray="7 6"
            fill="none"
            strokeWidth="2"
          />
          {points
            .filter((_, i) => i % 20 === 0)
            .map((v, i) => (
              <circle
                key={i}
                cx={x(v.x)}
                cy={y(v.y)}
                r="3"
                fill="var(--ui-primary)"
              />
            ))}
          <text x="470" y="35">
            虚线：{90 - p.angle}° 参考轨迹
          </text>
        </>
      )}
      {guides &&
        (polar ? (
          <>
            <line
              x1="450"
              y1="240"
              x2={450 + 175 * Math.cos(q.theta)}
              y2={240 - 175 * Math.sin(q.theta)}
              stroke="var(--ui-muted)"
              strokeDasharray="5 5"
            />
            <line
              x1="450"
              y1="240"
              x2={x(q.x)}
              y2={y(q.y)}
              stroke="var(--ui-primary)"
              strokeWidth="2"
            />
            <text x="30" y="445">
              θ={(time * 60).toFixed(0)}° · r={q.r.toFixed(2)}
              {q.r < 0 ? " · 负极径：位于射线反方向" : ""}
            </text>
          </>
        ) : (
          <>
            <path
              d={`${q.vx ? `M${x(q.x)} ${y(q.y)}h${q.vx * 2}` : ""}${q.vy ? `M${x(q.x)} ${y(q.y)}v${-q.vy * 2}` : ""}`}
              fill="none"
              stroke="var(--ui-primary)"
              strokeWidth="2"
              markerEnd={`url(#${uid})`}
            />
            <text x="30" y="455">
              速度分量：vₓ={q.vx.toFixed(1)}，vᵧ={q.vy.toFixed(1)} m/s ·
              箭头独立比例
            </text>
          </>
        ))}
      <circle
        cx={x(q.x)}
        cy={y(q.y)}
        r="8"
        fill="var(--ui-primary)"
        stroke="var(--ui-paper)"
        strokeWidth="2"
      />
      {!polar && (
        <text x="600" y="455">
          实际 t={q.t.toFixed(2)} s
        </text>
      )}
    </svg>
  );
}
