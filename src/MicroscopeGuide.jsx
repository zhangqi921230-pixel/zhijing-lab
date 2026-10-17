import { MobileChapterPicker } from "./MobileLearning.jsx";
import MicroscopeFocusTrial from "./MicroscopeFocusTrial.jsx";
import MicroscopeQuiz from "./MicroscopeQuiz.jsx";
import { microscopeFocusAdvice } from "./microscopeFocusAdvice.mjs";
import React from "react";
import { microscopeChapters } from "./microscopeChapters.mjs";
import { microscopeOptics } from "./MicroscopeField.jsx";
import "./MicroscopeGuide.css";
export function MicroscopeChapters({ chapter, onSelect }) {
  return (
    <nav className="microscope-chapters" aria-label="显微镜学习子主题">
      <MobileChapterPicker
        chapters={microscopeChapters}
        chapter={chapter}
        onSelect={onSelect}
      />
      <span className="nav-heading">MICROLAB · 学习子主题</span>
      {microscopeChapters.map((c, i) => (
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
export function MicroscopeGuide({
  chapter,
  p,
  onSelect,
  onPrepare,
  onRestart,
}) {
  const c = microscopeChapters[chapter],
    optics = microscopeOptics(p),
    advice = microscopeFocusAdvice(p, optics);
  return (
    <section className="microscope-guide" aria-label="当前显微镜学习任务">
      <p className="micro-kicker">
        LESSON {String(chapter).padStart(2, "0")} /{" "}
        {String(microscopeChapters.length - 1).padStart(2, "0")}
      </p>
      <h2>{c.title}</h2>
      <p>{c.text}</p>
      <div className="micro-task">
        <strong>操作任务</strong>
        <p>{c.task}</p>
      </div>
      <dl hidden={c.en === "CHECK YOUR UNDERSTANDING"}>
        <div>
          <dt>目镜 × 物镜</dt>
          <dd>10× × {p.mag / 10}×</dd>
        </div>
        <div>
          <dt>视野直径（模拟）</dt>
          <dd>{(optics.fieldDiameter / 1000).toFixed(2)} mm</dd>
        </div>
        <div>
          <dt>调焦状态</dt>
          <dd>
            {!optics.illuminated
              ? "光源关闭 · 待观察"
              : advice.canAssessFocus === false
                ? "照明较暗 · 待确认"
                : optics.blur > 0.6
                  ? "尚未合焦"
                  : "已合焦"}
          </dd>
        </div>
      </dl>
      {[2, 4].includes(chapter) && (
        <div className="micro-task" aria-label="调焦操作建议">
          <strong>{advice.title}</strong>
          <p>{advice.text}</p>
          {advice.patch && (
            <button
              className="btn micro-prepare"
              onClick={() => onPrepare(advice.patch)}
            >
              {advice.action}
            </button>
          )}
        </div>
      )}
      {[2, 4].includes(chapter) && (
        <MicroscopeFocusTrial
          key={chapter}
          p={p}
          optics={optics}
          onPrepare={onPrepare}
        />
      )}
      {[1, 4].includes(chapter) && (
        <div className="micro-task" aria-label="孔径光阑解读">
          <strong>孔径光阑 · {p.aperture ?? 70}%</strong>
          <svg
            viewBox="0 0 240 90"
            role="img"
            aria-label="光阑开口示意，非目镜视野"
            style={{ width: "100%", height: 90 }}
          >
            <circle cx="48" cy="45" r="35" fill="#465358" />
            <polygon
              points={Array.from({ length: 7 }, (_, i) => {
                const a = (i * 2 * Math.PI) / 7;
                const r = (30 * (p.aperture ?? 70)) / 100;
                return `${48 + r * Math.cos(a)},${45 + r * Math.sin(a)}`;
              }).join(" ")}
              fill="#e4d7a8"
            />
            <text x="99" y="37" fill="currentColor" fontSize="12">
              开口示意
            </text>
            <text x="99" y="58" fill="currentColor" fontSize="11">
              视野直径不随它改变
            </text>
          </svg>
          <p>
            真实孔径光阑影响照明锥角、对比度与分辨能力。收得过小会损失细节；调亮暗应优先用灯光强度。
          </p>
          <p>
            当前只演示开口与通光变暗，不模拟衍射、景深或定量对比度。开度不是数值孔径
            NA，也不是视场光阑；本地照片不受它影响。
          </p>
        </div>
      )}
      <div hidden={c.en !== "CHECK YOUR UNDERSTANDING"}>
        <MicroscopeQuiz onReview={onSelect} />
      </div>
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
        <button disabled={!chapter} onClick={() => onSelect(chapter - 1)}>
          ← 上一节
        </button>
        <button
          disabled={chapter === microscopeChapters.length - 1}
          onClick={() => onSelect(chapter + 1)}
        >
          下一节 →
        </button>
      </div>
    </section>
  );
}
