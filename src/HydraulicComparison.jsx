import React from "react";
import Button from "./LabButton.jsx";
import { hydraulicState } from "./discoveryModels.mjs";
import "./HydraulicComparison.css";
export default function HydraulicComparison({ p, time, onCompare }) {
  const q = hydraulicState(p, time);
  const rows = [
    {
      name: "力",
      unit: "N",
      values: [p.force, q.outputForce],
      note: `输出力是输入力的 ${p.ratio} 倍。`,
    },
    {
      name: "位移",
      unit: "cm",
      values: [q.distance, q.outputDistance],
      note:
        time === 0
          ? "还没有移动；先播放或查看完整行程。"
          : `输出位移是输入位移的 1/${p.ratio}。`,
    },
    {
      name: "机械功",
      unit: "J",
      values: [q.work, q.work],
      note: "理想情况下输入功与输出功相等。",
    },
  ];
  return (
    <section className="hydraulic-comparison" aria-label="液压机两端定量对照">
      <h3>力变大了，距离去了哪里？</h3>
      <p>
        同一行的两条柱使用相同刻度；不同行单位不同，不能跨行比较长度。位移和功按完整行程固定刻度，随活塞运动逐渐增长。
      </p>
      <div className="hydraulic-comparison-grid">
        {rows.map((row) => {
          const max =
            row.name === "位移"
              ? p.stroke
              : row.name === "机械功"
                ? (p.force * p.stroke) / 100
                : p.force * p.ratio;
          return (
            <div className="hydraulic-comparison-row" key={row.name}>
              <h4>{row.name}</h4>
              {row.values.map((value, i) => (
                <div className="hydraulic-bar" key={i}>
                  <div>
                    <span>
                      {i === 0 ? "输入端 · 小活塞" : "输出端 · 大活塞"}
                    </span>
                    <strong>
                      {Number(value.toFixed(3))} {row.unit}
                    </strong>
                  </div>
                  <div className="hydraulic-bar-track" aria-hidden="true">
                    <span
                      data-side={i}
                      style={{ width: `${(value / max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
              <p>{row.note}</p>
            </div>
          );
        })}
      </div>
      <div
        className="hydraulic-ratio-choice"
        role="group"
        aria-label="完整行程面积比对照"
      >
        <strong>保持施力与目标行程，查看完整行程：</strong>
        {[1, 2, 4, 8].map((ratio) => (
          <Button
            key={ratio}
            primary={p.ratio === ratio && time === 6}
            aria-pressed={p.ratio === ratio && time === 6}
            onClick={() => onCompare(ratio)}
          >
            面积比 {ratio}∶1
          </Button>
        ))}
      </div>
      <p className="hydraulic-balance">
        输入 {p.force} N × {(q.distance / 100).toFixed(3)} m ≈ 输出{" "}
        {q.outputForce} N × {(q.outputDistance / 100).toFixed(4)} m ={" "}
        {q.work.toFixed(3)} J
      </p>
      <details>
        <summary>为什么现实液压机的输出功会更少？</summary>
        <p>
          密封摩擦、液体黏性阻力和泄漏会消耗或分流输入能量；实际效率低于理想值。本演示只比较理想准静态关系，不能用柱形图估计真实装置效率。缸宽按面积示意，力箭头只表示方向，定量大小以本图与数值为准。
        </p>
      </details>
    </section>
  );
}
