import React, { useState } from "react";
import Button from "./LabButton.jsx";
import { thermalLengths } from "./vividLessons.mjs";
import "./ThermalComparison.css";
const x = (t) => 85 + (t + 30) * 5.4,
  y = (mm) => 330 - (mm + 4) * 19;
export default function ThermalComparison({ p, time, onChange }) {
  const [focus, setFocus] = useState(-1);
  const current = thermalLengths(p, time),
    low = thermalLengths({ ...p, delta: -30 }, 6),
    high = thermalLengths({ ...p, delta: 80 }, 6);
  const colors = ["var(--ui-gold)", "var(--ui-primary)", "var(--ui-muted)"];
  return (
    <section className="thermal-comparison" aria-label="温差与自由伸长对照">
      <h3>温差加倍，伸长也加倍吗？</h3>
      <p>
        保持初始杆长 {p.length.toFixed(1)}{" "}
        m，比较三种材料。横轴为温差，纵轴为自由伸长；负数表示收缩。三条线使用同一比例尺。
      </p>
      <div className="motion-shortcuts" role="group" aria-label="聚焦材料">
        <Button
          primary={focus === -1}
          aria-pressed={focus === -1}
          onClick={() => setFocus(-1)}
        >
          全部材料
        </Button>
        {current.map((m, i) => (
          <Button
            key={m.name}
            primary={focus === i}
            aria-pressed={focus === i}
            onClick={() => setFocus(i)}
          >
            聚焦{m.name}
          </Button>
        ))}
      </div>
      {focus >= 0 && (
        <p aria-label="材料斜率说明">
          {current[focus].name} · 每升高1°C，自由伸长{" "}
          {((current[focus].alpha * p.length) / 1000).toFixed(3)}{" "}
          mm；升高10°C，自由伸长{" "}
          {((current[focus].alpha * p.length) / 100).toFixed(3)}{" "}
          mm。斜率由材料系数与杆长共同决定，选择材料不改变参数和进度。
        </p>
      )}
      <div
        className="thermal-plot-scroll"
        role="region"
        aria-label="热膨胀对照曲线，可横向滚动"
        tabIndex={0}
      >
        <svg
          viewBox="0 0 760 410"
          role="img"
          aria-label="铝铜钢的线膨胀曲线与当前状态"
        >
          {current.map((m, i) => (
            <g key={m.name}>
              <line
                x1={345 + i * 110}
                x2={377 + i * 110}
                y1="28"
                y2="28"
                stroke={colors[i]}
                strokeWidth="3"
                strokeDasharray={["", "9 4", "3 4"][i]}
              />
              <text x={385 + i * 110} y="34">
                {m.name}
              </text>
            </g>
          ))}
          {[-4, -2, 0, 2, 4, 6, 8, 10].map((v) => (
            <g key={v}>
              <line
                x1="85"
                x2="679"
                y1={y(v)}
                y2={y(v)}
                stroke="var(--ui-line)"
              />
              <text x="72" y={y(v) + 6} textAnchor="end">
                {v}
              </text>
            </g>
          ))}
          {[-30, 0, 30, 60, 80].map((v) => (
            <g key={v}>
              <line
                x1={x(v)}
                x2={x(v)}
                y1="64"
                y2="330"
                stroke="var(--ui-line)"
              />
              <text x={x(v)} y="358" textAnchor="middle">
                {v}
              </text>
            </g>
          ))}
          <line x1={x(0)} x2={x(0)} y1="64" y2="330" stroke="var(--ui-ink)" />
          <line x1="85" x2="679" y1={y(0)} y2={y(0)} stroke="var(--ui-ink)" />
          <text x="20" y="32">
            自由伸长 / mm
          </text>
          <text x="540" y="395">
            温差 / °C
          </text>
          {p.gap <= 10 && (
            <g>
              <path
                d={`M85 ${y(p.gap)} H679`}
                stroke="var(--ui-ink)"
                strokeDasharray="3 6"
              />
              <text x="679" y={y(p.gap) - 9} textAnchor="end">
                接缝 {p.gap} mm
              </text>
            </g>
          )}
          <line
            x1={x(current[0].delta)}
            x2={x(current[0].delta)}
            y1="64"
            y2="330"
            stroke="var(--ui-primary)"
            strokeDasharray="6 6"
            opacity=".5"
          />
          {current.map((m, i) => (
            <g
              key={m.name}
              data-material={m.name}
              opacity={focus === -1 || focus === i ? 1 : 0.22}
            >
              <path
                d={`M${x(-30)} ${y(low[i].extension)} L${x(80)} ${y(high[i].extension)}`}
                fill="none"
                stroke={colors[i]}
                strokeWidth="3"
                strokeDasharray={["", "9 4", "3 4"][i]}
              />
              <circle
                cx={x(m.delta)}
                cy={y(m.extension)}
                r={7 - i}
                fill="var(--ui-surface)"
                stroke={colors[i]}
                strokeWidth="3"
              />
            </g>
          ))}
        </svg>
      </div>
      <p>
        当前温差：{current[0].delta.toFixed(1)}
        °C。圆点跟随上方播放进度；点击下面的温差，暂停并直接观察该状态。
      </p>
      <div className="motion-shortcuts">
        {[-30, 0, 30, 60, 80].map((delta) => (
          <Button
            key={delta}
            primary={current[0].delta === delta}
            onClick={() => onChange({ ...p, delta })}
          >
            观察 {delta > 0 ? "+" : ""}
            {delta}°C
          </Button>
        ))}
      </div>
      <div className="thermal-thresholds">
        {current.map((m) => {
          const threshold = (p.gap * 1000) / (m.alpha * p.length);
          return (
            <p key={m.name}>
              <strong>{m.name}：</strong>
              {m.extension.toFixed(2)} mm；
              {m.remaining > 0
                ? `余缝 ${m.remaining.toFixed(2)} mm`
                : m.remaining === 0
                  ? "刚好抵接"
                  : `自由伸长需求超出接缝 ${(-m.remaining).toFixed(2)} mm`}
              。抵接温差约 {threshold.toFixed(1)}°C
              {threshold > 80 ? "（超出本页温差范围）" : ""}。
            </p>
          );
        })}
      </div>
      <p>
        曲线表示自由膨胀需求。超过接缝线后，受约束杆件不再按这条线实际移动；此处不计算应力。材料系数是教学近似值。
      </p>
    </section>
  );
}
