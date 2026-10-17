import { MobileChapterPicker } from "./MobileLearning.jsx";
import LensScreenCheck from "./LensScreenCheck.jsx";
import React, { useEffect, useRef } from "react";
import { lensChapters } from "./lensChapters.mjs";
import { opticalState, objectHeight, opticalScale } from "./opticalModel.mjs";
import "./MicroscopeGuide.css";
import LensPositions from "./LensPositions.jsx";
export function LensChapters({ chapter, onSelect }) {
  return (
    <nav className="microscope-chapters" aria-label="凸透镜学习子主题">
      <MobileChapterPicker
        chapters={lensChapters}
        chapter={chapter}
        onSelect={onSelect}
      />
      <span className="nav-heading">OPTICSLAB · 学习子主题</span>
      {lensChapters.map((c, i) => (
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
export function LensGuide({
  chapter,
  p,
  onSelect,
  onPrepare,
  onRestart,
  screenControl,
  view,
}) {
  const section = useRef(null);
  useEffect(() => {
    const panel = section.current?.closest(".control-panel");
    if (panel) panel.scrollTop = 0;
  }, [chapter]);
  const c = lensChapters[chapter],
    q = opticalState(p);
  const outsideTravel =
    q.v !== null &&
    q.v > 0 &&
    screenControl &&
    (q.v < screenControl.min - 1e-9 || q.v > screenControl.max + 1e-9);
  return (
    <section
      ref={section}
      className="microscope-guide"
      aria-label="当前凸透镜学习任务"
    >
      <p className="micro-kicker">
        LESSON {String(chapter).padStart(2, "0")} /{" "}
        {String(lensChapters.length - 1).padStart(2, "0")}
      </p>
      <h2>{c.title}</h2>
      <p>{c.text}</p>
      {view === "screen" ? (
        <p role="status">
          光屏近景已临时收起器材名称与焦点标记，返回其他视角后恢复原显示设置。
        </p>
      ) : (
        <button
          className="btn"
          aria-pressed={p.apparatusLabels !== 0}
          onClick={() =>
            onPrepare({ apparatusLabels: p.apparatusLabels === 0 ? 1 : 0 })
          }
        >
          {p.apparatusLabels === 0 ? "显示器材名称" : "隐藏器材名称"}
        </button>
      )}
      <div className="micro-task">
        <strong>操作任务</strong>
        <p>{c.task}</p>
      </div>
      <dl>
        <div>
          <dt>物距 / 焦距</dt>
          <dd>{(p.u / p.f).toFixed(2)} f</dd>
        </div>
        <div>
          <dt>像距</dt>
          <dd>{q.v === null ? "无有限像" : `${q.v.toFixed(2)} cm`}</dd>
        </div>
        <div>
          <dt>物高 / 理想像高</dt>
          <dd>
            {(objectHeight / opticalScale).toFixed(2)} /{" "}
            {q.m === null
              ? "—"
              : ((q.m * objectHeight) / opticalScale).toFixed(2)}{" "}
            cm
          </dd>
        </div>
        <div>
          <dt>光屏观察</dt>
          <dd>
            {!q.illuminated
              ? "光源关闭，无亮像"
              : q.v === null
                ? "无有限成像位置"
                : q.v < 0
                  ? "虚像不能承接"
                  : outsideTravel
                    ? "像平面超出光屏行程"
                    : q.focused
                      ? q.imageFitsScreen
                        ? "光屏接近像平面"
                        : "已对焦，像超出屏边"
                      : "移动光屏寻找像"}
          </dd>
        </div>
      </dl>
      {chapter >= 1 && chapter <= 5 && (
        <LensPositions p={p} onPrepare={onPrepare} />
      )}
      {chapter >= 1 && chapter <= 5 && (
        <LensScreenCheck
          p={p}
          onPrepare={onPrepare}
          screenControl={screenControl}
        />
      )}
      {outsideTravel && (
        <div className="micro-task" role="status">
          <strong>实像存在，光屏暂时无法到达</strong>
          <p>
            计算像距为 {q.v.toFixed(2)} cm，本台光屏行程为 {screenControl.min}–
            {screenControl.max} cm。
            {q.v > screenControl.max
              ? "保持焦距不变，把物体适当远离透镜，再重新寻找像平面。"
              : "保持焦距不变，把物体向透镜靠近一些，同时保持物距大于焦距，再重新寻找像平面。"}
            这与焦点处没有有限距离像、焦点以内形成虚像是不同情况。
          </p>
        </div>
      )}
      {p.heightLock === 1 && (
        <p role="status">
          光源高度已锁紧。点击三维升降旋钮，或在参数栏选择“松开”后再调高低；物距仍可沿轨道调整。
        </p>
      )}
      {(chapter === 9 || q.apertureRatio < 1) && (
        <p>
          孔径为全开的 {(q.apertureRatio * 100).toFixed(0)}%，相对通光面积{" "}
          {(q.relativeLight * 100).toFixed(1)}
          %。光屏亮度为定性近似，不是照度计读数。
        </p>
      )}
      {(chapter === 8 || (p.sourceOffset ?? 0) !== 0) && (
        <div className="micro-task">
          <p>
            箭头下端偏移 {(p.sourceOffset ?? 0).toFixed(1)} cm；理想像下端偏移{" "}
            {q.m === null
              ? "无有限值"
              : `${(q.m * (p.sourceOffset ?? 0)).toFixed(2)} cm`}
            。
          </p>
          <button
            className="btn"
            disabled={(p.sourceOffset ?? 0) === 0}
            onClick={() => onPrepare({ sourceOffset: 0, heightLock: 0 })}
          >
            {p.heightLock === 1 ? "松开并恢复对齐" : "恢复光源对齐"}
          </button>
        </div>
      )}
      {q.illuminated && q.focused && !q.imageFitsScreen && (
        <p>
          像平面仍然存在，但当前光屏尺寸不足。把物体适当远离焦点，并重新移动光屏对焦，可以获得较小、完整的像。
        </p>
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
          disabled={chapter === lensChapters.length - 1}
          onClick={() => onSelect(chapter + 1)}
        >
          下一节 →
        </button>
      </div>
    </section>
  );
}
