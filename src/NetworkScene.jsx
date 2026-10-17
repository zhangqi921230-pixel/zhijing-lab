import React from "react";
import { networkState } from "./networkLesson.mjs";
const ink = "var(--ui-ink)",
  gold = "var(--ui-gold)",
  green = "var(--ui-primary)";
export default function NetworkScene({ p, time, guides = true }) {
  const q = networkState(p),
    parallel = p.mode === 1,
    top = parallel ? 110 : 150;
  const resistor = (x, y, label, value, color) => (
    <g>
      <rect
        x={x - 55}
        y={y - 17}
        width="110"
        height="34"
        fill="var(--ui-paper)"
        stroke={color}
        strokeWidth="2"
      />
      <text x={x} y={y + 6} textAnchor="middle">
        {label} · {value} Ω
      </text>
    </g>
  );
  return (
    <svg
      className="motion-diagram"
      viewBox="0 0 900 600"
      role="img"
      aria-label={
        parallel ? "两电阻并联与节点电流分配" : "两电阻串联与电压分配"
      }
      style={{
        width: "100%",
        display: "block",
        fill: ink,
        font: '18px "Microsoft YaHei", sans-serif',
      }}
    >
      <rect width="900" height="600" fill="var(--ui-paper)" />
      <text x="32" y="38">
        {parallel
          ? "并联 · 两端分别接到同一对节点"
          : "串联 · 同一电流依次流过两只电阻"}
      </text>
      <path
        d={`M140 243V${top}H220 M260 ${top}H${parallel ? 320 : 750}${parallel ? "V340" : "V440"} M140 317V440H750${parallel ? "V190" : ""}`}
        fill="none"
        stroke={ink}
        strokeWidth="2"
      />
      {parallel ? (
        <>
          <path
            d="M320 190H750M320 340H355M395 340H750"
            stroke={ink}
            strokeWidth="2"
          />
          <path
            data-testid="branch-switch"
            d={`M355 340L395 ${q.branch2Connected ? 340 : 312}`}
            stroke={ink}
            strokeWidth="3"
          />
          <circle cx="355" cy="340" r="4" fill={ink} />
          <circle cx="395" cy="340" r="4" fill={ink} />
          <text x="338" y="383">
            S₂ {q.branch2Connected ? "闭合" : "断开"}
          </text>
          {[320, 750].map((x) =>
            [190, 340].map((y) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="4" fill={ink} />
            )),
          )}
          {resistor(530, 190, "R₁", p.r1, gold)}
          {resistor(530, 340, "R₂", p.r2, green)}
        </>
      ) : (
        <>
          {resistor(405, 150, "R₁", p.r1, gold)}
          {resistor(635, 150, "R₂", p.r2, green)}
        </>
      )}
      <circle
        cx="140"
        cy="280"
        r="37"
        fill="none"
        stroke={ink}
        strokeWidth="2"
      />
      <text x="140" y="273" textAnchor="middle">
        ＋
      </text>
      <text x="140" y="300" textAnchor="middle">
        −
      </text>
      <text x="45" y="350">
        电源 {p.u.toFixed(1)} V
      </text>
      <path
        d={`M220 ${top}L260 ${p.closed ? top : top - 27}`}
        stroke={ink}
        strokeWidth="3"
      />
      <circle cx="220" cy={top} r="4" fill={ink} />
      <circle cx="260" cy={top} r="4" fill={ink} />
      <text x="204" y={top - 40}>
        {p.closed ? "闭合" : "断开"}
      </text>
      {q.current > 0 && (
        <>
          {(parallel ? [190, 340] : [150]).map((y, j) => (
            <g
              key={y}
              visibility={j === 1 && !q.branch2Connected ? "hidden" : "visible"}
            >
              <path
                d={`M${parallel ? 430 : 315} ${y - 5}l9 5-9 5Z`}
                fill={j ? green : gold}
              />
              {Array.from({ length: 4 }, (_, i) => {
                const x =
                  (parallel ? 330 : 290) +
                  ((time / 3 + i / 4) % 1) * (parallel ? 400 : 430);
                const inResistor = parallel
                  ? x > 471 && x < 589
                  : (x > 346 && x < 464) || (x > 576 && x < 694);
                return inResistor ? null : (
                  <circle key={i} cx={x} cy={y} r="3" fill={j ? green : gold} />
                );
              })}
            </g>
          ))}
          <path d="M460 435l-9 5 9 5Z" fill={gold} />
          <circle
            cx={740 - ((time / 3) % 1) * 570}
            cy="440"
            r="3"
            fill={gold}
          />
        </>
      )}
      {guides && (
        <>
          <text x="330" y={parallel ? 163 : 210}>
            I₁ = {q.i1.toFixed(3)} A
          </text>
          <text x={parallel ? 330 : 570} y={parallel ? 283 : 210}>
            I₂ = {q.i2.toFixed(3)} A
          </text>
          <text x={parallel ? 555 : 330} y={parallel ? 234 : 253}>
            U₁ = {q.u1.toFixed(2)} V
          </text>
          <text x={parallel ? 555 : 570} y={parallel ? 384 : 253}>
            U₂ = {q.u2.toFixed(2)} V
          </text>
          <text x="300" y="478">
            {parallel
              ? `I = I₁ + I₂ = ${q.current.toFixed(3)} A`
              : `U₁ + U₂ = ${(q.u1 + q.u2).toFixed(2)} V`}
          </text>
        </>
      )}
      <path d="M32 510H868" stroke="var(--ui-line)" />
      <text x="32" y="547">
        {p.closed
          ? parallel
            ? q.branch2Connected
              ? "支路电压相同 · 电流在节点分流与汇合"
              : "R₂ 支路断开 · R₁ 的电流保持不变"
            : "各处电流相同 · 两段电压相加"
          : "总开关断开 · 两只电阻均无电流，负载电压为零"}
      </text>
      <text x="32" y="580" fontSize="16">
        亮点仅示意约定电流方向；数值来自理想直流电路模型。
      </text>
    </svg>
  );
}
