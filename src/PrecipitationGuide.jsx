import PrecipitationIons from "./PrecipitationIons.jsx";
import React from "react";
import { precipitate } from "./advancedModels.mjs";
import {
  dosingState,
  dosingTime,
  reactionTiming,
} from "./precipitationDosing.mjs";
import "./PrecipitationGuide.css";

export default function PrecipitationGuide({ p, t, onSeek, onChange }) {
  const q = precipitate(p, t);
  const dose = dosingState(p, t);
  const toEquivalence = dose.equivalence - dose.delivered;
  const phase = t <= 0 ? 0 : t < reactionTiming.end ? 1 : t < 20 ? 2 : 3;
  const status =
    q.cu > 1e-8
      ? "溶液仍含铜离子，呈蓝色；颜色随浓度定性变化。"
      : q.oh > 1e-8
        ? "铜离子已耗尽，氢氧根过量；上清液无色，沉淀不再增加。"
        : "铜离子与氢氧根恰好反应；静置后观察无色上清液和蓝色沉淀。";
  return (
    <section className="precipitation-guide" aria-label="沉淀反应阶段对照">
      <div className="reaction-phase-heading">
        <strong>
          {p.base <= 0
            ? "尚未准备 NaOH · 当前不会发生沉淀反应"
            : t > 0 && t < reactionTiming.firstImpact
              ? "首滴下落 · 尚未到达溶液"
              : ["准备观察", "滴加中途", "滴加完成 · 观察沉降", "静置观察终点"][
                  phase
                ]}
        </strong>
        <span>
          已加入 {q.delivered.toFixed(1)} / {p.base} mL NaOH
        </span>
      </div>
      <p>
        {p.base <= 0
          ? "请在右侧将 NaOH 体积设为大于 0 mL，再开始滴加。烧杯中的硫酸铜保持原状态。"
          : "点击三维滴加器的蓝色旋塞可开始或暂停滴加；也可使用播放按钮。试剂加完后旋塞关闭，沉降仍可继续观察。"}
      </p>
      <div className="reaction-phase-buttons" aria-label="选择观察阶段">
        {[
          [0, "滴加前"],
          [reactionTiming.end, "滴加完成"],
          [20, "静置观察"],
        ].map(([time, text]) => (
          <button
            key={time}
            disabled={p.base <= 0 && time > 0}
            aria-pressed={Math.abs(t - time) < 1e-8}
            onClick={() => onSeek(time)}
          >
            {text}
          </button>
        ))}
      </div>
      <fieldset className="reaction-dose-controls">
        <legend>逐量观察 · NaOH 加入量</legend>
        <label htmlFor="reaction-dose">
          已加入 <strong>{dose.delivered.toFixed(1)} mL</strong>
        </label>
        <div className="reaction-dose-readout" aria-label="试剂余量与反应点">
          <span>
            滴加器剩余 <strong>{dose.remaining.toFixed(1)} mL</strong>
          </span>
          <span>
            {Math.abs(toEquivalence) < 1e-8
              ? "已到恰好反应点"
              : toEquivalence > 0
                ? "距恰好还需"
                : "已超过恰好点"}
            {Math.abs(toEquivalence) >= 1e-8 && (
              <strong> {Math.abs(toEquivalence).toFixed(1)} mL</strong>
            )}
          </span>
        </div>
        <div className="reaction-dose-slider">
          <input
            id="reaction-dose"
            aria-label="NaOH 已加入体积"
            type="range"
            min="0"
            max={Math.max(1, p.base)}
            step="0.1"
            value={dose.delivered}
            disabled={p.base <= 0}
            style={{
              "--range-progress": `${p.base > 0 ? (dose.delivered / p.base) * 100 : 0}%`,
            }}
            onChange={(event) =>
              onSeek(dosingTime(Number(event.target.value), p.base))
            }
          />
          {dose.canReachEquivalence && (
            <span
              className="reaction-equivalence-tick"
              aria-hidden="true"
              style={{
                left: `calc(11px + (100% - 22px) * ${dose.equivalence / p.base})`,
              }}
            />
          )}
        </div>
        {dose.canReachEquivalence && (
          <small className="reaction-scale-key">
            刻线：恰好反应 {dose.equivalence} mL
          </small>
        )}
        <div className="reaction-phase-buttons">
          <button
            aria-pressed={p.volumeGuide === 1}
            onClick={() =>
              onChange?.("volumeGuide", p.volumeGuide === 1 ? 0 : 1)
            }
          >
            {p.volumeGuide === 1 ? "隐藏液面读数" : "显示液面读数"}
          </button>
          {(dose.remaining > 0 && dose.remaining <= 1 ? [1] : [1, 5]).map(
            (amount) => (
              <button
                key={amount}
                disabled={dose.remaining < 1e-8}
                onClick={() =>
                  onSeek(dosingTime(dose.delivered + amount, p.base))
                }
              >
                {dose.remaining > 1e-8 && dose.remaining < amount
                  ? `加入剩余 ${dose.remaining.toFixed(1)} mL`
                  : `再加 ${amount} mL`}
              </button>
            ),
          )}
          <button
            disabled={!dose.canReachEquivalence}
            onClick={() => onSeek(dosingTime(dose.equivalence, p.base))}
          >
            到恰好反应点
          </button>
        </div>
        <small>
          烧杯刻度用于粗略估读；选择“平视液面”可减少视差，俯视时不要用液面后沿对照前壁刻度。
          总体积按混合体积可加和估算，辅助读数不是烧杯的测量精度。
        </small>
        <small>
          {dose.canReachEquivalence
            ? `本组浓度下，加入 ${dose.equivalence} mL NaOH 恰好反应。`
            : `恰好反应需 ${dose.equivalence} mL NaOH，超过当前准备的 ${p.base} mL。`}{" "}
          拖动可回看；单次加入不超过剩余量，操作后暂停。
        </small>
      </fieldset>
      <p>{status}</p>
      {p.volumeGuide === 1 && (
        <p>
          金色线表示总体积 {(p.copper + q.delivered).toFixed(1)} mL
          所对应的水平面；烧杯刻度用于粗略估量，辅助数值来自教学模型。
        </p>
      )}
      <PrecipitationIons p={p} t={t} />

      <small>时间为教学演示进度；颗粒沉降不代表真实反应或沉降速率。</small>
    </section>
  );
}
