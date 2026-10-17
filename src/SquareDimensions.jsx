import React from "react";
export default function SquareDimensions({ p, a, b, h, finished }) {
  const ink = "var(--ui-ink)",
    primary = "var(--ui-primary)",
    gold = "var(--ui-gold)";
  return (
    <g data-testid="square-dimensions" fill={ink}>
      <path d={`M-15 ${b}h-10v${h}h10`} fill="none" stroke={ink} />
      <text
        transform={`translate(-39 ${b + h / 2}) rotate(-90)`}
        textAnchor="middle"
      >
        a−b = {p.a - p.b}
      </text>
      {finished ? (
        <>
          <path
            d={`M0 ${a + 12}v8h${a}v-8m0 0v8h${b}v-8`}
            fill="none"
            stroke={ink}
          />
          <text x={a / 2} y={a + 43} textAnchor="middle" fill={gold}>
            a = {p.a}
          </text>
          <text x={a + b / 2} y={a + 43} textAnchor="middle" fill={primary}>
            b = {p.b}
          </text>
          <path d={`M0 ${a + 53}v8h${a + b}v-8`} fill="none" stroke={ink} />
          <text x={(a + b) / 2} y={a + 85} textAnchor="middle">
            a+b = {p.a + p.b}
          </text>
        </>
      ) : (
        <>
          <path d={`M0 -10v-8h${h}v8m0 0v-8h${b}v8`} fill="none" stroke={ink} />
          <text x={h / 2} y="-31" textAnchor="middle" fill={primary}>
            a−b = {p.a - p.b}
          </text>
          <text x={h + b / 2} y="-31" textAnchor="middle">
            b = {p.b}
          </text>
          <path d={`M0 ${a + 22}v8h${a}v-8`} fill="none" stroke={ink} />
          <text x={a / 2} y={a + 58} textAnchor="middle">
            a = {p.a}
          </text>
        </>
      )}
    </g>
  );
}
