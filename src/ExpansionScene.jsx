import React from "react";
import CylinderUnroll from "./CylinderUnroll.jsx";
import { expansionState } from "./expansionLessons.mjs";
import "./ObservableScene.css";
export default function ExpansionScene({
  id,
  p,
  time,
  chapter = 0,
  guides = true,
}) {
  const progress = Math.max(0, Math.min(1, time / 6)),
    q = expansionState(id, p);
  if (id === "additive-light") {
    const centers = [
        [190 + 170 * progress, 265],
        [710 - 170 * progress, 265],
        [450, 465 - 105 * progress],
      ],
      radius = 130;
    // Disjoint channel lights are added with screen: no channel is duplicated.
    const colors = q.rgb.map(
      (v, i) => `rgb(${[0, 1, 2].map((j) => (i === j ? v : 0)).join(",")})`,
    );
    return (
      <svg
        className="motion-diagram observable-scene"
        viewBox="0 0 900 620"
        role="img"
        aria-label="三原色色光重叠与加色混合"
      >
        <text x="35" y="45" className="observable-title">
          {
            [
              "让三束光相遇",
              "红 + 绿 = 黄",
              "青色 ↔ 品红色",
              "从暗灰到明亮白光",
              "红 + 青 = 白",
            ][chapter]
          }
        </text>
        <rect x="30" y="75" width="840" height="490" rx="18" fill="#080b10" />
        <g style={{ isolation: "isolate" }}>
          <rect x="32" y="77" width="836" height="486" rx="16" fill="#000" />
          {centers.map(([cx, cy], i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={radius}
              fill={colors[i]}
              style={{ mixBlendMode: "screen" }}
            />
          ))}
        </g>
        {guides &&
          centers.map(([cx, cy], i) => (
            <g key={i}>
              <circle
                cx={cx}
                cy={cy}
                r={radius}
                fill="none"
                stroke="#a5b3be"
                strokeDasharray="4 7"
              />
              <text
                x={cx}
                y={i === 2 ? cy + radius + 25 : cy - radius - 15}
                textAnchor="middle"
                style={{ fill: "#eef3f7" }}
              >
                {["红 R", "绿 G", "蓝 B"][i]}　{[p.red, p.green, p.blue][i]}%
              </text>
            </g>
          ))}
        <text x="35" y="603">
          光束重叠才混合；虚线标记光斑边界，黑色表示没有入射光
        </text>
      </svg>
    );
  }
  const scale = 18,
    r = p.radius * scale,
    h = p.height * scale,
    w = q.circumference * scale,
    x = 350,
    y = 300 - h / 2;
  const unfold = 1,
    caps = chapter === 1 ? progress : 1;
  return (
    <svg
      className="motion-diagram observable-scene"
      viewBox="0 0 900 620"
      role="img"
      aria-label="圆柱侧面展开和底面拼接"
    >
      <text x="35" y="45" className="observable-title">
        {chapter === 4 ? "无盖圆柱 · 少一个底面" : "从立体到平面 · 面积不变"}
      </text>
      <text x="35" y="83">
        半径 {p.radius} cm　高度 {p.height} cm；右侧展开图共用比例尺
      </text>
      <path
        d={`M${160 - r} ${y}V${y + h}a${r} ${r * 0.28} 0 0 0 ${2 * r} 0V${y}`}
        fill="var(--ui-primary)"
        fillOpacity=".12"
        stroke="var(--ui-primary)"
        strokeWidth="2"
      />
      <ellipse
        cx="160"
        cy={y}
        rx={r}
        ry={r * 0.28}
        fill="var(--ui-surface)"
        stroke="var(--ui-gold)"
        strokeWidth="3"
      />
      <path
        d={`M${160 + r} ${y}V${y + h}`}
        stroke="var(--ui-gold)"
        strokeWidth="3"
        strokeDasharray="6 4"
      />
      {chapter === 0 ? (
        <CylinderUnroll
          radius={p.radius}
          height={p.height}
          progress={progress}
          {...{ x, y, scale, guides }}
        />
      ) : (
        <>
          <rect
            x={x}
            y={y}
            width={w * unfold}
            height={h}
            fill="var(--ui-primary)"
            fillOpacity=".17"
            stroke="var(--ui-primary)"
            strokeWidth="2"
          />
          <path
            d={`M${x} ${y}h${w * unfold}`}
            stroke="var(--ui-gold)"
            strokeWidth="4"
          />
        </>
      )}
      {chapter !== 0 &&
        [1, -1]
          .filter((n) => chapter !== 4 || n === 1)
          .map((n) => (
            <circle
              key={n}
              cx={x + w / 2 + (1 - caps) * 180}
              cy={
                n === 1 ? y + h + r + (1 - caps) * 35 : y - r - (1 - caps) * 35
              }
              r={r}
              fill="var(--ui-gold)"
              fillOpacity=".17"
              stroke="var(--ui-gold)"
              strokeWidth="2"
            />
          ))}
      {guides && (
        <>
          <text x={x} y="125">
            展平宽 = 2πr ≈ {q.circumference.toFixed(2)} cm
          </text>
          <text x={x + w + 12} y="305">
            h
          </text>
          <text x="80" y={y + h + 55}>
            沿金色母线剪开
          </text>
        </>
      )}
      <text x="350" y="500">
        侧面：{q.side.toFixed(2)} cm²
      </text>
      <text x="350" y="540">
        {chapter === 4 ? "一个底面" : "两个底面"}：
        {(q.base * (chapter === 4 ? 1 : 2)).toFixed(2)} cm²
      </text>
      <text x="35" y="588">
        {chapter === 0
          ? `展开进度 ${(progress * 100).toFixed(0)}%`
          : `所需面积 ≈ ${(chapter === 4 ? q.open : q.total).toFixed(2)} cm²`}
        　· 不计厚度、接缝与裁剪损耗
      </text>
    </svg>
  );
}
