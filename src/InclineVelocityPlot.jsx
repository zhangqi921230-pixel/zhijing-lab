import React, { useState } from "react";
import { incline } from "./advancedModels.mjs";

export function inclineVelocityTrace(p, t) {
  const initial = incline(p, 0);
  const a = Math.max(0, initial.a);
  const impact = initial.impactTime;
  const current = Math.max(0, Math.min(8, t));
  const peak = a * Math.min(8, impact);
  return {
    a,
    impact,
    current,
    peak,
    movingUntil: Math.min(current, impact),
    stopped: current >= impact,
    displacement: 0.5 * a * Math.min(current, impact) ** 2,
  };
}
export default function InclineVelocityPlot({ p, t, onSeek }) {
  const [showArea, setShowArea] = useState(false);
  const q = inclineVelocityTrace(p, t),
    maxV = Math.max(1, Math.ceil(q.peak));
  const x = (time) => 36 + time * 32;
  const y = (v) => 114 - (84 * v) / maxV;
  return (
    <div className="incline-velocity">
      <span>速度—时间 · 曲线仅显示已演示部分</span>
      {onSeek && (
        <div
          className="incline-phase-controls"
          role="group"
          aria-label="定位斜面运动阶段"
        >
          {[
            ["释放前", 0],
            ["行程一半", q.impact / Math.SQRT2],
            ["到达挡板", q.impact],
          ].map(([label, time]) => (
            <button
              key={label}
              disabled={!Number.isFinite(time) || time > 8}
              aria-pressed={Math.abs(t - time) < 1e-8}
              onClick={() => onSeek(time)}
            >
              {label}
            </button>
          ))}
          <small>
            {q.a <= 1e-10
              ? "当前保持静止，调整倾角或摩擦系数后再观察滑动。"
              : q.impact > 8
                ? "当前参数下，8 秒演示窗口内尚不能到达挡板。"
                : "点击定位并暂停；行程一半为 2 m，不是总时间的一半。"}
          </small>
        </div>
      )}
      <button
        className="incline-area-toggle"
        aria-pressed={showArea}
        onClick={() => setShowArea(!showArea)}
      >
        {showArea ? "隐藏位移面积" : "显示位移面积"}
      </button>
      <svg
        viewBox="0 0 320 148"
        role="img"
        aria-label="物块速度随时间变化，挡板处采用瞬时停止假设"
      >
        {showArea && (
          <path
            aria-label={`速度图下方面积，位移 ${q.displacement.toFixed(2)} 米`}
            d={`M36 114L${x(q.movingUntil)} ${y(q.a * q.movingUntil)}V114Z`}
            fill="var(--ui-primary)"
            fillOpacity=".16"
            stroke="none"
          />
        )}
        {[0, maxV / 2, maxV].map((v) => (
          <g key={v}>
            <path d={`M36 ${y(v)}H292`} stroke="currentColor" opacity=".12" />
            <text x="30" y={y(v) + 4} textAnchor="end">
              {v.toFixed(1)}
            </text>
          </g>
        ))}
        <path
          d="M36 20V114H295"
          fill="none"
          stroke="currentColor"
          opacity=".5"
        />
        <text x="36" y="14">
          v / (m/s)
        </text>
        <text x="291" y="142" textAnchor="end">
          t / s
        </text>
        {[0, 4, 8].map((v) => (
          <text key={v} x={x(v)} y="130" textAnchor="middle">
            {v}
          </text>
        ))}
        <path
          data-velocity-rise
          d={`M36 114L${x(q.movingUntil)} ${y(q.a * q.movingUntil)}`}
          stroke="var(--ui-primary)"
          strokeWidth="2.5"
          fill="none"
        />
        {q.stopped && (
          <>
            <path
              d={`M${x(q.impact)} ${y(q.peak)}V114`}
              stroke="#7851a0"
              strokeDasharray="3 3"
            />
            <circle
              cx={x(q.impact)}
              cy={y(q.peak)}
              r="3.5"
              fill="var(--surface)"
              stroke="var(--ui-primary)"
            />
            <path
              d={`M${x(q.impact)} 114H${x(q.current)}`}
              stroke="var(--ui-primary)"
              strokeWidth="2.5"
            />
          </>
        )}
        <circle
          cx={x(q.current)}
          cy={y(q.stopped ? 0 : q.a * q.current)}
          r="3.5"
          fill="var(--ui-primary)"
        />
      </svg>
      {showArea && (
        <p className="incline-area-reading">
          图下面积 = 位移 <strong>{q.displacement.toFixed(2)} m</strong>。
          {q.stopped
            ? "到达挡板后速度为零，面积不再增加。"
            : "横轴时间 × 纵轴速度，对应位移。"}
        </p>
      )}
      <small>
        {q.stopped
          ? `在 ${q.impact.toFixed(2)} s 到达挡板。虚线表示模型速度跳变，不表示有限碰撞加速度。`
          : q.a > 1e-10
            ? "上升直线的斜率是沿斜面加速度，曲线下面积是位移。"
            : "未达到起滑条件，速度保持为零。"}
      </small>
    </div>
  );
}
