import React, { useState, useEffect } from "react";
import Button from "../LabButton.jsx";
import { storyboards } from "./storyboards.mjs";
import "./visual-story.css";

export function StoryPicture({
  entry,
  index = 0,
  thumbnail = false,
  zoom = false,
}) {
  const [failed, setFailed] = useState(false);
  const step = entry.steps[index];
  const split = entry.splitY || 0.5;
  const x = (index % 2) * 0.5 + 0.01,
    y = (index < 2 ? 0 : split) + 0.01,
    w = 0.48,
    h = (index < 2 ? split : 1 - split) - 0.02;
  const file = step.file || (thumbnail ? entry.thumbnail : entry.file);
  useEffect(() => setFailed(false), [file]);
  return (
    <div
      className="story-picture"
      data-kind={entry.kind}
      data-frame={index}
      data-zoom={zoom}
      style={
        entry.kind === "illustration"
          ? { aspectRatio: `${(1.5 * w) / h}` }
          : entry.kind === "diagram"
            ? { aspectRatio: "900 / 690" }
            : undefined
      }
    >
      {failed ? (
        <p role="status">
          图片暂未加载，可以继续阅读图下说明，或切换原理互动。
        </p>
      ) : (
        <div
          className="story-picture-inner"
          style={{
            transform: zoom ? "scale(1.5)" : undefined,
            transformOrigin: step.focus
              ? `${step.focus[0]}% ${step.focus[1]}%`
              : "50% 50%",
          }}
        >
          <img
            src={`${import.meta.env.BASE_URL}${file}`}
            width="1536"
            height="1024"
            alt={step.alt || `${step.title}的教学情景示意`}
            loading={thumbnail ? "lazy" : undefined}
            onError={() => setFailed(true)}
            style={
              entry.kind === "illustration"
                ? {
                    width: `${100 / w}%`,
                    maxWidth: "none",
                    height: `${100 / h}%`,
                    left: `${(-100 * x) / w}%`,
                    top: `${(-100 * y) / h}%`,
                  }
                : undefined
            }
          />
        </div>
      )}
    </div>
  );
}
function StoryData({ step }) {
  if (!step.values) return null;
  return (
    <div className="science-scale-data">
      <p>{step.unit}</p>
      <dl>
        {step.values.map(([name, value]) => (
          <div key={name}>
            <dt>{name}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
export default function VisualStory({
  id,
  print = false,
  entry: suppliedEntry,
}) {
  const entry = suppliedEntry || storyboards[id];
  const [index, setIndex] = useState(0),
    [compare, setCompare] = useState(false),
    [zoom, setZoom] = useState(false),
    [reveal, setReveal] = useState(true),
    [uncertain, setUncertain] = useState(false);
  const step = entry.steps[index];
  function choose(i) {
    setIndex(i);
    setZoom(false);
    setUncertain(false);
  }
  return (
    <section className="visual-story" data-topic={id} aria-label="分步观察图鉴">
      <header className="story-heading">
        <strong>{entry.mode}</strong>
        <span>
          {entry.kind === "photo"
            ? "来源实拍"
            : entry.kind === "diagram"
              ? "按比例绘制"
              : "AI 辅助情景示意"}{" "}
          · {entry.steps.length} 幅观察画面
        </span>
      </header>
      {compare || print ? (
        <div className="story-comparison">
          {entry.steps.map((s, i) => (
            <figure key={s.title}>
              <StoryPicture entry={entry} index={i} />
              <figcaption>
                <strong>
                  {i + 1}. {s.title}
                </strong>
                {(reveal || print) && <p>{s.text}</p>}
                {(reveal || print) && <StoryData step={s} />}
                {s.source && (
                  <a href={s.source} target="_blank" rel="noreferrer">
                    {s.species} · 来源
                  </a>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <>
          <StoryPicture
            key={`${id}:${index}`}
            entry={entry}
            index={index}
            zoom={zoom}
          />
          <nav className="story-steps" aria-label="选择观察画面">
            {entry.steps.map((s, i) => (
              <Button
                key={s.title}
                aria-pressed={i === index}
                onClick={() => choose(i)}
              >
                <span>{i + 1}</span>
                {s.title}
              </Button>
            ))}
          </nav>
          <div className="story-explanation" role="status">
            <h3>
              {index + 1} / {entry.steps.length} · {step.title}
            </h3>
            {reveal ? (
              <p>{step.text}</p>
            ) : (
              <p>先描述画面中可见的形态、位置或变化，再展开解释核对。</p>
            )}
            {reveal && <StoryData step={step} />}
            {step.source && (
              <p className="story-credit">
                <i>{step.species}</i>
                <br />
                <a href={step.source} target="_blank" rel="noreferrer">
                  {step.author} · 原始照片
                </a>{" "}
                /{" "}
                <a href={step.licenseUrl} target="_blank" rel="noreferrer">
                  {step.license}
                </a>
              </p>
            )}
          </div>
        </>
      )}
      {!print && (
        <div className="science-controls story-controls">
          <Button
            onClick={() => {
              choose(0);
              setCompare(false);
              setReveal(true);
            }}
          >
            从头观察
          </Button>
          <Button
            onClick={() => choose(Math.max(0, index - 1))}
            disabled={index === 0 || compare}
          >
            上一图
          </Button>
          <Button
            onClick={() => choose(Math.min(entry.steps.length - 1, index + 1))}
            disabled={index === entry.steps.length - 1 || compare}
          >
            下一图
          </Button>
          <Button
            aria-pressed={compare}
            onClick={() => {
              setCompare(!compare);
              setZoom(false);
            }}
          >
            {compare ? "逐张查看" : "并排对照"}
          </Button>
          {!compare && (
            <Button aria-pressed={zoom} onClick={() => setZoom(!zoom)}>
              {zoom ? "返回全图" : "放大观察"}
            </Button>
          )}
          <Button aria-pressed={reveal} onClick={() => setReveal(!reveal)}>
            {reveal ? "先隐藏解释" : "展开解释"}
          </Button>
          {entry.kind === "photo" && (
            <Button onClick={() => setUncertain(true)}>线索不足</Button>
          )}
        </div>
      )}
      {uncertain && (
        <p className="science-caption" role="status">
          可以保留判断。请在原有辨识互动中比较多个部位；照片没有拍清楚的特征不能补猜。
        </p>
      )}
      <p className="science-caption story-boundary">{entry.boundary}</p>
      <details className="story-sources">
        <summary>这组画面的依据与适用范围</summary>
        <p>
          {entry.review.status}。
          {entry.kind === "illustration"
            ? "画面用于观察与讲解，不是实拍记录、实验测量或比例模型。"
            : ""}
        </p>
        {entry.sources.map((s) => (
          <a key={s.url} href={s.url} target="_blank" rel="noreferrer">
            {s.title}
          </a>
        ))}
      </details>
    </section>
  );
}
