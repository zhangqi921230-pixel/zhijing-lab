import React, { useState } from "react";
import Button from "./LabButton.jsx";
export const noRecessiveProbability = (n) => 2 ** -n;
export default function TestCrossEvidence({ p, samples }) {
  const [size, setSize] = useState(4);
  const eligible =
    (p.parent2 === 2 && p.parent1 !== 2) ||
    (p.parent1 === 2 && p.parent2 !== 2);
  const recessive = samples.filter((s) => s.genotype === "aa").length;
  return (
    <section className="testcross-evidence" aria-label="测交证据与样本量">
      <h3>一直没看到隐性后代，就一定是 AA 吗？</h3>
      <p>假设待测亲本表现显性，与 aa 测交。比较两种解释在独立抽样中的预测：</p>
      <div className="testcross-hypotheses">
        <div>
          <strong>假设一 · AA × aa</strong>
          <span>全部显性后代的概率</span>
          <b>100%</b>
        </div>
        <div>
          <strong>假设二 · Aa × aa</strong>
          <span>连续 {size} 个均为显性的概率</span>
          <b>
            {(100 * noRecessiveProbability(size)).toFixed(size > 10 ? 4 : 2)}%
          </b>
        </div>
      </div>
      <label>
        假设观察的后代数 <output>{size} 个</output>
        <input
          aria-label="假设观察的后代数"
          type="range"
          min="1"
          max="20"
          step="1"
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
        />
      </label>
      <div className="genetics-actions">
        {[1, 4, 10, 20].map((n) => (
          <Button key={n} aria-pressed={size === n} onClick={() => setSize(n)}>
            对照 {n} 个
          </Button>
        ))}
      </div>
      <p className="testcross-current">
        {!eligible
          ? "当前亲本不属于“显性亲本 × aa”的测交；请使用右侧测交预设。"
          : samples.length === 0
            ? "当前还没有抽样。上方用于虚拟后代抽样；此处样本量只改变假设计算，不增加后代。"
            : `当前抽样 ${samples.length} 个，其中隐性 ${recessive} 个。${recessive ? "在本模型假设下，出现隐性后代可排除待测亲本为 AA。" : "本次未出现隐性后代，两种解释都可能产生这一结果，不能据此直接证明 AA。"}`}
      </p>
      <details>
        <summary>为什么是 (1/2)ⁿ？</summary>
        <p>
          Aa × aa 时，每个子代表现显性的概率为 1/2；相互独立的 n
          次都为显性，概率是
          (1/2)ⁿ。这是“给定亲本假设时，观察到这一结果”的概率，并不是亲本为 Aa
          的概率。未设置先验概率，不作后验推断。以上结论限于完全显性、无突变、无判读错误的单基因模型。
        </p>
      </details>
    </section>
  );
}
