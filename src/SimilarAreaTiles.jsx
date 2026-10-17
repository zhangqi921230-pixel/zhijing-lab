import React, { useState, useMemo } from "react";
import Button from "./LabButton.jsx";
import "./SimilarAreaTiles.css";
export function similarTiles(scale, shape) {
  const unit = Number.isInteger(scale) ? 1 : 0.5,
    n = Math.round(scale / unit),
    w = 120 * unit,
    h = 80 * unit;
  const tiles = [];
  for (let row = 0; row < n; row++)
    for (let col = 0; col < (shape ? n - row : n); col++) {
      const x = col * w,
        y = row * h;
      if (!shape)
        tiles.push([
          [x, y],
          [x + w, y],
          [x + w, y + h],
          [x, y + h],
        ]);
      else {
        tiles.push([
          [x, y],
          [x + w, y],
          [x, y + h],
        ]);
        if (col < n - row - 1)
          tiles.push([
            [x + w, y],
            [x + w, y + h],
            [x, y + h],
          ]);
      }
    }
  return {
    unit,
    tiles,
    width: 120 * scale,
    height: 80 * scale,
    partRatio: unit ** 2,
  };
}
export default function SimilarAreaTiles({ p, time, onSeek }) {
  const [selected, setSelected] = useState(0),
    [show, setShow] = useState(true);
  const q = useMemo(() => similarTiles(p.scale, p.shape), [p.scale, p.shape]),
    baseArea = p.shape ? 3 : 6;
  const shape = p.shape ? "三角形" : "矩形";
  const origin = p.shape ? "0,0 120,0 0,80" : "0,0 120,0 120,80 0,80";
  return (
    <section className="similar-tiles" aria-label="用原面积计数">
      <header>
        <div>
          <span>目标尺寸的分割对照</span>
          <h3>目标图相当于几份原面积？</h3>
        </div>
        <strong>
          边长比 {p.scale} · 面积比 {p.scale ** 2}
        </strong>
      </header>
      <p>
        {q.unit === 1
          ? `每一块都是与原图全等的${shape}。数一数目标图中的${q.tiles.length}块，面积就是原图的${q.tiles.length}倍。`
          : `先把原图的底和高都减半，得到面积为原图1/4的小${shape}。目标图包含${q.tiles.length}块，所以面积比是${q.tiles.length}÷4=${p.scale ** 2}。`}
      </p>
      <div className="similar-tiles-actions">
        <Button onClick={() => onSeek(6)} disabled={time === 6}>
          主图到达目标尺寸
        </Button>
        <Button aria-pressed={show} onClick={() => setShow(!show)}>
          {show ? "隐藏分割" : "显示分割"}
        </Button>
        <Button
          disabled={!show || selected === 0}
          onClick={() => setSelected(selected - 1)}
        >
          上一块
        </Button>
        <Button
          disabled={!show || selected === q.tiles.length - 1}
          onClick={() => setSelected(selected + 1)}
        >
          下一块
        </Button>
      </div>
      <div
        className="similar-tiles-scroll"
        role="region"
        aria-label="面积分块对照，可横向滚动"
        tabIndex="0"
      >
        <svg
          viewBox="0 0 720 385"
          role="group"
          aria-label={`目标${shape}由${q.tiles.length}块组成，每块是原面积的${q.partRatio}`}
        >
          <text x="40" y="35">
            原图 · {baseArea} cm²
          </text>
          <polygon
            points={origin}
            transform="translate(40 90)"
            fill="var(--ui-primary)"
            fillOpacity=".12"
            stroke="var(--ui-primary)"
            strokeWidth="3"
          />
          <text x="40" y="218">
            一块的面积
          </text>
          <polygon
            points={origin}
            transform={`translate(40 235) scale(${q.unit})`}
            fill="var(--ui-gold)"
            fillOpacity=".3"
            stroke="var(--ui-gold)"
            strokeWidth="3"
          />
          <text x="40" y="350">
            {baseArea * q.partRatio} cm² = {q.partRatio} 份
          </text>
          <text x="280" y="35">
            目标图 · {baseArea * p.scale ** 2} cm²
          </text>
          <g transform="translate(280 90)">
            {show ? (
              q.tiles.map((points, i) => {
                const cx = points.reduce((s, v) => s + v[0], 0) / points.length,
                  cy = points.reduce((s, v) => s + v[1], 0) / points.length;
                return (
                  <g key={i}>
                    <polygon
                      className="similar-tile"
                      role="button"
                      tabIndex="0"
                      aria-label={`第${i + 1}块，面积${baseArea * q.partRatio}平方厘米`}
                      aria-pressed={selected === i}
                      points={points.map((v) => v.join(",")).join(" ")}
                      fill={
                        selected === i ? "var(--ui-gold)" : "var(--ui-primary)"
                      }
                      fillOpacity={
                        selected === i ? 0.45 : 0.08 + (i % 2) * 0.07
                      }
                      stroke="var(--ui-ink)"
                      strokeWidth="1.5"
                      onClick={() => setSelected(i)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelected(i);
                        }
                      }}
                    />
                    <text
                      x={cx}
                      y={cy + 6}
                      textAnchor="middle"
                      pointerEvents="none"
                    >
                      {i + 1}
                    </text>
                  </g>
                );
              })
            ) : (
              <polygon
                points={origin}
                transform={`scale(${p.scale})`}
                fill="var(--ui-primary)"
                fillOpacity=".12"
                stroke="var(--ui-primary)"
                strokeWidth="2"
              />
            )}
          </g>
        </svg>
      </div>
      <p className="similar-tiles-equation">
        {q.tiles.length} 块 × {baseArea * q.partRatio} cm² ={" "}
        {baseArea * p.scale ** 2} cm²
        <span>
          {show
            ? `当前选中第${selected + 1}块；每块面积相同，颜色仅用于辨认。`
            : "分割线已隐藏，目标面积不变。"}
        </span>
      </p>
      <p>
        上图按目标比例分块，始终显示完整结果；主动画仍保留当前进度。改变图形或目标比例会重新分块。
        {p.shape
          ? "三角形中的部分小块经过旋转，形状和面积保持不变。"
          : "矩形中的小块按行、列排列，每块面积相同。"}
      </p>
    </section>
  );
}
