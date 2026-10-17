import React, { useState } from "react";
import { format } from "./models.mjs";
import SolidUnfold from "./SolidUnfold.jsx";

export function solidNetMeasures(radius, height) {
  const slant = Math.hypot(radius, height);
  return {
    slant,
    circumference: 2 * Math.PI * radius,
    angle: (2 * Math.PI * radius) / slant,
    cylinderArea: 2 * Math.PI * radius * height,
    coneArea: Math.PI * radius * slant,
  };
}

export default function SolidNets({ p }) {
  const [kind, setKind] = useState("cone");
  const q = solidNetMeasures(p.radius, p.height);
  const cone = kind === "cone";
  const scale = cone
    ? 105 / q.slant
    : Math.min(200 / p.height, 285 / q.circumference);
  const r = q.slant * scale;
  const half = q.angle / 2;
  const start = [180 - r * Math.sin(half), 155 - r * Math.cos(half)];
  const end = [180 + r * Math.sin(half), 155 - r * Math.cos(half)];
  return (
    <div className="solids-guide">
      <div
        className="cube-pairs"
        role="group"
        aria-label="选择侧面展开图"
        style={{ gridColumn: "1 / -1" }}
      >
        <button aria-pressed={!cone} onClick={() => setKind("cylinder")}>
          圆柱 · 矩形
        </button>
        <button aria-pressed={cone} onClick={() => setKind("cone")}>
          圆锥 · 扇形
        </button>
      </div>
      <SolidUnfold kind={kind} radius={p.radius} height={p.height} />
      <div className="solids-sections">
        <span>侧面展开 · 尺寸随实体同步</span>
        <svg
          viewBox="0 0 360 310"
          role="img"
          aria-label={cone ? "圆锥侧面扇形展开图" : "圆柱侧面矩形展开图"}
        >
          <defs>
            <pattern
              id="net-grid"
              width="15"
              height="15"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M15 0H0V15"
                fill="none"
                stroke="#d8d5cb"
                strokeWidth=".5"
              />
            </pattern>
          </defs>
          <rect width="360" height="310" fill="url(#net-grid)" />
          {cone ? (
            <>
              <path
                d={`M180 155 L${start.join(" ")} A${r} ${r} 0 ${q.angle > Math.PI ? 1 : 0} 1 ${end.join(" ")} Z`}
                fill="#dca74a30"
                stroke="#af7d27"
                strokeWidth="2"
              />
              <path
                d={`M180 155 V${155 - r}`}
                stroke="#af7d27"
                strokeDasharray="4 4"
              />
              <text x="186" y={155 - r / 2} fontSize="13">
                l = {format(q.slant)} cm
              </text>
              <text x="180" y="278" textAnchor="middle" fontSize="13">
                圆心角 {format((q.angle * 180) / Math.PI)}°
              </text>
            </>
          ) : (
            <>
              <rect
                x={180 - (q.circumference * scale) / 2}
                y={155 - (p.height * scale) / 2}
                width={q.circumference * scale}
                height={p.height * scale}
                fill="#68a59430"
                stroke="#327c6c"
                strokeWidth="2"
              />
              <text
                x="180"
                y={145 - (p.height * scale) / 2}
                textAnchor="middle"
                fontSize="13"
              >
                2πr = {format(q.circumference)} cm
              </text>
              <text
                x="180"
                y={177 + (p.height * scale) / 2}
                textAnchor="middle"
                fontSize="13"
              >
                h = {format(p.height)} cm
              </text>
            </>
          )}
          <text x="180" y="299" textAnchor="middle" fontSize="12">
            {cone ? "扇形弧长" : "矩形的一边"} = 底面周长{" "}
            {format(q.circumference)} cm
          </text>
        </svg>
      </div>
      <div>
        <p>
          调整右侧半径和高，对照实体与展开图。展开图保留长度和面积关系；图幅会自动缩放。
        </p>
        <strong>{cone ? "S侧 = πrl" : "S侧 = 2πrh"}</strong>
        <p>侧面积 {format(cone ? q.coneArea : q.cylinderArea)} cm²</p>
        <p>
          {cone
            ? "扇形半径是母线 l，不是圆锥的高 h。由勾股定理 l² = r² + h²；弧长等于底面周长，因此 θ = 360° × r/l。"
            : "沿一条母线剪开圆柱侧面，展开得到矩形：两边分别为底面周长 2πr 和高 h。"}
        </p>
        <p>
          这里只展开侧面，不包含底面。圆柱总表面积还需加两个底面；圆锥需加一个底面。
        </p>
      </div>
    </div>
  );
}
