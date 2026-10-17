import React from "react";
import { rc } from "./advancedModels.mjs";
import Button from "./LabButton.jsx";
import "./RCVoltageBalance.css";
export default function RCVoltageBalance({ p, t, onSeek }) {
  const q = rc(p, t),
    ur = q.current * p.r,
    source = p.mode ? 0 : p.u;
  const rows = [
    ["回路电源", source],
    ["电阻电压 I·R", ur],
    ["电容电压 Uc", q.voltage],
  ];
  return (
    <section className="rc-voltage-balance" aria-label="回路电压平衡">
      <h3>沿同一方向，核对回路电压</h3>
      <p>
        充电电流方向为正方向；放电保留这个参考方向，因此电流和电阻电压为负。
      </p>
      <svg
        viewBox="0 0 480 250"
        role="img"
        aria-label="同尺度正负电压条，右侧为正，左侧为负"
      >
        <line x1="280" x2="280" y1="25" y2="214" stroke="var(--ui-muted)" />
        <text x="155" y="20">
          −{p.u} V
        </text>
        <text x="276" y="20">
          0
        </text>
        <text x="390" y="20">
          +{p.u} V
        </text>
        {rows.map(([name, v], i) => (
          <g key={name}>
            <text x="8" y={64 + i * 66}>
              {name}
            </text>
            <rect
              x={280 + Math.min(0, (v / p.u) * 135)}
              y={42 + i * 66}
              width={Math.abs((v / p.u) * 135)}
              height="29"
              rx="3"
              fill={i === 1 ? "#bd893e" : "var(--ui-primary)"}
            />
            <text x="280" y={91 + i * 66} textAnchor="middle">
              {v.toFixed(3)} V
            </text>
          </g>
        ))}
      </svg>
      <strong>
        {source.toFixed(3)} V = ({ur.toFixed(3)} V) + {q.voltage.toFixed(3)} V
      </strong>
      <p>
        U回路电源 = I·R + Uc；I = {(q.current * 1000).toFixed(3)} mA。
        {p.mode
          ? "电源已从回路断开，0 = I·R + Uc，电容驱动反向电流。"
          : "电容电压上升时，电阻分到的电压与电流逐渐减小。"}
      </p>
      <div className="rc-voltage-actions">
        {[0, 1, 3, 5].map((n) => (
          <Button
            key={n}
            onClick={() => onSeek?.(n * q.tau)}
            aria-pressed={Math.abs(t - n * q.tau) < 1e-8}
          >
            {n === 0 ? "初始时刻" : `${n}τ`}
          </Button>
        ))}
      </div>
      <p>
        t = {t.toFixed(2)} s = {(t / q.tau).toFixed(2)}
        τ。电压条使用相同量程，数字按三位小数显示；负号表示参考方向，不表示负的耗散功率。
      </p>
    </section>
  );
}
