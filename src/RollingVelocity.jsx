import React, { useId } from "react";
import Button from "./LabButton.jsx";
import { rollingVelocity } from "./motionModels.mjs";
import "./RollingVelocity.css";
export default function RollingVelocity({ p, time, onSeek }) {
  const q = rollingVelocity(p.radius, p.ratio, (time * Math.PI) / 3),
    uid = useId().replace(/:/g, "");
  const ox = 125,
    oy = 155,
    k = 52,
    tx = ox + q.translation * k,
    ex = ox + q.vx * k,
    ey = oy - q.vy * k;
  const arrow = (x1, y1, x2, y2, color, key) =>
    Math.hypot(x2 - x1, y2 - y1) < 1e-8 ? null : (
      <path
        key={key}
        d={`M${x1} ${y1}L${x2} ${y2}`}
        fill="none"
        stroke={color}
        strokeWidth="3"
        markerEnd={`url(#${uid}-${key})`}
      />
    );
  return (
    <section className="rolling-velocity" aria-label="描迹点的速度合成">
      <h2>为什么接地点会瞬间停下？</h2>
      <div className="rolling-velocity-grid">
        <svg
          viewBox="0 0 500 330"
          role="img"
          aria-label="平移速度加转动速度等于描迹点速度"
        >
          <defs>
            {["var(--ui-primary)", "var(--ui-muted)", "var(--ui-gold)"].map(
              (c, i) => (
                <marker
                  key={i}
                  id={`${uid}-${i}`}
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto"
                >
                  <path d="M0 0L10 5L0 10Z" fill={c} />
                </marker>
              ),
            )}
          </defs>
          <path d="M35 155H465M125 25V290" stroke="var(--ui-line)" />
          {arrow(ox, oy, tx, oy, "var(--ui-primary)", 0)}
          {arrow(tx, oy, ex, ey, "var(--ui-muted)", 1)}
          {q.speed > 0 && arrow(ox, oy + 5, ex, ey + 5, "var(--ui-gold)", 2)}
          <circle cx={ox} cy={oy} r="4" fill="var(--ui-ink)" />
          <text x="30" y="315">
            速度图 · 三根箭头使用同一比例
          </text>
        </svg>
        <div>
          <p>① 平移：向右 {q.translation.toFixed(2)} m/s</p>
          <p>
            ② 绕轮心转动：({q.rotationX.toFixed(2)}, {q.rotationY.toFixed(2)})
            m/s
          </p>
          <p>
            <strong>
              ③ 合速度：({q.vx.toFixed(2)}, {q.vy.toFixed(2)}) m/s
            </strong>
          </p>
          <p>
            速率 {q.speed.toFixed(2)} m/s。
            {q.speed === 0
              ? "两部分恰好抵消，描迹点瞬时静止。"
              : q.vx < 0
                ? "水平分量向左，描迹点此刻正在向后走。"
                : "水平分量非负，描迹点此刻没有向后运动。"}
          </p>
        </div>
      </div>
      <div className="motion-shortcuts">
        {[
          ["底部位置", 0],
          ["左侧位置", 1.5],
          ["顶部位置", 3],
        ].map(([label, t]) => (
          <Button key={label} onClick={() => onSeek(t)}>
            {label}
          </Button>
        ))}
      </div>
      <p>
        ①②首尾相接，③表示总速度（为辨认而略微下移）。这里比较速度向量，不是物体位置；纵向正方向向上。固定6秒转一周，ω=π/3
        rad/s。轮缘点在底部瞬时静止，轮外点可出现向后运动；轮内点则不会。
      </p>
    </section>
  );
}
