import React, { useMemo, useState } from "react";
import Button from "./LabButton.jsx";
import "./ProbabilityComparison.css";
export function frequencyPath(history, maxCount) {
  const stride = Math.max(1, Math.ceil(history.length / 400));
  return history
    .map((v, i) => [i + 1, v])
    .filter((_, i) => i % stride === 0 || i === history.length - 1)
    .map(
      ([n, v], i) =>
        `${i ? "L" : "M"}${60 + (n / Math.max(10, maxCount)) * 660} ${245 - v * 190}`,
    )
    .join(" ");
}
export default function ProbabilityComparison({ p, count, sample, onPause }) {
  const [reference, setReference] = useState(null);
  const [probe, setProbe] = useState(1);
  const [early, setEarly] = useState(false);
  const available = Math.max(count, reference?.count ?? 0);
  const maxProbe = Math.max(1, early ? Math.min(50, available) : available),
    selected = Math.min(probe, maxProbe);
  const currentAt = sample.history[selected - 1],
    referenceAt = reference?.history[selected - 1];
  const maxCount = Math.max(10, maxProbe);
  const visibleCount = Math.min(count, maxCount),
    visibleReference = Math.min(reference?.count ?? 0, maxCount);
  const currentPath = useMemo(
    () => frequencyPath(sample.history.slice(0, maxCount), maxCount),
    [sample.history, maxCount],
  );
  const referencePath = useMemo(
    () =>
      frequencyPath((reference?.history ?? []).slice(0, maxCount), maxCount),
    [reference, maxCount],
  );
  return (
    <section className="probability-comparison" aria-label="两轮随机试验对照">
      <header>
        <div>
          <span>REPEAT & COMPARE</span>
          <h2>条件相同，结果一定相同吗？</h2>
        </div>
        <Button
          disabled={!count}
          onClick={() => {
            onPause();
            setReference({
              count,
              frequency: sample.frequency,
              history: [...sample.history],
            });
          }}
        >
          {reference ? "替换参考轮" : "保留为参考轮"}
        </Button>
      </header>
      <p>
        每组 {p.n} 次，单次正面概率 {p.p}
        。保留一轮后，点击上方“新一轮试验”，使用另一条随机序列再试。修改试验条件会清除参考轮。
      </p>
      <div
        className="motion-shortcuts"
        role="group"
        aria-label="频率曲线观察范围"
      >
        <Button
          primary={!early}
          aria-pressed={!early}
          onClick={() => {
            onPause();
            setEarly(false);
          }}
        >
          全部组次
        </Button>
        <Button
          primary={early}
          aria-pressed={early}
          onClick={() => {
            onPause();
            setEarly(true);
          }}
        >
          前 50 组
        </Button>
      </div>
      <p>
        {early
          ? "曲线放大小样本阶段，最多显示前50组；下方汇总仍统计完整试验。"
          : "曲线显示完整试验；可切换前50组，比较开始阶段的波动。"}
        切换视图不增加或删除样本。
      </p>
      <div className="probability-legend">
        <span>实线：当前轮</span>
        <span>虚线：参考轮</span>
        <span>水平金线：理论概率</span>
      </div>
      <div
        className="probability-chart"
        tabIndex="0"
        role="region"
        aria-label="频率对照图，可横向滚动"
      >
        <svg
          viewBox="0 0 780 310"
          role="img"
          aria-label="两轮累计正面频率与理论概率对照"
        >
          {[0, 0.25, 0.5, 0.75, 1].map((v) => (
            <g key={v}>
              <path d={`M60 ${245 - v * 190}H720`} stroke="var(--ui-line)" />
              <text x="49" y={250 - v * 190} textAnchor="end">
                {v}
              </text>
            </g>
          ))}
          <text x="60" y="25">
            累计正面频率
          </text>
          <path
            d={`M60 ${245 - p.p * 190}H720`}
            stroke="var(--ui-gold)"
            strokeWidth="2"
          />
          {referencePath && (
            <path
              d={referencePath}
              fill="none"
              stroke="var(--ui-muted)"
              strokeWidth="2"
              strokeDasharray="6 4"
            />
          )}
          {currentPath && (
            <path
              d={currentPath}
              fill="none"
              stroke="var(--ui-primary)"
              strokeWidth="2.5"
            />
          )}
          {count > 0 && (
            <circle
              data-testid="current-frequency-end"
              cx={60 + (visibleCount / maxCount) * 660}
              cy={245 - sample.history[visibleCount - 1] * 190}
              r="4"
              fill="var(--ui-primary)"
            />
          )}
          {reference && (
            <circle
              data-testid="reference-frequency-end"
              cx={60 + (visibleReference / maxCount) * 660}
              cy={245 - reference.history[visibleReference - 1] * 190}
              r="4"
              fill="var(--ui-surface)"
              stroke="var(--ui-muted)"
              strokeWidth="2"
            />
          )}
          {(count > 0 || reference) && (
            <>
              <path
                d={`M${60 + (selected / maxCount) * 660} 40V245`}
                stroke="var(--ui-ink)"
                strokeDasharray="3 5"
              />
              {[
                [currentAt, "var(--ui-primary)"],
                [referenceAt, "var(--ui-muted)"],
              ].map(([v, color], i) =>
                v === undefined ? null : (
                  <rect
                    key={i}
                    x={56 + (selected / maxCount) * 660}
                    y={241 - v * 190}
                    width="8"
                    height="8"
                    fill="var(--ui-surface)"
                    stroke={color}
                    strokeWidth="2"
                  />
                ),
              )}
            </>
          )}
          {[0, 1, 2, 3, 4].map((i) => (
            <text
              key={i}
              x={60 + (Math.round((maxCount * i) / 4) / maxCount) * 660}
              y="271"
              textAnchor="middle"
            >
              {Math.round((maxCount * i) / 4)}
            </text>
          ))}
          <text x="720" y="300" textAnchor="end">
            已完成组数
          </text>
        </svg>
      </div>
      <label className="probability-probe-control">
        对照组次：第 {selected} 组
        <input
          aria-label="频率对照组次"
          type="range"
          min="1"
          max={maxProbe}
          step="1"
          disabled={!count && !reference}
          value={selected}
          onChange={(e) => {
            onPause();
            setProbe(Number(e.target.value));
          }}
        />
      </label>
      <p aria-label="同组次频率读数">
        第 {selected} 组累计频率：当前轮{" "}
        {currentAt === undefined
          ? "尚无该组样本"
          : `${(currentAt * 100).toFixed(2)}%`}
        ；参考轮{" "}
        {referenceAt === undefined
          ? "尚无该组样本"
          : `${(referenceAt * 100).toFixed(2)}%`}
        ；理论概率 {(p.p * 100).toFixed(2)}%。
      </p>
      <p>
        移动探针只查看已有结果，不会重新抽样。对比相邻组次，偏差可能变大，也可能变小；某一组刚好接近理论值不代表后续频率不再波动。
      </p>
      <div className="probability-summaries">
        <p>
          当前轮{" "}
          <strong>
            {count} 组 ·{" "}
            {count ? (sample.frequency * 100).toFixed(2) + "%" : "尚无样本"}
          </strong>
        </p>
        <p>
          参考轮{" "}
          <strong>
            {reference
              ? `${reference.count} 组 · ${(reference.frequency * 100).toFixed(2)}%`
              : "尚未保留"}
          </strong>
        </p>
      </div>
      {reference && (
        <Button onClick={() => setReference(null)}>移除参考轮</Button>
      )}
      <p>
        {reference && reference.count !== count
          ? "两轮样本量不同。追加到相同组数，再对照各自的波动。"
          : "比较相同组数时的频率，不把某一轮的偏差当作概率发生改变。"}
        样本增加不保证每一步都更接近理论值；有限样本也可能出现连续相同结果。
      </p>
    </section>
  );
}
