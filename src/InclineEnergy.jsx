import React from "react";
import { incline } from "./advancedModels.mjs";
import "./InclineEnergy.css";

export function inclineEnergy(p, t) {
  const q = incline(p, t);
  const total = q.parallel * 4;
  const heat = q.friction * q.s;
  const kinetic = 0.5 * p.mass * q.v ** 2;
  return {
    total,
    remaining: Math.max(0, total - q.parallel * q.s),
    heat,
    kinetic,
    collision: q.arrived ? Math.max(0, q.parallel * q.s - heat) : 0,
  };
}

export default function InclineEnergy({ p, t }) {
  const e = inclineEnergy(p, t);
  const parts = [
    ["尚未释放的势能", e.remaining, "#63889c"],
    ["动能", e.kinetic, "#368879"],
    ["摩擦耗散", e.heat, "#b88834"],
    ["停止过程耗散", e.collision, "#916ab0"],
  ];
  let offset = 0;
  return (
    <section className="incline-energy" aria-label="斜面能量去向">
      <header>
        <div>
          <small>从释放到挡板 · 同一份能量</small>
          <h3>减少的势能去了哪里？</h3>
        </div>
        <strong>初始势能 {e.total.toFixed(2)} J</strong>
      </header>
      <svg
        viewBox="0 0 600 74"
        role="img"
        aria-label={parts
          .map(([n, v]) => `${n} ${v.toFixed(2)} 焦耳`)
          .join("，")}
      >
        <rect
          x="1"
          y="12"
          width="598"
          height="38"
          fill="var(--ui-paper)"
          stroke="var(--ui-line)"
        />
        {parts.map(([name, value, color]) => {
          const width = e.total > 0 ? (598 * value) / e.total : 0;
          const start = offset;
          offset += width;
          return (
            <rect
              key={name}
              x={1 + start}
              y="12"
              width={width}
              height="38"
              fill={color}
            />
          );
        })}
      </svg>
      <dl>
        {parts.map(([name, value, color]) => (
          <div key={name}>
            <dt>
              <i style={{ background: color }} />
              {name}
            </dt>
            <dd>
              {value.toFixed(2)} <small>J</small>
            </dd>
          </div>
        ))}
      </dl>
      <p>
        条带总长固定对应这组参数下的初始势能。以挡板处为势能零点，滑行时势能转为动能与摩擦耗散；撞到挡板后，剩余动能转入停止过程耗散。
      </p>
      <p>
        使用上方“行程一半”和“到达挡板”对照。静止时没有位移，静摩擦不做功；此模型不模拟形变、声音或冲击时长。
      </p>
    </section>
  );
}
