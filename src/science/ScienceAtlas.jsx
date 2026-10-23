import React, { useEffect, useState } from "react";
import Button from "../LabButton.jsx";
// One implementation for editable, keyboard-accessible labels on generated art.
export default function ScienceAtlas({
  asset,
  points,
  chapter,
  chapterMap,
  notice,
  annotations = [],
}) {
  const [selected, setSelected] = useState(0),
    [labels, setLabels] = useState(true);
  useEffect(() => {
    if (chapterMap && chapter in chapterMap) setSelected(chapterMap[chapter]);
  }, [chapter, chapterMap]);
  return (
    <div className="science-atlas">
      <div className="science-atlas-figure">
        <div className="science-atlas-image">
          <img
            src={`${import.meta.env.BASE_URL}${asset.file}`}
            width={asset.width}
            height={asset.height}
            alt={asset.alt}
          />
          {labels && (
            <svg
              className="science-atlas-leaders"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {points.map(([, x, y], i) => (
                <g key={i} className={selected === i ? "is-selected" : ""}>
                  {annotations[i] && <polyline points={annotations[i].line} />}
                  <circle cx={x} cy={y} r="0.65" />
                </g>
              ))}
            </svg>
          )}
          {labels &&
            points.map(([name, x, y], i) => (
              <React.Fragment key={name}>
                <span
                  className="science-atlas-point"
                  aria-hidden="true"
                  data-selected={selected === i}
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  {i + 1}
                </span>
                <button
                  key={name}
                  className="science-hotspot"
                  style={{ left: `${x}%`, top: `${y}%` }}
                  aria-label={`查看${name}`}
                  aria-pressed={selected === i}
                  onClick={() => setSelected(i)}
                >
                  {i + 1}
                </button>
              </React.Fragment>
            ))}
        </div>
        {labels && (
          <div
            className="science-atlas-annotations"
            aria-label="图中结构名称与简要说明"
          >
            {points.map(([name, , , description], i) => (
              <button
                type="button"
                key={name}
                className="science-atlas-note"
                style={{
                  "--note-x": `${annotations[i]?.x || 0}%`,
                  "--note-y": `${annotations[i]?.y || 0}%`,
                }}
                aria-pressed={selected === i}
                onClick={() => setSelected(i)}
              >
                <strong>
                  <span>{i + 1}</span>
                  {name}
                </strong>
                <small>{annotations[i]?.short || description}</small>
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="science-controls">
        <Button
          className="science-atlas-label-toggle"
          aria-pressed={labels}
          onClick={() => setLabels((v) => !v)}
        >
          {labels ? "隐藏图中标注" : "显示图中标注"}
        </Button>
        {points.map(([name], i) => (
          <Button
            key={name}
            aria-pressed={selected === i}
            onClick={() => setSelected(i)}
          >
            {i + 1} · {name}
          </Button>
        ))}
      </div>
      <p className="science-caption" role="status">
        <strong>{points[selected][0]}：</strong>
        {points[selected][3]}
      </p>
      <p className="science-caption">{notice}</p>
    </div>
  );
}
