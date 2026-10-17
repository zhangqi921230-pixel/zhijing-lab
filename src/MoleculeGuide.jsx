import React from "react";
import { molecules } from "./moleculeGeometry.mjs";

export default function MoleculeGuide({ p, chapter }) {
  const m = molecules[p.type];

  return (
    <section className="micro-task" aria-label="分子结构解读">
      <strong>
        {m.formula} · {m.shape}
      </strong>
      <p>
        中心原子周围有 {m.domains} 个电子域、{m.pairs} 对孤电子对。
        {p.type === 1
          ? "每个双键计作一个电子域，两个方向相反，键角为 180°。"
          : "分子形状按原子核的位置命名；孤电子对不作为形状的顶点。"}
      </p>
      <p>
        {p.type === 3
          ? "三个氢原子构成底面，氮原子在底面上方。107.3° 是 H—N—H 键角，不是底面三角形的内角。"
          : p.type === 2
            ? "四个氢原子位于正四面体顶点，碳在内部。六组 H—C—H 键角均约 109.47°。"
            : p.type === 0
              ? "三个原子共面但不共线。两对孤电子对使键角偏离理想四面体角；此模型采用约 104.5°。"
              : "两个氧原子和中心碳原子共线；两根平行细棍表示一个双键。"}
      </p>
      {p.ensemble ? (
        <p>
          每个分子的组成与内部键角保持不变，只有整体位置和朝向变化。群体模式隐藏标注和辅助面；轨迹为示意，不能用来测量温度、密度或扩散速度。
        </p>
      ) : (
        <>
          {p.annotations !== 0 && (
            <p>金色弧线标示模型中的三维键角；旋转后屏幕上的投影角会改变。</p>
          )}
          {p.scaffold === 1 && (
            <p>辅助面只是连接原子位置的几何示意，不是实体表面或电子云。</p>
          )}
        </>
      )}
      {p.lonePairs === 1 && !p.ensemble && (
        <p>
          {m.pairs
            ? "紫色区域和成对圆点标记中心原子的孤电子对。位置与外形为 VSEPR 示意，不是实测电子云，也不表示电子静止在两个点上。"
            : "此分子的中心原子没有孤电子对；这里只标记中心原子，不展示外围原子的孤电子对。"}
        </p>
      )}
    </section>
  );
}
