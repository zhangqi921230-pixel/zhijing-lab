import React, { useState } from "react";
import Button from "./LabButton.jsx";
import "./SeismicMotion.css";

// At least four particles per S wavelength on the 80 km / 24 interval grid.
export const PARTICLE_OMEGA = 1.5;

export function seismicParticleOffset(distance, time, kind) {
  const speed = kind === "P" ? 6 : 3.5;
  const age = time - distance / speed;
  const displacement =
    age > 0 ? 7 * Math.sin(age * PARTICLE_OMEGA) * Math.exp(-age * 0.22) : 0;
  return kind === "P" ? [displacement, 0] : [0, displacement];
}

export default function SeismicMotion({ time, onSeek }) {
  const [probe, setProbe] = useState(12);
  const distance = (probe * 80) / 24;
  return (
    <section className="seismic-motion" aria-label="P 波与 S 波质点振动方向">
      <header>
        <strong>波向前传播，质点在原位附近振动</strong>
        <span>振幅放大示意</span>
      </header>
      <div
        className="seismic-wave-scroll"
        tabIndex="0"
        role="region"
        aria-label="波与质点方向图，可横向滚动"
      >
        <svg
          viewBox="0 0 640 205"
          role="img"
          aria-label={`当前 ${time.toFixed(2)} 秒，P 波质点沿传播方向振动，S 波质点垂直传播方向振动`}
        >
          {["P", "S"].map((kind, row) => {
            const center = 55 + row * 85,
              color = kind === "P" ? "#edbd70" : "#70ccd5";
            const front = time * (kind === "P" ? 6 : 3.5);
            return (
              <g key={kind}>
                <text x="12" y={center - 15} fill={color}>
                  {kind} 波
                </text>
                <text x="12" y={center + 5} className="motion-description">
                  {kind === "P" ? "纵向振动" : "横向振动"}
                </text>
                <line
                  x1="105"
                  x2="610"
                  y1={center}
                  y2={center}
                  className="motion-axis"
                />
                {Array.from({ length: 25 }, (_, i) => {
                  const distance = (i * 80) / 24,
                    x = 110 + i * 20;
                  const [dx, dy] = seismicParticleOffset(distance, time, kind);
                  return (
                    <g key={i}>
                      <circle
                        cx={x}
                        cy={center}
                        r="3.5"
                        className="motion-rest"
                      />
                      <line
                        x1={x}
                        y1={center}
                        x2={x + dx}
                        y2={center + dy}
                        stroke={color}
                        opacity=".4"
                      />
                      <circle
                        cx={x + dx}
                        cy={center + dy}
                        r={i === probe ? 5 : 3.5}
                        fill={color}
                        stroke={i === probe ? "var(--ui-ink)" : "none"}
                        strokeWidth="1.5"
                      />
                    </g>
                  );
                })}
                {front >= 0 && front <= 80 && (
                  <g>
                    <line
                      x1={110 + front * 6}
                      x2={110 + front * 6}
                      y1={center - 13}
                      y2={center + 14}
                      stroke={color}
                      strokeDasharray="2 2"
                    />
                    <text
                      x={Math.min(590, Math.max(130, 110 + front * 6))}
                      y={center + 27}
                      textAnchor="middle"
                      className="motion-description"
                    >
                      波前
                    </text>
                  </g>
                )}
                <path
                  d={`M110 ${center - 25}H600l-7 -4m7 4l-7 4`}
                  stroke={color}
                  fill="none"
                />
                <text
                  x="345"
                  y={center - 31}
                  textAnchor="middle"
                  className="motion-description"
                >
                  传播方向 →
                </text>
              </g>
            );
          })}
          {[0, 40, 80].map((distance, i) => (
            <text key={distance} x={110 + i * 240} y="177" textAnchor="middle">
              {distance} km
            </text>
          ))}
          <text x="350" y="199" textAnchor="middle">
            沿传播射线距震源的路程
          </text>
        </svg>
      </div>
      <p>
        空心圆标出平衡位置，实心圆表示质点。P、S 波分别采用 6 km/s 与 3.5 km/s，
        与三维波前一致；振幅、频率与衰减为教学设定，不代表真实地震记录。
      </p>
      <section className="seismic-probe" aria-label="单个质点放大观察">
        <h3>盯住一个质点：它真的向前走了吗？</h3>
        <label>
          沿射线选择观察点：{distance.toFixed(1)} km
          <input
            aria-label="观察质点位置"
            type="range"
            min="0"
            max="24"
            step="1"
            value={probe}
            onChange={(e) => setProbe(Number(e.target.value))}
          />
        </label>
        <div
          className="seismic-probe-scroll"
          tabIndex="0"
          role="region"
          aria-label="质点局部放大图，可横向滚动"
        >
          <svg
            viewBox="0 0 560 165"
            role="img"
            aria-label="同一距离的P波纵向位移与S波横向位移局部对照"
          >
            {["P", "S"].map((kind, i) => {
              const offset = seismicParticleOffset(distance, time, kind),
                cx = 140 + i * 280,
                cy = 80;
              const x = cx + offset[0] * 5,
                y = cy + offset[1] * 5;
              return (
                <g key={kind}>
                  <text x={cx} y="22" textAnchor="middle">
                    {kind} 波 · {kind === "P" ? "沿传播方向" : "垂直传播方向"}
                  </text>
                  <path
                    d={`M${cx - 70} ${cy}H${cx + 70}M${cx} ${cy - 40}V${cy + 40}`}
                    stroke="var(--ui-line)"
                  />
                  <path
                    d={`M${cx - 5} ${cy - 5}l10 10m-10 0l10-10`}
                    stroke="var(--ui-muted)"
                    strokeWidth="2"
                  />
                  <path
                    d={`M${cx} ${cy}L${x} ${y}`}
                    stroke="var(--ui-gold)"
                    strokeWidth="3"
                  />
                  <polygon
                    data-testid={`probe-${kind}`}
                    points={`${x},${y - 6} ${x + 6},${y} ${x},${y + 6} ${x - 6},${y}`}
                    fill="var(--ui-primary)"
                  />
                  <text x={cx} y="148" textAnchor="middle">
                    {time <= distance / (kind === "P" ? 6 : 3.5)
                      ? "波尚未经过 · 平衡位置"
                      : "波已经过 · 在原位附近振动"}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        {onSeek && (
          <div className="seismic-probe-actions">
            <Button
              disabled={distance === 0}
              onClick={() => onSeek(Math.max(0, distance / 6 - 0.5))}
            >
              P 波到达前
            </Button>
            <Button onClick={() => onSeek(distance / 6 + 0.5)}>
              P 波经过后 0.5 s
            </Button>
            <Button onClick={() => onSeek(distance / 3.5 + 0.5)}>
              S 波经过后 0.5 s
            </Button>
          </div>
        )}
        <p>
          上图加粗的质点与此处菱形同步；十字为平衡位置。局部位移在上图基础上再放大
          5
          倍，没有真实长度单位，不用于比较地震强度。这里选择的是沿射线距震源的路程，不会移动三维台站。
        </p>
      </section>
    </section>
  );
}
