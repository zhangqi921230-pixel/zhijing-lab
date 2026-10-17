import React from "react";
import { dissectionPoses } from "./pythagorasDissection.mjs";
export default function PythagorasDissection({ p, time, guides = true }) {
  const { a, b } = p,
    l = a + b,
    s = 310 / l;
  const poses = dissectionPoses(a, b, time),
    finished = time >= 6;
  const colors = [
    "var(--ui-primary)",
    "var(--ui-gold)",
    "var(--ui-muted)",
    "var(--ui-ink)",
  ];
  return (
    <svg
      className="motion-diagram"
      viewBox="0 0 900 620"
      role="img"
      aria-label="四个全等直角三角形的刚性重排，比较两种剩余面积"
      style={{ fill: "var(--ui-ink)", fontSize: 18 }}
    >
      <rect width="900" height="620" fill="var(--ui-paper)" />
      <text x="32" y="36" fill="var(--ui-muted)">
        同一个外框 · 同样的四块三角形
      </text>
      <text x="450" y="77" textAnchor="middle" fontSize="25">
        {time <= 0
          ? "中央留下一个 c²"
          : finished
            ? "重新拼排，留下 a² 与 b²"
            : "平移与旋转，不拉伸、不缩放"}
      </text>
      <g transform="translate(280 120)">
        <rect
          width="310"
          height="310"
          fill="var(--ui-gold)"
          fillOpacity=".12"
          stroke="var(--ui-gold)"
          strokeWidth="2"
        />
        {finished && (
          <>
            <rect
              x={a * s}
              y="0"
              width={b * s}
              height={b * s}
              fill="var(--ui-gold)"
              fillOpacity=".22"
              stroke="var(--ui-gold)"
            />
            <rect
              x="0"
              y={b * s}
              width={a * s}
              height={a * s}
              fill="var(--ui-primary)"
              fillOpacity=".16"
              stroke="var(--ui-primary)"
            />
            <text x={(a + b / 2) * s} y={(b * s) / 2 + 7} textAnchor="middle">
              b² = {b * b}
            </text>
            <text x={(a * s) / 2} y={(b + a / 2) * s + 7} textAnchor="middle">
              a² = {a * a}
            </text>
          </>
        )}
        {poses.map(([x, y, angle], i) => (
          <g
            key={i}
            data-piece={i + 1}
            transform={`translate(${x * s} ${y * s}) rotate(${angle})`}
          >
            <polygon
              points={`0,0 ${a * s},0 0,${b * s}`}
              fill={colors[i]}
              fillOpacity=".3"
              stroke={colors[i]}
              strokeWidth="2"
            />
            {guides && (
              <path
                data-testid="dissection-right-angle"
                d="M0 10H10V0"
                fill="none"
                stroke={colors[i]}
              />
            )}
            <g
              transform={`translate(${(a * s) / 3} ${(b * s) / 3}) rotate(${-angle})`}
            >
              <circle r="12" fill="var(--ui-paper)" />
              <text textAnchor="middle" y="6" fontSize="16">
                {i + 1}
              </text>
            </g>
          </g>
        ))}
        {time <= 0 && (
          <text x="155" y="163" textAnchor="middle" fontSize="30">
            c²
          </text>
        )}
        {guides && (
          <text x="155" y="343" textAnchor="middle">
            外框边长 a+b = {l}
          </text>
        )}
      </g>
      <text x="450" y="507" textAnchor="middle" fontSize="24">
        {l * l} − 4 × {(a * b) / 2} = {a * a + b * b}
      </text>
      <text x="450" y="548" textAnchor="middle">
        {finished
          ? `两块空白面积之和：${a * a} + ${b * b} = ${a * a + b * b}`
          : "两种完整拼法：外框面积相同，减去的四块面积也相同。"}
      </text>
      <text
        x="450"
        y="591"
        textAnchor="middle"
        fontSize="16"
        fill="var(--ui-muted)"
      >
        {time > 0 && !finished
          ? "搬运过程允许暂时重叠或越出外框；只比较起点与终点的完整拼法。"
          : "每块只作平移与旋转，边长与面积保持不变。"}
      </text>
    </svg>
  );
}
