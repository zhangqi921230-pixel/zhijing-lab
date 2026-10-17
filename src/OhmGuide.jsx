import { MobileChapterPicker } from "./MobileLearning.jsx";
import React, { useEffect, useRef } from "react";
import { ohmChapters } from "./ohmChapters.mjs";
import "./MicroscopeGuide.css";

export function OhmChapters({ chapter, onSelect }) {
  return (
    <nav className="microscope-chapters" aria-label="欧姆定律学习子主题">
      <MobileChapterPicker
        chapters={ohmChapters}
        chapter={chapter}
        onSelect={onSelect}
      />
      <span className="nav-heading">CIRCUITLAB · 学习子主题</span>
      {ohmChapters.map((c, i) => (
        <button
          key={c.en}
          className={chapter === i ? "selected" : ""}
          aria-current={chapter === i ? "step" : undefined}
          onClick={() => onSelect(i)}
        >
          <small>{String(i).padStart(2, "0")}</small>
          <span>
            {c.title}
            <em>{c.en}</em>
          </span>
        </button>
      ))}
    </nav>
  );
}

export function OhmGuide({ chapter, p, onSelect, onPrepare, onRestart }) {
  const section = useRef(null);
  useEffect(() => {
    const panel = section.current?.closest(".control-panel");
    if (panel) panel.scrollTop = 0;
  }, [chapter]);
  const c = ohmChapters[chapter],
    current = p.closed ? p.u / p.r : 0;
  return (
    <section
      ref={section}
      className="microscope-guide"
      aria-label="当前欧姆定律学习任务"
    >
      <p className="micro-kicker">
        LESSON {String(chapter).padStart(2, "0")} / 06
      </p>
      <h2>{c.title}</h2>
      <p>{c.text}</p>
      <div className="micro-task">
        <strong>操作任务</strong>
        <p>{c.task}</p>
      </div>
      {chapter === 1 && p.u === 0 && (
        <div className="micro-task" role="note" aria-label="电源未提供电压">
          <strong>电源当前为 0 V</strong>
          <p>
            此时开关即使闭合，电流仍为零。先把电源调到 6 V，再比较开关通断；
            当前电阻保持 {p.r} Ω，闭合后电流应为 {(6 / p.r).toFixed(3)} A。
          </p>
          <button className="btn" onClick={() => onPrepare({ u: 6 })}>
            将电源设为 6 V
          </button>
        </div>
      )}
      <dl>
        <div>
          <dt>回路状态</dt>
          <dd>{p.closed ? "闭合" : "断开"}</dd>
        </div>
        <div>
          <dt>电流表</dt>
          <dd>{p.digital === 0 ? "先读指针" : `${current.toFixed(3)} A`}</dd>
        </div>
        <div>
          <dt>电阻两端电压</dt>
          <dd>
            {p.digital === 0
              ? "先读指针"
              : `${(p.closed ? p.u : 0).toFixed(2)} V`}
          </dd>
        </div>
        <div>
          <dt>电阻功率</dt>
          <dd>
            {p.digital === 0
              ? "核对时显示"
              : `${(current * current * p.r).toFixed(3)} W`}
          </dd>
        </div>
      </dl>
      {!!p.trace && (
        <div className="micro-task">
          <strong>
            {p.trace === 1 ? "主回路 · 串联" : "电压表支路 · 并联"}
          </strong>
          <p>
            {p.trace === 1
              ? "金色导线连接电源、开关、电流表和电阻。开关闭合后构成完整回路。"
              : "金色的两根导线把电压表接到电阻两端。理想电压表电阻无限大，支路电流为零。"}{" "}
            金色仅用于辨认接线，不代表电流或真实线色。
          </p>
          <button className="btn" onClick={() => onPrepare({ trace: 0 })}>
            恢复实际线色
          </button>
        </div>
      )}
      {(chapter === 4 || p.digital === 0) && (
        <button
          className="btn micro-prepare"
          aria-pressed={p.digital === 0}
          onClick={() => onPrepare({ digital: p.digital === 0 ? 1 : 0 })}
        >
          {p.digital === 0 ? "显示数字，核对读数" : "隐藏数字，练习估读"}
        </button>
      )}
      {c.preset && (
        <button
          className="btn micro-prepare"
          title="恢复本节起始参数与观察视角，保留章节和实验记录"
          onClick={() => (onRestart ? onRestart() : onPrepare(c.preset))}
        >
          重做本节
        </button>
      )}
      <div className="micro-step">
        <button disabled={chapter === 0} onClick={() => onSelect(chapter - 1)}>
          ← 上一节
        </button>
        <button
          disabled={chapter === ohmChapters.length - 1}
          onClick={() => onSelect(chapter + 1)}
        >
          下一节 →
        </button>
      </div>
    </section>
  );
}
