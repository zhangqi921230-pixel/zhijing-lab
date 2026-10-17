import React from "react";

export default function BisectionInterval({ result, left, right }) {
  if (!result.valid) return null;
  const previous = result.rows.at(-1);
  const lo = previous?.left ?? Number(left);
  const hi = previous?.right ?? Number(right);
  const position = (x) => 40 + (520 * (x - lo)) / (hi - lo);
  const start = position(result.left),
    end = position(result.right);
  const midpoint = position(result.estimate);
  const label = (x) => Number(x.toPrecision(12)).toString();
  return (
    <figure className="bisection-interval" aria-label="局部放大数轴">
      <figcaption>
        <strong>
          {previous ? `第 ${result.rows.length} 步 · 保留哪一半` : "初始区间"}
        </strong>
        <span>局部放大 · 每一步重新适配比例</span>
      </figcaption>
      <svg
        viewBox="0 0 600 90"
        role="img"
        aria-label={`上一轮区间 ${lo} 至 ${hi}，保留 ${result.left} 至 ${result.right}，中点 ${result.estimate}`}
      >
        <path d="M40 35H560" stroke="#d9d7d1" strokeWidth="12" />
        <path
          aria-label="保留段"
          d={`M${start} 35H${end}`}
          stroke="#2878b5"
          strokeWidth="12"
        />
        {[40, 300, 560].map((x) => (
          <path key={x} d={`M${x} 22V48`} stroke="#566865" />
        ))}
        <circle
          cx={midpoint}
          cy="35"
          r="6"
          fill="#fffdf5"
          stroke="#2878b5"
          strokeWidth="2"
        />
        <text x="40" y="72" textAnchor="start">
          {label(lo)}
        </text>
        <text x="300" y="72" textAnchor="middle">
          {label(lo + (hi - lo) / 2)}
        </text>
        <text x="560" y="72" textAnchor="end">
          {label(hi)}
        </text>
      </svg>
      <div className="bisection-legend">
        <span>蓝色：保留区间 · 空心点：当前中点</span>
        <span>
          {result.exact !== null
            ? "当前计算得到零值，区间收为一点"
            : previous
              ? "灰色：本步排除的半区间"
              : "两端异号，开始逐步缩小范围"}
        </span>
      </div>
    </figure>
  );
}
