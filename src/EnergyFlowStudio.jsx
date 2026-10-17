import TrophicSpecimen from "./TrophicSpecimen.jsx";
import EnergyPathways from "./EnergyPathways.jsx";
import EnergyComparison from "./EnergyComparison.jsx";
import EnergyDepthStudy from "./EnergyDepthStudy.jsx";
import React, { useEffect, useState } from "react";
import { trophicBudget } from "./trophicBudget.mjs";
import "./EnergyFlowStudio.css";
const names = ["草 · 生产者", "兔 · 初级消费者", "狐 · 次级消费者"];
const number = (value) => Number(value.toFixed(2)).toLocaleString("zh-CN");
export default function EnergyFlowStudio({ p, chapter }) {
  const [step, setStep] = useState(chapter === 0 ? 0 : 2),
    [playing, setPlaying] = useState(false),
    [ledger, setLedger] = useState(chapter >= 2);
  const budget = trophicBudget(p.energy, p.eff);
  useEffect(() => {
    setPlaying(false);
  }, [p.energy, p.eff]);
  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      if (!document.hidden) setStep((old) => Math.min(2, old + 1));
    }, 1600);
    return () => clearInterval(timer);
  }, [playing]);
  useEffect(() => {
    if (step === 2) setPlaying(false);
  }, [step]);
  if (chapter === 5) return <EnergyDepthStudy p={p} />;
  return (
    <section className="energy-studio" aria-label="食物链能量流动工作台">
      <header>
        <div>
          <span>ECOLOGY / 能量的单向流动</span>
          <h2>每向上一级，能量如何分配？</h2>
        </div>
        <strong>
          {p.eff}%<small>相邻级传递效率</small>
        </strong>
      </header>
      <div className="energy-view" role="group" aria-label="能量呈现方式">
        <button aria-pressed={!ledger} onClick={() => setLedger(false)}>
          食物链与传递
        </button>
        <button aria-pressed={ledger} onClick={() => setLedger(true)}>
          守恒账本
        </button>
      </div>
      <div className={`energy-chain ${playing ? "is-running" : ""}`}>
        {names.map((name, index) => (
          <React.Fragment key={name}>
            <button
              className="energy-level"
              aria-pressed={step === index}
              onClick={() => {
                setStep(index);
                setPlaying(false);
              }}
            >
              <span className="energy-level-index">
                {String(index + 1).padStart(2, "0")} / 营养级
              </span>
              <TrophicSpecimen index={index} />
              <strong>{name}</strong>
              <b>
                {number(budget.levels[index])}
                <small> kJ</small>
              </b>
              <span>
                占起点 {((budget.levels[index] / p.energy) * 100).toFixed(2)}%
              </span>
            </button>
            {index < 2 && (
              <div className={`energy-link ${step > index ? "reached" : ""}`}>
                <span>{p.eff}%</span>
                <i>→</i>
                <small>传入下一级</small>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      {!ledger ? (
        <div className="energy-focus" aria-live="polite">
          <span>当前观察 · {names[step]}</span>
          <h3>{step < 2 ? "一份能量，两类去向" : "两个传递环节，效率相乘"}</h3>
          <p>
            {step < 2
              ? `${number(budget.levels[step])} kJ 中，${number(budget.levels[step + 1])} kJ 进入下一营养级；其余 ${number(budget.diverted[step])} kJ 未沿这条摄食链继续传递。`
              : `${number(p.energy)} × ${p.eff}% × ${p.eff}% = ${number(budget.levels[2])} kJ。每次乘的是上一营养级的能量，并非每级减去同一个数。`}
          </p>
          <div className="energy-proportion">
            <i
              style={{ width: `${step < 2 ? p.eff : (p.eff * p.eff) / 100}%` }}
            />
          </div>
          <small>条形长度按比例绘制；动物图示大小不表示生物量或能量。</small>
        </div>
      ) : (
        <div className="energy-ledger">
          <h3>把生产者固定的能量分配完整</h3>
          <div
            className="energy-budget-strip"
            role="img"
            aria-label={`第一环节未传递 ${number(budget.diverted[0])}，第二环节未传递 ${number(budget.diverted[1])}，末级获得 ${number(budget.retained)}，合计 ${number(p.energy)} 千焦`}
          >
            {[...budget.diverted, budget.retained].map((value, i) => (
              <span key={i} style={{ width: `${(value / p.energy) * 100}%` }} />
            ))}
          </div>
          <div className="energy-accounts">
            {[...budget.diverted, budget.retained].map((value, i) => (
              <div key={i}>
                <span>
                  {
                    [
                      "① 草→兔，未沿此链传递",
                      "② 兔→狐，未沿此链传递",
                      "③ 狐获得的能量",
                    ][i]
                  }
                </span>
                <strong>{number(value)} kJ</strong>
              </div>
            ))}
          </div>
          <p>
            {number(budget.diverted[0])} + {number(budget.diverted[1])} +{" "}
            {number(budget.retained)} = {number(p.energy)} kJ
          </p>
          <small>
            未传递部分包含呼吸散失、碎屑途径及暂留本级等，本模型没有进一步分配这些份额；不能全部画成热损失。
          </small>
        </div>
      )}
      <div className="energy-actions">
        <button
          aria-pressed={playing}
          onClick={() => {
            if (playing) setPlaying(false);
            else {
              setStep(0);
              setPlaying(true);
              setLedger(false);
            }
          }}
        >
          {playing ? "暂停演示" : "逐级演示"}
        </button>
        <button
          disabled={step === 2}
          onClick={() => {
            setPlaying(false);
            setStep(step + 1);
          }}
        >
          下一营养级 →
        </button>
        <button
          onClick={() => {
            setPlaying(false);
            setStep(0);
            setLedger(false);
          }}
        >
          回到生产者
        </button>
        <span>动画展示传递顺序，不表示真实生态时间。</span>
      </div>
      {chapter === 4 && <EnergyPathways p={p} />}
      {chapter >= 1 && (
        <EnergyComparison p={p} onCapture={() => setPlaying(false)} />
      )}
      <p className="energy-boundary">
        草—兔—狐为简化食物链示意，插图大小不表示个体大小、数量或生物量。固定时间、固定范围内的能量账本。统一效率为教学假设；分解者利用碎屑中的能量，不能把能量循环送回生产者。物质循环与能量流动需要区分。
      </p>
    </section>
  );
}
