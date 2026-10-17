import React from "react";
import { shadowState } from "./observableModels.mjs";
export function shadowSimilarityGeometry(p, time, step) {
  const q = shadowState(p, time),
    scale = Math.min(30, 280 / q.large, 210 / p.height);
  const progress = step === 2 ? q.progress : 0;
  const factor = 1 + (q.ratio - 1) * progress;
  return {
    q,
    scale,
    factor,
    small: {
      x: 100 + 400 * progress,
      y: 390,
      height: p.pole * scale * factor,
      length: q.small * scale * factor,
    },
    large: {
      x: 500,
      y: 390,
      height: p.height * scale,
      length: q.large * scale,
    },
  };
}
export default function ShadowSimilarity({ p, time, step, guides }) {
  const { q, factor, small, large } = shadowSimilarityGeometry(p, time, step);
  const titles = [
    "两个角相等，确定三角形相似",
    "对应边要按同一顺序配对",
    "把小三角形等比例放大，检验重合",
    "由三条已知边，计算建筑高度",
  ];
  return (
    <svg
      className="motion-diagram observable-scene"
      viewBox="0 0 900 650"
      role="img"
      aria-label="影长测高的相似三角形分步证明"
    >
      <text x="35" y="44" className="observable-title">
        {titles[step]}
      </text>
      <text x="35" y="82">
        {step === 2
          ? `播放下方时间轴：相似缩放 ${factor.toFixed(2)} 倍（目标 ${q.ratio.toFixed(2)} 倍）`
          : "立杆与建筑竖直，地面水平；同一时刻的阳光近似平行。"}
      </text>
      {[
        { ...large, color: "var(--ui-gold)", label: "建筑与影子", big: true },
        {
          ...small,
          color: "var(--ui-primary)",
          label: "立杆与影子",
          big: false,
        },
      ].map((a) => {
        const arcRadius = Math.min(25, a.length * 0.35, a.height * 0.6),
          alpha = (p.angle * Math.PI) / 180;
        const end = a.x + a.length;
        return (
          <g key={a.label} data-similarity-triangle={a.big ? "large" : "small"}>
            <polygon
              points={`${a.x},${a.y} ${end},${a.y} ${a.x},${a.y - a.height}`}
              fill={a.color}
              fillOpacity=".09"
              stroke={a.color}
              strokeWidth={a.big ? 5 : 2}
              strokeDasharray={a.big && step === 2 ? "9 6" : undefined}
            />
            {step !== 2 && (
              <text x={a.x} y="125">
                {a.label}
              </text>
            )}
            {step !== 2 && (
              <>
                <text x={a.x - 15} y={a.y - a.height / 2} textAnchor="end">
                  {a.big ? "H" : "h"}
                  {step >= 1 && !a.big ? ` = ${p.pole} m` : ""}
                </text>
                <text x={a.x + a.length / 2} y="427" textAnchor="middle">
                  {a.big ? "L" : "l"}
                  {step >= 1
                    ? ` ≈ ${(a.big ? q.large : q.small).toFixed(2)} m`
                    : ""}
                </text>
              </>
            )}
            {guides && (
              <>
                <path
                  d={`M${a.x} ${a.y - 12}h12v12`}
                  fill="none"
                  stroke={a.color}
                  strokeWidth="2"
                />
                <path
                  d={`M${end - arcRadius} ${a.y}A${arcRadius} ${arcRadius} 0 0 1 ${end - arcRadius * Math.cos(alpha)} ${a.y - arcRadius * Math.sin(alpha)}`}
                  fill="none"
                  stroke={a.color}
                  strokeWidth="2"
                />
                {step !== 2 && (
                  <text x={end + 12} y={a.y - 12}>
                    α = {p.angle}°
                  </text>
                )}
              </>
            )}
          </g>
        );
      })}
      <path d="M35 462H865" stroke="var(--ui-line)" />
      {step === 0 && (
        <>
          <text x="35" y="505">
            直角 = 直角　　太阳高度角 α = α
          </text>
          <text x="35" y="548">
            两角分别相等 → 两个三角形相似（AA）
          </text>
        </>
      )}
      {step === 1 && (
        <>
          <text x="35" y="505">
            高度对应高度：H ↔ h　　影长对应影长：L ↔ l
          </text>
          <text x="35" y="548" className="observable-number">
            H / h = L / l
          </text>
        </>
      )}
      {step === 2 && (
        <>
          <text x="35" y="505">
            两个方向乘同一个倍数：形状不变，角度不变。
          </text>
          <text x="35" y="548">
            {q.progress === 1
              ? "轮廓已重合：高度比与影长比相等。"
              : "点击播放演示，或拖动进度到终点，观察两个轮廓重合。"}
          </text>
        </>
      )}
      {step === 3 && (
        <>
          <text x="35" y="505" className="observable-number">
            H = h × L / l = {p.height.toFixed(2)} m
          </text>
          <text x="35" y="548">
            已知：h = {p.pole} m；L ≈ {q.large.toFixed(2)} m；l ≈{" "}
            {q.small.toFixed(2)} m
          </text>
        </>
      )}
      <text x="35" y="605">
        {step === 2
          ? "这是几何缩放验证，立杆和建筑本身没有变大或移动。"
          : "图中两组采用相同米制比例；显示值有舍入，结果按未舍入数值计算。"}
      </text>
    </svg>
  );
}
