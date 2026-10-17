import React, { useState } from "react";
import { plateColumn } from "./plateModel.mjs";
import "./PlateStrainExplorer.css";
export default function PlateStrainExplorer({ p }) {
  const [u, setU] = useState(0);
  const q = plateColumn(u, 0, p),
    thickness = q.thickness / 1.1;
  return (
    <section className="plate-strain" aria-label="地层柱变形对照">
      <header>
        <strong>同一地层柱 · 变形前后</strong>
        <span>宽度 × 厚度，观察局部面积</span>
      </header>
      <div
        className="plate-sample-positions"
        role="group"
        aria-label="选择地层柱的位置"
      >
        {[
          [0, "靠近边界"],
          [0.5, "板块中部"],
          [1, "远离边界"],
        ].map(([value, label]) => (
          <button
            key={value}
            aria-pressed={u === value}
            onClick={() => setU(value)}
          >
            {label}
          </button>
        ))}
      </div>
      <svg
        viewBox="0 0 680 205"
        role="img"
        aria-label={`局部宽度${q.jacobian.toFixed(2)}倍，厚度${thickness.toFixed(2)}倍，面积比1`}
      >
        {[
          { x: 175, w: 1, h: 1, title: "初始状态" },
          { x: 505, w: q.jacobian, h: thickness, title: "当前状态" },
        ].map(({ x, w, h, title }) => (
          <g key={title}>
            <text x={x} y="23" textAnchor="middle">
              {title}
            </text>
            {[
              [0, 0.13],
              [0.13, 0.42],
              [0.42, 0.7],
              [0.7, 1],
            ].map(([f, end], i) => (
              <rect
                key={i}
                x={x - 45 * w}
                y={154 - 44 * h + f * 44 * h}
                width={90 * w}
                height={(end - f) * 44 * h}
                fill={["#b9a787", "#a78d69", "#82796e", "#515b61"][i]}
                stroke="var(--ui-paper)"
                strokeWidth=".7"
              />
            ))}
            <text x={x} y="179" textAnchor="middle">
              宽 {w.toFixed(2)} × 厚 {h.toFixed(2)}
            </text>
          </g>
        ))}
        <path
          d="M300 113h65m-9-7 9 7-9 7"
          fill="none"
          stroke="var(--ui-primary)"
          strokeWidth="2"
        />
      </svg>
      <div className="plate-strain-readouts">
        <span>
          宽度比 <b>{q.jacobian.toFixed(2)}</b>
        </span>
        <span>
          厚度比 <b>{thickness.toFixed(2)}</b>
        </span>
        <span>
          局部面积比 <b>{(q.jacobian * thickness).toFixed(2)}</b>
        </span>
      </div>
      <p>
        {p.type === 2
          ? "水平错动只改变两侧相对位置，本模型地层柱形状不变。观察三维场景中原本连续的金色标记发生错位。"
          : p.type === 0
            ? "拉伸主要集中在边界附近：地层柱变宽、变薄。切换位置，比较远离边界处的变形较小。"
            : "挤压主要集中在边界附近：地层柱变窄、增厚。切换位置，比较变形的空间差异。"}{" "}
        此图取模型中央剖面的一小段材料柱，以初始宽度与厚度分别为1，面积比保持1；各轴采用独立示意尺度，不表示真实公里数。模型不模拟断层破裂、侵蚀或岩石流变。
      </p>
    </section>
  );
}
