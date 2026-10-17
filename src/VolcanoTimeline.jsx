import React from "react";
import "./ModelStage.css";

export const volcanoStages = [
  {
    title: "通道与岩浆",
    time: 1.5,
    text: "先观察岩浆储集区和通道。剖面中的深浅层理用于示意不同堆积层，不是实测地层；本模型没有计算地下压力变化。",
  },
  {
    title: "喷发与溢流",
    time: 8,
    text: "观察熔岩沿坡推进；爆发式还展示灰柱与抛出的碎屑。亮色裂隙与暗色表皮用于区分流动细节。",
  },
  {
    title: "减弱与结壳",
    time: 16.5,
    text: "喷出物逐渐减少，熔岩表面变暗并结壳。表面变暗不表示内部已经完全冷却。",
  },
  {
    title: "观察流迹",
    time: 20,
    text: "对照山坡上的暗色流迹，回看前一阶段。时间经过压缩；颜色不能用于读取温度或判断安全。",
  },
];
export const volcanoStageIndex = (time) =>
  time < 3 ? 0 : time < 13 ? 1 : time < 20 ? 2 : 3;

export default function VolcanoTimeline({ time, onSeek, p = {}, onChange }) {
  const active = volcanoStageIndex(time);
  return (
    <section className="volcano-timeline" aria-label="火山过程对照">
      <div className="volcano-stages" role="group" aria-label="定位演示阶段">
        {volcanoStages.map((stage, i) => (
          <button
            key={stage.title}
            type="button"
            aria-pressed={i === active}
            onClick={() => onSeek?.(stage.time)}
          >
            <span>{String(i + 1).padStart(2, "0")}</span>
            <strong>{stage.title}</strong>
            <small>{stage.time} s</small>
          </button>
        ))}
      </div>
      {onChange && (
        <div className="volcano-layers" role="group" aria-label="喷发现象显示">
          <span>观察图层</span>
          {[
            ["showLava", "熔岩流"],
            ["showAsh", "火山灰羽流"],
            ["showEjecta", "喷出碎屑"],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              aria-pressed={p[key] !== 0}
              onClick={() => onChange(key, p[key] === 0 ? 1 : 0)}
            >
              <span aria-hidden="true">{p[key] === 0 ? "○" : "●"}</span> {label}
            </button>
          ))}
          <small>只改变显示，保留时间与播放状态</small>
        </div>
      )}
      <p className="volcano-stage-summary">{volcanoStages[active].text}</p>
      <details className="volcano-observation">
        <summary>观察提示 · {volcanoStages[active].title}</summary>
        <p>
          火山灰是细小的岩石、矿物和火山玻璃碎片，不是燃烧产生的烟灰。羽流可携带灰颗粒，图中的云状外观不表示全部都是气体；这里只示意扩散，没有求解风场和颗粒沉降。
        </p>
        <p>
          本页把较大的抛出物单列为“喷出碎屑”，便于观察抛射路径；火山灰本身也属于火山碎屑物质。隐藏图层只减少遮挡，并不改变喷发过程。
        </p>
        <a
          href="https://volcanoes.usgs.gov/volcanic_ash/ash.html"
          target="_blank"
          rel="noreferrer"
        >
          科学依据：USGS 火山灰说明 ↗
        </a>
        <small>
          点击阶段会定位并暂停，保留喷发形态与剖面设置。演示时间不对应真实喷发时长。
        </small>
      </details>
    </section>
  );
}
