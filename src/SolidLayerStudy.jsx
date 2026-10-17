import React, { useState } from "react";
import { solidLayers } from "./solidLayers.mjs";
import "./SolidLayerStudy.css";
export default function SolidLayerStudy({ radius, height, fraction }) {
  const [count, setCount] = useState(8),
    [outer, setOuter] = useState(false);
  const q = solidLayers(radius, height, fraction, count),
    scale = 80 / radius;
  return (
    <section className="solid-layer-study" aria-label="薄层夹逼体积">
      <header>
        <div>
          <small>进阶观察 · 用薄圆柱近似</small>
          <h3>层数越多，两种估算越接近。</h3>
        </div>
        <div className="solid-layer-count" role="group" aria-label="薄层数量">
          {[4, 8, 16, 32].map((n) => (
            <button
              key={n}
              aria-pressed={n === count}
              onClick={() => setCount(n)}
            >
              {n} 层
            </button>
          ))}
        </div>
      </header>
      <div className="solid-layer-content">
        <div>
          <div
            className="solid-layer-count"
            role="group"
            aria-label="薄层包络方式"
          >
            <button aria-pressed={!outer} onClick={() => setOuter(false)}>
              内接：偏小
            </button>
            <button aria-pressed={outer} onClick={() => setOuter(true)}>
              外接：偏大
            </button>
          </div>
          <svg
            viewBox="0 0 360 300"
            role="img"
            aria-label={`${outer ? "外接" : "内接"}薄圆柱轴截面，当前高度分成${count}层`}
          >
            <path
              d="M90 260L170 40L250 260Z"
              fill="var(--ui-selected)"
              stroke="var(--ui-muted)"
              strokeWidth="1.5"
            />
            {q.layers.map((layer, i) => {
              const r = (outer ? layer.outer : layer.inner) * scale;
              return (
                <rect
                  key={i}
                  x={170 - r}
                  y={260 - 220 * layer.top}
                  width={2 * r}
                  height={220 * (layer.top - layer.bottom)}
                  fill={outer ? "#b3904b66" : "#408d8266"}
                  stroke={outer ? "#a78038" : "#327e73"}
                  strokeWidth="1"
                />
              );
            })}
            <path
              d="M90 260L170 40L250 260"
              fill="none"
              stroke="var(--ui-ink)"
              strokeWidth="2"
            />
            <path
              d={`M65 ${260 - 220 * fraction}H275`}
              stroke="var(--ui-primary)"
              strokeDasharray="5 4"
            />
            <text
              x="170"
              y="286"
              textAnchor="middle"
              fill="var(--ui-ink)"
              fontSize="14"
            >
              轴截面示意 · 薄层的水平宽度表示直径
            </text>
            <text
              x="285"
              y={Math.max(24, 260 - 220 * fraction + 5)}
              fill="var(--ui-ink)"
              fontSize="14"
            >
              z/h = {fraction.toFixed(2)}
            </text>
          </svg>
        </div>
        <div>
          <dl>
            <div>
              <dt>内接估算（下界）</dt>
              <dd>{q.lower.toFixed(4)} cm³</dd>
            </div>
            <div>
              <dt>精确累计体积</dt>
              <dd>{q.exact.toFixed(4)} cm³</dd>
            </div>
            <div>
              <dt>外接估算（上界）</dt>
              <dd>{q.upper.toFixed(4)} cm³</dd>
            </div>
            <div>
              <dt>上下界间距</dt>
              <dd>{(q.upper - q.lower).toFixed(4)} cm³</dd>
            </div>
          </dl>
          <p>
            将底面至当前截面的高度分成 {count} 层，每层厚约 {q.dz.toFixed(4)}{" "}
            cm。内接圆柱用每层顶部半径，外接用底部半径；两者分别少算、多算了弧面附近的体积。
          </p>
          <p>
            调节本节截面高度或播放扫描，三维着色范围、薄层和读数一起变化。薄层是几何近似，不表示真实液体分层。
          </p>
          <small>
            内接体积 ≤ 精确体积 ≤
            外接体积；读数四舍五入。图中水平与竖直比例分别适配，尺寸以参数为准。
          </small>
        </div>
      </div>
    </section>
  );
}
