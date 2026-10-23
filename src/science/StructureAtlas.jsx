import React, { useState } from "react";
import Button from "../LabButton.jsx";
import { structureAtlases } from "./structureAtlases.mjs";

export default function StructureAtlas({ id, entry: suppliedEntry }) {
  const entry = suppliedEntry || structureAtlases[id];
  const [selected, setSelected] = useState(0);
  const [labels, setLabels] = useState(true);
  const [zoom, setZoom] = useState(false);
  const [failed, setFailed] = useState(false);
  const part = entry.parts[selected];
  return (
    <section className="structure-atlas" aria-label={`${entry.name}结构图鉴`}>
      <div className="structure-board" data-labels={labels} data-zoom={zoom}>
        <div className="structure-picture">
          {!failed ? (
            <div
              className="structure-image-layer"
              style={{
                transform: zoom ? "scale(1.7)" : undefined,
                transformOrigin: `${part.x}% ${part.y}%`,
              }}
            >
              <img
                src={`${import.meta.env.BASE_URL}${entry.file}`}
                width="1536"
                height="1024"
                alt={entry.alt}
                onError={() => setFailed(true)}
              />
              {labels &&
                entry.parts.map((p, i) => (
                  <React.Fragment key={p.name}>
                    <button
                      type="button"
                      className="structure-pin"
                      style={{ left: `${p.x}%`, top: `${p.y}%` }}
                      aria-label={`查看${p.name}`}
                      aria-pressed={selected === i}
                      onClick={() => setSelected(i)}
                    >
                      {i + 1}
                    </button>
                    <span
                      className="structure-mobile-pin"
                      aria-hidden="true"
                      data-selected={selected === i}
                      style={{ left: `${p.x}%`, top: `${p.y}%` }}
                    >
                      {i + 1}
                    </span>
                  </React.Fragment>
                ))}
            </div>
          ) : (
            <p className="science-caption" role="status">
              图片暂未加载。下方结构说明仍可阅读，也可切换到原理互动。
            </p>
          )}
        </div>
        {labels && (
          <div
            className="structure-notes"
            aria-label="结构名称与简要说明"
            style={{ gridTemplateRows: `repeat(${entry.parts.length}, 1fr)` }}
          >
            {entry.parts.map((p, i) => (
              <button
                type="button"
                key={p.name}
                className="structure-note"
                aria-pressed={selected === i}
                onClick={() => setSelected(i)}
              >
                <strong>
                  <span>{i + 1}</span>
                  {p.name}
                </strong>
                <small>{p.short}</small>
              </button>
            ))}
          </div>
        )}
        {labels && !zoom && !failed && (
          <svg
            className="structure-leader"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polyline
              points={`${part.x * 0.68},${part.y} 69,${part.y} 71,${((selected + 0.5) * 100) / entry.parts.length} 72,${((selected + 0.5) * 100) / entry.parts.length}`}
            />
          </svg>
        )}
      </div>
      <div className="science-controls">
        <Button aria-pressed={labels} onClick={() => setLabels(!labels)}>
          {labels ? "隐藏结构标注" : "显示结构标注"}
        </Button>
        <Button
          aria-pressed={zoom}
          onClick={() => setZoom(!zoom)}
          disabled={failed}
        >
          {zoom ? "返回全图" : "放大当前结构"}
        </Button>
        <Button
          onClick={() => {
            setLabels(true);
            setSelected(
              (selected + entry.parts.length - 1) % entry.parts.length,
            );
          }}
        >
          上一结构
        </Button>
        <Button
          onClick={() => {
            setLabels(true);
            setSelected((selected + 1) % entry.parts.length);
          }}
        >
          下一结构
        </Button>
      </div>
      <p className="science-caption structure-detail" role="status">
        <strong>{part.name}：</strong>
        {part.detail}
      </p>
      <p className="science-caption">{entry.scope}</p>
      <details className="structure-evidence">
        <summary>图像核对记录与依据</summary>
        <p>{entry.review}</p>
        <p>
          AI 辅助教学插画，标注为网页文字；不按制造、解剖或地质比例。
          {entry.sources.map(([title, url]) => (
            <a key={url} href={url} target="_blank" rel="noreferrer">
              {title}
            </a>
          ))}
        </p>
      </details>
    </section>
  );
}
