import React from "react";
import "./CellStage.css";

const objects = [
  ["perspective", "全景", 0],
  ["nucleus", "细胞核近景", 1],
  ["vacuole", "液泡近景", 2],
  ["chloroplast", "叶绿体近景", 3],
  ["mitochondrion", "线粒体近景", 4],
  ["golgi", "高尔基体近景", 5],
  ["reticulum", "内质网近景", 6],
];
export const isCellCloseup = (view) =>
  objects.slice(1).some(([key]) => key === view);

export default function CellViewControls({
  view,
  angle = 0,
  motion = 0,
  onPart,
  onAngle,
  onMotion,
}) {
  const closeup = isCellCloseup(view);
  const directions = [
    ["perspective", "立体"],
    ["front", "正视"],
    ["top", "俯视"],
  ];
  const activeAngle = closeup
    ? angle
    : directions.findIndex(([key]) => key === view);
  return (
    <div className="cell-view-controls">
      <div className="view-switch" role="group" aria-label="观察对象">
        <span>观察对象</span>
        {objects.map(([key, label, part]) => (
          <button
            key={key}
            aria-pressed={closeup ? view === key : part === 0}
            onClick={() => onPart(part)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="view-switch" role="group" aria-label="观察方向">
        <span>观察方向</span>
        {directions.map(([key, label], index) => (
          <button
            key={key}
            aria-pressed={activeAngle === index}
            onClick={() => onAngle(index)}
          >
            {label}
          </button>
        ))}
      </div>
      <details className="cell-camera-options">
        <summary>镜头切换设置</summary>
        <div className="view-switch" role="group" aria-label="镜头切换方式">
          <span>镜头切换</span>
          {["跟随系统", "平滑切换", "直接定位"].map((label, index) => (
            <button
              key={label}
              aria-pressed={motion === index}
              onClick={() => onMotion?.(index)}
            >
              {label}
            </button>
          ))}
        </div>
      </details>
    </div>
  );
}
