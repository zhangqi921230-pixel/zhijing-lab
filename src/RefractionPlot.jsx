import React, { useMemo, useRef } from "react";
import { refraction, rad } from "./models.mjs";
import "./RefractionPlot.css";
export function refractionCurve(n1, n2) {
  const critical = refraction(0, n1, n2).critical,
    limit = critical ?? 89.9;
  return Array.from({ length: 181 }, (_, i) => {
    const angle = (limit * i) / 180;
    return { angle, value: refraction(angle, n1, n2).angle };
  });
}
export default function RefractionPlot({ p, onChange }) {
  const samples = useMemo(() => refractionCurve(p.n1, p.n2), [p.n1, p.n2]);
  const q = refraction(p.angle, p.n1, p.n2),
    pointer = useRef(null);
  const X = (a) => 55 + a * 5,
    Y = (a) => 260 - a * 2.3;
  const choose = (e) => {
    const svg = e.currentTarget,
      m = svg.getScreenCTM();
    if (!m) return;
    const point = new DOMPoint(e.clientX, e.clientY).matrixTransform(
      m.inverse(),
    );
    onChange(
      "angle",
      Math.round(Math.max(0, Math.min(89.9, (point.x - 55) / 5)) * 10) / 10,
    );
  };
  return (
    <section className="refraction-plot" aria-label="入射角与折射角关系">
      <header>
        <div>
          <small>同时看光路与数据</small>
          <h3>
            {q.critical === null
              ? "折射角如何随入射角变化？"
              : "接近临界角时，折射角怎样变化？"}
          </h3>
        </div>
        <span>
          n₁ = {p.n1} · n₂ = {p.n2}
        </span>
      </header>
      <svg
        viewBox="0 0 550 320"
        role="slider"
        tabIndex="0"
        aria-label="在角度曲线上选择入射角"
        aria-valuemin="0"
        aria-valuemax="89.9"
        aria-valuenow={p.angle}
        aria-valuetext={`${p.angle.toFixed(2)}度；${q.tir ? "全反射" : `折射角${q.angle.toFixed(2)}度`}`}
        onPointerDown={(e) => {
          if (e.button !== 0 || pointer.current !== null) return;
          e.preventDefault();
          e.currentTarget.focus();
          pointer.current = e.pointerId;
          e.currentTarget.setPointerCapture(e.pointerId);
          choose(e);
        }}
        onPointerMove={(e) => {
          if (pointer.current === e.pointerId) choose(e);
        }}
        onPointerUp={(e) => {
          if (pointer.current === e.pointerId) {
            choose(e);
            pointer.current = null;
            e.currentTarget.releasePointerCapture(e.pointerId);
          }
        }}
        onPointerCancel={() => {
          pointer.current = null;
        }}
        onLostPointerCapture={() => {
          pointer.current = null;
        }}
        onKeyDown={(e) => {
          const delta = {
            ArrowLeft: -1,
            ArrowDown: -1,
            ArrowRight: 1,
            ArrowUp: 1,
          }[e.key];
          let a =
            e.key === "Home"
              ? 0
              : e.key === "End"
                ? 89.9
                : delta === undefined
                  ? null
                  : Math.max(0, Math.min(89.9, p.angle + delta));
          if (a !== null) {
            e.preventDefault();
            onChange("angle", a);
          }
        }}
      >
        {q.critical !== null && (
          <rect
            x={X(q.critical)}
            y="53"
            width={X(90) - X(q.critical)}
            height="207"
            fill="var(--ui-selected)"
          />
        )}
        {[0, 30, 60, 90].map((a) => (
          <g key={a}>
            <path
              d={`M55 ${Y(a)}H505M${X(a)} 53V260`}
              stroke="var(--ui-line)"
            />
            <text x="45" y={Y(a) + 4} textAnchor="end">
              {a}°
            </text>
            <text x={X(a)} y="280" textAnchor="middle">
              {a}°
            </text>
          </g>
        ))}
        <path d="M55 53V260H505" fill="none" stroke="var(--ui-muted)" />
        <path
          d={`M55 260L505 53`}
          fill="none"
          stroke="var(--ui-muted)"
          strokeDasharray="4 5"
        />
        <path
          d={samples
            .map((s, i) => `${i ? "L" : "M"}${X(s.angle)},${Y(s.value)}`)
            .join(" ")}
          fill="none"
          stroke="var(--ui-primary)"
          strokeWidth="3"
        />
        <path
          d={`M${X(p.angle)} 53V260`}
          stroke="var(--ui-primary)"
          strokeDasharray="3 4"
        />
        {!q.tir && (
          <circle
            cx={X(p.angle)}
            cy={Y(q.angle)}
            r="5"
            fill="var(--ui-primary)"
            stroke="var(--ui-paper)"
            strokeWidth="2"
          />
        )}
        <text x="55" y="25">
          折射角 r
        </text>
        <text x="275" y="310" textAnchor="middle">
          入射角 i · 点按或拖动选择，方向键微调
        </text>
        {q.critical !== null && (
          <>
            <path
              d={`M${X(q.critical)} 53V260`}
              stroke="var(--ui-muted)"
              strokeDasharray="5 4"
            />
            <text
              x={X(q.critical) + (X(90) - X(q.critical)) / 2}
              y="43"
              textAnchor="middle"
            >
              全反射区
            </text>
          </>
        )}
      </svg>
      <div
        className="refraction-boundary"
        role="group"
        aria-label="临界角附近对照"
      >
        {[-1, 0, 1].map((d) => (
          <button
            key={d}
            disabled={q.critical === null}
            onClick={() =>
              onChange("angle", Math.max(0, Math.min(89.9, q.critical + d)))
            }
          >
            {d < 0 ? "临界角前 1°" : d > 0 ? "临界角后 1°" : "恰好临界角"}
          </button>
        ))}
      </div>
      <p>
        {q.tir
          ? "此时没有传播进入第二介质的折射光线，因此曲线上不画折射角点，也不把90°当作全反射时的折射角。"
          : `n₁ sin i = ${(p.n1 * Math.sin(rad(p.angle))).toFixed(4)}；n₂ sin r = ${(p.n2 * Math.sin(rad(q.angle))).toFixed(4)}。相等的是这两个量，不是两个角度。`}
      </p>
      <small>
        虚线斜线表示
        r=i。只有n₁&gt;n₂时才存在临界角；曲线止于临界掠射状态，不跨越全反射区。角度扫描是教学演示，不表示光的传播速度。
      </small>
    </section>
  );
}
