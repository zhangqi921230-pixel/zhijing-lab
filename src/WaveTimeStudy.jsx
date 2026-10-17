import React, { useMemo } from "react";
import { waveState } from "./visualPhysics.mjs";
export default function WaveTimeStudy({ p, t }) {
  const period = 1 / p.frequency,
    phase = ((t % period) + period) % period,
    limit = 2 * p.amplitude;
  const y = (value) => 130 - (value / limit) * 80;
  const path = useMemo(
    () =>
      Array.from(
        { length: 121 },
        (_, i) =>
          `${i ? "L" : "M"}${70 + (i / 120) * 540},${130 - (waveState(p, p.probe, i / 120 / p.frequency).total / (2 * p.amplitude)) * 80}`,
      ).join(" "),
    [p.amplitude, p.frequency, p.speed, p.phase, p.mode, p.probe],
  );
  return (
    <section className="wave-time-study" aria-label="固定质点的振动图">
      <h3>把观察位置固定，记录它怎样上下振动</h3>
      <p>
        上图横轴是位置 x；下图横轴是时间，观察的始终是 x = {p.probe.toFixed(1)}{" "}
        m 处的同一质点。曲线表示一个完整周期的模型预测。
      </p>
      <div
        role="region"
        tabIndex="0"
        aria-label="质点振动曲线，可横向滚动"
        style={{ overflowX: "auto" }}
      >
        <svg
          viewBox="0 0 680 280"
          role="img"
          aria-label="固定位置的合成位移随周期内时间变化"
          style={{
            minWidth: 560,
            width: "100%",
            display: "block",
            fontSize: 18,
            fill: "var(--ui-ink)",
          }}
        >
          {[-limit, 0, limit].map((v) => (
            <g key={v}>
              <path d={`M70 ${y(v)}H610`} stroke="var(--ui-line)" />
              <text x="60" y={y(v) + 6} textAnchor="end">
                {v.toFixed(2)}
              </text>
            </g>
          ))}
          <text x="70" y="26">
            位移 / m
          </text>
          {[0, 0.5, 1].map((f) => (
            <g key={f}>
              <path d={`M${70 + f * 540} 50V210`} stroke="var(--ui-line)" />
              <text x={70 + f * 540} y="242" textAnchor="middle">
                {(f * period).toFixed(2)}
              </text>
            </g>
          ))}
          <text x="610" y="272" textAnchor="end">
            周期内时间 / s
          </text>
          <path
            d={path}
            fill="none"
            stroke="var(--ui-primary)"
            strokeWidth="3"
          />
          <path
            d={`M${70 + (phase / period) * 540} 50V210`}
            stroke="var(--ui-gold)"
            strokeDasharray="4 4"
          />
          <circle
            cx={70 + (phase / period) * 540}
            cy={y(waveState(p, p.probe, t).total)}
            r="6"
            fill="var(--ui-gold)"
            stroke="var(--ui-ink)"
          />
        </svg>
      </div>
      <p>
        周期 T = {period.toFixed(2)} s。指示线每周期回到起点，当前周期内时间{" "}
        {phase.toFixed(2)} s；实验累计时间仍为 {t.toFixed(2)} s。
        {p.mode === 2
          ? "若选中波节，此处曲线始终为零；波腹的振幅最大。"
          : p.mode === 1
            ? "相消时合成位移曲线为零，但两列波各自的位移仍可变化。"
            : "曲线重复表示质点往复振动，不表示质点沿传播方向前进。"}
      </p>
    </section>
  );
}
