import React, { useEffect, useRef } from "react";
import { acidChapters } from "./acidChapters.mjs";
import { ph } from "./models.mjs";
import "./MicroscopeGuide.css";

export function AcidChapters({ chapter, onSelect }) {
  return (
    <nav className="microscope-chapters" aria-label="酸碱中和学习子主题">
      <span className="nav-heading">TITRATIONLAB · 学习子主题</span>
      {acidChapters.map((item, i) => (
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
export function AcidGuide({ chapter, p, onSelect, onPrepare, onRestart }) {
  const section = useRef(null);
  useEffect(() => {
    const panel = section.current?.closest(".control-panel");
    if (panel) panel.scrollTop = 0;
  }, [chapter]);
  const item = acidChapters[chapter],
    delta = p.c * (p.acid - p.base);
  return (
    <section
      ref={section}
      className="microscope-guide"
      aria-label="当前中和学习任务"
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
          <dt>HCl / NaOH 投料</dt>
          <dd>
            {(p.c * p.acid).toFixed(3)} / {(p.c * p.base).toFixed(3)} mmol
          </dd>
        </div>
        <div>
          <dt>中和条件</dt>
          <dd>
            {Math.abs(delta) < 1e-9
              ? "恰好中和"
              : delta > 0
                ? "酸过量"
                : "碱过量"}
          </dd>
        </div>
        <div>
          <dt>当前 pH · 理想值</dt>
          <dd>{ph(p.acid, p.base, p.c).toFixed(2)}</dd>
        </div>
        <div>
          <dt>混合液总体积</dt>
          <dd>{Number((p.acid + p.base).toFixed(2))} mL</dd>
        </div>
      </dl>
      {chapter === 3 && (
        <div
          className="acid-equivalence"
          role="group"
          aria-label="中和点附近对照"
        >
          {[-0.1, 0, 0.1].map((offset) => (
            <button
              key={offset}
              className="btn micro-prepare"
              disabled={p.acid + offset > 100 || p.acid + offset < 0}
              onClick={() => onPrepare({ base: p.acid + offset })}
            >
              {offset < 0
                ? "中和点前 0.1 mL"
                : offset > 0
                  ? "中和点后 0.1 mL"
                  : "恰好中和"}
            </button>
          ))}
        </div>
      )}
      <p>
        模拟充分混合后的理想状态，尚未模拟滴定操作误差、电极校准、响应延迟与反应放热。原理图颜色为比色示意。
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
