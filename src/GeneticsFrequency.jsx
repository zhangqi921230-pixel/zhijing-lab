import React, { useMemo } from "react";
import { recessiveFrequencyHistory } from "./geneticsSampling.mjs";
export default function GeneticsFrequency({ samples, probability }) {
  const history = useMemo(() => recessiveFrequencyHistory(samples), [samples]);
  const last = history.at(-1),
    maximum = Math.max(20, samples.length);
  const x = (n) => 52 + (460 * n) / maximum,
    y = (f) => 208 - 170 * f;
  return (
    <section className="genetics-frequency" aria-label="隐性后代频率的累计变化">
      <h3>每增加一个子代，比例怎样变化？</h3>
      <p>
        实线是累计抽样中 aa 的频率，虚线是这组亲本的理论概率{" "}
        {(probability * 100).toFixed(0)}
        %。两条线使用相同的0–100%纵轴；横轴随样本量展开。
      </p>
      <div
        className="genetics-frequency-scroll"
        tabIndex={0}
        role="region"
        aria-label="累计频率图，可横向滚动"
      >
        <svg
          viewBox="0 0 550 260"
          role="img"
          aria-label={
            last
              ? `抽样${last.n}个，隐性${last.count}个，当前频率${(last.frequency * 100).toFixed(1)}%，理论${(probability * 100).toFixed(0)}%`
              : "尚未抽样，图中仅显示理论概率线"
          }
        >
          {[0, 0.25, 0.5, 0.75, 1].map((f) => (
            <g key={f}>
              <line
                x1="52"
                x2="512"
                y1={y(f)}
                y2={y(f)}
                stroke="currentColor"
                opacity=".16"
              />
              <text
                x="44"
                y={y(f) + 5}
                textAnchor="end"
                fill="currentColor"
                fontSize="15"
              >
                {f * 100}%
              </text>
            </g>
          ))}
          {[0, Math.round(maximum / 2), maximum].map((n) => (
            <text
              key={n}
              x={x(n)}
              y="231"
              textAnchor="middle"
              fill="currentColor"
              fontSize="15"
            >
              {n}
            </text>
          ))}
          <text
            x="280"
            y="254"
            textAnchor="middle"
            fill="currentColor"
            fontSize="15"
          >
            累计子代数
          </text>
          <line
            x1="52"
            x2="512"
            y1={y(probability)}
            y2={y(probability)}
            stroke="var(--ui-gold)"
            strokeWidth="2"
            strokeDasharray="7 5"
          />
          {history.length > 0 && (
            <>
              <polyline
                points={history
                  .map((point) => `${x(point.n)},${y(point.frequency)}`)
                  .join(" ")}
                fill="none"
                stroke="var(--ui-primary)"
                strokeWidth="2.5"
              />
              <circle
                cx={x(last.n)}
                cy={y(last.frequency)}
                r="4"
                fill="var(--ui-primary)"
              />
            </>
          )}
        </svg>
      </div>
      <p>
        {last
          ? `当前 ${last.count} / ${last.n} = ${(last.frequency * 100).toFixed(1)}%；与理论相差 ${((last.frequency - probability) * 100).toFixed(1)} 个百分点。`
          : "点击上方“抽样20个”开始，再连续抽样或清空重做。没有样本时不把频率记成0%。"}
      </p>
      <p>
        曲线可以暂时远离理论线；大样本不保证每一步偏差都缩小。清空后重做会产生另一条随机轨迹。此图跟随当前这批后代，切换统计分类不会重新抽样。
      </p>
    </section>
  );
}
