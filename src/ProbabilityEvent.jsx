import React, { useState } from "react";
import { binomial } from "./explorationModels.mjs";
import "./ProbabilityEvent.css";
const modes = { exact: "恰好", atleast: "至少", atmost: "至多" };
export function eventProbability(n, p, k, mode, bins = []) {
  const values = binomial(n, p),
    included = values.map((_, x) =>
      mode === "atleast" ? x >= k : mode === "atmost" ? x <= k : x === k,
    );
  return {
    values,
    included,
    theory: Math.max(
      0,
      Math.min(
        1,
        values.reduce((sum, v, i) => sum + (included[i] ? v : 0), 0),
      ),
    ),
    hits: bins.reduce((sum, v, i) => sum + (included[i] ? v : 0), 0),
  };
}
export default function ProbabilityEvent({ p, count, sample, onPause }) {
  const [mode, setMode] = useState("atleast"),
    [k, setK] = useState(1);
  const q = eventProbability(p.n, p.p, k, mode, sample.bins),
    complement = 1 - q.theory;
  return (
    <section className="probability-event" aria-label="正面次数事件选择">
      <h2>“恰好一次”和“至少一次”，一样吗？</h2>
      <p>
        每组独立抛掷 {p.n}{" "}
        次，X表示这一组的正面次数。选择事件后，亮色栏目为符合条件的X；不同X互不重叠，可以把对应概率相加。每格柱条共用0—100%的高度刻度；点击某个X可设置阈值。
      </p>
      <div
        className="probability-event-actions"
        role="group"
        aria-label="事件关系"
      >
        {Object.entries(modes).map(([key, name]) => (
          <button
            key={key}
            aria-pressed={mode === key}
            onClick={() => {
              onPause();
              setMode(key);
            }}
          >
            {name}
          </button>
        ))}
      </div>
      <label>
        正面次数阈值 k = {k}
        <input
          aria-label="正面次数阈值"
          type="range"
          min="0"
          max={p.n}
          step="1"
          value={k}
          onChange={(e) => {
            onPause();
            setK(Number(e.target.value));
          }}
        />
      </label>
      <div
        className="probability-event-options"
        role="group"
        aria-label="各个正面次数的理论概率"
      >
        {q.values.map((v, x) => (
          <button
            key={x}
            aria-label={`选择阈值${x}，该结果概率${(100 * v).toFixed(2)}%`}
            onClick={() => {
              onPause();
              setK(x);
            }}
            aria-pressed={k === x}
            data-included={q.included[x]}
          >
            <span>X = {x}</span>
            <span className="probability-event-bar">
              <i style={{ height: `${v * 100}%` }} />
            </span>
            <strong>{(100 * v).toFixed(2)}%</strong>
            <small>{q.included[x] ? "计入事件" : "不计入"}</small>
          </button>
        ))}
      </div>
      <div className="probability-event-readings">
        <p>
          理论：每组{modes[mode]} {k} 次正面
          <strong>{(100 * q.theory).toFixed(2)}%</strong>
        </p>
        <p>
          样本：符合事件的组数 / 已完成组数
          <strong>
            {count
              ? `${q.hits} / ${count} = ${((100 * q.hits) / count).toFixed(2)}%`
              : "尚无样本"}
          </strong>
        </p>
      </div>
      <p>
        计入的X：{q.included.flatMap((yes, x) => (yes ? [x] : [])).join("、")}
        。选择事件不重新抽样，只重新统计已完成的 {count}{" "}
        组；操作会暂停自动试验。
      </p>
      <details>
        <summary>用相反事件核对</summary>
        <p>
          事件概率 + 相反事件概率 = 1：{q.theory.toFixed(4)} +{" "}
          {complement.toFixed(4)} = 1（显示值已四舍五入）。
          {mode === "atleast" && k === 1
            ? `至少一次正面 = 1 − 全部反面 = 1 − (1−${p.p})^${p.n}。`
            : "相反事件是所有未被计入的X。"}
          这里的分母是组数，不是全部单次抛掷次数；有限样本频率不保证等于理论概率。
        </p>
      </details>
    </section>
  );
}
