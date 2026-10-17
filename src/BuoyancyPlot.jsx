import React from "react";
import { buoyancyState } from "./visualPhysics.mjs";
export default function BuoyancyPlot({ p, onChange }) {
  const q = buoyancyState(p),
    full = buoyancyState({ ...p, mode: 0, immersion: 100 });
  const limit = Math.max(full.force, q.weight) * 1.15;
  const y = (force) => 240 - (force / limit) * 190;
  const possible = p.solid <= p.liquid;
  return (
    <section className="buoyancy-plot" aria-label="浸入比例与浮力曲线">
      <h3>浸入多少，浮力就增加多少？</h3>
      <div
        className="buoyancy-plot-scroll"
        tabIndex="0"
        role="region"
        aria-label="受力曲线，可横向滚动"
      >
        <svg
          viewBox="0 0 620 300"
          role="img"
          aria-label={`当前浸入${(q.fraction * 100).toFixed(1)}%，浮力${q.force.toFixed(2)}牛，重力${q.weight.toFixed(2)}牛`}
        >
          {[0, 0.5, 1].map((f) => (
            <g key={f}>
              <path d={`M${65 + 480 * f} 45V240`} className="vp-grid" />
              <text x={65 + 480 * f} y="267" textAnchor="middle">
                {100 * f}%
              </text>
            </g>
          ))}
          {[0, 0.5, 1].map((f) => (
            <g key={f}>
              <path d={`M65 ${y(f * limit)}H545`} className="vp-grid" />
              <text x="55" y={y(f * limit) + 5} textAnchor="end">
                {(f * limit).toFixed(1)}
              </text>
            </g>
          ))}
          <path d="M65 35V240H560" className="vp-axis" fill="none" />
          <text x="65" y="22">
            力 / N
          </text>
          <text x="420" y="294">
            浸入体积比例
          </text>
          <path
            d={`M65 ${y(q.weight)}H545`}
            stroke="var(--ui-gold)"
            strokeWidth="2"
            strokeDasharray="7 5"
          />
          <path
            d={`M65 240L545 ${y(full.force)}`}
            stroke="var(--ui-primary)"
            strokeWidth="3"
          />
          <path
            d={`M${65 + 480 * q.fraction} 240V${y(q.force)}`}
            stroke="var(--ui-muted)"
            strokeDasharray="3 4"
          />
          <circle
            cx={65 + 480 * q.fraction}
            cy={y(q.force)}
            r="6"
            fill="var(--ui-primary)"
            stroke="var(--ui-paper)"
            strokeWidth="2"
          />
          {possible && (
            <circle
              cx={65 + (480 * p.solid) / p.liquid}
              cy={y(q.weight)}
              r="10"
              fill="none"
              stroke="var(--ui-gold)"
              strokeWidth="2"
            />
          )}
        </svg>
      </div>
      <p>
        实线：浮力 · 金色虚线：重力 · 实心点：当前状态 ·
        金色空心圈：两力相等。纵轴随物体与液体条件调整；同一张图内两力共用尺度。
      </p>
      <div className="vp-modes">
        {p.mode === 0 && (
          <>
            <button onClick={() => onChange("immersion", 0)}>尚未浸入</button>
            <button onClick={() => onChange("immersion", 100)}>完全浸没</button>
            {possible && (
              <button
                onClick={() =>
                  onChange("immersion", (100 * p.solid) / p.liquid)
                }
              >
                定位两力相等
              </button>
            )}
          </>
        )}
      </div>
      <p>
        {possible
          ? `两力相等需要浸入 ${((100 * p.solid) / p.liquid).toFixed(1)}%。${p.solid === p.liquid ? "此时必须完全浸没，对应悬浮条件。" : "这也是自由漂浮时的平衡浸入比例。"}`
          : `完全浸没时浮力仍比重力小 ${(q.weight - full.force).toFixed(2)} N；不存在两力相等的浸入比例。沉底平衡还需要槽底支持力。`}
      </p>
      <p>
        曲线比较同一个物体的不同浸入状态，并非运动轨迹。完全浸没后，在均匀液体内继续加深不会增加排水体积。
      </p>
    </section>
  );
}
