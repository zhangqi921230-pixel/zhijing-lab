import React, { useState } from "react";
import { trophicBudget } from "./trophicBudget.mjs";
import Button from "./LabButton.jsx";
import "./EnergyComparison.css";
const fmt = (n) => Number(n.toFixed(2)).toLocaleString("zh-CN");
export default function EnergyComparison({ p, onCapture }) {
  const [reference, setReference] = useState(null),
    current = trophicBudget(p.energy, p.eff),
    before = reference && trophicBudget(reference.energy, reference.eff);
  return (
    <section className="energy-comparison" aria-label="两组食物链能量对照">
      <header>
        <h3>保留一组，再改变一个条件</h3>
        <Button
          onClick={() => {
            onCapture?.();
            setReference({ energy: p.energy, eff: p.eff });
          }}
        >
          {reference ? "用当前条件更新参照" : "保留当前条件为参照"}
        </Button>
      </header>
      {!reference ? (
        <p>
          先保留起点能量与效率，再调整右侧参数。两组结果并排呈现，便于判断改变输入或效率的不同影响。
        </p>
      ) : (
        <>
          <p>
            参照 A：{fmt(reference.energy)} kJ · {reference.eff}%；当前 B：
            {fmt(p.energy)} kJ · {p.eff}%。参照只保留在本节，离开后清除。
          </p>
          <div className="energy-comparison-rows">
            {["生产者", "初级消费者", "次级消费者"].map((name, i) => {
              const a = before.levels[i],
                b = current.levels[i],
                max = Math.max(a, b, 1);
              return (
                <div className="energy-comparison-row" key={name}>
                  <strong>{name}</strong>
                  <div>
                    {[
                      ["A", a],
                      ["B", b],
                    ].map(([label, value]) => (
                      <div className="energy-compare-bar" key={label}>
                        <span>{label}</span>
                        <div>
                          <i style={{ width: `${(100 * value) / max}%` }} />
                        </div>
                        <b>{fmt(value)} kJ</b>
                      </div>
                    ))}
                  </div>
                  <span>
                    B/A：{a ? fmt(b / a) : "无法计算"}
                    {a ? " 倍" : ""}
                    <small>
                      差额 {b >= a ? "+" : ""}
                      {fmt(b - a)} kJ
                    </small>
                  </span>
                </div>
              );
            })}
          </div>
          <p>
            每行的 A、B
            条共用量程，不同行分别缩放；不能用跨行条长比较营养级能量。三级数值是连续传递过程，不能相加作为总能量。
          </p>
          <strong>
            {p.energy === reference.energy && p.eff !== reference.eff
              ? `输入不变，效率比为 ${fmt(p.eff / reference.eff)}，末级能量比为效率比的平方。`
              : p.eff === reference.eff
                ? "效率不变时，起点能量变为几倍，各级能量也变为相同倍数。"
                : "两个条件同时改变，末级能量比 = 输入能量比 × 效率比²。"}
          </strong>
        </>
      )}
    </section>
  );
}
