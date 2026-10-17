import React, { useState } from "react";
import { electrolysisState } from "./chemistryTopics.mjs";
import "./EqualChargeStudy.css";
export default function EqualChargeStudy({ onApply, current, time }) {
  const [charge, setCharge] = useState(300),
    gas = electrolysisState(1, charge);
  return (
    <section className="equal-charge-study" aria-label="相同电荷的电解对照">
      <h3>电流更大，一定收集得更多吗？</h3>
      <p>
        选择相同的目标电荷，比较不同电流所需的通电时间。只要电流效率相同，Q=It相同，理论产气量就相同。
      </p>
      <div className="equal-charge-options" role="group" aria-label="目标电荷">
        {[120, 300, 600].map((q) => (
          <button
            key={q}
            aria-pressed={charge === q}
            onClick={() => setCharge(q)}
          >
            {q} C
          </button>
        ))}
      </div>
      {Number.isFinite(current) && (
        <p>
          当前器材：{current} A × {time.toFixed(1)} s ={" "}
          {(current * time).toFixed(1)} C；
          {Math.abs(current * time - charge) < 1e-6
            ? "已达到所选目标电荷。"
            : "当前电荷与目标不同，可点击下方可用方案。"}
        </p>
      )}
      <div className="equal-charge-cases">
        {[0.5, 1, 2].map((current) => {
          const time = charge / current;
          return (
            <article key={current}>
              <h4>{current} A</h4>
              <strong>{time.toFixed(0)} s</strong>
              <p>
                {current} × {time.toFixed(0)} = {charge} C
              </p>
              <button
                disabled={time > 600}
                onClick={() => onApply(current, time)}
              >
                在器材中对照
              </button>
              {time > 600 && <p>超过600秒演示范围</p>}
            </article>
          );
        })}
      </div>
      <p>
        三组理论产气量一致：H₂ {gas.hydrogen.toFixed(2)} mL，O₂{" "}
        {gas.oxygen.toFixed(2)} mL（25°C、1
        atm）。这是目标状态预测；点击可用按钮才会把上方器材定位到该组电流和时间，并暂停。
      </p>
      <p>
        若固定通电时间，增大电流才会增大产气量。这里不模拟副反应、极化和发热对效率的影响，也不能由电荷直接推出耗电量；计算电能还需要电压。
      </p>
    </section>
  );
}
