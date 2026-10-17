import React, { useMemo } from "react";
import { radianState, beatState } from "./signalLessons.mjs";
import "./ObservableScene.css";
const ink = "var(--ui-ink)",
  gold = "var(--ui-gold)",
  green = "var(--ui-primary)",
  line = "var(--ui-line)",
  muted = "var(--ui-muted)";
export default function SignalScene({ id, p, time, guides = true }) {
  const curves = useMemo(
    () =>
      id !== "beat-frequency"
        ? []
        : [0, 1, 2, 3, 4].map((j) =>
            Array.from({ length: 721 }, (_, i) => {
              const q = beatState(p, i / 120);
              return `${i ? "L" : "M"}${80 + i},${[170, 270, 440, 440, 440][j] - [q.A, q.B, q.total, q.envelope, -q.envelope][j] * 38}`;
            }).join(" "),
          ),
    [id, p.frequency, p.difference, p.amplitude],
  );
  if (id === "radian-arc") {
    const q = radianState(p),
      R = p.radius * 24,
      u = Math.min(1, Math.max(0, time / 6)),
      theta = q.theta;
    // Curvature decreases to zero while arc length stays R*theta.
    const path = Array.from({ length: 181 }, (_, i) => {
      const s = (R * theta * i) / 180,
        k = (1 - u) / R;
      return `${i ? "L" : "M"}${100 + (k > 1e-8 ? Math.sin(k * s) / k : s)},${470 - (k > 1e-8 ? (1 - Math.cos(k * s)) / k : 0)}`;
    }).join(" ");
    const arc = Array.from(
      { length: 181 },
      (_, i) =>
        `${i ? "L" : "M"}${235 + R * Math.cos((theta * i) / 180)},${200 - R * Math.sin((theta * i) / 180)}`,
    ).join(" ");
    return (
      <svg
        className="motion-diagram observable-scene"
        viewBox="0 0 900 620"
        role="img"
        aria-label="圆弧展开与弧度测量"
      >
        <text x="35" y="44" className="observable-title">
          用半径作为角度的尺子
        </text>
        <text x="35" y="80">
          圆心角 {p.angle}°　·　θ = {q.theta.toFixed(3)} rad
        </text>
        <circle
          cx="235"
          cy="200"
          r={R}
          fill="none"
          stroke={line}
          strokeWidth="2"
        />
        <path d={arc} fill="none" stroke={gold} strokeWidth="7" />
        <path
          d={`M${235 + R},200 L235,200 L${235 + R * Math.cos(theta)},${200 - R * Math.sin(theta)}`}
          fill="none"
          stroke={green}
          strokeWidth="2"
        />
        <circle cx="235" cy="200" r="4" fill={ink} />
        <text x="340" y="175">
          r = {p.radius} cm
        </text>
        <text x="340" y="214">
          s = {q.length.toFixed(3)} cm
        </text>
        <text x="340" y="253">
          s ÷ r = {q.theta.toFixed(3)}
        </text>
        <text x="35" y="320">
          等长展开　{Math.round(u * 100)}%
        </text>
        <path d={path} stroke={gold} strokeWidth="7" fill="none" />
        <circle cx="100" cy="470" r="5" fill={ink} />
        {guides && (
          <g stroke={line}>
            <path d="M100 490H600" />
            {Array.from({ length: 7 }, (_, i) => (
              <g key={i}>
                <path d={`M${100 + i * R} 483v14`} />
                <text stroke="none" x={100 + i * R} y="526" textAnchor="middle">
                  {i}r
                </text>
              </g>
            ))}
          </g>
        )}
        <text x="100" y="555">
          展开长度 = r × θ = {q.length.toFixed(3)} cm
        </text>
        <text x="35" y="580">
          上方圆与下方展开线采用相同长度比例；金色部分始终等长。
        </text>
      </svg>
    );
  }
  const q = beatState(p, time),
    x = 80 + time * 120;
  return (
    <svg
      className="motion-diagram observable-scene"
      viewBox="0 0 900 620"
      role="img"
      aria-label="双频振动与拍频包络"
    >
      <text x="35" y="44" className="observable-title">
        {p.amplitude === 0
          ? "单个振动，振幅保持不变"
          : p.difference === 0
            ? "同频同相，合振幅保持不变"
            : "振动很快，强弱变化很慢"}
      </text>
      <text x="35" y="80">
        A {p.frequency.toFixed(1)} Hz　＋　B{" "}
        {(p.frequency + p.difference).toFixed(1)} Hz
      </text>
      {[170, 270, 440].map((y, i) => (
        <g key={y}>
          <path d={`M80 ${y}H800`} stroke={line} />
          <text x="35" y={y + 7}>
            {["A", "B", "合"][i]}
          </text>
        </g>
      ))}
      {curves.slice(0, 3).map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke={[green, gold, ink][i]}
          strokeWidth={i === 2 ? 2.8 : 1.8}
        />
      ))}
      {guides &&
        curves
          .slice(3)
          .map((d, i) => (
            <path
              key={i}
              d={d}
              fill="none"
              stroke={gold}
              strokeWidth="2"
              strokeDasharray="7 5"
            />
          ))}
      <path d={`M${x} 115V525`} stroke={muted} strokeDasharray="4 4" />
      {[q.A, q.B, q.total].map((v, i) => (
        <circle
          key={i}
          cx={x}
          cy={[170, 270, 440][i] - v * 38}
          r="5"
          fill={[green, gold, ink][i]}
        />
      ))}
      {Array.from({ length: 7 }, (_, i) => (
        <text key={i} x={80 + i * 120} y="551" textAnchor="middle">
          {i}s
        </text>
      ))}
      <text x="35" y="590">
        实线：位移　虚线：±振幅包络　当前 t = {time.toFixed(2)} s
      </text>
    </svg>
  );
}
