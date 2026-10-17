import PolygonAngleGuide from "./PolygonAngleGuide.jsx";
import React from "react";
import { polygonTurn, thermalLengths } from "./vividLessons.mjs";
import "./ObservableScene.css";
const ink = "var(--ui-ink)",
  primary = "var(--ui-primary)",
  gold = "var(--ui-gold)",
  muted = "var(--ui-muted)",
  line = "var(--ui-line)";
export default function VividScene({
  id,
  p,
  time,
  guides = true,
  trace = true,
}) {
  if (id === "polygon-turn") {
    const q = polygonTurn(p, time),
      n = p.sides,
      points = Array.from({ length: n }, (_, i) => {
        const a = -Math.PI / 2 - (p.direction * i * 2 * Math.PI) / n;
        return [310 + 190 * Math.cos(a), 315 + 190 * Math.sin(a)];
      }),
      a = points[q.index],
      b = points[(q.index + 1) % n],
      next = points[(q.index + 2) % n],
      x = a[0] + (b[0] - a[0]) * q.travel,
      y = a[1] + (b[1] - a[1]) * q.travel,
      angle =
        (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI -
        p.direction * q.exterior * q.turn;
    return (
      <svg
        className="motion-diagram observable-scene"
        viewBox="0 0 900 620"
        role="img"
        aria-label="多边形行走与外角累积演示"
      >
        <text x="35" y="44" className="observable-title">
          走完一周，朝向回到起点
        </text>
        <text x="35" y="80">
          {n}边形 · {p.direction === 1 ? "逆时针" : "顺时针"} · 先走直线，再转弯
        </text>
        <polygon
          points={points.map((v) => v.join(",")).join(" ")}
          fill={primary}
          fillOpacity=".05"
          stroke={line}
          strokeWidth="3"
        />
        {points.map((v, i) => (
          <g key={i}>
            <circle cx={v[0]} cy={v[1]} r="5" fill={ink} />
            {guides && (
              <text
                x={310 + (v[0] - 310) * 1.16}
                y={323 + (v[1] - 315) * 1.16}
                textAnchor="middle"
              >
                {i + 1}
              </text>
            )}
            {trace && i < q.index && (
              <path
                d={`M${v} L${points[(i + 1) % n]}`}
                stroke={primary}
                strokeWidth="4"
              />
            )}
          </g>
        ))}
        {trace && (
          <path
            d={`M${a} L${x},${y}`}
            fill="none"
            stroke={primary}
            strokeWidth="4"
          />
        )}
        {guides && (
          <>
            <PolygonAngleGuide
              a={a}
              b={b}
              exterior={q.exterior}
              interior={q.interior}
              direction={p.direction}
              turn={q.turn}
            />

            <path
              d={`M${a} L${b[0] + (b[0] - a[0]) * 0.25},${b[1] + (b[1] - a[1]) * 0.25}`}
              stroke={muted}
              strokeWidth="2"
              strokeDasharray="7 6"
            />
            <path d={`M${b} L${next}`} stroke={gold} strokeWidth="4" />
            <text
              x="310"
              y="310"
              textAnchor="middle"
              className="observable-number"
            >
              外角 {q.exterior.toFixed(1)}°
            </text>
            <text x="310" y="348" textAnchor="middle">
              内角 {q.interior.toFixed(1)}°
            </text>
          </>
        )}
        <g transform={`translate(${x} ${y}) rotate(${angle})`}>
          <circle
            r="19"
            fill="var(--ui-surface)"
            stroke={primary}
            strokeWidth="2"
          />
          <path d="M14 0L-9 -9L-5 0L-9 9Z" fill={primary} />
        </g>
        <text x="600" y="150">
          转角累积
        </text>
        <circle
          cx="700"
          cy="280"
          r="90"
          fill="none"
          stroke={line}
          strokeWidth="18"
        />
        <circle
          cx="700"
          cy="280"
          r="90"
          fill="none"
          stroke={primary}
          strokeWidth="18"
          pathLength="360"
          strokeDasharray={`${Math.abs(q.total)} ${360 - Math.abs(q.total)}`}
          transform="rotate(-90 700 280)"
          strokeDashoffset={p.direction === 1 ? Math.abs(q.total) : 0}
        />
        <text x="700" y="289" textAnchor="middle" className="observable-number">
          {q.total.toFixed(0)}°
        </text>
        {Array.from({ length: n }, (_, i) => {
          const r = (i * 2 * Math.PI) / n;
          return (
            <line
              key={i}
              x1={700 + 80 * Math.sin(r)}
              y1={280 - 80 * Math.cos(r)}
              x2={700 + 100 * Math.sin(r)}
              y2={280 - 100 * Math.cos(r)}
              stroke="var(--ui-surface)"
              strokeWidth="3"
            />
          );
        })}
        <text x="590" y="435">
          {n} × {q.exterior.toFixed(1)}° = 360°
        </text>
        <text x="590" y="477">
          {time >= 6
            ? "一周完成 · 朝向复原"
            : q.travel < 1
              ? "正在直行 · 转角不增加"
              : "正在转弯 · 累计转角增加"}
        </text>
        {guides && (
          <text x="35" y="548">
            金色实弧：外角　灰色虚弧：内角　绿色弧：本次已转过
          </text>
        )}
        <text x="35" y="580">
          箭头表示前进朝向；圆环只累计转弯，不累计直线行走。
        </text>
      </svg>
    );
  }
  const rows = thermalLengths(p, time),
    base = 95 + p.length * 65;
  return (
    <svg
      className="motion-diagram observable-scene"
      viewBox="0 0 900 620"
      role="img"
      aria-label="三种金属热膨胀及接缝对照"
    >
      <text x="35" y="44" className="observable-title">
        同温差、同杆长，材料决定伸长
      </text>
      <text x="35" y="80">
        当前温差 {rows[0].delta.toFixed(1)}°C · 初始杆长 {p.length.toFixed(1)} m
      </text>
      <text x="95" y="122">
        杆端位移 ×200
      </text>
      <text x="600" y="122">
        接缝局部 · 10 px/mm
      </text>
      {rows.map((m, i) => {
        const y = 182 + i * 128,
          end = base + m.extension * 13,
          gap = Math.max(0, m.remaining) * 10;
        return (
          <g key={m.name}>
            <text x="35" y={y + 5}>
              {m.name}
            </text>
            <rect x="78" y={y - 32} width="17" height="64" fill={muted} />
            <rect
              x="95"
              y={y - 16}
              width={end - 95}
              height="32"
              rx="3"
              fill={[gold, primary, muted][i]}
              fillOpacity=".7"
              stroke={ink}
            />
            <path
              d={`M95 ${y - 9} H${end - 4}`}
              stroke="var(--ui-surface)"
              opacity=".6"
            />
            {guides && (
              <line
                x1={base}
                x2={base}
                y1={y - 36}
                y2={y + 32}
                stroke={ink}
                strokeDasharray="5 5"
              />
            )}
            <text x="95" y={y + 54}>
              {m.extension >= 0 ? "+" : ""}
              {m.extension.toFixed(2)} mm · α={m.alpha}×10⁻⁶/°C
            </text>
            <rect
              x="600"
              y={y - 18}
              width={190 - gap}
              height="36"
              fill={primary}
              fillOpacity=".35"
              stroke={primary}
            />
            <rect x="790" y={y - 28} width="34" height="56" fill={muted} />
            <line
              x1={790 - p.gap * 10}
              x2={790 - p.gap * 10}
              y1={y - 30}
              y2={y + 25}
              stroke={gold}
              strokeDasharray="4 4"
            />
            <text x="596" y={y + 54}>
              {m.remaining >= 0
                ? `余缝 ${m.remaining.toFixed(2)} mm`
                : `已抵接 · 超出 ${(-m.remaining).toFixed(2)} mm`}
            </text>
          </g>
        );
      })}
      <text x="35" y="568">
        虚线：初始位置。杆长图显示自由伸长需求；接缝图抵接后停止位移。
      </text>
      <text x="35" y="603">
        示意进度不是加热时间；不模拟受约束后的应力与变形。
      </text>
    </svg>
  );
}
