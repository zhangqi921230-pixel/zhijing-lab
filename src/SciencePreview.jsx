import React from "react";
import SvgScene from "./SvgScene.jsx";
import { lessons } from "./lessons.mjs";
import { ChemistryScene } from "./ChemistryLab.jsx";
import { chemistryTopics } from "./chemistryTopics.mjs";
import { chemistryDuration } from "./chemistrySession.mjs";
import { previewParameters, previewCycle } from "./previewCatalog.mjs";
import usePreviewClock from "./usePreviewClock.js";
import { binomial, gasState } from "./explorationModels.mjs";
import { gasParticles, gasParticleState } from "./gasParticles.mjs";

const defaults = Object.fromEntries(
  lessons.map((l) => [
    l.id,
    Object.fromEntries(l.params.map((p) => [p.key, p.value])),
  ]),
);
export function SciencePreviewFrame({ id, time }) {
  const u = previewCycle(time),
    p = previewParameters(id, defaults[id] || {}, time);
  const chemistry = chemistryTopics.find((l) => l.id === id);
  if (chemistry)
    return (
      <ChemistryScene
        id={id}
        p={{
          ...chemistry.chapters[0].preset,
          ...(id === "flame"
            ? {
                sample: ["sodium", "lithium", "potassium", "copper"][
                  Math.floor(time / 3) % 4
                ],
              }
            : {}),
        }}
        time={((time % 12) / 12) * chemistryDuration(id)}
        running
        labels
      />
    );
  if (["probability", "gas", "waves", "buoyancy"].includes(id))
    return <PreviewDiagram id={id} time={time} u={u} />;
  return <SvgScene id={id} p={p} t={time % 5} diagramOnly />;
}
function PreviewDiagram({ id, time, u }) {
  let body, title;
  if (id === "probability") {
    const p = 0.15 + 0.7 * u,
      values = binomial(6, p);
    title = "概率改变，分布向哪边移动？";
    body = (
      <>
        <path d="M110 150V460H810" stroke="var(--ui-ink)" fill="none" />
        {[0, 0.1, 0.2, 0.3, 0.4].map((v) => (
          <g key={v}>
            <path d={`M110 ${460 - v * 650}H810`} stroke="var(--ui-line)" />
            <text x="95" y={467 - v * 650} textAnchor="end">
              {v.toFixed(1)}
            </text>
          </g>
        ))}
        {values.map((v, i) => (
          <g key={i}>
            <rect
              x={140 + i * 90}
              y={460 - v * 650}
              width="55"
              height={v * 650}
              fill="var(--ui-primary)"
            />
            <text x={167 + i * 90} y="491" textAnchor="middle">
              {i}
            </text>
          </g>
        ))}
        <text x="110" y="115">
          每组6次 · 正面概率 p = {p.toFixed(2)}
        </text>
        <text x="110" y="540">
          理论概率分布 · 横轴：正面次数 · 纵轴：概率（0–0.4）
        </text>
      </>
    );
  } else if (id === "gas") {
    const p = { volume: 25, temperature: 300, amount: 1 },
      q = gasState(p);
    title = "分子持续运动，碰壁改变方向";
    body = (
      <>
        <rect
          x="180"
          y="145"
          width="230"
          height="230"
          rx="5"
          fill="var(--ui-surface)"
          stroke="var(--ui-ink)"
          strokeWidth="4"
        />
        {gasParticles.map((v, i) => {
          const r = gasParticleState(p, time, v);
          return (
            <circle key={i} cx={r.x} cy={r.y} r="4" fill="var(--ui-primary)" />
          );
        })}
        <text x="470" y="240">
          T = 300 K
        </text>
        <text x="470" y="290">
          V = 25 L
        </text>
        <text x="470" y="340">
          P = {q.pressure.toFixed(1)} kPa
        </text>
        <text x="110" y="505">
          PV = nRT · 粒子大小、数量与速度为示意
        </text>
      </>
    );
  } else if (id === "waves") {
    title = "波形向前，质点上下振动";
    const y = (x) => 285 - 65 * Math.sin(2 * Math.PI * (x / 320 - time * 0.5));
    body = (
      <>
        <path d="M60 285H840" stroke="var(--ui-line)" />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
          <path key={i} d={`M${60 + i * 65} 180V390`} stroke="var(--ui-line)" />
        ))}
        <path
          d={Array.from(
            { length: 161 },
            (_, i) => `${i ? "L" : "M"}${60 + i * 4.8} ${y(i * 4.8)}`,
          ).join(" ")}
          stroke="var(--ui-primary)"
          strokeWidth="4"
          fill="none"
        />
        <circle cx="450" cy={y(390)} r="9" fill="var(--ui-gold)" />
        <text x="110" y="470">
          金色质点横坐标不变 · 向右传播的正弦行波
        </text>
      </>
    );
  } else {
    title = "浸入越深，排开液体越多";
    body = (
      <>
        <path
          d="M180 135V445H720V135"
          fill="none"
          stroke="var(--ui-ink)"
          strokeWidth="4"
        />
        <rect
          x="184"
          y="265"
          width="532"
          height="176"
          fill="#438ad0"
          opacity=".2"
        />
        <rect
          x="370"
          y={145 + 120 * u}
          width="120"
          height="120"
          fill="var(--ui-gold)"
          fillOpacity=".5"
          stroke="var(--ui-gold)"
        />
        <path d="M180 265H720" stroke="#438ad0" />
        <text x="110" y="500">
          浸入比例 {(100 * u).toFixed(0)}% · 排水体积 {u.toFixed(2)} L
        </text>
        <text x="110" y="540">
          F浮 = ρ液gV排 · 物体由外部缓慢放下，非自由沉浮
        </text>
      </>
    );
  }
  return (
    <svg
      className="preview-diagram"
      viewBox="0 0 900 580"
      role="img"
      aria-label={title}
    >
      <text x="40" y="55" className="preview-diagram-title">
        {title}
      </text>
      {body}
    </svg>
  );
}
export default function SciencePreview({ id, playing = true }) {
  const time = usePreviewClock(playing);
  return (
    <div className={`science-preview preview-${id}`}>
      <SciencePreviewFrame id={id} time={time} />
    </div>
  );
}
