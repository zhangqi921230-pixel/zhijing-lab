import CommunityAbundance from "./CommunityAbundance.jsx";
import React, { useState } from "react";
import { biodiversity } from "./advancedModels.mjs";
import "./CommunityComparison.css";
const groups = [
  ["plants", "植物"],
  ["insects", "昆虫"],
  ["birds", "鸟类"],
  ["fungi", "真菌"],
];
function Composition({ p, label }) {
  const q = biodiversity(p);
  return (
    <div className="community-sample">
      <strong>{label}</strong>
      <div
        className="community-stripe"
        role="img"
        aria-label={groups.map(([key, name]) => `${name}${p[key]}`).join("，")}
      >
        {groups.map(([key, name], i) => (
          <span
            key={key}
            className={`community-color-${i}`}
            style={{ width: `${q.total ? (p[key] / q.total) * 100 : 0}%` }}
            title={`${name} ${p[key]}`}
          />
        ))}
      </div>
      {!q.total && (
        <p>当前样方没有计数，比例尚未定义；空条不表示某一示例种占100%。</p>
      )}
      <dl>
        {groups.map(([key, name], i) => (
          <div key={key}>
            <dt>
              <i className={`community-color-${i}`} />
              {name}
            </dt>
            <dd>
              {p[key]}{" "}
              <small>
                ({q.total ? ((p[key] / q.total) * 100).toFixed(1) : "0.0"}%)
              </small>
            </dd>
          </div>
        ))}
      </dl>
      <div className="community-metrics">
        <span>
          计数合计 <b>{q.total}</b>
        </span>
        <span>
          示例种数 <b>{q.richness}</b>
        </span>
        <span>
          H′ <b>{q.diversity.toFixed(3)}</b>
        </span>
      </div>
    </div>
  );
}
export default function CommunityComparison({ p }) {
  const [reference, setReference] = useState(null);
  const q = biodiversity(p),
    r = reference ? biodiversity(reference) : null;
  return (
    <section className="community-comparison" aria-label="样方组成与对照">
      <header>
        <strong>样方组成 · 看数量，也看比例</strong>
        <span>四个假想示例种</span>
      </header>
      <div className="community-pair">
        {reference && <Composition p={reference} label="A · 保留对照" />}
        <Composition p={p} label="B · 当前样方" />
      </div>
      <div className="community-actions">
        <button
          onClick={() =>
            setReference(
              Object.fromEntries(groups.map(([key]) => [key, p[key]])),
            )
          }
        >
          保存当前为 A 对照
        </button>
        {reference && (
          <button onClick={() => setReference(null)}>移除 A 对照</button>
        )}
      </div>
      <CommunityAbundance p={p} reference={reference} groups={groups} />
      {reference && (
        <>
          <p className="community-difference">
            B 相对 A：计数 {q.total - r.total >= 0 ? "+" : ""}
            {q.total - r.total}，示例种数{" "}
            {q.richness - r.richness >= 0 ? "+" : ""}
            {q.richness - r.richness}，H′ 差值{" "}
            {(q.diversity - r.diversity).toFixed(3)}。
          </p>
        </>
      )}
      <p>
        比例条长度表示计数占比，不是生物量。H′
        使用自然对数；它不能单独证明生态系统更健康或更稳定。
      </p>
      <details>
        <summary>清点方法与模型边界</summary>
        <p>
          先用“俯视清点”核对数量，再调节右侧计数。保留 A 后逐项改变计数，比较
          B。一键情境和重做本节保留 A；切换章节或复位会移除临时对照。
        </p>
        <p>
          植物、昆虫、鸟和真菌在这里各代表一个假想物种。真菌图示计的是子实体，真实调查不能直接当作独立个体。本模型不是对现实一平方米群落的抽样估计。
        </p>
      </details>
    </section>
  );
}
