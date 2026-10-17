import React from "react";
import { unrolledPoint } from "./cylinderUnroll.mjs";
export default function CylinderUnroll({
  radius,
  height,
  progress,
  x,
  y,
  scale,
  guides,
}) {
  const length = 2 * Math.PI * radius,
    center = x + (length * scale) / 2;
  const point = (s) => unrolledPoint(radius, s, progress);
  const project = (p, v) => [
    center + scale * (p.x + 0.35 * p.z),
    y + scale * (v + 0.24 * p.z),
  ];
  const path = (points) =>
    points.map((p, i) => `${i ? "L" : "M"}${p.join(" ")}`).join(" ");
  const strips = Array.from({ length: 64 }, (_, i) => {
    const a = point(length * (i / 64 - 0.5)),
      b = point(length * ((i + 1) / 64 - 0.5));
    return { i, depth: (a.z + b.z) / 2, a, b };
  }).sort((a, b) => b.depth - a.depth);
  const edge = Array.from({ length: 129 }, (_, i) =>
    point(length * (i / 128 - 0.5)),
  );
  return (
    <g aria-label="保持弧长的圆柱侧面展开">
      {strips.map(({ i, a, b }) => (
        <path
          key={i}
          d={
            path([
              project(a, 0),
              project(b, 0),
              project(b, height),
              project(a, height),
            ]) + "Z"
          }
          fill="var(--ui-primary)"
          fillOpacity={
            0.13 +
            0.09 * (1 - Math.cos((i / 64 - 0.5) * Math.PI * 2 * (1 - progress)))
          }
          stroke="var(--ui-primary)"
          strokeOpacity=".12"
          strokeWidth=".5"
        />
      ))}
      {[0, height].map((v) => (
        <path
          key={v}
          d={path(edge.map((p) => project(p, v)))}
          fill="none"
          stroke={v === 0 ? "var(--ui-gold)" : "var(--ui-primary)"}
          strokeWidth={v === 0 ? 3 : 2}
        />
      ))}
      {[-0.5, 0.5].map((f) => {
        const p = point(length * f);
        return (
          <path
            key={f}
            d={path([project(p, 0), project(p, height)])}
            stroke="var(--ui-gold)"
            strokeWidth="3"
            strokeDasharray="6 4"
          />
        );
      })}
      {guides &&
        [-0.25, 0, 0.25].map((f) => {
          const p = point(length * f);
          return (
            <path
              key={f}
              d={path([project(p, 0), project(p, height)])}
              stroke="var(--ui-muted)"
              strokeDasharray="4 5"
              strokeWidth="1.5"
            />
          );
        })}
      {guides && (
        <>
          <text x={center} y="440" textAnchor="middle">
            金色弧长始终为 2πr；竖向母线始终为 h
          </text>
          <text x={center} y="470" textAnchor="middle">
            {progress === 1
              ? "完全展平：宽 2πr × 高 h"
              : "弯曲逐渐减小，侧面没有拉伸"}
          </text>
        </>
      )}
    </g>
  );
}
