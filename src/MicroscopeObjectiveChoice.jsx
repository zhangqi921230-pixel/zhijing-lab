import React from "react";

export default function MicroscopeObjectiveChoice({
  mag,
  onChange,
  label = "选择物镜",
}) {
  return (
    <div
      className="microscope-objective-choice"
      role="group"
      aria-label={label}
    >
      {[
        [4, "#ae4542"],
        [10, "#d4ad48"],
        [40, "#487fb0"],
      ].map(([objective, color]) => (
        <button
          key={objective}
          type="button"
          aria-label={`${objective}倍物镜，总倍率${objective * 10}倍`}
          aria-pressed={mag === objective * 10}
          disabled={!onChange}
          onClick={() => onChange("mag", objective * 10)}
          style={{ "--objective-color": color }}
        >
          <strong>{objective}×</strong>
          <small>总 {objective * 10}×</small>
        </button>
      ))}
    </div>
  );
}
