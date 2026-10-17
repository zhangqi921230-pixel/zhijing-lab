import React, { useState } from "react";
import { planDilution } from "./dilutionTarget.mjs";
import "./DilutionTarget.css";

export function DilutionTarget({ p, onPrepare }) {
  const [target, setTarget] = useState("5");
  const [revealed, setRevealed] = useState(false);
  const plan = planDilution(p.solute, p.water, Number(target));
  return (
    <div className="dilution-target">
      <label>
        目标质量分数 / %
        <input
          type="number"
          min="0.01"
          max="100"
          step="0.1"
          value={target}
          onChange={(event) => {
            setTarget(event.target.value);
            setRevealed(false);
          }}
        />
      </label>
      <p>
        以当前原溶液为起点：溶质 {p.solute} g，水 {p.water}{" "}
        g。先算需要加入多少水。
      </p>
      <button
        type="button"
        onClick={() => setRevealed(!revealed)}
        aria-expanded={revealed}
      >
        {revealed ? "收起计算过程" : "核对我的计算"}
      </button>
      {revealed && (
        <div className="dilution-target-result" role="status">
          {plan.status === "invalid" ? (
            <p>请输入大于 0、不超过 100 的目标百分数。有限加水不能达到 0%。</p>
          ) : plan.status === "higher" ? (
            <p>目标比原溶液更浓，无法只通过加水实现。请降低目标质量分数。</p>
          ) : (
            <>
              <p>
                目标溶液质量 = {p.solute} ÷ ({target} / 100) ≈{" "}
                <strong>{plan.totalMass.toFixed(2)} g</strong>
              </p>
              <p>
                总加水量 = {plan.totalMass.toFixed(2)} − {p.solute + p.water} ≈{" "}
                <strong>{plan.added.toFixed(2)} g</strong>
              </p>
              {plan.status === "outside" ? (
                <p>数学上可以稀释到此浓度，但需要的水超过本演示 300 g 上限。</p>
              ) : (
                <button
                  type="button"
                  onClick={() => onPrepare({ add: plan.added })}
                >
                  查看目标状态
                </button>
              )}
              <p className="dilution-target-note">
                数值显示取两位小数，计算保留完整精度。“查看目标状态”直接设置从原溶液起算的总加水量。
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
