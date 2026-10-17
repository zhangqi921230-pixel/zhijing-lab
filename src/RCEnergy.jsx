import React from "react";
import { rc } from "./advancedModels.mjs";

export default function RCEnergy({ p, t, onSeek }) {
  const q = rc(p, t),
    available = q.initialEnergy + q.sourceWork,
    reference = (p.mode ? 0.5 : 1) * (p.c / 1000) * p.u ** 2,
    width = (energy) => (energy / reference) * 360,
    mj = (energy) => {
      const value = energy * 1000;
      return value > 0 && value < 0.01
        ? value.toPrecision(3)
        : value.toFixed(2);
    };
  return (
    <div className="rc-energy">
      <div className="rc-chart-heading">
        <span>能量收支 · t = {t.toFixed(2)} s</span>
        <span>同一比例 · 单位 mJ</span>
      </div>
      <svg
        viewBox="0 0 440 240"
        role="img"
        aria-label={`能量守恒：${mj(available)} 毫焦等于电容储能 ${mj(q.energy)} 毫焦加电阻耗散 ${mj(q.heat)} 毫焦`}
      >
        <g fontSize="13" fill="#36584e">
          <text x="40" y="32">
            {p.mode ? "初始电容储能" : "初始储能 + 电源做功"}　{mj(available)}
          </text>
          <rect x="40" y="46" width="360" height="28" rx="3" fill="#e5e7dc" />
          <rect
            x="40"
            y="46"
            width={width(available)}
            height="28"
            rx="3"
            fill="#667c91"
          />
          <text x="40" y="114">
            能量去向　{mj(q.energy + q.heat)}
          </text>
          <rect x="40" y="128" width="360" height="28" rx="3" fill="#e5e7dc" />
          <rect
            x="40"
            y="128"
            width={width(q.energy)}
            height="28"
            fill="#287d70"
          />
          <rect
            x={40 + width(q.energy)}
            y="128"
            width={width(q.heat)}
            height="28"
            fill="#ad7428"
          />
          <circle cx="46" cy="191" r="5" fill="#287d70" />
          <text x="58" y="196">
            电容储能 {mj(q.energy)}
          </text>
          <circle cx="246" cy="191" r="5" fill="#ad7428" />
          <text x="258" y="196">
            电阻耗散 {mj(q.heat)}
          </text>
          <text x="40" y="226">
            两条彩色条总长度始终相等
          </text>
        </g>
      </svg>
      <div className="rc-energy-seek" role="group" aria-label="能量观察时刻">
        {[0, 1, 5].map((n) => (
          <button
            key={n}
            aria-pressed={Math.abs(t - n * q.tau) < 1e-8}
            onClick={() => onSeek(n * q.tau)}
          >
            {n === 0 ? "初始时刻" : `${n}τ · ${(n * q.tau).toFixed(1)} s`}
          </button>
        ))}
      </div>
      <p className="rc-energy-equation">
        {p.mode ? "E₀ = E꜀ + Q" : "E₀ + W电源 = E꜀ + Q"} · E꜀ = ½CU꜀² · 电阻功率
        I²R = {(q.resistorPower * 1000).toFixed(2)} mW
      </p>
      <p>
        {p.mode
          ? "电源不做功，电容原有的能量逐渐在电阻中转化为内能。"
          : q.initialVoltage > 0
            ? "从剩余电压继续充电时，应把初始储能和本段电源做功一起计入；存储与耗散不再遵循从零充电的一半比例。"
            : "从零充电到稳态，电源做功 CU²，其中一半存入电容，一半在电阻中耗散；改变电阻影响快慢，不改变最终比例。"}{" "}
        5τ 仍是近似稳态。理想元件模型；耗散能量不等于温度，未模拟散热。
      </p>
    </div>
  );
}
