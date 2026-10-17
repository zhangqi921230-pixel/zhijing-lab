import React, { useState } from "react";
import { molecules } from "./moleculeGeometry.mjs";
import { moleculeProjection } from "./moleculeProjection.mjs";
import Button from "./LabButton.jsx";
import "./MoleculeProjection.css";
export default function MoleculeProjection({ p }) {
  const [angle, setAngle] = useState(0),
    g = moleculeProjection(p.type, angle),
    m = molecules[p.type];
  const point = ([x, y]) => [230 + x * 80, 175 - y * 80];
  return (
    <section className="molecule-projection" aria-label="空间键角与投影角对照">
      <div>
        <h3>旋转的是观察方向，不是化学键</h3>
        <p>
          下图与三维模型共用原子坐标，采用正交投影。观察第1、2个外围原子与中心原子的夹角；数字编号只用于追踪位置。
        </p>
        <svg
          viewBox="0 0 460 350"
          role="img"
          aria-label={`${m.formula} 的正交投影，观察角度 ${angle} 度`}
        >
          <path
            d="M30 175H430M230 25V325"
            stroke="var(--ui-line)"
            strokeDasharray="4 5"
          />
          {g.points.slice(1).map((v, i) => {
            const [x, y] = point(v);
            return (
              <line
                key={i}
                x1="230"
                y1="175"
                x2={x}
                y2={y}
                stroke={i < 2 ? "#bd893e" : "var(--ui-muted)"}
                strokeWidth={i < 2 ? 5 : 3}
              />
            );
          })}
          {g.points
            .map((v, i) => ({ v, i }))
            .sort((a, b) => a.v[2] - b.v[2])
            .map(({ v, i }) => {
              const [x, y] = point(v);
              return (
                <g key={i}>
                  <circle
                    cx={x}
                    cy={y}
                    r={i ? 19 : 24}
                    fill={
                      g.types[i] === "O"
                        ? "#b65a48"
                        : g.types[i] === "N"
                          ? "#587bbb"
                          : i
                            ? "var(--ui-paper)"
                            : "var(--ui-primary)"
                    }
                    stroke="var(--ui-ink)"
                    strokeWidth="1.5"
                  />
                  <text
                    x={x}
                    y={y + 5}
                    textAnchor="middle"
                    fill={i && g.types[i] === "H" ? "var(--ui-ink)" : "white"}
                  >
                    {g.types[i]}
                  </text>
                  {i > 0 && (
                    <text x={x + 23} y={y - 20}>
                      {i}
                    </text>
                  )}
                </g>
              );
            })}
        </svg>
      </div>
      <div>
        <strong>真实键角 ≈ {m.angle.toFixed(2)}°</strong>
        <strong>
          屏幕投影角：
          {g.projectedAngle === null
            ? "无法定义（键投影为点）"
            : `${g.projectedAngle.toFixed(2)}°`}
        </strong>
        <label>
          绕竖直轴观察 {angle}°
          <input
            aria-label="分子投影观察角度"
            type="range"
            min="0"
            max="180"
            step="1"
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
          />
        </label>
        <div className="molecule-projection-actions">
          {[0, 45, 90, 180].map((a) => (
            <Button
              key={a}
              aria-pressed={angle === a}
              onClick={() => setAngle(a)}
            >
              {a}°
            </Button>
          ))}
        </div>
        <p>
          金色两条键对应所测角。即使原子重叠或投影角改变，三维结构与真实键角也不改变。
        </p>
        <p>
          这是独立的投影观察器，不驱动上方三维相机。图中距离是展示单位，圆球不是原子的真实边界；CO₂
          的线仅表示键方向，不区分键级。
        </p>
      </div>
    </section>
  );
}
