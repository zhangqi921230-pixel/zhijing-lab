import React, { useMemo } from "react";
import Button from "./LabButton.jsx";
import { polarPoint } from "./visualModels.mjs";
import "./PolarRadiusStudy.css";
export default function PolarRadiusStudy({ p, time, onSeek }) {
  const theta = (time * Math.PI) / 3,
    q = polarPoint(p, theta),
    limit = p.shape === 1 ? 2 * p.radius : p.radius;
  const y = (r) => 120 - (r / limit) * 70;
  const d = useMemo(
    () =>
      Array.from(
        { length: 361 },
        (_, i) =>
          `${i ? "L" : "M"}${50 + i * 1.25},${120 - (polarPoint(p, (i * Math.PI) / 180).r / (p.shape === 1 ? 2 * p.radius : p.radius)) * 70}`,
      ).join(" "),
    [p],
  );
  const zero = Math.abs(q.r) < 1e-9;
  const choices =
    p.shape === 2
      ? [
          ["正极径峰值", 0],
          ["极径为零", Math.PI / (2 * p.petals)],
          ["负极径峰值", Math.PI / p.petals],
        ]
      : p.shape === 1
        ? [
            ["最远点", 0],
            ["侧向位置", Math.PI / 2],
            ["回到极点", Math.PI],
          ]
        : [
            ["右侧", 0],
            ["上方", Math.PI / 2],
            ["左侧", Math.PI],
          ];
  return (
    <section className="polar-radius-study" aria-label="角度与带符号极径">
      <h2>同一个点，两种读法</h2>
      <p>
        当前曲线：
        {p.shape === 0
          ? `圆 r=${p.radius}`
          : p.shape === 1
            ? `心形线 r=${p.radius}(1+cosθ)`
            : `玫瑰线 r=${p.radius}cos(${p.petals}θ)`}
        。上图看点的位置，下图看极径如何随角度变化。
      </p>
      <div className="polar-radius-grid">
        <svg
          viewBox="0 0 560 240"
          role="img"
          aria-label="极径随角度变化曲线，光标与上方描迹点同步"
        >
          <path
            d="M50 35V205M50 120H510"
            fill="none"
            stroke="var(--ui-muted)"
          />
          {[0, 90, 180, 270, 360].map((a) => (
            <g key={a}>
              <path d={`M${50 + a * 1.25} 40V200`} stroke="var(--ui-line)" />
              <text x={50 + a * 1.25} y="226" textAnchor="middle">
                {a}°
              </text>
            </g>
          ))}
          <text x="8" y="55">
            {limit.toFixed(1)}
          </text>
          <text x="22" y="125">
            0
          </text>
          <text x="4" y="195">
            −{limit.toFixed(1)}
          </text>
          <path
            d={d}
            fill="none"
            stroke="var(--ui-primary)"
            strokeWidth="2.5"
          />
          <line
            x1={50 + time * 75}
            x2={50 + time * 75}
            y1="35"
            y2="205"
            stroke="var(--ui-muted)"
            strokeDasharray="4 4"
          />
          <circle
            cx={50 + time * 75}
            cy={y(q.r)}
            r="5"
            fill="var(--ui-primary)"
          />
        </svg>
        <div>
          <p>
            <strong>
              θ={(time * 60).toFixed(1)}° · r={zero ? "0.000" : q.r.toFixed(3)}
            </strong>
          </p>
          <p>
            {zero
              ? "点位于极点，此时点本身没有唯一方向。"
              : q.r < 0
                ? `负极径：点沿射线反方向，实际方向为 ${((time * 60 + 180) % 360).toFixed(1)}°，离极点 ${Math.abs(q.r).toFixed(3)}。`
                : `正极径：点沿射线正方向，离极点 ${q.r.toFixed(3)}。`}
          </p>
          <p>x=r cosθ，y=r sinθ；距离为 |r|，不是带符号的 r。</p>
        </div>
      </div>
      <div className="motion-shortcuts">
        {choices.map(([name, angle]) => (
          <Button key={name} onClick={() => onSeek((angle * 3) / Math.PI)}>
            {name}
          </Button>
        ))}
      </div>
      <p>
        下图纵轴按当前极径范围显示；跨尺度比较请看读数。点击关键位置会暂停演示，右侧可继续调整曲线。
      </p>
    </section>
  );
}
