import React, { useState } from "react";
import {
  unfoldedPoint,
  projectUnfoldPoint,
  unfoldedLightness,
  solidUnfoldScale,
} from "./solidUnfold.mjs";

export default function SolidUnfold({ kind, radius, height }) {
  const [progress, setProgress] = useState(0);
  const [showGrid, setShowGrid] = useState(true);
  const cone = kind === "cone";
  const point = (u, v) =>
    projectUnfoldPoint(
      unfoldedPoint(kind, radius, height, progress / 100, u, v),
    );
  const strips = Array.from({ length: 72 }, (_, i) => {
    const corners = [
      point(i / 72, 0),
      point((i + 1) / 72, 0),
      point((i + 1) / 72, 1),
      point(i / 72, 1),
    ];
    return { i, corners, depth: corners.reduce((sum, p) => sum + p[2], 0) / 4 };
  }).sort((a, b) => b.depth - a.depth);
  const all = strips.flatMap((s) => s.corners);
  const minX = Math.min(...all.map((p) => p[0])),
    maxX = Math.max(...all.map((p) => p[0]));
  const minY = Math.min(...all.map((p) => p[1])),
    maxY = Math.max(...all.map((p) => p[1]));
  // Fit using the largest possible dimensions, so the camera does not pump while dragging.
  const scale = solidUnfoldScale(kind, radius, height);
  const xy = (p) =>
    `${300 + (p[0] - (minX + maxX) / 2) * scale},${145 + (p[1] - (minY + maxY) / 2) * scale}`;
  const edge = (u) => `${xy(point(u, 0))} ${xy(point(u, 1))}`;
  const rim = (v) =>
    Array.from({ length: 73 }, (_, i) => xy(point(i / 72, v))).join(" ");
  return (
    <section className="solid-unfold" aria-label="侧面连续展开实验">
      <div className="solid-unfold-heading">
        <strong>沿母线剪开，保持纸面不伸长</strong>
        <output aria-live="polite">
          {progress === 0
            ? "闭合侧面"
            : progress === 100
              ? "完全展开"
              : `正在展开 ${progress}%`}
        </output>
      </div>
      <svg
        viewBox="0 0 600 290"
        role="img"
        aria-label={`${cone ? "圆锥" : "圆柱"}侧面展开 ${progress}%`}
      >
        <ellipse cx="300" cy="252" rx="155" ry="12" fill="#253a3010" />
        {progress === 100 && (
          <polygon
            points={`${rim(0)} ${Array.from({ length: 73 }, (_, i) => xy(point(1 - i / 72, 1))).join(" ")}`}
            fill={`hsl(${cone ? "39 49%" : "160 26%"} ${unfoldedLightness(kind, radius, height, 1, 0.5)}%)`}
          />
        )}
        {strips.map(({ i, corners }) => (
          <g key={i}>
            {progress < 100 && (
              <polygon
                points={corners.map(xy).join(" ")}
                fill={
                  cone
                    ? `hsl(39 49% ${unfoldedLightness(kind, radius, height, progress / 100, (i + 0.5) / 72)}%)`
                    : `hsl(160 26% ${unfoldedLightness(kind, radius, height, progress / 100, (i + 0.5) / 72)}%)`
                }
                stroke="none"
              />
            )}
            {showGrid && (
              <path
                d={
                  [0.25, 0.5, 0.75]
                    .map(
                      (v) =>
                        `M${xy(point(i / 72, v))}L${xy(point((i + 1) / 72, v))}`,
                    )
                    .join(" ") +
                  (i % 9 === 0
                    ? ` M${xy(point(i / 72, 0))}L${xy(point(i / 72, 1))}`
                    : "")
                }
                fill="none"
                stroke={cone ? "#67491e" : "#174d40"}
                strokeOpacity="0.28"
                strokeWidth="0.7"
              />
            )}
          </g>
        ))}
        {[0, 1].map((v) => (
          <polyline
            key={v}
            points={rim(v)}
            fill="none"
            stroke={cone ? "#8d6728" : "#285e50"}
            strokeWidth="1.6"
          />
        ))}
        {[0, 1].map((u) => (
          <polyline
            key={u}
            points={edge(u)}
            stroke="#b45536"
            strokeWidth="2.5"
          />
        ))}
        <text x="24" y="28" fill="#6c7066" fontSize="13">
          {cone
            ? "扇形弧长保持 2πr · 母线保持 l"
            : "上下边长保持 2πr · 母线保持 h"}
        </text>
        <text x="24" y="278" fill="#995334" fontSize="12">
          红色边：剪开后的同一条母线
        </text>
      </svg>
      <label className="solid-unfold-slider">
        展开进度
        <input
          aria-label="侧面展开进度"
          type="range"
          min="0"
          max="100"
          step="1"
          style={{ "--range-progress": `${progress}%` }}
          value={progress}
          onChange={(e) => setProgress(Number(e.target.value))}
        />
        <span>{progress}%</span>
      </label>
      <div className="cube-pairs">
        <button aria-pressed={showGrid} onClick={() => setShowGrid(!showGrid)}>
          纸面参照线
        </button>
        {[
          [0, "合拢"],
          [50, "展开一半"],
          [100, "完全展开"],
        ].map(([value, label]) => (
          <button
            key={value}
            aria-pressed={progress === value}
            onClick={() => setProgress(value)}
          >
            {label}
          </button>
        ))}
      </div>
      <p>
        拖动滑块观察连续变化。此处是可展曲面的几何演示，不模拟纸张弹性；斜视投影不能直接量取面积。下方平面图显示真实展开形状。
      </p>
    </section>
  );
}
