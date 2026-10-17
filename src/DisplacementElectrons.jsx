import React from "react";
import Button from "./LabButton.jsx";
import { displacementState } from "./chemistryTopics.mjs";
import "./DisplacementElectrons.css";
export default function DisplacementElectrons({ p, time, onSeek }) {
  const symbol = p.metal === "zinc" ? "Zn" : p.metal === "iron" ? "Fe" : "Cu";
  const reactive = p.metal !== "copper";
  const stage = time <= 0 ? 0 : time >= 60 ? 2 : 1;
  const q = displacementState(p.metal, p.mass, time / 60);
  const progress = Math.min(1, Math.max(0, time / 60));
  return (
    <section
      className="displacement-electrons"
      aria-label="置换反应电子得失记账"
    >
      <h3>从红色铜层到电子得失</h3>
      <p>
        用一个金属原子与一个铜离子表示净反应。中间画面只用于电子得失记账，不表示溶液中存在游离电子，也不描述实际微观运动路径。
      </p>
      <div
        className="electron-diagram-scroll"
        tabIndex="0"
        role="region"
        aria-label="电子记账图，可横向滚动"
      >
        <svg
          viewBox="0 0 780 350"
          role="img"
          aria-label={
            reactive
              ? `${symbol}失去两个电子，铜离子得到两个电子`
              : "铜片与铜离子没有净置换"
          }
        >
          <text x="24" y="32">
            {reactive
              ? [
                  "反应前：辨认原子与离子",
                  "电子得失记账：两电子转移",
                  "反应后：铜析出，金属离子进入溶液",
                ][stage]
              : "铜放入硫酸铜：没有净置换"}
          </text>
          <circle
            cx="170"
            cy="145"
            r="58"
            fill="var(--ui-primary)"
            fillOpacity=".15"
            stroke="var(--ui-primary)"
            strokeWidth="2"
          />
          <circle
            cx="610"
            cy="145"
            r="58"
            fill="var(--ui-gold)"
            fillOpacity=".15"
            stroke="var(--ui-gold)"
            strokeWidth="2"
          />
          <text x="170" y="154" textAnchor="middle" fontSize="28">
            {symbol}
            {reactive && stage > 0 ? "²⁺" : ""}
          </text>
          <text x="610" y="154" textAnchor="middle" fontSize="28">
            Cu{reactive && stage === 2 ? "" : "²⁺"}
          </text>
          <text x="170" y="239" textAnchor="middle">
            {reactive && stage > 0 ? "进入溶液的金属离子" : "金属固体中的原子"}
          </text>
          <text x="610" y="239" textAnchor="middle">
            {reactive && stage === 2 ? "析出的铜原子" : "溶液中的铜离子"}
          </text>
          {reactive && stage === 1 && (
            <g aria-label="两个电子用于记账">
              <path
                d="M250 145H530l-10-6m10 6-10 6"
                fill="none"
                stroke="var(--ui-muted)"
              />
              {[-1, 1].map((n) => (
                <g key={n}>
                  <circle
                    cx={270 + 240 * progress}
                    cy={145 + n * 22}
                    r="14"
                    fill="var(--ui-paper)"
                    stroke="var(--ui-ink)"
                  />
                  <text
                    x={270 + 240 * progress}
                    y={151 + n * 22}
                    textAnchor="middle"
                  >
                    e⁻
                  </text>
                </g>
              ))}
            </g>
          )}
          <text x="24" y="291">
            {reactive
              ? stage === 0
                ? "净离子记账：0 + (+2) = +2"
                : stage === 1
                  ? "净离子记账：(+2) + (+2) + 2×(−1) = +2"
                  : "净离子记账：(+2) + 0 = +2"
              : "没有净电子转移；不能套用铁、锌的反应式。"}
          </text>
          <text x="24" y="325" fontSize="16">
            硫酸根是旁观离子，未画出；真实溶液整体保持电中性。
          </text>
        </svg>
      </div>
      <div className="electron-stage-controls">
        {["看反应前", "看电子记账", "看反应后"].map((label, i) => (
          <Button
            key={label}
            aria-pressed={stage === i}
            onClick={() => onSeek(i * 30)}
          >
            {label}
          </Button>
        ))}
      </div>
      {reactive && (
        <>
          <p>
            <strong>
              {symbol} → {symbol}²⁺ + 2e⁻
            </strong>
            （失电子、氧化）
            <br />
            <strong>Cu²⁺ + 2e⁻ → Cu</strong>（得电子、还原）
          </p>
          <p>
            合并后：{symbol} + Cu²⁺ → {symbol}²⁺ + Cu。电子在两式中抵消，每置换
            1 mol 铜，对应转移 2 mol 电子。
          </p>
        </>
      )}
      <p>
        按当前宏观反应进度计算：析出铜 {(q.extent * 1000).toFixed(3)}{" "}
        mmol，对应净转移电子 {(q.extent * 2000).toFixed(3)}{" "}
        mmol。记账图只代表一次净交换，不与上方动画的粒子数量一一对应；演示时间不预测反应速率。
      </p>
    </section>
  );
}
