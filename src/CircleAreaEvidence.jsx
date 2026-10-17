import React from "react";
import Button from "./LabButton.jsx";
import { circleAreaState } from "./revealModels.mjs";
import "./CircleAreaEvidence.css";
export function arcRise(radius, sectors, fraction) {
  const angle = Math.PI / sectors;
  const x = radius * Math.sin(angle) * fraction;
  return Math.max(
    0,
    Math.sqrt(radius * radius - x * x) - radius * Math.cos(angle),
  );
}
export default function CircleAreaEvidence({ p, chapter, onSelect }) {
  const q = circleAreaState(p),
    half = p.radius * Math.sin(Math.PI / p.sectors);
  const path = Array.from({ length: 65 }, (_, i) => {
    const f = i / 32 - 1;
    return `${i ? "L" : "M"}${320 + half * f * 80} ${175 - arcRise(p.radius, p.sectors, f) * 240}`;
  }).join(" ");
  return (
    <details className="circle-area-evidence" open={chapter === 5}>
      <summary>放大弧边 · 有限等分与极限</summary>
      <p>
        保持半径 {p.radius}{" "}
        cm，比较同一比例下的一段圆弧与它的弦。金色弧边与虚线之间的最大距离叫弓高；图中纵向起伏放大
        3 倍，读数仍为实际长度。
      </p>
      <div
        className="circle-edge-scroll"
        tabIndex="0"
        role="region"
        aria-label="弧边放大图，可横向滚动"
      >
        <svg
          viewBox="0 0 640 270"
          role="img"
          aria-label={`${p.sectors} 等分圆弧与弦的弓高对照`}
        >
          <text x="24" y="30">
            当前 {p.sectors} 等分 · 每段圆心角 {q.sectorAngle.toFixed(2)}°
          </text>
          <path
            d={`M${320 - half * 80} 175H${320 + half * 80}`}
            stroke="var(--ui-muted)"
            strokeDasharray="5 5"
          />
          <path
            data-testid="circle-edge-arc"
            d={path}
            fill="none"
            stroke="var(--ui-gold)"
            strokeWidth="3"
          />
          <path
            d={`M320 175V${175 - q.sagitta * 240}`}
            stroke="var(--ui-primary)"
            strokeWidth="2"
          />
          <circle
            cx="320"
            cy={175 - q.sagitta * 240}
            r="4"
            fill="var(--ui-primary)"
          />
          <text x="24" y="220">
            最大起伏 {(q.sagitta * 10).toFixed(3)} mm
          </text>
          <text x="24" y="252">
            弧没有被拉直，起伏也没有变成零。
          </text>
        </svg>
      </div>
      <div className="circle-edge-comparisons" aria-label="弧边起伏对照">
        {[8, 24, 64].map((sectors) => {
          const v = circleAreaState({ ...p, sectors });
          return (
            <Button
              key={sectors}
              aria-pressed={p.sectors === sectors}
              onClick={() => onSelect(sectors)}
            >
              <span>
                {sectors} 等分 · 起伏 {(v.sagitta * 10).toFixed(3)} mm
              </span>
            </Button>
          );
        })}
      </div>
      <p>
        这些等分方案的总面积都为 <strong>{q.area.toFixed(2)} cm²</strong>
        。增加块数改变的是每段弧的起伏，既不增添也不删去扇形面积。
      </p>
      <details>
        <summary>进阶：用公式核对弓高</summary>
        <p>
          h = r[1 − cos(π/n)]，n 是等分数。n 越大，h 越接近 0；任意有限 n 的 h
          仍大于 0。这里的 h 是弓高，不是拼接图的宽。
        </p>
      </details>
    </details>
  );
}
