import React, { useEffect, useState } from "react";
import "./EnergyDepthStudy.css";
const fmt = (n) => n.toLocaleString("zh-CN", { maximumFractionDigits: 4 });
export function energyAtLevel(energy, efficiency, level) {
  return energy * (efficiency / 100) ** (level - 1);
}
export default function EnergyDepthStudy({ p }) {
  const [depth, setDepth] = useState(3),
    [playing, setPlaying] = useState(false);
  useEffect(() => {
    setPlaying(false);
  }, [p.energy, p.eff]);
  useEffect(() => {
    if (!playing || depth === 5) return;
    const timer = setInterval(() => {
      if (!document.hidden) setDepth((d) => Math.min(5, d + 1));
    }, 1600);
    return () => clearInterval(timer);
  }, [playing, depth]);
  useEffect(() => {
    if (depth === 5) setPlaying(false);
  }, [depth]);
  const last = energyAtLevel(p.energy, p.eff, depth),
    before = energyAtLevel(p.energy, p.eff, depth - 1);
  return (
    <section className="energy-depth-study" aria-label="食物链长度探究">
      <header>
        <span>生态学 · 延长一次传递</span>
        <h2>多一个营养级，末级能量还剩多少？</h2>
        <p>
          固定同一时间与范围，生产者固定能量 {fmt(p.energy)}{" "}
          kJ；每次传递效率均假设为 {p.eff}%。
        </p>
      </header>
      <div
        className="energy-depth-actions"
        role="group"
        aria-label="选择营养级数"
      >
        {[2, 3, 4, 5].map((n) => (
          <button
            key={n}
            aria-pressed={depth === n}
            onClick={() => {
              setPlaying(false);
              setDepth(n);
            }}
          >
            {n} 个营养级
          </button>
        ))}
        <button
          aria-pressed={playing}
          onClick={() => {
            if (playing) setPlaying(false);
            else {
              setDepth(2);
              setPlaying(true);
            }
          }}
        >
          {playing ? "暂停延长" : "逐级延长"}
        </button>
      </div>
      <ol className="energy-depth-levels">
        {Array.from({ length: depth }, (_, i) => {
          const value = energyAtLevel(p.energy, p.eff, i + 1),
            percent = (100 * value) / p.energy;
          return (
            <li key={i} aria-current={i === depth - 1 ? "step" : undefined}>
              <div className="energy-depth-node">{i + 1}</div>
              <div className="energy-depth-content">
                <div>
                  <strong>{i === 0 ? "生产者" : `第 ${i} 级消费者`}</strong>
                  <b>{fmt(value)} kJ</b>
                </div>
                <div className="energy-depth-track" aria-hidden="true">
                  <i style={{ width: `${percent}%` }} />
                </div>
                <span>
                  占起点 {fmt(percent)}%
                  {i > 0 ? ` · 第 ${i} 次传递` : " · 尚未经过传递"}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
      <p>
        所有条形共用起点能量作为满刻度，小份额可能细至难以辨认，请同时读取数值；不能把各级能量相加作为总能量。
      </p>
      <div className="energy-depth-result" aria-live="polite">
        <span>
          {depth} 个营养级 · {depth - 1} 次传递
        </span>
        <strong>{fmt(last)} kJ</strong>
        <p>
          {fmt(p.energy)} × ({p.eff}%)<sup>{depth - 1}</sup> = {fmt(last)} kJ
        </p>
      </div>
      <div className="energy-depth-detail">
        <h3>放大最后一个传递环节</h3>
        <p>
          {fmt(before)} kJ 中，{fmt(last)} kJ 进入末级；其余{" "}
          {fmt(before - last)} kJ 未沿这条摄食链继续传递。
        </p>
        <div
          className="energy-depth-split"
          role="img"
          aria-label={`最后一环节：传递${p.eff}%，未沿此链传递${100 - p.eff}%`}
        >
          <i style={{ width: `${p.eff}%` }} />
          <span />
        </div>
        <p>
          绿色：传递 {p.eff}% · 其余：未沿此链传递 {100 - p.eff}
          %。此处把上一级能量重新放大为100%，不能与上方条长直接比较。
        </p>
      </div>
      <p>
        这里只延长抽象的营养级，不把草—兔—狐示例强行接到其他物种。模型不能据此预测个体数量或某生态系统能维持的最大链长。未传递部分包括呼吸散失及碎屑等途径，不全是热。
      </p>
      <p>
        “逐级延长”用于展示乘法次数，每1.6秒增加一级，不表示生物生长或生态时间；切换级数、改变右侧条件会暂停。
      </p>
    </section>
  );
}
