import React from "react";
import { cubeStudy } from "./cubeStudy.mjs";
import { format } from "./models.mjs";
import "./CubeMeasureGuide.css";
export default function CubeMeasureGuide({ p, onChange }) {
  const q = cubeStudy(p);
  return (
    <section className="cube-measure" aria-label="正方体面积与体积观察">
      <div
        className="cube-study-modes"
        role="group"
        aria-label="正方体观察方式"
      >
        {["折叠纸板", "每面分格", "体积小方块"].map((s, i) => (
          <button
            key={s}
            aria-pressed={(p.detail ?? 0) === i}
            onClick={() => onChange("detail", i)}
          >
            {s}
          </button>
        ))}
      </div>
      {p.detail === 1 ? (
        <>
          <h3>
            6 个面，每面 {q.n} × {q.n} 个小正方形
          </h3>
          <div className="cube-measure-equation">
            共 {6 * q.perLayer} 格 · 表面积 {format(6 * p.edge * p.edge)} cm²
          </div>
          <p>
            小格边长 a/{q.n} ≈ {format(q.side, 4)} cm，单格面积约{" "}
            {format(q.cellArea, 4)} cm²。 6 × {q.n}² × (a/{q.n})² =
            6a²。折叠只改变朝向，不改变各面面积。
          </p>
        </>
      ) : p.detail === 2 ? (
        <>
          <h3>
            每层 {q.perLayer} 块，一共 {q.n} 层
          </h3>
          <div
            className="cube-layer-buttons"
            role="group"
            aria-label="逐层填充"
          >
            {Array.from({ length: q.n + 1 }, (_, i) => (
              <button
                key={i}
                aria-pressed={q.count === i * q.perLayer}
                onClick={() => onChange("fill", (100 * i) / q.n)}
              >
                {i === 0 ? "清空" : `填到第 ${i} 层`}
              </button>
            ))}
          </div>
          <div className="cube-measure-equation">
            已填 {q.count} / {q.total} 块 · 对应体积 {format(q.filledVolume)}{" "}
            cm³
          </div>
          <p>
            {q.fullLayers} 个完整层{q.partial ? `，再加 ${q.partial} 块` : ""}
            。每个小方块边长 {format(q.side)} cm、体积 {format(q.cellVolume, 4)}{" "}
            cm³；填满后是 a³ = {format(p.edge ** 3)} cm³。
          </p>
          <small>
            读数按显示位数取近似值。
            小方块之间的细缝仅用于辨认边界，计数按无缝填满的数学模型；外框保持归一化显示，不以屏幕大小判断实际棱长。
          </small>
        </>
      ) : (
        <p>先折叠追踪相对面，再切换分格或小方块，分别观察表面积与体积。</p>
      )}
    </section>
  );
}
