import React, { useEffect, useState } from "react";
import Button from "./LabButton.jsx";
import { genetics } from "./models.mjs";
import { offspringQuartet } from "./offspringQuartet.mjs";
import "./OffspringQuartet.css";

export default function OffspringQuartet({ p }) {
  const probability = genetics(p.parent1, p.parent2).aa;
  const { sequences, distribution } = offspringQuartet(probability);
  const [count, setCount] = useState(1),
    [mask, setMask] = useState(1);
  const [revealed, setRevealed] = useState(4),
    [running, setRunning] = useState(false);
  const selected = sequences[mask];
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      if (!document.hidden) setRevealed((v) => Math.min(4, v + 1));
    }, 650);
    return () => clearInterval(timer);
  }, [running]);
  useEffect(() => {
    if (revealed === 4) setRunning(false);
  }, [revealed]);
  const select = (s) => {
    setMask(s.mask);
    setCount(s.count);
    setRunning(false);
    setRevealed(4);
  };
  return (
    <section
      className="genetics-studio quartet-study"
      aria-label="四个子代的概率分布"
    >
      <header>
        <div>
          <span>HEREDITY / 从排列到概率</span>
          <h2>四个子代，一定是三显一隐吗？</h2>
        </div>
      </header>
      <p>
        当前亲本下，每个独立子代表现隐性的概率为{" "}
        <strong>{(probability * 100).toFixed(0)}%</strong>
        。选择隐性个数，再观察有哪些先后排列。
      </p>
      <div
        className="quartet-histogram"
        role="group"
        aria-label="选择四个子代中的隐性个数"
      >
        {distribution.map((s) => (
          <button
            key={s.count}
            aria-pressed={count === s.count}
            onClick={() => select(sequences.find((v) => v.count === s.count))}
          >
            <strong>{(s.probability * 100).toFixed(2)}%</strong>
            <span className="quartet-bar">
              <i style={{ height: `${s.probability * 100}%` }} />
            </span>
            <span>{s.count} 个隐性</span>
          </button>
        ))}
      </div>
      <p>
        所选类别：
        <strong>
          {count} 个隐性、{4 - count} 个显性
        </strong>
        ，共有 <strong>{distribution[count].arrangements}</strong>{" "}
        种排列。点击下方排列逐个观察。
      </p>
      <div
        className="quartet-arrangements"
        role="group"
        aria-label="选择性状排列"
      >
        {sequences
          .filter((s) => s.count === count)
          .map((s) => (
            <Button
              key={s.mask}
              aria-pressed={mask === s.mask}
              onClick={() => select(s)}
            >
              {s.recessive.map((v) => (v ? "隐" : "显")).join(" · ")}
            </Button>
          ))}
      </div>
      <div
        className="quartet-offspring"
        aria-label={`已揭示 ${revealed} 个子代`}
      >
        {selected.recessive.map((recessive, i) => (
          <div
            key={i}
            className={
              i < revealed
                ? recessive
                  ? "recessive"
                  : "dominant"
                : "unrevealed"
            }
          >
            <span>子代 {i + 1}</span>
            <svg viewBox="0 0 100 110" aria-hidden="true">
              <path
                d="M50 93V62M50 77Q24 78 24 58Q48 59 50 77M50 70Q78 68 78 49Q53 52 50 70"
                fill="var(--ui-primary)"
                opacity=".7"
              />
              <g fill="currentColor" stroke="var(--ui-line)">
                <ellipse
                  cx="38"
                  cy="39"
                  rx="15"
                  ry="21"
                  transform="rotate(-35 38 39)"
                />
                <ellipse
                  cx="62"
                  cy="39"
                  rx="15"
                  ry="21"
                  transform="rotate(35 62 39)"
                />
                <ellipse cx="50" cy="51" rx="21" ry="14" />
              </g>
              <circle cx="50" cy="43" r="6" fill="var(--ui-paper)" />
            </svg>
            <strong>
              {i < revealed
                ? recessive
                  ? "隐性 aa"
                  : "显性 AA / Aa"
                : "待揭示"}
            </strong>
          </div>
        ))}
      </div>
      <div className="quartet-arrangements">
        <Button
          onClick={() => {
            setRevealed(0);
            setRunning(true);
          }}
          disabled={running}
        >
          逐个揭示所选排列
        </Button>
        <Button onClick={() => setRunning(false)} disabled={!running}>
          暂停揭示
        </Button>
        <Button
          onClick={() => {
            setRunning(false);
            setRevealed((v) => Math.min(4, v + 1));
          }}
          disabled={revealed === 4}
        >
          揭示下一个
        </Button>
        <Button
          onClick={() => {
            setRunning(false);
            setRevealed(4);
          }}
        >
          显示全部
        </Button>
      </div>
      <div className="quartet-equation">
        <strong>这一种排列：{(selected.probability * 100).toFixed(2)}%</strong>
        <span>
          这一类结果：{distribution[count].arrangements} ×{" "}
          {(selected.probability * 100).toFixed(2)}% ≈{" "}
          {(distribution[count].probability * 100).toFixed(2)}%
        </span>
        <p>
          {selected.probability === 0
            ? "当前亲本条件下，该排列不可能出现。这里保留它用于对照。"
            : "各次独立，排列概率等于四次性状概率相乘；同类不同排列互斥，因此相加。显示值有四舍五入。"}
        </p>
      </div>
      <p>
        花朵仅作显隐性性状示意。揭示播放展示你选定的理论排列，不进行随机抽样，也不增加抽样记录。假设单基因完全显性、独立受精、无选择压力；3∶1
        是概率比例，并非每四个后代必须满足的数量配额。
      </p>
    </section>
  );
}
