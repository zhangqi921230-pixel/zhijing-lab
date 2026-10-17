import React from "react";
import { format } from "./models.mjs";
import "./PythagorasReasoning.css";

// All pieces are rigid copies of (0,0), (a,0), (0,b). Only translation changes.
export function pythagorasPieces(a, b, progress) {
  const L = a + b,
    t = Math.max(0, Math.min(1, progress));
  return [
    { x: 0, y: a * t, angle: 0 },
    { x: L, y: 0, angle: 90 },
    { x: L - b * t, y: L, angle: 180 },
    { x: a * t, y: L - b * t, angle: 270 },
  ].map(({ x, y, angle }) => {
    const r = (angle * Math.PI) / 180;
    return {
      x,
      y,
      angle,
      points: [
        [0, 0],
        [a, 0],
        [0, b],
      ].map(([u, v]) => [
        x + u * Math.cos(r) - v * Math.sin(r),
        y + u * Math.sin(r) + v * Math.cos(r),
      ]),
    };
  });
}
const polygon = (points) => points.map((p) => p.join(",")).join(" ");
function Board({ a, b, progress, name, suffix, selected, select, focus }) {
  const L = a + b,
    s = 316 / L,
    t = progress / 100;
  const complete = t === 1,
    start = t === 0;
  return (
    <svg viewBox="0 0 420 440" role="group" aria-label={name}>
      <defs>
        <linearGradient id={`wood-${suffix}`} x2=".8" y2="1">
          <stop stopColor="#f1e9d3" />
          <stop offset="1" stopColor="#d4c19a" />
        </linearGradient>
        <linearGradient id={`tile-${suffix}`} x2=".5" y2="1">
          <stop stopColor="#458877" />
          <stop offset="1" stopColor="#1f584b" />
        </linearGradient>
        <filter
          id={`shadow-${suffix}`}
          x="-.1"
          y="-.1"
          width="1.2"
          height="1.3"
        >
          <feDropShadow
            dx="0"
            dy="4"
            stdDeviation="3"
            floodColor="#57482e"
            floodOpacity=".2"
          />
        </filter>
      </defs>
      <rect
        x="39"
        y="39"
        width="342"
        height="342"
        rx="9"
        fill={`url(#wood-${suffix})`}
        stroke="#b8a57e"
        strokeWidth={focus === 0 ? 3 : 1}
        filter={`url(#shadow-${suffix})`}
      />
      <rect
        x="50"
        y="50"
        width="320"
        height="320"
        fill="#faf7eb"
        style={{ fill: "#faf7eb" }}
        stroke="#a69776"
      />
      <g transform={`translate(52,52) scale(${s})`}>
        {start && (
          <polygon
            points={polygon([
              [a, 0],
              [L, a],
              [b, L],
              [0, b],
            ])}
            fill="#dce6ed"
            stroke="#658699"
            strokeWidth={1 / s}
          />
        )}
        {complete && (
          <>
            <rect width={a} height={a} fill="#e5d6ab" />
            <rect x={a} y={a} width={b} height={b} fill="#c9dce5" />
          </>
        )}
        {pythagorasPieces(a, b, t).map((piece, i) => (
          <g
            key={i}
            transform={`translate(${piece.x},${piece.y}) rotate(${piece.angle})`}
          >
            <path
              d={`M0 0H${a}L0 ${b}Z`}
              fill={`url(#tile-${suffix})`}
              opacity={focus === 2 ? 0.24 : 1}
              stroke={selected === i ? "#d28d29" : "#f1f0df"}
              strokeWidth={(selected === i ? 3 : 1.4) / s}
              role="button"
              tabIndex="0"
              aria-label={`观察三角板 ${i + 1}`}
              aria-pressed={selected === i}
              onClick={() => select(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  select(i);
                }
              }}
            />
            <path
              d={`M${8 / s} 0v${8 / s}H0`}
              fill="none"
              stroke="#d4e5d7"
              strokeWidth={1 / s}
              pointerEvents="none"
            />
            <text
              transform={`translate(${a / 3},${b / 3}) rotate(${-piece.angle})`}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#fff8e8"
              style={{ fill: focus === 2 ? "#23473d" : "#fff8e8" }}
              fontSize={15 / s}
              pointerEvents="none"
            >
              {i + 1}
            </text>
          </g>
        ))}
        {start && (
          <text
            x={L / 2}
            y={L / 2}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={27 / s}
            fill="#365d71"
            style={{ fill: "#365d71" }}
          >
            c²
          </text>
        )}
        {complete && (
          <>
            <text
              x={a / 2}
              y={a / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={Math.min(26, a * s * 0.48) / s}
              fill="#725820"
              style={{ fill: "#725820" }}
            >
              a²
            </text>
            <text
              x={a + b / 2}
              y={a + b / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={Math.min(26, b * s * 0.48) / s}
              fill="#365d71"
              style={{ fill: "#365d71" }}
            >
              b²
            </text>
          </>
        )}
      </g>
      <path d="M52 399v-6m0 3h316m0-3v6" stroke="#8d8a71" fill="none" />
      <text x="210" y="426" textAnchor="middle" fontSize="16" fill="#526b60">
        外框边长 a + b = {format(L)}
      </text>
      <text x="210" y="24" textAnchor="middle" fontSize="14" fill="#607368">
        {start
          ? "四角放置 · 中间是斜边正方形"
          : complete
            ? "平移重排 · 留下两个直角边正方形"
            : "三角板移动中 · 以端点拼合为准"}
      </text>
    </svg>
  );
}
export default function PythagorasScene({ p, onChange, chapter = 0 }) {
  const [selected, setSelected] = React.useState(0);
  const [focusStep, setFocus] = React.useState(chapter === 3 ? 2 : 0);
  const progress = p.arrange ?? 100;
  const focus = focusStep === 2 && progress !== 100 ? 1 : focusStep;
  return (
    <div className="pythagoras-studio">
      <div className="proof-heading">
        <span>面积拼合实验</span>
        <strong>同一个框，四块相同的三角板。</strong>
        <p>整体面积不变，移走的四块也不变，留下的面积一定相等。</p>
      </div>
      <div
        className="proof-reasoning-steps"
        role="group"
        aria-label="逐步理解面积证明"
      >
        {["看整个底板", "看四块三角板", "看剩余面积"].map((label, i) => (
          <button
            key={label}
            aria-pressed={focus === i}
            onClick={() => {
              setFocus(i);
              if (i === 2) onChange("arrange", 100);
            }}
          >
            {i + 1}. {label}
          </button>
        ))}
      </div>
      <div className="proof-boards">
        <Board
          a={p.a}
          b={p.b}
          progress={0}
          name="原始拼法，剩余面积 c 的平方"
          suffix="original"
          selected={selected}
          select={setSelected}
          focus={focus}
        />
        <Board
          a={p.a}
          b={p.b}
          progress={progress}
          name="重排拼法"
          suffix="rearranged"
          selected={selected}
          select={setSelected}
          focus={focus}
        />
      </div>
      <section className="proof-reasoning" aria-label="面积证明推理">
        <strong>
          {["相同的底板", "扣去同样的四块", "剩余面积相等"][focus]}
        </strong>
        <p>
          {focus === 0
            ? `两个底板的边长都是 a+b=${format(p.a + p.b)}，总面积都是 ${format((p.a + p.b) ** 2)}。`
            : focus === 1
              ? `每块三角板面积 ab/2=${format((p.a * p.b) / 2)}，四块合计 2ab=${format(2 * p.a * p.b)}，移动不改变每一块的形状和面积。`
              : `每个底板剩余 ${format((p.a + p.b) ** 2)} − ${format(2 * p.a * p.b)} = ${format(p.a ** 2 + p.b ** 2)}。左边是 c²，右边是 a²+b²，所以两者相等。`}
        </p>
        {focus === 2 && (
          <div className="proof-algebra">(a+b)² − 4 × ab/2 = a² + b² = c²</div>
        )}
        <small>
          看剩余面积会定位到重排终点；淡化的三角板仍在原位。移动过程的投影可能重叠，面积分割关系以起点和终点为准。
        </small>
      </section>
      <div className="proof-equation">
        <span>c²</span>
        <b>=</b>
        <span className="proof-a">a²</span>
        <b>+</b>
        <span className="proof-b">b²</span>
        <small>
          {format(p.a * p.a + p.b * p.b)} = {format(p.a * p.a)} +{" "}
          {format(p.b * p.b)}
        </small>
      </div>
      <div className="proof-actions">
        <button
          aria-pressed={progress === 0}
          onClick={() => onChange("arrange", 0)}
        >
          回到四角拼法
        </button>
        <button
          aria-pressed={progress === 100}
          onClick={() => onChange("arrange", 100)}
        >
          查看面积重排
        </button>
      </div>
      <p className="proof-caption" aria-live="polite">
        已选三角板 {selected + 1}：两直角边为 {format(p.a)}、{format(p.b)}
        ，面积为 {format((p.a * p.b) / 2)}。点击同编号可对照位置。
      </p>
    </div>
  );
}
