import React, { useId, useState, useEffect } from "react";
import Button from "./LabButton.jsx";
import { trophicBudget } from "./trophicBudget.mjs";
import "./EnergyPathways.css";
const fmt = (n) => n.toLocaleString("zh-CN", { maximumFractionDigits: 2 });
const notes = [
  "只有一部分能量沿选定摄食链进入下一营养级。粗细与示踪速度均不代表能量大小，以数值为准。",
  "呼吸作用将有机物中的一部分化学能用于生命活动，并以热等形式散入环境；这部分不能被生产者循环利用。",
  "遗体、排出物等进入碎屑途径，分解者利用其中的有机物能量，其呼吸也会散失热。能量流向分解者，不是返回生产者。",
  "在选定统计时段内，有些能量仍储存在本营养级的生物体中，尚未被下一级摄食，也未进入碎屑途径。",
];
export default function EnergyPathways({ p }) {
  const uid = useId().replace(/:/g, ""),
    [link, setLink] = useState(0),
    [route, setRoute] = useState(0),
    [playing, setPlaying] = useState(false),
    [hidden, setHidden] = useState(false);
  useEffect(() => {
    const change = () => setHidden(document.hidden);
    change();
    document.addEventListener("visibilitychange", change);
    return () => document.removeEventListener("visibilitychange", change);
  }, []);
  useEffect(() => setPlaying(false), [p.energy, p.eff]);
  const budget = trophicBudget(p.energy, p.eff),
    source = link === 0 ? "草 · 生产者" : "兔 · 初级消费者",
    target = link === 0 ? "兔 · 初级消费者" : "狐 · 次级消费者";
  const paths = [
    "M250 100H440",
    "M150 135V175H535",
    "M150 135V325H280",
    "M250 100H300V250H350",
    "M450 335H530",
    "M620 300V220",
  ];
  const active = (i) => i === route || (route === 2 && (i === 4 || i === 5));
  return (
    <section className="energy-pathways" aria-label="未传递能量的去向探究">
      <h3>未沿这条链传递，不等于全部变成热</h3>
      <p>
        先选摄食环节，再追踪一种去向。已知的是传递量与剩余总量；下方三个去向的比例没有给定，不能按线长或节点大小估算。
      </p>
      <div className="motion-shortcuts" role="group" aria-label="选择摄食环节">
        {["草 → 兔", "兔 → 狐"].map((label, i) => (
          <Button
            key={label}
            primary={link === i}
            aria-pressed={link === i}
            onClick={() => {
              setLink(i);
              setPlaying(false);
            }}
          >
            {label}
          </Button>
        ))}
      </div>
      <div className="energy-pathway-values">
        <span>
          本级：<strong>{fmt(budget.levels[link])} kJ</strong>
        </span>
        <span>
          下一级：<strong>{fmt(budget.levels[link + 1])} kJ</strong>
        </span>
        <span>
          未沿本链继续：<strong>{fmt(budget.diverted[link])} kJ</strong>
        </span>
      </div>
      <div className="motion-shortcuts" role="group" aria-label="追踪能量去向">
        {["进入下一级", "呼吸散失", "碎屑与分解", "暂留本级"].map(
          (label, i) => (
            <Button
              key={label}
              primary={route === i}
              aria-pressed={route === i}
              onClick={() => {
                setRoute(i);
                setPlaying(false);
              }}
            >
              {label}
            </Button>
          ),
        )}
      </div>
      <div
        className="energy-pathways-scroll"
        role="region"
        tabIndex="0"
        aria-label="能量去向图，可横向滚动"
      >
        <svg
          viewBox="0 0 800 475"
          role="img"
          aria-label={`${source}的能量去向，当前追踪${["下一级", "呼吸散失", "碎屑与分解", "暂留本级"][route]}`}
          className={playing && !hidden ? "is-tracing" : ""}
        >
          <defs>
            <marker
              id={`ep-${uid}`}
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M0 0L10 5L0 10Z" fill="context-stroke" />
            </marker>
          </defs>
          {paths.map((d, i) => (
            <path
              key={i}
              d={d}
              className={`energy-pathway-line ${active(i) ? "is-active" : ""}`}
              fill="none"
              stroke={active(i) ? "var(--ui-primary)" : "var(--ui-muted)"}
              opacity={active(i) ? 1 : 0.3}
              strokeWidth="3"
              strokeDasharray="7 5"
              markerEnd={`url(#ep-${uid})`}
            />
          ))}
          {[
            [50, 65, 200, 70, source, "本级能量起点"],
            [440, 65, 265, 70, target, `${fmt(budget.levels[link + 1])} kJ`],
            [280, 300, 170, 70, "碎屑途径", "分项数值未设定"],
            [350, 225, 180, 55, "暂留本级", "分项数值未设定"],
            [530, 300, 180, 70, "分解者", "利用有机物能量"],
            [535, 155, 170, 65, "环境中的热", "呼吸等过程散失"],
          ].map(([x, y, w, h, label, caption], i) => (
            <g key={label}>
              <rect
                x={x}
                y={y}
                width={w}
                height={h}
                rx="8"
                fill="var(--ui-surface)"
                stroke="var(--ui-line)"
              />
              <text x={x + w / 2} y={y + 26} textAnchor="middle">
                {label}
              </text>
              <text
                x={x + w / 2}
                y={y + h - 13}
                textAnchor="middle"
                className="energy-pathway-caption"
              >
                {caption}
              </text>
            </g>
          ))}
          <text x="40" y="457">
            能量单向流动 · 不画回到生产者的循环箭头
          </text>
        </svg>
      </div>
      <p className="energy-pathway-note" role="status">
        {notes[route]}
      </p>
      <Button
        primary={playing}
        aria-pressed={playing}
        onClick={() => setPlaying((v) => !v)}
      >
        {playing ? "暂停方向示踪" : "播放方向示踪"}
      </Button>
      <p className="energy-pathway-boundary">
        示踪只强调方向，不增加能量、不推进真实生态时间；减少动态效果设置下只保留静态箭头。各去向未做定量拆分，守恒账本仍以本级减去下一级的总量核对。
      </p>
    </section>
  );
}
