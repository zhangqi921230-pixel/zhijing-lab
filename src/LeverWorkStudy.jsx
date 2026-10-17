import React, { useState } from "react";
import "./LeverWorkStudy.css";
export function leverWork(p, degrees) {
  const a = (degrees * Math.PI) / 180,
    force = (p.f1 * p.l1) / p.l2;
  return {
    force,
    leftHeight: p.l1 * Math.sin(a),
    rightHeight: p.l2 * Math.sin(a),
    leftArc: p.l1 * a,
    rightArc: p.l2 * a,
    work: p.f1 * p.l1 * Math.sin(a),
  };
}
export default function LeverWorkStudy({ p, onChange }) {
  const [angle, setAngle] = useState(20),
    q = leverWork(p, angle),
    a = (angle * Math.PI) / 180;
  const scale = 120,
    x = 340,
    y = 180;
  const left = {
    x: x - p.l1 * scale * Math.cos(a),
    y: y - p.l1 * scale * Math.sin(a),
  };
  const right = {
    x: x + p.l2 * scale * Math.cos(a),
    y: y + p.l2 * scale * Math.sin(a),
  };
  const choose = (value) => {
    onChange("l1", p.l1);
    setAngle(value);
  };
  return (
    <section className="lever-work-study" aria-label="杠杆省力与移动距离">
      <h3>同样转过一个角，哪一端走得更远？</h3>
      <p>
        下图独立观察理想杠杆从水平位置缓慢转动，右端向下施力、左端抬起载荷。所需右侧力按平衡条件计算，不使用上方当前右侧载荷的自由释放结果。力箭头仅表示方向，大小以数值为准。
      </p>
      <div
        className="lever-work-scroll"
        role="region"
        tabIndex="0"
        aria-label="杠杆两端位移图，可横向滚动"
      >
        <svg
          viewBox="0 0 680 430"
          role="img"
          aria-label={`左端升高${q.leftHeight.toFixed(3)}米，右端下降${q.rightHeight.toFixed(3)}米`}
        >
          <defs>
            <marker
              id="lever-work-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto"
            >
              <path d="M0 0L10 5L0 10Z" fill="var(--ui-gold)" />
            </marker>
          </defs>
          <path d="M60 180H620" stroke="var(--ui-line)" strokeDasharray="5 5" />
          <text x="60" y="165">
            水平起点
          </text>
          <path
            d={`M${x - p.l1 * scale} ${y}A${p.l1 * scale} ${p.l1 * scale} 0 0 1 ${left.x} ${left.y}`}
            fill="none"
            stroke="var(--ui-gold)"
            strokeWidth="2"
            strokeDasharray="4 3"
          />
          <path
            d={`M${x + p.l2 * scale} ${y}A${p.l2 * scale} ${p.l2 * scale} 0 0 1 ${right.x} ${right.y}`}
            fill="none"
            stroke="var(--ui-gold)"
            strokeWidth="2"
            strokeDasharray="4 3"
          />
          <path
            d={`M${left.x} ${left.y}L${right.x} ${right.y}`}
            stroke="var(--ui-primary)"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path d="M340 180L323 213H357Z" fill="var(--ui-gold)" />
          <circle cx="340" cy="180" r="6" fill="var(--ui-ink)" />
          {[left, right].map((v, i) => (
            <g key={i}>
              <circle cx={v.x} cy={v.y} r="9" fill="var(--ui-gold)" />
              <path
                d={`M${v.x} ${v.y + 12}v42`}
                stroke="var(--ui-gold)"
                strokeWidth="2"
                markerEnd="url(#lever-work-arrow)"
              />
              <text x={v.x} y={v.y + 78} textAnchor="middle">
                {(i ? q.force : p.f1).toFixed(2)} N ↓
              </text>
              <path
                d={`M${v.x} ${v.y}H${i ? 625 : 55}V180`}
                fill="none"
                stroke="var(--ui-primary)"
                strokeDasharray="3 3"
              />
            </g>
          ))}
          <text x="55" y="35">
            左端抬升 {q.leftHeight.toFixed(3)} m
          </text>
          <text x="625" y="35" textAnchor="end">
            右端下降 {q.rightHeight.toFixed(3)} m
          </text>
          <text x="340" y="410" textAnchor="middle">
            两端同转 {angle}° · 金色虚线为圆弧轨迹 · 竖直虚线为高度变化
          </text>
        </svg>
      </div>
      <label>
        观察转角 <strong>{angle}°</strong>
        <input
          aria-label="杠杆位移观察转角"
          type="range"
          min="0"
          max="25"
          step="1"
          value={angle}
          onChange={(e) => choose(Number(e.target.value))}
        />
      </label>
      <div className="lever-work-actions">
        {[0, 10, 20, 25].map((v) => (
          <button key={v} aria-pressed={angle === v} onClick={() => choose(v)}>
            {v === 0 ? "水平起点" : `转到 ${v}°`}
          </button>
        ))}
      </div>
      <div className="lever-work-values">
        <p>
          左侧载荷增加的重力势能
          <strong>
            {p.f1.toFixed(2)} × {q.leftHeight.toFixed(3)} ≈ {q.work.toFixed(3)}{" "}
            J
          </strong>
        </p>
        <p>
          右侧向下作用力做的功
          <strong>
            {q.force.toFixed(2)} × {q.rightHeight.toFixed(3)} ≈{" "}
            {q.work.toFixed(3)} J
          </strong>
        </p>
      </div>
      <p>
        右臂 / 左臂 = {(p.l2 / p.l1).toFixed(2)}；两端圆弧路程分别为{" "}
        {q.leftArc.toFixed(3)} m、{q.rightArc.toFixed(3)}{" "}
        m。长臂端省力，但移动距离更大。竖直力做功应使用竖直位移，不能直接用圆弧长度乘力。
      </p>
      <details>
        <summary>为什么这里不自动从静止转起来？</summary>
        <p>
          这是忽略杆重、摩擦和动能变化的准静态几何比较，右侧力始终取F₁l₁/l₂。严格平衡且初始静止的杠杆不会自行转动；滑块指定外部缓慢操控的位置，未求解启动和停止过程。上方自由释放实验另行计算角加速度与限位。
        </p>
      </details>
    </section>
  );
}
