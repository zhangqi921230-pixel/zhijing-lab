import React, { useState } from "react";
import { leverForceAngle } from "./leverForceAngle.mjs";
import Button from "./LabButton.jsx";
import "./LeverForceAngle.css";
export default function LeverForceAngle({ p }) {
  const [components, setComponents] = useState(false);
  const [angle, setAngle] = useState(90),
    q = leverForceAngle(p.l2, p.f2, angle),
    scale = 130,
    ox = 100,
    oy = 175,
    px = ox + p.l2 * scale,
    fx = ox + q.foot[0] * scale,
    fy = oy + q.foot[1] * scale,
    [vx, vy] = q.direction,
    ex = px + 75 * vx,
    ey = oy + 75 * vy;
  const fmt = (n) => Number(n.toFixed(3));
  return (
    <section className="lever-angle-study" aria-label="斜向力与垂直力臂">
      <div>
        <h3>同一个作用点，拉力方向不同</h3>
        <p>
          独立的水平杆静态示意：沿用右侧
          F₂、d₂，改变力的方向。此观察器不改变上方固定重物的竖直重力模型。
        </p>
        <svg
          viewBox="0 0 470 320"
          role="img"
          aria-label={`夹角${angle}度，垂直力臂${fmt(q.arm)}米，力矩${fmt(q.torque)}牛米`}
        >
          <line
            x1={px - 160 * vx}
            y1={oy - 160 * vy}
            x2={px + 120 * vx}
            y2={oy + 120 * vy}
            stroke="var(--ui-muted)"
            strokeDasharray="5 5"
          />
          <line
            x1={ox}
            y1={oy}
            x2={px}
            y2={oy}
            stroke="var(--ui-ink)"
            strokeWidth="8"
          />
          <line
            x1={ox}
            y1={oy}
            x2={fx}
            y2={fy}
            stroke="#b8883d"
            strokeWidth="4"
          />
          <circle cx={fx} cy={fy} r="4" fill="#b8883d" />
          {q.arm > 1e-8 && (
            <path
              d={`M${fx + 8 * vx} ${fy + 8 * vy}L${fx + 8 * vx - 8 * vy} ${fy + 8 * vy + 8 * vx}L${fx - 8 * vy} ${fy + 8 * vx}`}
              fill="none"
              stroke="#b8883d"
              strokeWidth="1.5"
            />
          )}
          {angle > 0 && (
            <path
              d={`M${px + 32} ${oy}A32 32 0 0 1 ${px + 32 * vx} ${oy + 32 * vy}`}
              fill="none"
              stroke="var(--ui-primary)"
              strokeWidth="1.5"
            />
          )}

          <line
            x1={px}
            y1={oy}
            x2={ex}
            y2={ey}
            stroke="var(--ui-primary)"
            strokeWidth="4"
          />
          <path
            d={`M${ex - 12 * vx + 6 * vy} ${ey - 12 * vy - 6 * vx}L${ex} ${ey}L${ex - 12 * vx - 6 * vy} ${ey - 12 * vy + 6 * vx}`}
            fill="none"
            stroke="var(--ui-primary)"
            strokeWidth="4"
          />
          {components && (
            <g
              data-testid="lever-force-components"
              fill="none"
              strokeWidth="2.5"
            >
              <path
                d={`M${px} ${oy}H${ex}V${ey}H${px}`}
                stroke="var(--ui-muted)"
                strokeDasharray="4 4"
              />
              {Math.abs(vx) > 1e-8 && (
                <>
                  <path d={`M${px} ${oy}H${ex}`} stroke="var(--ui-muted)" />
                  <path
                    d={`M${ex - 8 * Math.sign(vx)} ${oy - 5}L${ex} ${oy}L${ex - 8 * Math.sign(vx)} ${oy + 5}`}
                    stroke="var(--ui-muted)"
                  />
                </>
              )}
              {vy > 1e-8 && (
                <>
                  <path d={`M${px} ${oy}V${ey}`} stroke="var(--ui-gold)" />
                  <path
                    d={`M${px - 5} ${ey - 8}L${px} ${ey}L${px + 5} ${ey - 8}`}
                    stroke="var(--ui-gold)"
                  />
                </>
              )}
            </g>
          )}
          <circle
            cx={ox}
            cy={oy}
            r="7"
            fill="var(--ui-paper)"
            stroke="var(--ui-ink)"
            strokeWidth="2"
          />
          <circle cx={px} cy={oy} r="5" fill="var(--ui-primary)" />
          <text x={ox - 12} y={oy + 30}>
            支点 O
          </text>
          <text x={px + 8} y={oy - 12}>
            作用点
          </text>
          <text x="28" y="30">
            金线：支点到力的作用线的最短距离
          </text>
          <text x="28" y="301">
            虚线为作用线；箭头长度仅表示方向
          </text>
        </svg>
      </div>
      <div>
        <strong>杆上距离 d = {p.l2} m</strong>
        <strong>垂直力臂 l = d sinα = {fmt(q.arm)} m</strong>
        <strong>力矩大小 F·l = {fmt(q.torque)} N·m</strong>
        <label>
          力与杆向右方向的夹角 α：{angle}°
          <input
            type="range"
            aria-label="力与杆的夹角"
            min="0"
            max="180"
            step="1"
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
          />
        </label>
        <div className="lever-angle-actions">
          {[0, 30, 90, 150, 180].map((a) => (
            <Button
              key={a}
              aria-pressed={angle === a}
              onClick={() => setAngle(a)}
            >
              {a}°
            </Button>
          ))}
        </div>
        <Button
          aria-pressed={components}
          onClick={() => setComponents(!components)}
        >
          {components ? "收起力的分解" : "分解为沿杆与垂直分力"}
        </Button>
        {components && (
          <div role="status">
            <p>
              沿杆分力 F cosα = {fmt(q.parallel)} N（向右为正）；垂直分力 F sinα
              = {fmt(q.perpendicular)}{" "}
              N（向下为正）。灰色箭头沿杆，金色箭头垂直杆；虚线构成分力平行四边形。
            </p>
            <p>
              沿杆分力的作用线经过支点，力矩为零。垂直分力的力矩 ={" "}
              {fmt(q.perpendicular)} × {p.l2} = {fmt(q.torque)} N·m，与 F ×
              垂直力臂相同。两种算法得到同一力矩，不能相加。分力箭头与原力使用同一示意比例，力值以读数为准。
            </p>
          </div>
        )}
        <p>
          当前作用力 {p.f2} N。
          {q.arm === 0
            ? "作用线经过支点，力矩为零。"
            : angle === 90
              ? "力垂直于杆，同样的力和距离下力矩最大。"
              : "力不垂直于杆，力臂小于杆上距离；当前力矩方向为顺时针。"}
        </p>
        <p>
          比较30°与150°：垂直力臂相等，力矩大小也相等。这里不模拟斜向拉力下的运动，也不把示意箭头长度当作力的大小。
        </p>
      </div>
    </section>
  );
}
