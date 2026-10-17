import React, { useId, useState } from "react";
import { flameSamples } from "./chemistryTopics.mjs";
import "./FlameComparison.css";
export default function FlameComparison({ p, onClean }) {
  const id = useId().replaceAll(":", ""),
    sample = flameSamples[p.sample];
  const [reference, setReference] = useState(null);
  const observations = [reference || { sample: p.sample, contamination: 0 }, p];
  const changedSample = reference && reference.sample !== p.sample;
  const changedPollution =
    reference && reference.contamination !== p.contamination;
  return (
    <section className="flame-comparison" aria-label="焰色清洁参考对照">
      <header>
        <div>
          <small>
            {reference
              ? "控制变量 · 保留一次观察"
              : "同一样品 · 先比较，再判断"}
          </small>
          <h3>
            {reference
              ? "保留观察与当前样品"
              : `${sample.name}：清洁参考与当前观察`}
          </h3>
        </div>
        <button disabled={p.contamination === 0} onClick={onClean}>
          清洁后重新观察
        </button>
      </header>
      <div className="flame-reference-actions">
        <button
          onClick={() =>
            setReference({ sample: p.sample, contamination: p.contamination })
          }
        >
          {reference ? "用当前观察更新参考" : "保留当前观察作参考"}
        </button>
        {reference && (
          <button onClick={() => setReference(null)}>
            恢复同一样品清洁对照
          </button>
        )}
      </div>
      {reference && (
        <p role="status">
          {changedSample && changedPollution
            ? "样品和污染程度都改变了。先保持其中一个条件一致，再判断颜色变化的原因。"
            : changedSample
              ? "仅改变样品：污染程度保持一致，可以比较不同样品的颜色。"
              : changedPollution
                ? "仅改变污染程度：样品保持一致，可以比较清洁前后的变化。"
                : "两个条件相同：现在改变样品或污染程度，保留的参考不会随之变化。"}
        </p>
      )}
      <div className="flame-comparison-pair">
        {observations.map((observation, i) => {
          const pollution = observation.contamination;
          const observedSample = flameSamples[observation.sample];
          const title = i ? "当前观察" : reference ? "保留参考" : "清洁参考";
          return (
            <figure key={i}>
              <svg
                viewBox="0 0 250 240"
                role="img"
                aria-label={`${title}，${observedSample.name}${pollution ? "，叠加钠污染黄光" : "，无钠污染"}`}
              >
                <defs>
                  <linearGradient id={`${id}-${i}`} x1="0" y1="1" x2="0" y2="0">
                    <stop stopColor="#6bbaff" />
                    <stop offset=".3" stopColor={observedSample.color} />
                    <stop
                      offset="1"
                      stopColor={observedSample.color}
                      stopOpacity=".2"
                    />
                  </linearGradient>
                </defs>
                <rect width="250" height="240" rx="8" fill="#111b22" />
                <path
                  d="M125 193C58 177 94 117 113 91C127 68 116 43 137 24C120 80 159 101 160 139C163 177 148 194 125 193Z"
                  fill={`url(#${id}-${i})`}
                />
                <path
                  d="M125 193C74 170 108 108 135 39C121 103 177 143 142 190Z"
                  fill="#ffd12e"
                  opacity={pollution * 0.85}
                />
                <path
                  d="M125 190C108 173 120 148 131 130C129 158 146 170 134 190Z"
                  fill="#b5deff"
                  opacity=".7"
                />
                <rect
                  x="113"
                  y="191"
                  width="24"
                  height="30"
                  rx="3"
                  fill="#8798a0"
                />
                <path d="M100 223H150" stroke="#b2bec2" strokeWidth="5" />
              </svg>
              <figcaption>
                <strong>
                  {title} · {observedSample.name}
                </strong>
                <span>
                  {pollution > 0 ? "样品焰色叠加黄光" : observedSample.label}
                </span>
                <span>钠污染视觉叠加：{Math.round(pollution * 100)}%</span>
              </figcaption>
            </figure>
          );
        })}
      </div>
      {!reference && (
        <p>
          {p.contamination === 0
            ? "当前已清洁，两幅参考应一致。换样前清洁工具，避免上一份样品干扰。"
            : p.sample === "sodium"
              ? "样品与污染源都呈钠的黄光，不能凭颜色区分黄光来自哪里。"
              : "黄光可能掩盖样品原本的焰色。清洁后复测，比较颜色是否恢复；不能据此鉴定未知混合物。"}
        </p>
      )}
      <p>
        两幅为静态颜色示意，观察闪动请使用上方器材。污染设置仅代表视觉叠加程度，不对应浓度；不模拟谱线强度、真实光谱混合或仪器测量。
      </p>
    </section>
  );
}
