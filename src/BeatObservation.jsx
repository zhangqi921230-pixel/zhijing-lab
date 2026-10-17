import React from "react";
import Button from "./LabButton.jsx";
import { beatState } from "./signalLessons.mjs";
import "./BeatObservation.css";

const fixed = (value) => (Math.abs(value) < 0.0005 ? 0 : value).toFixed(3);
export function beatObservationTimes(p, duration = 6) {
  const beats = p.difference > 0 && p.amplitude > 0;
  return [
    { label: "A第一次到正峰", time: 1 / (4 * p.frequency) },
    { label: "第一次包络最弱", time: beats ? 1 / (2 * p.difference) : null },
    { label: "再次同相加强", time: beats ? 1 / p.difference : null },
  ].map((point) => ({
    ...point,
    available: point.time !== null && point.time <= duration,
  }));
}
export default function BeatObservation({ p, time, onSeek, duration = 6 }) {
  const q = beatState(p, time),
    beats = p.difference > 0 && p.amplitude > 0;
  const rows = [
    ["A 分位移", q.A, "var(--ui-primary)"],
    ["B 分位移", q.B, "var(--ui-gold)"],
    ["合位移", q.total, "var(--ui-ink)"],
  ];
  return (
    <section className="beat-observation" aria-label="同一时刻的振动叠加">
      <header>
        <div>
          <span>冻结一个时刻</span>
          <h3>把两个分位移相加</h3>
        </div>
        <strong>t = {time.toFixed(3)} s</strong>
      </header>
      <div className="beat-observation-actions">
        {beatObservationTimes(p, duration).map((point) => (
          <Button
            key={point.label}
            disabled={!point.available}
            onClick={() => onSeek(point.time)}
          >
            {point.label}
            {point.time !== null ? ` · ${point.time.toFixed(3)} s` : ""}
          </Button>
        ))}
      </div>
      <p>
        {!beats
          ? "当前没有拍：同频同相或只保留一个振动时，包络保持不变。"
          : 1 / p.difference > duration
            ? `完整拍周期为 ${(1 / p.difference).toFixed(2)} s，超出当前${duration}秒观察窗的定位按钮不可用；不会把窗末误当作下一次加强。`
            : "定位后暂停，保留频率与振幅。三行使用相同标尺；正负号表示位移方向。"}
      </p>
      <div
        className="beat-observation-scroll"
        role="region"
        aria-label="分位移标尺，可横向滚动"
        tabIndex="0"
      >
        <svg
          viewBox="0 0 760 285"
          role="img"
          aria-label={`A ${fixed(q.A)}，B ${fixed(q.B)}，合位移 ${fixed(q.total)}`}
        >
          <path
            d="M400 40V235"
            stroke="var(--ui-muted)"
            strokeDasharray="5 5"
          />
          {rows.map(([label, value, color], i) => {
            const y = 75 + i * 65,
              x = 400 + value * 100;
            return (
              <g key={label}>
                <text x="15" y={y + 6}>
                  {label}
                </text>
                <path d={`M200 ${y}H600`} stroke="var(--ui-line)" />
                <path d={`M400 ${y}H${x}`} stroke={color} strokeWidth="5" />
                {Math.abs(value) > 0.0005 && (
                  <path
                    d={`M${x - (value > 0 ? 9 : -9)} ${y - 6}L${x} ${y}L${x - (value > 0 ? 9 : -9)} ${y + 6}`}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                  />
                )}
                <circle cx={x} cy={y} r="5" fill={color} />
                <text x="630" y={y + 6}>
                  {fixed(value)}
                </text>
              </g>
            );
          })}
          {[-2, -1, 0, 1, 2].map((v) => (
            <text key={v} x={400 + v * 100} y="255" textAnchor="middle">
              {v > 0 ? "+" : ""}
              {v}
            </text>
          ))}
        </svg>
      </div>
      <p className="beat-observation-equation">
        {fixed(q.A)} + ({fixed(q.B)}) = {fixed(q.total)}{" "}
        <span>相对位移 · 显示值经四舍五入</span>
      </p>
      <div className="beat-observation-envelope">
        <strong>此刻包络半高 {fixed(q.envelope)}</strong>
        <p>
          包络表示当前相位关系允许的合成振幅，实线点才是此刻位移。同相加强时，两个振动也可能恰好同时经过零位；“位移为零”不能单独证明相互抵消。
        </p>
      </div>
    </section>
  );
}
