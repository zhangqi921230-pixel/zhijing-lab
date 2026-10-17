import React from "react";
import Button from "./LabButton.jsx";
import { gasState, GAS_R } from "./explorationModels.mjs";
import "./GasWorkStudy.css";
export function isothermalWork(p, initialVolume = 20) {
  return p.amount * GAS_R * p.temperature * Math.log(p.volume / initialVolume);
}
export default function GasWorkStudy({
  p,
  onVolume,
  onSweep,
  onStop,
  sweeping,
}) {
  const initial = 20,
    work = isothermalWork(p),
    a = gasState({ ...p, volume: initial }),
    b = gasState(p);
  const maxP = gasState({ ...p, volume: 5 }).pressure;
  const x = (v) => 70 + ((v - 5) / 25) * 610,
    y = (pressure) => 250 - (pressure / maxP) * 190;
  const curve = Array.from({ length: 101 }, (_, i) => {
    const v = 5 + i * 0.25;
    return [x(v), y(gasState({ ...p, volume: v }).pressure)];
  });
  const low = Math.min(initial, p.volume),
    high = Math.max(initial, p.volume);
  const area = Array.from({ length: 81 }, (_, i) => {
    const v = low + ((high - low) * i) / 80;
    return `${x(v)} ${y(gasState({ ...p, volume: v }).pressure)}`;
  });
  return (
    <section className="gas-work-study" aria-label="恒温过程与做功对照">
      <header>
        <span>ISOTHERMAL / 高中跨学科拓展</span>
        <h2>压缩时，功与热量去了哪里？</h2>
      </header>
      <p>
        固定 {p.temperature} K、{p.amount} mol；从参考体积 20 L
        出发，观察当前体积 {p.volume.toFixed(2)}{" "}
        L。阴影表示这一段准静态恒温过程的 |∫P dV|。
      </p>
      <div className="gas-work-actions">
        <Button primary onClick={sweeping ? onStop : onSweep}>
          {sweeping ? "暂停恒温压缩" : "演示 20 → 10 L 恒温压缩"}
        </Button>
        {[10, 20, 30].map((v) => (
          <Button
            key={v}
            aria-pressed={p.volume === v}
            onClick={() => onVolume(v)}
          >
            {v} L
          </Button>
        ))}
      </div>
      <div
        className="gas-work-chart"
        role="region"
        tabIndex="0"
        aria-label="压强体积曲线，可横向滚动"
      >
        <svg
          viewBox="0 0 760 330"
          role="img"
          aria-label="等温线、参考状态和当前状态间的做功面积"
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <path
                d={`M70 ${y((maxP * i) / 4)}H680`}
                stroke="var(--ui-line)"
              />
              <text x="60" y={y((maxP * i) / 4) + 5} textAnchor="end">
                {((maxP * i) / 4).toFixed(0)}
              </text>
            </g>
          ))}
          <path
            d={`M${x(low)} 250L${area.join("L")}L${x(high)} 250Z`}
            fill="var(--ui-gold)"
            opacity=".18"
          />
          <path
            d={curve.map(([a, b], i) => `${i ? "L" : "M"}${a} ${b}`).join(" ")}
            fill="none"
            stroke="var(--ui-primary)"
            strokeWidth="3"
          />
          {[
            [initial, a.pressure, "A"],
            [p.volume, b.pressure, "B"],
          ].map(([v, pressure, name]) => (
            <g key={name}>
              <path
                d={`M${x(v)} 250V${y(pressure)}`}
                stroke="var(--ui-muted)"
                strokeDasharray="5 4"
              />
              <circle
                cx={x(v)}
                cy={y(pressure)}
                r={name === "A" ? 8 : 4}
                fill={name === "A" ? "var(--ui-surface)" : "var(--ui-primary)"}
                stroke="var(--ui-primary)"
                strokeWidth="2"
              />
              <text
                x={x(v) + (name === "A" ? -12 : 12)}
                y={y(pressure) - 14}
                textAnchor={name === "A" ? "end" : "start"}
              >
                {name}
              </text>
            </g>
          ))}
          {[5, 10, 15, 20, 25, 30].map((v) => (
            <text key={v} x={x(v)} y="280" textAnchor="middle">
              {v}
            </text>
          ))}
          <text x="70" y="30">
            P / kPa
          </text>
          <text x="680" y="315" textAnchor="end">
            V / L
          </text>
        </svg>
      </div>
      <div className="gas-work-values">
        <div>
          <span>A · 20 L 参考压强</span>
          <strong>{a.pressure.toFixed(2)} kPa</strong>
        </div>
        <div>
          <span>B · 当前压强</span>
          <strong>{b.pressure.toFixed(2)} kPa</strong>
        </div>
        <div>
          <span>气体对外做功 W</span>
          <strong>{work.toFixed(1)} J</strong>
        </div>
      </div>
      <p className="gas-work-explanation">
        {p.volume < 20
          ? `压缩：外界对气体做功 ${(-work).toFixed(1)} J；为保持温度不变，气体向外放热 ${(-work).toFixed(1)} J。`
          : p.volume > 20
            ? `膨胀：气体对外做功 ${work.toFixed(1)} J；为保持温度不变，气体从外界吸热 ${work.toFixed(1)} J。`
            : "体积未改变：本段做功与热量均为 0。"}
      </p>
      <p>
        W = nRT ln(V/20 L)，ΔU = 0，Q = W。规定气体对外做功、吸收热量为正；1
        kPa·L = 1
        J。仅限理想气体可逆准静态恒温过程，演示速度不代表实际压缩速度，也不用于计算快速压缩或绝热过程。
      </p>
    </section>
  );
}
