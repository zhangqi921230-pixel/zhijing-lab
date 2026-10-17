import React from "react";
import { format } from "./models.mjs";
import "./CircleLimitStudy.css";

export function circleApproximation(r, n) {
  const angle = Math.PI / n;
  return {
    chord: 2 * r * Math.sin(angle),
    sagitta: r * (1 - Math.cos(angle)),
    polygonArea: (n * r * r * Math.sin(2 * angle)) / 2,
    circleArea: Math.PI * r * r,
  };
}
function ArcDetail({ r, n }) {
  const q = circleApproximation(r, n),
    scale = 280 / q.chord;
  return (
    <div className="circle-arc-detail">
      <strong>{n} 等分 · 单段弧边</strong>
      <svg
        viewBox="0 0 340 170"
        role="img"
        aria-label={`${n}等分，圆弧高出弦${q.sagitta.toFixed(4)}厘米`}
      >
        <path
          d={`M30 65A${r * scale} ${r * scale} 0 0 0 310 65`}
          fill="var(--ui-selected)"
          stroke="var(--ui-primary)"
          strokeWidth="3"
        />
        <path
          d="M30 65H310"
          stroke="var(--ui-muted)"
          strokeWidth="1.5"
          strokeDasharray="5 4"
        />
        <path
          d={`M170 65v${q.sagitta * scale}`}
          stroke="var(--ui-primary)"
          strokeWidth="3"
        />
        <text
          x="170"
          y="38"
          textAnchor="middle"
          fontSize="15"
          fill="var(--ui-ink)"
        >
          虚线为弦，实线为圆弧
        </text>
        <text
          x="170"
          y="125"
          textAnchor="middle"
          fontSize="19"
          fill="var(--ui-ink)"
        >
          弧高 {q.sagitta.toFixed(4)} cm
        </text>
        <text
          x="170"
          y="152"
          textAnchor="middle"
          fontSize="14"
          fill="var(--ui-muted)"
        >
          弦长 {format(q.chord)} cm
        </text>
      </svg>
    </div>
  );
}
export default function CircleLimitStudy({ p, onChange, chapter }) {
  const q = circleApproximation(p.r, p.parts);
  const vertices = Array.from({ length: p.parts }, (_, i) => {
    const angle = (2 * Math.PI * i) / p.parts;
    return `${130 + 92 * Math.cos(angle)},${115 + 92 * Math.sin(angle)}`;
  }).join(" ");
  return (
    <section className="circle-limit-study" aria-label="圆面积逼近观察">
      <header>
        <div>
          <small>放大观察 · 保留真实几何</small>
          <h3>
            {chapter === 3
              ? "分得更细，弧边怎样变平？"
              : "越来越接近，仍要区分近似与精确。"}
          </h3>
        </div>
        <div
          className="circle-count-options"
          role="group"
          aria-label="比较分割份数"
        >
          {[8, 16, 32, 48].map((n) => (
            <button
              key={n}
              aria-pressed={p.parts === n}
              onClick={() => onChange("parts", n)}
            >
              {n} 等分
            </button>
          ))}
        </div>
      </header>
      {chapter === 3 ? (
        <>
          <div className="circle-arc-pair">
            <ArcDetail r={p.r} n={8} />
            <ArcDetail r={p.r} n={p.parts} />
          </div>
          <p>
            两图把各自的弦放大到同样宽度，横纵采用相同比例；请用厘米读数比较实际大小。半径不变时，分割越细，弧与弦之间的最大距离越小。
          </p>
        </>
      ) : (
        <div className="circle-polygon-study">
          <svg
            viewBox="0 0 260 235"
            role="img"
            aria-label={`圆内接正${p.parts}边形，弧边间隙是尚未计入的面积`}
          >
            <circle
              cx="130"
              cy="115"
              r="92"
              fill="var(--ui-selected)"
              stroke="var(--ui-primary)"
              strokeWidth="2"
            />
            <polygon
              points={vertices}
              fill="var(--ui-paper)"
              stroke="var(--ui-primary)"
              strokeWidth="2"
            />
            {Array.from({ length: p.parts }, (_, i) => {
              const angle = (2 * Math.PI * i) / p.parts;
              return (
                <path
                  key={i}
                  d={`M130 115L${130 + 92 * Math.cos(angle)} ${115 + 92 * Math.sin(angle)}`}
                  stroke="var(--ui-line)"
                  strokeWidth="1"
                />
              );
            })}
            <circle cx="130" cy="115" r="3" fill="var(--ui-primary)" />
          </svg>
          <div>
            <h4>用直边三角形覆盖圆内区域</h4>
            <dl>
              <div>
                <dt>内接多边形面积</dt>
                <dd>{q.polygonArea.toFixed(4)} cm²</dd>
              </div>
              <div>
                <dt>圆的精确面积 πr²</dt>
                <dd>≈ {q.circleArea.toFixed(4)} cm²</dd>
              </div>
              <div>
                <dt>弧边间隙面积</dt>
                <dd>{(q.circleArea - q.polygonArea).toFixed(4)} cm²</dd>
              </div>
              <div>
                <dt>未覆盖比例</dt>
                <dd>
                  {(100 * (1 - q.polygonArea / q.circleArea)).toFixed(3)}%
                </dd>
              </div>
            </dl>
            <p>
              细分使直边图形逼近圆。上方重排移动的是完整扇形，面积始终精确等于
              πr²；这里改用弦围成多边形，才会少掉弧边间隙。
            </p>
            <small>拓展：S内 = n·r²·sin(2π/n)/2。显示的小数为近似值。</small>
          </div>
        </div>
      )}
    </section>
  );
}
