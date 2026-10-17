import React from "react";
import VolcanoTimeline from "./VolcanoTimeline.jsx";
import { opticalState } from "./opticalModel.mjs";
import MicroscopeField from "./MicroscopeField.jsx";
import { rc, seismic, precipitate, incline } from "./advancedModels.mjs";
import { reactionTiming } from "./precipitationDosing.mjs";
const curve = (points) =>
  points
    .map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(2)},${p[1].toFixed(2)}`)
    .join(" ");
function Plot({ title, children }) {
  return (
    <div className="process-chart">
      <span>{title}</span>
      <svg viewBox="0 0 280 135" role="img" aria-label={title}>
        <path
          d="M26 12V112H265"
          stroke="currentColor"
          opacity=".35"
          fill="none"
        />
        {children}
      </svg>
    </div>
  );
}
export function AdvancedOverlay({
  id,
  view,
  p,
  t,
  onChange,
  specimenSelection,
  microChapter,
  onSeek,
}) {
  if (id === "lens") {
    const q = opticalState(p);
    return (
      <div className="advanced-caption">
        三维模式可拖动物体或光屏 · 彩线为光路辅助线
        <strong>
          {!q.illuminated
            ? "光源已关闭 · 光屏无亮像，参数仍可调整"
            : q.v === null
              ? "焦点处：无有限像"
              : q.v < 0
                ? "虚像不能承接在光屏上"
                : q.v > 80
                  ? `像距 ${q.v.toFixed(1)} cm · 超出光屏行程`
                  : q.focused
                    ? q.imageFitsScreen
                      ? "光屏已对焦 · 倒立实像"
                      : "光屏已对焦 · 像超出屏边，只能接收一部分"
                    : `移动光屏至 ${q.v.toFixed(1)} cm 观察清晰像`}
        </strong>
      </div>
    );
  }

  if (id === "microscope")
    return (
      <MicroscopeField
        p={p}
        t={t}
        onChange={onChange}
        specimenSelection={specimenSelection}
        chapter={microChapter}
      />
    );
  if (id === "earthquake") {
    const q = seismic(p, t),
      max = Math.max(25, q.ts + 5);
    return (
      <>
        <div className="seismic-console" aria-label="台站记录与时间对照">
          <Plot title="台站波形示意 · 非真实记录">
            <path
              d={curve(
                Array.from({ length: 601 }, (_, i) => {
                  const time = (i / 600) * Math.min(t, max);
                  const ageP = time - q.tp,
                    ageS = time - q.ts;
                  const amp =
                    (ageP > 0
                      ? Math.sin(ageP * 12) * 8 * Math.exp(-ageP * 0.15)
                      : 0) +
                    (ageS > 0
                      ? Math.sin(ageS * 15) * 22 * Math.exp(-ageS * 0.25)
                      : 0);
                  return [26 + (time / max) * 230, 65 - amp];
                }),
              )}
              fill="none"
              stroke="#74cbd0"
              strokeWidth="1.6"
            />
            <path
              d={`M${26 + (Math.min(t, max) / max) * 230} 30V110`}
              stroke="currentColor"
              opacity=".7"
            />
            {[
              [q.tp, "P"],
              [q.ts, "S"],
            ].map(([time, name]) => (
              <g key={name}>
                <path
                  d={`M${26 + (time / max) * 230} 30V110`}
                  stroke={name === "P" ? "#dcae69" : "#74cbd0"}
                  strokeDasharray="3 5"
                />
                <text
                  x={26 + (time / max) * 230}
                  y="22"
                  fill="currentColor"
                  fontSize="11"
                >
                  {name}
                </text>
              </g>
            ))}
            <text x="26" y="128" fill="currentColor" fontSize="10">
              0 s
            </text>
            <text
              x="260"
              y="128"
              textAnchor="end"
              fill="currentColor"
              fontSize="10"
            >
              {max.toFixed(1)} s
            </text>
            <text x="30" y="103" fill="currentColor" fontSize="10">
              {q.stage}
            </text>
          </Plot>
          <div
            className="seismic-arrivals"
            role="group"
            aria-label="地震波到时对照"
          >
            <span>
              当前 {t.toFixed(2)} s · 到时差 {(q.ts - q.tp).toFixed(2)} s
            </span>
            <button className="btn" onClick={() => onSeek?.(q.tp)}>
              P 波到站 · {q.tp.toFixed(2)} s
            </button>
            <button className="btn" onClick={() => onSeek?.((q.tp + q.ts) / 2)}>
              两次到站之间
            </button>
            <button className="btn" onClick={() => onSeek?.(q.ts)}>
              S 波到站 · {q.ts.toFixed(2)} s
            </button>
            <small>
              点击定位并暂停。游标右侧尚未记录；振幅和频率为示意，不用于判断震级。
            </small>
          </div>
        </div>
      </>
    );
  }
  if (id === "volcano")
    return (
      <>
        <VolcanoTimeline time={t} onSeek={onSeek} p={p} onChange={onChange} />
      </>
    );
  const captions = {
    conics: "蓝色：截平面 · 金色：交线 · α 半顶角 · θ 与水平面的夹角",
    capacitor:
      p.fieldLines === 1
        ? "电场透视 · 正极板 → 负极板，放电时方向不反转 · 亮度随电压减弱 · 忽略边缘效应，非粒子流动"
        : view === "selector"
          ? `换向开关 · 当前${p.mode ? "放电" : "充电"} · 点击绝缘手柄或刀片换向，保留电压并暂停`
          : view === "plates"
            ? p.chargeMarkers === 0
              ? "极板结构放大示意 · 电荷标记已隐藏 · 两块极板由绝缘夹座支撑，介质中没有导电电流"
              : "极板结构放大示意 · 金色标记为正电荷，蓝色为负电荷 · 介质中没有导电电流 · 数量非真实电荷个数"
            : `${p.trace === 1 ? "金色线：选通路径（非电流大小） · " : p.currentArrows === 0 ? "器材观察 · 电流箭头已隐藏 · " : "金色箭头：约定电流方向 · "}${p.mode ? "放电时电源正端支路断开" : "电源经电阻充电"} · 极板为放大示意`,
    plates: "箭头表示相对运动方向 · 金线为地表对照标记 · 时间与尺度夸张",
    solids: "相同底面和高度 · 水平截面按相似关系计算",
    incline:
      p.forces === 0
        ? "器材观察 · 三维箭头已隐藏，下方受力图保留"
        : "橙：重力　青：支持力　金：摩擦力　紫：挡板力",
    precipitation:
      p.base <= 0
        ? "未准备 NaOH · 当前无沉淀生成"
        : t <= 0
          ? "滴加前 · 观察硫酸铜溶液"
          : t <= reactionTiming.firstImpact
            ? "首滴下落 · 尚无可见沉淀"
            : precipitate(p, t).solid <= 0
              ? "当前投料无 Cu(OH)₂ 沉淀生成"
              : t < reactionTiming.end
                ? "滴加过程 · 蓝色 Cu(OH)₂ 絮团生成"
                : "滴加结束 · 静置观察蓝色絮团沉降（示意）",
    biodiversity: "四个示例物种 · 落叶、石子为环境背景，不计入个体数",
    volcano: "教学剖面 · 演示强度不代表灾害等级",
  };
  return captions[id] ? (
    <div className="advanced-caption">
      {captions[id]}
      {id === "precipitation" && (
        <strong>已加液 {precipitate(p, t).delivered.toFixed(1)} mL</strong>
      )}
    </div>
  ) : null;
}
