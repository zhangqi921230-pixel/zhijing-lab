import GearWheel from "./GearWheel.jsx";
import React from "react";
import { mechanismState } from "./mechanismLessons.mjs";
import "./ObservableScene.css";
export default function MechanismScene({
  id,
  p,
  time,
  chapter = 0,
  guides = true,
}) {
  const q = mechanismState(id, p, time);
  if (id === "gear-drive") {
    const r1 = p.driver * 3.6,
      r2 = p.driven * 3.6,
      x1 = 450 - r2,
      x2 = 450 + r1,
      a = (q.angle * 180) / Math.PI,
      b = (-a * p.driver) / p.driven + 180 - 90 / p.driven;
    return (
      <svg
        className="motion-diagram observable-scene"
        viewBox="0 0 900 620"
        role="img"
        aria-label="两只外啮合齿轮的转向与转速对照"
      >
        <text x="35" y="45" className="observable-title">
          {
            [
              "啮合点 · 两轮反向转动",
              "小轮驱动大轮 · 减速",
              "大轮驱动小轮 · 增速",
              "等齿数 · 等速反向",
              "调节输入 · 传动比不变",
            ][chapter]
          }
        </text>
        <text x="35" y="85">
          同模数齿轮　·　轮缘标记追踪转动
        </text>
        {[
          { x: x1, r: r1, z: p.driver, angle: a, color: "var(--ui-primary)" },
          { x: x2, r: r2, z: p.driven, angle: b, color: "var(--ui-gold)" },
        ].map((g, i) => (
          <g key={i}>
            <g transform={`translate(${g.x} 300) rotate(${g.angle})`}>
              <GearWheel teeth={g.z} r={g.r} color={g.color} driver={i === 0} />
            </g>
            {guides && (
              <circle
                cx={g.x}
                cy="300"
                r={g.r}
                fill="none"
                stroke="var(--ui-muted)"
                strokeDasharray="5 6"
              />
            )}
            <text x={g.x} y="475" textAnchor="middle">
              {i === 0 ? "主动轮 ↻" : "从动轮 ↺"}　{g.z} 齿
            </text>
            <text x={g.x} y="515" textAnchor="middle">
              {(i === 0 ? q.input : q.output).toFixed(2)} r/min
            </text>
          </g>
        ))}
        {guides && (
          <>
            <path
              d={`M${x1 + r1} 160V430`}
              stroke="var(--ui-muted)"
              strokeDasharray="4 5"
            />
            <text x="450" y="135" textAnchor="middle">
              节圆相切 · 虚线为节圆
            </text>
          </>
        )}
        <text x="35" y="590">
          n₁ × z₁ = n₂ × z₂　·　轮齿为教学轮廓示意
        </text>
      </svg>
    );
  }
  const t = Math.max(0, Math.min(6, time));
  const y = t < 2 ? 260 + t * 20 : 300 + (t - 2) * 50,
    h = 100,
    w = 65 * Math.sqrt(p.volume / 300),
    center = 325;
  const arrow = (x, from, to, color, label) => (
    <g>
      <path
        d={`M${x} ${from}V${to}m-7 ${to < from ? 10 : -10}l7 ${to < from ? -10 : 10} 7 ${to < from ? 10 : -10}`}
        fill="none"
        stroke={color}
        strokeWidth="3"
      />
      <text x={x + 14} y={to}>
        {label}
      </text>
    </g>
  );
  return (
    <svg
      className="motion-diagram observable-scene"
      viewBox="0 0 900 620"
      role="img"
      aria-label="悬吊物体浸入液体的浮力与测力计读数"
    >
      <text x="35" y="45" className="observable-title">
        {
          [
            "缓慢浸入 · 浮力逐渐增大",
            "半浸没 · 只计算液下体积",
            "完全浸没 · 深度增加而浮力不变",
            "改变液体 · 同体积不同浮力",
            "保持体积 · 对比重力与浮力",
          ][chapter]
        }
      </text>
      <path
        d="M85 550V75H325V90M60 550H115"
        fill="none"
        stroke="var(--ui-muted)"
        strokeWidth="6"
      />
      <text x="355" y="105">
        悬吊测力装置
      </text>
      <text x="355" y="139" style={{ fontSize: 16 }}>
        缓慢放线 · 保持张紧
      </text>
      {[350, 400, 450, 500].map((level) => (
        <path
          key={level}
          d={`M145 ${level}h16`}
          stroke="var(--ui-muted)"
          strokeWidth="2"
        />
      ))}
      <path
        d="M140 260V555H510V260"
        fill="none"
        stroke="var(--ui-muted)"
        strokeWidth="5"
      />
      <rect
        x="143"
        y="300"
        width="364"
        height="252"
        fill="#469bbc"
        fillOpacity=".17"
      />
      <path d="M143 300H507" stroke="#469bbc" strokeWidth="3" />
      <path
        d={`M${center} 152V${y - h}`}
        stroke="var(--ui-ink)"
        strokeWidth="2"
      />
      <rect
        x="287"
        y="90"
        width="76"
        height="62"
        rx="8"
        fill="var(--ui-surface)"
        stroke="var(--ui-primary)"
        strokeWidth="2"
      />
      <text x="325" y="126" textAnchor="middle">
        {q.tension.toFixed(2)} N
      </text>
      <rect
        x={center - w / 2}
        y={y - h}
        width={w}
        height={h}
        fill="var(--ui-gold)"
        fillOpacity=".45"
        stroke="var(--ui-gold)"
        strokeWidth="3"
      />
      <rect
        x={center - w / 2}
        y={Math.max(y - h, 300)}
        width={w}
        height={h * q.fraction}
        fill="#469bbc"
        fillOpacity=".35"
      />
      <text x="155" y="285">
        液面
      </text>
      <text x="35" y="585">
        蓝色覆盖部分为排水体积；悬线保持张紧，物体不触底
      </text>
      <text x="565" y="150">
        三力平衡 · 准静态悬吊
      </text>
      {guides && (
        <>
          {arrow(615, 320, 320 - q.tension * 9, "var(--ui-primary)", "T")}
          {q.buoyancy > 0 &&
            arrow(710, 320, 320 - q.buoyancy * 9, "#469bbc", "F浮")}
          {arrow(660, 320, 320 + q.weight * 9, "var(--ui-gold)", "G")}
        </>
      )}
      <text x="560" y="475">
        重力 G = {q.weight.toFixed(2)} N
      </text>
      <text x="560" y="515">
        T + F浮 = G
      </text>
      <text x="560" y="550">
        浸没 {(q.fraction * 100).toFixed(0)}%　·　{q.displaced.toFixed(0)} cm³
      </text>
    </svg>
  );
}
