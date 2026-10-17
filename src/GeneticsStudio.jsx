import OffspringQuartet from "./OffspringQuartet.jsx";
import GameteJourney from "./GameteJourney.jsx";
import GeneticsCondition from "./GeneticsCondition.jsx";
import GeneticsFrequency from "./GeneticsFrequency.jsx";
import TestCrossEvidence from "./TestCrossEvidence.jsx";
import React, { useEffect, useState, useRef } from "react";
import { genetics } from "./models.mjs";
import {
  genotypeNames,
  drawOffspring,
  summarizeOffspring,
} from "./geneticsSampling.mjs";
import "./GeneticsStudio.css";
export default function GeneticsStudio({ p, chapter }) {
  const [phenotypes, setPhenotypes] = useState(false),
    [selected, setSelected] = useState(0),
    [samples, setSamples] = useState([]),
    [running, setRunning] = useState(false);
  const sampleCount = useRef(0);
  sampleCount.current = samples.length;
  const q = genetics(p.parent1, p.parent2),
    counts = summarizeOffspring(samples);
  const add = (number) => {
    const batch = Array.from(
      { length: Math.min(number, 1000 - sampleCount.current) },
      () => drawOffspring(p.parent1, p.parent2),
    );
    sampleCount.current += batch.length;
    setSamples((old) => [...old, ...batch].slice(0, 1000));
    if (batch.length) setSelected(batch.at(-1).first * 2 + batch.at(-1).second);
  };
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      if (!document.hidden) add(10);
    }, 120);
    return () => clearInterval(timer);
  }, [running, p.parent1, p.parent2]);
  useEffect(() => {
    if (samples.length >= 1000) setRunning(false);
  }, [samples.length]);
  if (chapter === 7)
    return <OffspringQuartet key={`${p.parent1}-${p.parent2}`} p={p} />;
  if (chapter === 6) return <GeneticsCondition p={p} />;
  const active = selected;
  const distribution = phenotypes
    ? [
        {
          name: "显性性状",
          note: "AA + Aa",
          probability: q.AA + q.Aa,
          count: counts.AA + counts.Aa,
        },
        { name: "隐性性状", note: "aa", probability: q.aa, count: counts.aa },
      ]
    : genotypeNames.map((name) => ({
        name,
        note: name,
        probability: q[name],
        count: counts[name],
      }));
  return (
    <section className="genetics-studio" aria-label="遗传组合与抽样工作台">
      <header>
        <div>
          <span>HEREDITY / 单基因遗传</span>
          <h2>
            {chapter === 5
              ? "从配子到受精"
              : chapter >= 3
                ? "理论比例与随机后代"
                : "从亲本到一个子代"}
          </h2>
        </div>
        <strong>
          {genotypeNames[p.parent1]} × {genotypeNames[p.parent2]}
        </strong>
      </header>
      {(chapter === 0 || chapter === 5) && (
        <GameteJourney
          key={`${p.parent1}-${p.parent2}-${selected}`}
          p={p}
          selected={selected}
          onPauseSampling={() => setRunning(false)}
          onSelect={(index) => {
            setRunning(false);
            setSelected(index);
          }}
        />
      )}
      <div className="genetics-workspace">
        <div className="genetics-cross">
          <p>每次受精，各亲本随机提供一个等位基因。</p>
          <div className="genetics-gametes">
            <span>
              亲本一 <b>{genotypeNames[p.parent1]}</b>
            </span>
            <span>
              亲本二 <b>{genotypeNames[p.parent2]}</b>
            </span>
          </div>
          <div className="genetics-grid" role="group" aria-label="点选配子组合">
            <span>配子</span>
            {[0, 1].map((i) => (
              <strong key={i}>{genotypeNames[p.parent2][i]}</strong>
            ))}
            {[0, 1].map((row) => (
              <React.Fragment key={row}>
                <strong>{genotypeNames[p.parent1][row]}</strong>
                {[0, 1].map((col) => {
                  const index = row * 2 + col;
                  return (
                    <button
                      key={col}
                      aria-pressed={active === index}
                      aria-label={`第${row + 1}行第${col + 1}列，${q.cells[index]}，概率25%`}
                      onClick={() => {
                        setRunning(false);
                        setSelected(index);
                      }}
                    >
                      <b>{q.cells[index]}</b>
                      <small>25% 的组合机会</small>
                    </button>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
          <div className="genetics-fusion" key={`${active}-${samples.length}`}>
            <span>{genotypeNames[p.parent1][Math.floor(active / 2)]}</span>
            <i>＋</i>
            <span>{genotypeNames[p.parent2][active % 2]}</span>
            <i>→</i>
            <strong>{q.cells[active]}</strong>
          </div>
          <p className="genetics-note">
            {q.cells[active] === "aa"
              ? "aa：两个隐性等位基因，表现隐性性状。"
              : `${q.cells[active]}：含显性等位基因 A，完全显性模型下表现显性性状。`}
          </p>
        </div>
        <div className="genetics-population">
          <div className="genetics-population-title">
            <strong>虚拟后代样本</strong>
            <span>{samples.length} / 1000</span>
          </div>
          <div
            className="genetics-seeds"
            aria-label="最近60个子代，紫色为显性，米色为隐性"
          >
            {samples.length ? (
              samples.slice(-60).map((s, i) => (
                <span
                  key={`${samples.length - Math.min(samples.length, 60) + i}`}
                  className={s.genotype === "aa" ? "recessive" : "dominant"}
                  title={s.genotype}
                >
                  {s.genotype}
                </span>
              ))
            ) : (
              <p>
                先点选组合理解来源，再抽样观察后代分布。每枚标记代表一个虚拟子代。
              </p>
            )}
          </div>
          <p className="genetics-legend">
            <span>● 显性性状（AA / Aa）</span>
            <span>○ 隐性性状（aa）</span>
          </p>
          <div className="genetics-actions">
            <button
              disabled={running || samples.length >= 1000}
              onClick={() => add(1)}
            >
              抽样 1 个
            </button>
            <button
              disabled={running || samples.length >= 1000}
              onClick={() => add(Math.min(20, 1000 - samples.length))}
            >
              抽样 20 个
            </button>
            <button
              disabled={samples.length >= 1000}
              aria-pressed={running}
              onClick={() => setRunning(!running)}
            >
              {running ? "暂停抽样" : "连续抽样至 1000"}
            </button>
            <button
              onClick={() => {
                setRunning(false);
                setSamples([]);
              }}
            >
              清空本次抽样
            </button>
          </div>
          <p className="genetics-note">
            随机抽样不保证每四个恰好符合比例。切换亲本、章节或复位会清空本次样本；此抽样不写入实验记录。
          </p>
        </div>
      </div>
      <div className="genetics-actions" role="group" aria-label="统计分类">
        <button aria-pressed={!phenotypes} onClick={() => setPhenotypes(false)}>
          按基因型统计
        </button>
        <button aria-pressed={phenotypes} onClick={() => setPhenotypes(true)}>
          按显隐性性状统计
        </button>
      </div>
      <p className="genetics-note">
        {phenotypes
          ? "完全显性条件下，AA 与 Aa 合并为显性性状，aa 为隐性性状。切换分类使用同一批后代，不重新抽样。"
          : "基因型分成 AA、Aa、aa 三类；AA 与 Aa 虽然基因型不同，但在本模型中表现相同的显性性状。"}
      </p>
      <div
        className={`genetics-distribution${phenotypes ? " phenotype" : ""}`}
        aria-label="理论与抽样结果对照"
      >
        {distribution.map(({ name, note, probability, count }) => (
          <div key={name}>
            <strong>
              {name}
              <small>{phenotypes ? note : ""}</small>
            </strong>
            <div>
              <span>理论 {(probability * 100).toFixed(0)}%</span>
              <div className="genetics-bar expected">
                <i style={{ width: `${probability * 100}%` }} />
              </div>
              <span>
                抽样 {count} 个 ·{" "}
                {samples.length
                  ? ((count / samples.length) * 100).toFixed(1) + "%"
                  : "尚未抽样"}
              </span>
              <div className="genetics-bar">
                <i
                  style={{
                    width: `${samples.length ? (count / samples.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <GeneticsFrequency samples={samples} probability={q.aa} />
      {chapter >= 2 && chapter <= 4 && (
        <TestCrossEvidence p={p} samples={samples} />
      )}
      <p className="genetics-note">
        条件：单基因、完全显性、配子等概率结合、无选择压力。只展示基因型组合；不模拟减数分裂的细胞结构，也不用于预测个体的复杂性状。
      </p>
    </section>
  );
}
