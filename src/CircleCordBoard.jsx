import React from "react";
import { circleCordPoint } from "./circleCord.mjs";
import { format } from "./models.mjs";

export default function CircleCordBoard({ p }) {
  const progress = (p.unroll ?? 100) / 100;
  const point = (fraction) => {
    const [x, y] = circleCordPoint(p.r, progress, fraction);
    return [240 + x * 12, 210 - y * 12];
  };
  const start = point(0),
    end = point(1);
  return (
    <svg
      viewBox="0 0 480 340"
      role="img"
      aria-label={`圆周绳展开 ${Math.round(progress * 100)}%，绳长始终为 ${format(2 * Math.PI * p.r)} 厘米`}
    >
      <rect
        x="14"
        y="36"
        width="452"
        height="240"
        rx="9"
        fill="#f9f7ea"
        stroke="#d8d1b7"
      />
      <text x="240" y="22" textAnchor="middle" fill="#6d7d68" fontSize="15">
        圆周绳 · 只改变弯曲程度
      </text>
      {Array.from({ length: p.parts }, (_, i) => {
        const points = Array.from({ length: 25 }, (_, j) =>
          point((i + j / 24) / p.parts),
        );
        return (
          <path
            key={i}
            d={points.map(([x, y], j) => `${j ? "L" : "M"}${x} ${y}`).join(" ")}
            fill="none"
            stroke={i % 2 ? "#c8b986" : "#337862"}
            strokeWidth="5"
          />
        );
      })}
      {[start, end].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="#b47e2b" />
      ))}
      <text x="240" y="256" textAnchor="middle" fill="#6d7d68" fontSize="15">
        绳长 C ≈ {format(2 * Math.PI * p.r)} cm · 始终不变
      </text>
      <text x="240" y="296" textAnchor="middle" fill="#6d7d68" fontSize="14">
        {progress === 1
          ? "拉直后可与下方厘米尺和直径尺对照"
          : "正在弯曲展开，端点间距不等于绳长"}
      </text>
      <text x="240" y="326" textAnchor="middle" fill="#62735f" fontSize="15">
        {Math.round(progress * 100)}% · 与左侧圆盘使用同一尺度
      </text>
    </svg>
  );
}
