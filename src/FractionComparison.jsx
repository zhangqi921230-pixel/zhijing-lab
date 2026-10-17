import React, { useState } from "react";
import "./FractionComparison.css";
export const compareFractions = (a, b) => Math.sign(a.n * b.d - b.n * a.d);
export default function FractionComparison({ p }) {
  const [a, setA] = useState(() => ({ n: p.n, d: p.d }));
  const wholes = Math.max(1, Math.ceil(a.n / a.d), Math.ceil(p.n / p.d));
  const relation = compareFractions(a, p);
  return (
    <section className="fraction-comparison" aria-label="同一整体的分数对照">
      <header>
        <strong>整体一样大，分数怎样比</strong>
        <button onClick={() => setA({ n: p.n, d: p.d })}>
          保留当前为对照 A
        </button>
      </header>
      <p>
        每一条框都是同样大的 1。先保留 A，再调整分子或分母，比较
        B；分隔线表示每份的大小。
      </p>
      {[
        ["对照 A", a],
        ["当前 B", p],
      ].map(([label, v]) => (
        <div className="fraction-compare-row" key={label}>
          <div className="fraction-compare-label">
            <b>{label}</b>
            <strong>
              {v.n}/{v.d}
            </strong>
          </div>
          <div
            className="fraction-compare-bars"
            style={{ "--whole-columns": Math.min(3, wholes) }}
          >
            {Array.from({ length: wholes }, (_, i) => (
              <div
                key={i}
                className="fraction-compare-unit"
                role="img"
                aria-label={`${label}，第${i + 1}个整体，选取${Math.max(0, Math.min(v.d, v.n - i * v.d))}/${v.d}`}
              >
                <span
                  className="fraction-compare-fill"
                  style={{
                    width: `${Math.max(0, Math.min(1, v.n / v.d - i)) * 100}%`,
                  }}
                />
                {Array.from({ length: v.d - 1 }, (_, j) => (
                  <i key={j} style={{ left: `${((j + 1) / v.d) * 100}%` }} />
                ))}
                <small>{i + 1}</small>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="fraction-compare-result" aria-label="分数大小关系">
        <strong>
          {a.n}/{a.d} {relation === 0 ? "=" : relation < 0 ? "＜" : "＞"} {p.n}/
          {p.d}
        </strong>
        <span>
          {relation === 0
            ? "写法可以不同，表示的量相同。"
            : a.d === p.d
              ? "分母相同，每份大小相同，比较取出份数。"
              : a.n === p.n
                ? "分子相同，取出份数相同，比较每份大小。"
                : "分子与分母都不同，要比较在相同整体中占的量。"}
        </span>
      </div>
      <details>
        <summary>进一步理解 · 用乘法核对</summary>
        <p>
          {a.n} × {p.d} = {a.n * p.d}；{p.n} × {a.d} = {p.n * a.d}
          。分母都是正数，比较这两个积即可核对大小，不使用四舍五入的小数。
        </p>
      </details>
    </section>
  );
}
