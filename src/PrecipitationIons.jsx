import React from "react";
import { precipitate } from "./advancedModels.mjs";
import "./PrecipitationIons.css";
export function precipitationInventory(p, t) {
  const q = precipitate(p, t),
    sulfate = p.copper * 0.1,
    sodium = q.delivered * 0.2;
  return {
    ...q,
    sulfate,
    sodium,
    positive: 2 * q.cu + sodium,
    negative: q.oh + 2 * sulfate,
  };
}
export default function PrecipitationIons({ p, t }) {
  const q = precipitationInventory(p, t);
  const scale = Math.max(0.1, p.copper * 0.1, p.base * 0.2);
  const ions = [
    ["Cu²⁺", "剩余铜离子", q.cu, false],
    ["OH⁻", "剩余氢氧根", q.oh, false],
    ["Na⁺", "钠离子", q.sodium, true],
    ["SO₄²⁻", "硫酸根离子", q.sulfate, true],
  ];
  return (
    <section className="precipitation-ions" aria-label="溶液离子与沉淀去向">
      <header>
        <h3>无色，不等于没有溶质</h3>
        <span>物质的量 · mmol</span>
      </header>
      <p>
        反应离子进入固体；旁观离子留在溶液中。条长使用同一量程，表示物质的量，不表示浓度或真实粒子数量。
      </p>
      <div className="ion-inventory">
        {ions.map(([formula, label, value, spectator]) => (
          <div key={formula} className="ion-inventory-row">
            <div>
              <strong>{formula}</strong>
              <span>
                {label} · {spectator ? "旁观离子" : "反应离子"}
              </span>
              <output aria-label={`${label}物质的量`}>
                {value.toFixed(2)} mmol
              </output>
            </div>
            <div className="ion-amount-track" aria-hidden="true">
              <span
                style={{
                  width: `${(value / scale) * 100}%`,
                  background: spectator
                    ? "var(--ui-muted)"
                    : "var(--ui-primary)",
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="ion-solid">
        <span>固相 · Cu(OH)₂</span>
        <strong>
          {q.solid.toFixed(2)} mmol / {q.mass.toFixed(3)} g
        </strong>
        <p>
          {t >= 8
            ? "滴加已结束。继续静置只改变颗粒分布，固体总量保持不变。"
            : "滴加过程中，根据铜离子与氢氧根的投入量计算生成的固体。"}
        </p>
      </div>
      <details>
        <summary>核对离子去向与电荷守恒</summary>
        <p>
          Cu：{(p.copper * 0.1).toFixed(2)} = 溶液中 {q.cu.toFixed(2)} + 沉淀中{" "}
          {q.solid.toFixed(2)} mmol。
        </p>
        <p>
          OH⁻ 投入：{(q.delivered * 0.2).toFixed(2)} = 剩余 {q.oh.toFixed(2)} +
          生成固体所消耗 {(2 * q.solid).toFixed(2)} mmol。
        </p>
        <p>
          溶液电荷当量：2n(Cu²⁺) + n(Na⁺) = {q.positive.toFixed(2)}；n(OH⁻) +
          2n(SO₄²⁻) = {q.negative.toFixed(2)}。单位为 mmol
          基元电荷，沉淀整体电中性。
        </p>
        <p>
          采用完全反应近似，忽略微量溶解、水的自解离、水解及络合；零读数表示模型忽略的微量，不等于实际溶液中绝对不存在。
        </p>
      </details>
    </section>
  );
}
