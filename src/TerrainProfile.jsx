import React, { useMemo } from "react";
import { terrainSection } from "./models.mjs";

export default function TerrainProfile({ p }) {
  const points = useMemo(
    () => terrainSection(p.section ?? 50, p.sectionAngle ?? 0),
    [p.section, p.sectionAngle],
  );
  const first = points[0],
    last = points.at(-1);
  const distance = Math.hypot(last[0] - first[0], last[2] - first[2]);
  const direction =
    (p.sectionAngle ?? 0) === 0
      ? "西 → 东"
      : p.sectionAngle === 90
        ? "北 → 南"
        : "西北 → 东南";
  const path = points
    .map(
      ([x, h, z], i) =>
        `${i ? "L" : "M"}${34 + (Math.hypot(x - first[0], z - first[2]) / distance) * 288},${135 - h * 0.045}`,
    )
    .join(" ");
  const high = Math.max(...points.map((v) => v[1]));
  return (
    <section className="terrain-profile" aria-label="同步地形剖面">
      <div className="terrain-profile-heading">
        <strong>A—B 地形剖面</strong>
        <span>
          {direction} · 当前最高点 {high.toFixed(0)} m
        </span>
      </div>
      <svg
        viewBox="0 0 350 180"
        role="img"
        aria-label={`${direction}地形剖面，最高点 ${high.toFixed(0)} 米，切面 ${p.level} 米`}
      >
        {[0, 800, 1600, 2400].map((h) => (
          <g key={h}>
            <path d={`M34 ${135 - h * 0.045}H322`} stroke="#314553" />
            <text x="28" y={139 - h * 0.045} textAnchor="end">
              {h}
            </text>
          </g>
        ))}
        <path d={`${path}L322 135H34Z`} fill="#617d6b" fillOpacity=".32" />
        <path d={path} fill="none" stroke="#e8d4a0" strokeWidth="2" />
        <path
          d={`M34 ${135 - p.level * 0.045}H322`}
          stroke="#83c9e0"
          strokeDasharray="6 5"
        />
        <text x="320" textAnchor="end" y={130 - p.level * 0.045} fill="#a8def0">
          {p.level} m
        </text>
        {[0, 25, 50, 75, 100].map((v) => (
          <g key={v}>
            <path d={`M${34 + v * 2.88} 135v5`} stroke="#95adb9" />
            <text x={34 + v * 2.88} y="153" textAnchor="middle">
              {v}%
            </text>
          </g>
        ))}
        <text x="34" y="174">
          A
        </text>
        <text x="322" y="174" textAnchor="end">
          B
        </text>
        <text x="34" y="11">
          海拔 / m
        </text>
      </svg>
      <p>
        旋转或平移 A—B
        线，对比山峰与山谷。横轴为沿线距离比例；合成教学地形，横纵比例不同。
      </p>
    </section>
  );
}
