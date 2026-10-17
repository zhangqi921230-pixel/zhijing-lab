import React from "react";
export default function CubeGuide({ p, onChange }) {
  const pairs = ["A ↔ F", "B ↔ D", "C ↔ E"];
  return (
    <div className="cube-guide">
      <svg
        viewBox="0 0 140 175"
        role="group"
        aria-label="十字展开图，相对面定位"
      >
        {[
          [1, 1, "A", 1],
          [1, 2, "B", 2],
          [2, 1, "C", 3],
          [1, 0, "D", 2],
          [0, 1, "E", 3],
          [1, 3, "F", 1],
        ].map(([x, y, label, pair]) => (
          <g
            key={label}
            role="button"
            tabIndex="0"
            aria-label={`选择 ${label} 的相对面`}
            aria-pressed={p.pair === pair}
            onClick={() => onChange("pair", pair)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onChange("pair", pair);
              }
            }}
            className="cube-net-face"
          >
            <rect
              x={12 + x * 39}
              y={8 + y * 39}
              width="37"
              height="37"
              rx="2"
              fill={p.pair === pair ? "#e5be73" : "#e3e9da"}
              stroke="#a3b6a0"
            />
            <text
              x={30.5 + x * 39}
              y={32 + y * 39}
              textAnchor="middle"
              fontSize="16"
              transform={`rotate(${{ C: 270, D: 180, E: 90 }[label] ?? 0},${30.5 + x * 39},${26.5 + y * 39})`}
              fill="#355d48"
            >
              {label}
            </text>
          </g>
        ))}
      </svg>
      <div>
        <span>追踪相对面</span>
        <strong>
          {p.pair ? pairs[p.pair - 1] : "先选一个面，再观察它的对面。"}
        </strong>
        <p>
          点击三维纸板或展开图，对应的两个面会同时描边。金色虚线标示折痕；字母帮助追踪旋转后的朝向。
        </p>
        <div className="cube-pairs">
          {pairs.map((label, i) => (
            <button
              key={label}
              aria-pressed={p.pair === i + 1}
              onClick={() => onChange("pair", i + 1)}
            >
              {label}
            </button>
          ))}
          <button aria-pressed={!p.pair} onClick={() => onChange("pair", 0)}>
            全部面
          </button>
        </div>
      </div>
    </div>
  );
}
