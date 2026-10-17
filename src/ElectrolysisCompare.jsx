import WaterAtomBalance from "./WaterAtomBalance.jsx";
import EqualChargeStudy from "./EqualChargeStudy.jsx";
import React, { useState } from "react";
import { electrolysisState, FARADAY } from "./chemistryTopics.mjs";
import "./ElectrolysisCompare.css";
export function electrolysisAmounts(current, time) {
  const q = electrolysisState(current, time),
    h = q.charge / (2 * FARADAY),
    o = h / 2;
  return {
    ...q,
    hydrogenMmol: h * 1000,
    oxygenMmol: o * 1000,
    hydrogenMg: h * 2 * 1000,
    oxygenMg: o * 32 * 1000,
  };
}
export default function ElectrolysisCompare({ p, time, onApply }) {
  const [mass, setMass] = useState(false),
    q = electrolysisAmounts(p.current, time),
    max = electrolysisAmounts(2, 600);
  const rows = [
      ["阴极 − · 氢气", mass ? q.hydrogenMg : q.hydrogen, "#438b9b"],
      ["阳极 + · 氧气", mass ? q.oxygenMg : q.oxygen, "#b18a49"],
    ],
    limit = mass ? max.oxygenMg : max.hydrogen,
    unit = mass ? "mg" : "mL";
  return (
    <section
      className="electrolysis-compare"
      aria-label="电解气体体积与质量对照"
    >
      <header>
        <div>
          <small>同一对气体，两种比较</small>
          <h3>体积多，不代表质量更大</h3>
        </div>
        <div role="group" aria-label="气体比较方式">
          <button aria-pressed={!mass} onClick={() => setMass(false)}>
            比较体积
          </button>
          <button aria-pressed={mass} onClick={() => setMass(true)}>
            比较质量
          </button>
        </div>
      </header>
      {rows.map(([label, value, color]) => (
        <div className="electrolysis-compare-row" key={label}>
          <strong>{label}</strong>
          <div className="electrolysis-compare-track">
            <i
              style={{ width: `${(value / limit) * 100}%`, background: color }}
            />
          </div>
          <span>
            {value.toFixed(2)} {unit}
          </span>
        </div>
      ))}
      <p className="electrolysis-ratio">
        {q.charge === 0
          ? "尚未产气，当前数量均为零；不能计算零与零的比值。"
          : mass
            ? "质量比 H₂ : O₂ = 1 : 8（按相对分子质量2与32近似）"
            : "同温同压体积比 H₂ : O₂ = 2 : 1"}
      </p>
      <p>
        每行背景代表 {limit.toFixed(2)} {unit}
        ，对应本台最大电流和演示时长下的量程；改变时间和电流时不会单独拉伸条带。
      </p>
      <dl>
        <div>
          <dt>通过电荷 Q = It</dt>
          <dd>{q.charge.toFixed(1)} C</dd>
        </div>
        <div>
          <dt>氢气 Q / 2F</dt>
          <dd>{q.hydrogenMmol.toFixed(3)} mmol</dd>
        </div>
        <div>
          <dt>氧气 Q / 4F</dt>
          <dd>{q.oxygenMmol.toFixed(3)} mmol</dd>
        </div>
      </dl>
      <p>
        2H₂O → 2H₂ +
        O₂。系数表示粒子个数或物质的量之比；质量还要乘以摩尔质量。体积按25°C、1
        atm的干燥理想气体计算，电流效率取100%，忽略气体溶解和泄漏。
      </p>
      <WaterAtomBalance />
      {onApply && (
        <EqualChargeStudy onApply={onApply} current={p.current} time={time} />
      )}
    </section>
  );
}
