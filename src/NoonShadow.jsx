import React, { useState } from "react";
import { solar } from "./models.mjs";
import "./NoonShadow.css";
export function noonShadow(height, altitude) {
  if (altitude <= 0) return null;
  if (Math.abs(altitude - 90) < 1e-9) return 0;
  return height / Math.tan((altitude * Math.PI) / 180);
}
export default function NoonShadow({ p }) {
  const [height, setHeight] = useState(1),
    altitude = solar(p.day, p.lat).noon;
  const length = noonShadow(height, altitude),
    visible = length !== null;
  const top = 205 - height * 80,
    end = 95 + 80 * Math.min(4, length ?? 0);
  const rayY = visible
    ? top + (end - 95) * Math.tan((altitude * Math.PI) / 180)
    : top;
  return (
    <section className="noon-shadow" aria-label="正午竖杆日影">
      <header>
        <span>把太阳高度带到地面</span>
        <h2>同一根杆，为什么影长不同？</h2>
      </header>
      <div className="noon-shadow-actions" role="group" aria-label="竖杆高度">
        {[0.5, 1, 2].map((h) => (
          <button
            key={h}
            aria-pressed={height === h}
            onClick={() => setHeight(h)}
          >
            杆高 {h} m
          </button>
        ))}
      </div>
      <div className="noon-shadow-layout">
        <div
          className="noon-shadow-scroll"
          tabIndex="0"
          role="region"
          aria-label="竖杆影长侧视图，可横向滚动"
        >
          <svg
            viewBox="0 0 510 270"
            role="img"
            aria-label={
              visible
                ? `杆高${height}米，正午太阳高度${altitude.toFixed(2)}度，影长${length.toFixed(3)}米`
                : "太阳不在地平线上方，无有限的日照影长"
            }
          >
            <path d="M55 205H460V219H55Z" fill="var(--ui-line)" />
            {[0, 1, 2, 3, 4].map((m) => (
              <g key={m}>
                <path d={`M${95 + 80 * m} 219v6`} stroke="var(--ui-muted)" />
                <text x={95 + 80 * m} y="247" textAnchor="middle">
                  {m} m
                </text>
              </g>
            ))}
            {visible && length > 0 && (
              <path
                d={`M95 207H${end}`}
                stroke="var(--ui-primary)"
                strokeWidth="7"
              />
            )}
            <rect
              x="91"
              y={top}
              width="8"
              height={height * 80}
              fill="var(--ui-gold)"
            />
            <ellipse cx="95" cy="206" rx="10" ry="3" fill="var(--ui-gold)" />
            <path
              d={`M70 205V${top}m-4 0h8M66 205h8`}
              stroke="var(--ui-muted)"
              fill="none"
            />
            <text x="58" y={(top + 205) / 2} textAnchor="end">
              {height} m
            </text>
            {visible && (
              <path
                d={`M95 ${top}L${end} ${length === 0 ? 205 : Math.min(205, rayY)}`}
                stroke="var(--ui-gold)"
                strokeWidth="2"
                strokeDasharray="7 4"
              />
            )}
            {visible && length > 4 && (
              <path
                d="M405 199L418 207L405 215"
                fill="none"
                stroke="var(--ui-primary)"
                strokeWidth="2"
              />
            )}
            <text x="155" y="30">
              {!visible
                ? "太阳不在地平线上方"
                : length === 0
                  ? "直射杆顶 · 影长为 0"
                  : length > 4
                    ? "影子超出图示 4 m 范围"
                    : "虚线为经过杆顶的光线"}
            </text>
          </svg>
        </div>
        <div className="noon-shadow-readout">
          <span>当地正午太阳高度</span>
          <strong>{altitude.toFixed(2)}°</strong>
          <span>水平地面影长</span>
          <strong>
            {length === null
              ? "无有限日照影长"
              : `${length.toLocaleString("zh-CN", { maximumFractionDigits: 3 })} m`}
          </strong>
          <p>
            {altitude < 0
              ? "正午太阳仍在地平线下，不绘制来自太阳直射的杆影。"
              : altitude === 0
                ? "太阳恰在地平线，理想光线平行于地面，影长没有有限值。"
                : length === 0
                  ? "太阳位于天顶，理想竖杆的影长为零。"
                  : "太阳高度越低，影子越长；杆高加倍，同一太阳高度下影长也加倍。"}
          </p>
        </div>
      </div>
      <p>
        影长 L = 杆高 H / tan(太阳高度)。图中横、纵距离共用比例尺，地面显示至4
        m；超范围保留实际读数，不把截断位置当作影子终点。
      </p>
      <p>
        侧视图沿背阳方向展开，左右不表示地理南北；太阳用平行光近似，忽略杆的粗细、折射和地形。日期、纬度与上方公转模型共用，播放公转时影长同步变化。杆高仅用于此日影演示。
      </p>
    </section>
  );
}
