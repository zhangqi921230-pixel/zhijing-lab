import React, { useState } from "react";
import Button from "./LabButton.jsx";
import { geneticsCondition } from "./geneticsCondition.mjs";
import { genotypeNames } from "./geneticsSampling.mjs";
import "./GeneticsCondition.css";
export default function GeneticsCondition({ p }) {
  const [filtered, setFiltered] = useState(false),
    q = geneticsCondition(p, filtered);
  return (
    <section
      className="genetics-studio genetics-condition"
      aria-label="显性后代中的杂合子概率"
    >
      <header>
        <div>
          <span>HEREDITY / 条件概率</span>
          <h2>先限定观察范围，再计算概率</h2>
        </div>
        <strong>
          {genotypeNames[p.parent1]} × {genotypeNames[p.parent2]}
        </strong>
      </header>
      <p>
        每格是一种等概率的配子来源组合，并非四个实际出生的后代。A+a 与 a+A
        来源不同，但都是基因型 Aa。
      </p>
      <div className="condition-actions">
        <Button aria-pressed={!filtered} onClick={() => setFiltered(false)}>
          观察全部后代
        </Button>
        <Button aria-pressed={filtered} onClick={() => setFiltered(true)}>
          只看显性后代
        </Button>
      </div>
      <div
        className="condition-grid"
        role="group"
        aria-label="四种等概率配子组合"
      >
        {q.entries.map((e, i) => (
          <div
            key={i}
            className={e.included ? "included" : "excluded"}
            data-testid={`condition-${i}`}
          >
            <small>
              亲本一 {e.first} + 亲本二 {e.second}
            </small>
            <strong>{e.genotype}</strong>
            <span>
              {e.included ? "纳入观察范围" : "aa · 排除在本次条件之外"}
            </span>
            <b>
              {e.included
                ? e.genotype === "Aa"
                  ? "计入杂合子分子"
                  : "只计入分母"
                : "不计入分母"}
            </b>
          </div>
        ))}
      </div>
      <div className="condition-result" role="status">
        {q.probability === null ? (
          <>
            <strong>该亲本组合不会产生显性后代</strong>
            <p>
              “已知显性”的条件在本模型中概率为零，不能继续相除；这不是杂合子概率为零。
            </p>
          </>
        ) : (
          <>
            <strong>
              {filtered ? "显性后代中" : "全部后代中"}，杂合子概率 ={" "}
              {q.heterozygotes} / {q.denominator} ≈{" "}
              {(q.probability * 100).toFixed(1)}%
            </strong>
            <p>
              分母：符合当前观察条件的 {q.denominator}{" "}
              种组合；分子：其中基因型为 Aa 的 {q.heterozygotes} 种组合。
            </p>
          </>
        )}
      </div>
      <p>
        切换观察范围只是筛选理论组合，不会改变亲本、产生新后代或把隐性基因删除。完全显性、单基因、配子等概率结合、无选择压力；不用于预测复杂性状。
      </p>
    </section>
  );
}
