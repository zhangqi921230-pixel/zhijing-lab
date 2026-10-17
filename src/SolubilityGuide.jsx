import { MobileChapterPicker } from "./MobileLearning.jsx";
import React, { useEffect, useRef } from "react";
import { solubility } from "./models.mjs";
import { saturationTemperature } from "./solubilityThreshold.mjs";
import { solubilityChapters } from "./solubilityChapters.mjs";
import "./MicroscopeGuide.css";

export function SolubilityChapters({ chapter, onSelect }) {
  return (
    <nav className="microscope-chapters" aria-label="饱和与结晶学习子主题">
      <MobileChapterPicker
        chapters={solubilityChapters}
        chapter={chapter}
        onSelect={onSelect}
      />
      <span className="nav-heading">CRYSTALLAB · 学习子主题</span>
      {solubilityChapters.map((item, i) => (
        <button
          key={item.en}
          className={chapter === i ? "selected" : ""}
          aria-current={chapter === i ? "step" : undefined}
          onClick={() => onSelect(i)}
        >
          <small>{String(i).padStart(2, "0")}</small>
          <span>
            {item.title}
            <em>{item.en}</em>
          </span>
        </button>
      ))}
    </nav>
  );
}
export function SolubilityGuide({
  chapter,
  p,
  onSelect,
  onPrepare,
  onRestart,
}) {
  const section = useRef(null);
  useEffect(() => {
    const panel = section.current?.closest(".control-panel");
    if (panel) panel.scrollTop = 0;
  }, [chapter]);
  const item = solubilityChapters[chapter],
    capacity = (solubility(p.temp) * p.water) / 100;
  const dissolved = Math.min(p.mass, capacity),
    solid = Math.max(0, p.mass - capacity);
  const state =
    p.mass < capacity - 1e-8
      ? "未饱和"
      : solid > 1e-8
        ? "饱和，有剩余固体"
        : "恰好饱和，无剩余固体";
  const threshold = saturationTemperature(p.mass, p.water);
  return (
    <section
      ref={section}
      className="microscope-guide"
      aria-label="当前溶解结晶学习任务"
    >
      <p className="micro-kicker">
        LESSON {String(chapter).padStart(2, "0")} / 05
      </p>
      <h2>{item.title}</h2>
      <p>{item.text}</p>
      <div className="micro-task">
        <strong>操作任务</strong>
        <p>{item.task}</p>
      </div>
      <dl>
        <div>
          <dt>溶液状态 · 平衡时</dt>
          <dd>{state}</dd>
        </div>
        <div>
          <dt>最多可溶解</dt>
          <dd>{capacity.toFixed(2)} g</dd>
        </div>
        <div>
          <dt>已溶解 / 剩余固体</dt>
          <dd>
            {dissolved.toFixed(2)} / {solid.toFixed(2)} g
          </dd>
        </div>
        <div>
          <dt>质量核对</dt>
          <dd>
            {(dissolved + solid).toFixed(2)} = {p.mass} g
          </dd>
        </div>
      </dl>
      <figure
        className="solubility-mass-split"
        aria-label={`硝酸钾投料 ${p.mass} g：已溶解 ${dissolved.toFixed(2)} g，剩余固体 ${solid.toFixed(2)} g`}
      >
        <figcaption>同一份投料 · 液相与固相的质量分配</figcaption>
        <svg
          viewBox="0 0 300 32"
          role="img"
          aria-label="绿色为已溶解硝酸钾，金色为剩余固体，合计为投料质量"
        >
          <rect
            x="0"
            y="4"
            width="300"
            height="24"
            rx="3"
            fill={p.mass > 0 ? "#bc985a" : "#77777722"}
          />
          <rect
            x="0"
            y="4"
            width={p.mass > 0 ? (300 * dissolved) / p.mass : 0}
            height="24"
            fill="#4c9c89"
          />
          <line
            x1={p.mass > 0 ? (300 * dissolved) / p.mass : 0}
            x2={p.mass > 0 ? (300 * dissolved) / p.mass : 0}
            y1="4"
            y2="28"
            stroke="var(--surface)"
            strokeWidth="2"
          />
        </svg>
        <div>
          <span>已溶解 {dissolved.toFixed(2)} g</span>
          <span>固体 {solid.toFixed(2)} g</span>
        </div>
        <small>不含水的质量；条长比例表示质量，不表示杯中体积。</small>
      </figure>
      <div className="solubility-threshold">
        <button
          className="btn"
          disabled={threshold === null}
          onClick={() => onPrepare({ temp: threshold })}
        >
          定位恰好饱和
        </button>
        <p>
          {threshold === null
            ? "当前投料与水量在 0–80°C 范围内没有恰好饱和点。可调整投料或水量。"
            : `按本实验插值数据，临界温度约 ${threshold.toFixed(2)}°C。先预测，再定位核对；定位会暂停温度扫描。`}
        </p>
      </div>
      <p>
        每次调整显示该温度下的平衡状态；尚未模拟实际升降温时间、溶解速度、过饱和与成核延迟。晶体数量和液位为示意。
      </p>
      {item.preset && (
        <button
          className="btn micro-prepare"
          title="恢复本节起始参数与观察视角，保留章节和实验记录"
          onClick={() => (onRestart ? onRestart() : onPrepare(item.preset))}
        >
          重做本节
        </button>
      )}
      <div className="micro-step">
        <button disabled={chapter === 0} onClick={() => onSelect(chapter - 1)}>
          ← 上一节
        </button>
        <button disabled={chapter === 5} onClick={() => onSelect(chapter + 1)}>
          下一节 →
        </button>
      </div>
    </section>
  );
}
