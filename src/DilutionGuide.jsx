import React, { useEffect, useRef } from "react";
import { dilutionChapters } from "./dilutionChapters.mjs";
import { DilutionTarget } from "./DilutionTarget.jsx";
import "./MicroscopeGuide.css";

export function DilutionChapters({ chapter, onSelect }) {
  return (
    <nav className="microscope-chapters" aria-label="溶液稀释学习子主题">
      <span className="nav-heading">SOLUTIONLAB · 学习子主题</span>
      {dilutionChapters.map((item, index) => (
        <button
          key={item.en}
          className={chapter === index ? "selected" : ""}
          aria-current={chapter === index ? "step" : undefined}
          onClick={() => onSelect(index)}
        >
          <small>{String(index).padStart(2, "0")}</small>
          <span>
            {item.title}
            <em>{item.en}</em>
          </span>
        </button>
      ))}
    </nav>
  );
}

export function DilutionGuide({ chapter, p, onSelect, onPrepare, onRestart }) {
  const section = useRef(null);
  useEffect(() => {
    const panel = section.current?.closest(".control-panel");
    if (panel) panel.scrollTop = 0;
  }, [chapter]);
  const massText = (value) => Number(value.toFixed(1));
  const item = dilutionChapters[chapter],
    before = p.solute + p.water,
    after = before + p.add;
  return (
    <section
      ref={section}
      className="microscope-guide"
      aria-label="当前稀释学习任务"
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
          <dt>溶质 · 前后不变</dt>
          <dd>{p.solute} g</dd>
        </div>
        <div>
          <dt>溶液总质量</dt>
          <dd>
            {massText(before)} → {massText(after)} g
          </dd>
        </div>
        <div>
          <dt>质量分数</dt>
          <dd>
            {((100 * p.solute) / before).toFixed(2)} →{" "}
            {((100 * p.solute) / after).toFixed(2)} %
          </dd>
        </div>
        <div>
          <dt>加入的纯水</dt>
          <dd>{massText(p.add)} g</dd>
        </div>
      </dl>
      {chapter === 3 && <DilutionTarget p={p} onPrepare={onPrepare} />}
      <p>
        底座显示已去除空杯质量的溶液净质量，浓度由质量计算，不能直接称量。供水与液位为示意，尚未求解实际流量、压力与混合过程。
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
