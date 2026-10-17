import React, { useMemo } from "react";
import { format } from "./models.mjs";
import "./LeverBalanceStudy.css";

export function leverBalanceCurve(moment) {
  const lo = Math.max(0.2, moment / 20),
    hi = Math.min(2, moment);
  if (lo > hi) return [];
  return Array.from({ length: 101 }, (_, i) => {
    const distance = lo + ((hi - lo) * i) / 100;
    return { distance, force: moment / distance };
  });
}

export default function LeverBalanceStudy({ p, q, onChange }) {
  const moment = p.f1 * p.l1;
  const points = useMemo(() => leverBalanceCurve(moment), [moment]);
  const target = moment / p.l2;
  const possible = target >= 1 && target <= 20;
  const x = (d) => 52 + (d - 0.2) * 260;
  const y = (f) => 270 - f * 11;
  return (
    <section className="lever-balance-study" aria-label="杠杆平衡曲线">
      <header>
        <div>
          <small>从一次平衡，到一组规律</small>
          <h3>距离加倍，所需的力怎样变化？</h3>
        </div>
        <strong>F₂d₂ = {format(moment)} N·m</strong>
      </header>
      <svg
        viewBox="0 0 570 325"
        role="img"
        aria-label="右侧平衡作用力随支点距离变化的曲线，圆点为当前状态"
      >
        {[0, 5, 10, 15, 20].map((f) => (
          <g key={f}>
            <path d={`M52 ${y(f)}H520`} stroke="var(--ui-line)" />
            <text x="42" y={y(f) + 5} textAnchor="end">
              {f}
            </text>
          </g>
        ))}
        {[0.2, 0.5, 1, 1.5, 2].map((d) => (
          <g key={d}>
            <path d={`M${x(d)} 50V270`} stroke="var(--ui-line)" />
            <text x={x(d)} y="292" textAnchor="middle">
              {d}
            </text>
          </g>
        ))}
        <text x="52" y="28">
          右侧作用力 / N
        </text>
        <text x="520" y="316" textAnchor="end">
          支点到作用点距离 d₂ / m
        </text>
        <path
          d={points
            .map((v, i) => `${i ? "L" : "M"}${x(v.distance)} ${y(v.force)}`)
            .join(" ")}
          fill="none"
          stroke="var(--ui-primary)"
          strokeWidth="3"
        />
        {possible && (
          <>
            <path
              d={`M${x(p.l2)} ${y(p.f2)}V${y(target)}`}
              stroke="var(--ui-ink)"
              strokeDasharray="4 4"
            />
            <circle
              cx={x(p.l2)}
              cy={y(target)}
              r="7"
              fill="var(--ui-surface)"
              stroke="var(--ui-primary)"
              strokeWidth="2"
            />
          </>
        )}
        <circle cx={x(p.l2)} cy={y(p.f2)} r="4" fill="var(--ui-ink)" />
      </svg>
      <div
        className="lever-distance-choices"
        role="group"
        aria-label="比较右侧距离"
      >
        {[0.5, 1, 1.5, 2].map((d) => (
          <button
            key={d}
            aria-pressed={Math.abs(p.l2 - d) < 1e-8}
            onClick={() => onChange("l2", d)}
          >
            距离 {d} m
          </button>
        ))}
        <button disabled={!possible} onClick={() => onChange("f2", target)}>
          调到平衡力 {format(target)} N
        </button>
      </div>
      <p>
        实心点是当前载荷；曲线上空心点是相同距离所需的平衡力。
        {possible
          ? `当前距离 ${format(p.l2)} m，需要 ${format(target)} N。`
          : `所需 ${format(target)} N 超出本台 1–20 N 范围，请改变距离或左侧载荷。`}{" "}
        图中仅绘出仪器范围内的平衡方案。
      </p>
      <div className="lever-projection-readout">
        <strong>此刻的垂直力臂</strong>
        <span>
          左：{format(p.l1)} × cos({format(q.angle)}°) = {format(q.leftArm)} m
        </span>
        <span>
          右：{format(p.l2)} × cos({format(q.angle)}°) = {format(q.rightArm)} m
        </span>
      </div>
      <p>
        曲线使用杆上距离 d；两侧力均竖直向下时，倾斜会给两侧力矩同时乘以
        cosθ，因此平衡条件仍为 F₁d₁ =
        F₂d₂。若已抵达限位，另有约束力矩，不能仅凭停止判断重力矩相等。
      </p>
    </section>
  );
}
