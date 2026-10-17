import React, { useEffect, useState } from "react";
import InclineVelocityPlot from "./InclineVelocityPlot.jsx";
import InclineEnergy from "./InclineEnergy.jsx";
import { incline } from "./advancedModels.mjs";
export default function InclineGuide({ p, t, onSeek, decomposition = false }) {
  const [decompose, setDecompose] = useState(decomposition);
  useEffect(() => setDecompose(decomposition), [decomposition]);
  const q = incline(p, t),
    a = (p.angle * Math.PI) / 180,
    scale = 72 / q.gravity;
  const forces = [
    [0, q.gravity, "mg", "#ad582c"],
    [q.normal * Math.sin(a), -q.normal * Math.cos(a), "N", "#20776d"],
    [-q.friction * Math.cos(a), -q.friction * Math.sin(a), "f", "#967415"],
    [-q.stopForce * Math.cos(a), -q.stopForce * Math.sin(a), "F挡", "#7851a0"],
  ];
  const components = [
    forces[0],
    [q.parallel * Math.cos(a), q.parallel * Math.sin(a), "mg sinθ", "#9c721d"],
    [-q.normal * Math.sin(a), q.normal * Math.cos(a), "mg cosθ", "#427d99"],
  ];
  const drop = q.parallel * q.s,
    heat = q.friction * q.s,
    kinetic = 0.5 * p.mass * q.v * q.v,
    collision = Math.max(0, drop - heat - kinetic);
  return (
    <section className="incline-guide" aria-label="斜面运动与受力分析">
      <div>
        <div className="cube-pairs" role="group" aria-label="受力图模式">
          <button
            className="btn"
            aria-pressed={!decompose}
            onClick={() => setDecompose(false)}
          >
            实际受力
          </button>
          <button
            className="btn"
            aria-pressed={decompose}
            onClick={() => setDecompose(true)}
          >
            重力分解
          </button>
        </div>
        <span>
          {decompose
            ? "重力分解 · 虚线分量不是额外的作用力"
            : "隔离物体 · 各箭头采用同一力标尺"}
        </span>
        <svg
          viewBox="0 0 320 225"
          role="img"
          aria-label={
            decompose
              ? "重力分解为沿斜面向下及垂直斜面向内的分量"
              : "重力竖直向下，支持力垂直斜面，摩擦与挡板力沿斜面向上"
          }
        >
          <defs>
            <marker
              id="incline-vector-head"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M0 0L10 5L0 10Z" fill="context-stroke" />
            </marker>
          </defs>
          <g transform={`translate(150 108) rotate(${p.angle})`}>
            <path d="M-105 19H110" stroke="#bac2b5" strokeWidth="4" />
            <rect
              x="-18"
              y="-18"
              width="36"
              height="36"
              rx="3"
              fill="#bba477"
            />
          </g>
          {decompose && (
            <g
              aria-label="重力分解平行四边形"
              fill="none"
              stroke="#9da99f"
              strokeDasharray="3 4"
            >
              {components.slice(1).map(([x, y, label]) => (
                <path
                  key={label}
                  d={`M${150 + x * scale} ${108 + y * scale}L150 ${108 + q.gravity * scale}`}
                />
              ))}
            </g>
          )}
          {(decompose ? components : forces).map(
            ([x, y, label, color], i) =>
              Math.hypot(x, y) > 0.001 && (
                <g
                  key={label}
                  aria-label={decompose ? `重力分解向量 ${label}` : undefined}
                >
                  <path
                    d={`M150 108l${x * scale} ${y * scale}`}
                    stroke={color}
                    strokeWidth="3"
                    strokeDasharray={decompose && i > 0 ? "5 4" : undefined}
                    markerEnd="url(#incline-vector-head)"
                  />
                  <text
                    x={
                      150 +
                      x * scale +
                      (decompose ? (i === 2 ? -90 : 10) : i > 1 ? -22 : 10)
                    }
                    y={
                      108 +
                      y * scale +
                      (decompose && i === 1 ? 10 : i === 3 ? -14 : 0)
                    }
                    fill={color}
                    fontSize="16"
                  >
                    {label}
                  </text>
                </g>
              ),
          )}
          <text x="16" y="219" fill="#596b61" fontSize="13">
            θ = {p.angle}° · mg = {q.gravity.toFixed(1)} N
          </text>
        </svg>
        <dl
          className="incline-force-values"
          aria-label={decompose ? "重力与分量大小" : "当前受力大小"}
        >
          {(decompose
            ? [
                ["重力 mg", q.gravity, "#ad582c"],
                ["沿斜面 mg sinθ", q.parallel, "#9c721d"],
                ["垂直斜面 mg cosθ", q.normal, "#427d99"],
              ]
            : [
                ["重力 mg", q.gravity, "#ad582c"],
                ["支持力 N", q.normal, "#20776d"],
                ["摩擦力 f", q.friction, "#967415"],
                ["挡板力 F挡", q.stopForce, "#7851a0"],
              ]
          ).map(([name, value, color]) => (
            <div key={name}>
              <dt>
                <i style={{ background: color }} aria-hidden="true" />
                {name}
              </dt>
              <dd>
                {value.toFixed(2)} <small>N</small>
              </dd>
            </div>
          ))}
        </dl>
        {decompose && (
          <p>
            两个分量的矢量和等于重力。列受力方程时，用分量替代重力参与对应方向的计算，不再重复加入
            mg；支持力是另一实际作用力。
          </p>
        )}
      </div>
      <div>
        <span>
          {q.arrived
            ? "抵达挡板 · 已停止"
            : q.a < 1e-10
              ? "静摩擦平衡 · 保持静止"
              : "释放后沿斜面加速"}
        </span>
        <div className="incline-readings">
          <strong>
            {q.s.toFixed(2)}
            <small>m 位移</small>
          </strong>
          <strong>
            {q.v.toFixed(2)}
            <small>m/s 速度</small>
          </strong>
          <strong>
            {q.a.toFixed(2)}
            <small>m/s² 加速度</small>
          </strong>
        </div>
        <div className="incline-track">
          <div style={{ width: `${(q.s / 4) * 100}%` }} />
        </div>
        <p>
          0 m 起点 <span className="incline-end">4 m 挡板</span>
        </p>
        <p>
          沿斜面：mg sinθ − f − F挡 = ma
          <br />
          垂直斜面：N = mg cosθ
        </p>
        <p>
          μₛ = {q.muStatic.toFixed(2)} · μₖ = {q.muKinetic.toFixed(2)}
          <br />
          起滑临界角 ≈ {q.criticalAngle.toFixed(1)}°；当前静摩擦上限{" "}
          {q.staticLimit.toFixed(2)} N。
          {q.phase === "static"
            ? "静摩擦随重力分量调节，不一定达到上限。"
            : q.phase === "sliding"
              ? "已满足起滑条件，摩擦按动摩擦系数计算。"
              : "已由挡板约束停止。"}
        </p>
        <p>
          载荷示意：滑块与固定件 0.5 kg + {Math.round((p.mass - 0.5) / 0.5)}{" "}
          片配重 × 0.5 kg = {p.mass}{" "}
          kg。配重锁紧后随滑块一起运动，模型忽略内部相对运动。
        </p>
        <InclineVelocityPlot p={p} t={t} onSeek={onSeek} />
        <details>
          <summary>查看能量与模型边界</summary>
          <p>
            重力势能减少 {drop.toFixed(2)} J ≈ 动能 {kinetic.toFixed(2)} J +
            摩擦耗散 {heat.toFixed(2)} J
            {q.arrived ? ` + 停止过程耗散 ${collision.toFixed(2)} J` : ""}。
          </p>
          <p>
            调节系数时保持 μₖ≤μₛ，超过时联动另一个系数。示意台按比例呈现 4 m
            行程；挡板处采用瞬时停止约束，不求解碰撞时长和冲击峰值。停止后的静摩擦取此前滑动摩擦值，剩余沿坡力由挡板承担；这是一个平衡分配约定，图中挡板力不是冲击力。
          </p>
        </details>
      </div>
      <InclineEnergy p={p} t={t} />
    </section>
  );
}
