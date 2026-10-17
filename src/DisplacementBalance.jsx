import React from "react";
import { displacementState } from "./chemistryTopics.mjs";
import "./DisplacementBalance.css";
export function displacementBalance(metal, mass, progress) {
  const q = displacementState(metal, mass, progress);
  const molar = metal === "zinc" ? 65.38 : metal === "copper" ? 63.546 : 55.845;
  return {
    ...q,
    initialMetal: mass / molar,
    remainingMetal: mass / molar - q.extent,
    dissolvedMass: q.extent * molar,
    solidMass: mass - q.extent * molar + q.copper,
  };
}
export default function DisplacementBalance({ p, time, onPrepare, onEnd }) {
  const q = displacementBalance(p.metal, p.mass, time / 60),
    name = p.metal === "iron" ? "铁" : p.metal === "zinc" ? "锌" : "铜";
  const scale = Math.max(0.01, q.initialMetal);
  const end = displacementBalance(p.metal, p.mass, 1),
    molar = p.metal === "zinc" ? 65.38 : p.metal === "copper" ? 63.546 : 55.845;
  const balanced = Math.abs(end.initialMetal - 0.01) < 1e-9;
  const rows = [
    ["溶液中原有铜", q.remaining, q.extent, "仍为 Cu²⁺", "已析出为铜"],
    [`原有${name}片`, q.remainingMetal, q.extent, "仍为原金属", "已进入溶液"],
  ];
  return (
    <section className="displacement-balance" aria-label="置换反应物质去向">
      <header>
        <div>
          <small>宏观现象背后的粒子交换</small>
          <h3>每析出一份铜，谁进入了溶液？</h3>
        </div>
        <strong>
          {p.metal === "copper" ? "没有净交换" : `${name}原子 : Cu²⁺ = 1 : 1`}
        </strong>
      </header>
      {rows.map(([title, remaining, converted, a, b]) => (
        <div className="displacement-row" key={title}>
          <strong>{title}</strong>
          <div
            className="displacement-track"
            role="img"
            aria-label={`${a} ${(remaining * 1000).toFixed(2)} mmol；${b} ${(converted * 1000).toFixed(2)} mmol`}
          >
            <i style={{ width: `${(remaining / scale) * 100}%` }} />
            <i style={{ width: `${(converted / scale) * 100}%` }} />
          </div>
          <p>
            {a} {(remaining * 1000).toFixed(2)} mmol · {b}{" "}
            {(converted * 1000).toFixed(2)} mmol
          </p>
        </div>
      ))}
      <p>
        两行使用同一数量标尺，整条背景代表 {(scale * 1000).toFixed(2)}{" "}
        mmol。硫酸根未参加净离子反应；颜色段表示物质去向，不表示真实粒子大小。
      </p>
      <dl>
        <div>
          <dt>金属溶解质量</dt>
          <dd>{q.dissolvedMass.toFixed(3)} g</dd>
        </div>
        <div>
          <dt>铜析出质量</dt>
          <dd>{q.copper.toFixed(3)} g</dd>
        </div>
        <div>
          <dt>固体总质量变化</dt>
          <dd>
            {q.solidMass - p.mass >= 0 ? "+" : ""}
            {(q.solidMass - p.mass).toFixed(3)} g
          </dd>
        </div>
      </dl>
      <p>
        质量变化按原金属与全部析出铜的总和计算，假定铜全部保留、固体洗净并干燥，不计附着溶液。1
        : 1 是物质的量关系，不是质量相等；动画进度不代表真实反应速率。
      </p>
      {onPrepare && (
        <section
          className="displacement-limit"
          aria-label="限制反应物与终点预测"
        >
          <h3>谁先用完，反应就停在哪里</h3>
          <p>
            当前投入{name} {(end.initialMetal * 1000).toFixed(3)}{" "}
            mmol，溶液初始含Cu²⁺ 10.000
            mmol。下列为完全反应的预测，上方条带仍显示当前动画进度。
          </p>
          <p>
            <strong>
              {p.metal === "copper"
                ? "铜片与铜离子没有净置换，不能按较少的一方预测反应。"
                : balanced
                  ? "恰好配比：两种反应物同时用完。"
                  : end.initialMetal < 0.01
                    ? `${name}不足：金属先用完，溶液仍有铜离子。`
                    : `铜离子不足：铜离子先用完，原金属有剩余。`}
            </strong>
          </p>
          <dl>
            <div>
              <dt>预计析出铜</dt>
              <dd>{end.copper.toFixed(3)} g</dd>
            </div>
            <div>
              <dt>预计剩余Cu²⁺</dt>
              <dd>{(end.remaining * 1000).toFixed(3)} mmol</dd>
            </div>
            <div>
              <dt>预计剩余原金属</dt>
              <dd>{(end.remainingMetal * 1000).toFixed(3)} mmol</dd>
            </div>
          </dl>
          <div className="displacement-limit-actions">
            {[5, 10, 15].map((n) => (
              <button key={n} onClick={() => onPrepare((n * molar) / 1000)}>
                准备{n} mmol {name} · {((n * molar) / 1000).toFixed(5)} g
              </button>
            ))}
            <button onClick={onEnd}>查看完全反应终点</button>
          </div>
          <p>
            准备按钮按精确物质的量设置质量，并回到起点暂停；质量滑块微调后可能离开恰好配比。比较铁和锌时，可分别准备10
            mmol：两者需要的质量不同，但在本模型中都恰好置换10
            mmol铜。这里比较反应总量，不比较真实反应速度。
          </p>
        </section>
      )}
    </section>
  );
}
