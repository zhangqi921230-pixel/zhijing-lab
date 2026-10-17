import React from "react";
import Button from "./LabButton.jsx";
import { gasParticleState } from "./gasParticles.mjs";
import { gasState } from "./explorationModels.mjs";

export default function GasCollisionStudy({ p, time, onPreset }) {
  const reference = { volume: 20, temperature: 300, amount: p.amount };
  const base = gasParticleState(reference, time),
    current = gasParticleState(p, time);
  return (
    <section
      className="exploration-chart gas-collision-study"
      aria-label="粒子碰壁对照"
    >
      <h2>追踪同一粒子：路程变短，还是速度变快？</h2>
      <p>
        两侧使用相同的初始相对位置和运动方向。选择条件后点击上方“播放粒子示意”，同时观察金色粒子与方向线。
      </p>
      <div className="exploration-actions">
        {[
          ["基准 20 L · 300 K", 20, 300],
          ["恒温压缩至 10 L", 10, 300],
          ["定容升温至 600 K", 20, 600],
        ].map(([label, volume, temperature]) => (
          <Button
            key={label}
            aria-pressed={p.volume === volume && p.temperature === temperature}
            onClick={() => onPreset({ volume, temperature, amount: p.amount })}
          >
            {label}
          </Button>
        ))}
      </div>
      <div className="gas-collision-pair">
        {[
          ["基准状态", reference, base],
          ["当前状态", p, current],
        ].map(([label, state, dot]) => (
          <figure key={label}>
            <figcaption>
              {label} · {state.volume} L / {state.temperature} K
            </figcaption>
            <svg
              viewBox="170 75 245 320"
              role="img"
              aria-label={`${label}的单粒子运动方向`}
            >
              <rect
                x="180"
                y={370 - (state.volume / 30) * 260}
                width="228"
                height={(state.volume / 30) * 260}
                fill="var(--surface)"
                stroke="var(--primary)"
                strokeWidth="2"
              />
              <path
                d={`M${dot.x} ${dot.y}L${Math.max(186, Math.min(402, dot.x - dot.vx * 0.7))} ${Math.max(376 - (state.volume / 30) * 260, Math.min(364, dot.y - dot.vy * 0.7))}`}
                stroke="var(--primary)"
                strokeWidth="3"
              />
              <circle
                cx={dot.x}
                cy={dot.y}
                r="6"
                fill="#c08428"
                stroke="var(--text)"
              />
            </svg>
            <p>
              压强 <strong>{gasState(state).pressure.toFixed(1)} kPa</strong>
            </p>
          </figure>
        ))}
      </div>
      <p>
        相对示意速率{" "}
        <strong>{Math.sqrt(p.temperature / 300).toFixed(2)} 倍</strong>
        ；竖直往返周期为基准的{" "}
        <strong>
          {(current.verticalPeriod / base.verticalPeriod).toFixed(2)} 倍
        </strong>
        。金色圆点位于方向线前端。
      </p>
      <p>
        固定温度时，同一粒子速率不变；升温时示意速率按 √T
        增大。周期指本图粒子中心在可运动区域的往返时间，不是实际分子碰撞频率。图中粒子大小被放大，压强独立由
        PV = nRT 计算；不模拟移动壁面碰撞或分子间碰撞。
      </p>
    </section>
  );
}
