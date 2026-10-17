import React, { useEffect, useState } from "react";
import Button from "./LabButton.jsx";
import "./WaterAtomBalance.css";
export const waterAtoms = [
  { id: "O1", element: "O", from: [220, 165], to: [472, 165] },
  { id: "H1", element: "H", from: [184, 205], to: [108, 165] },
  { id: "H2", element: "H", from: [256, 205], to: [150, 165] },
  { id: "O2", element: "O", from: [420, 165], to: [522, 165] },
  { id: "H3", element: "H", from: [384, 205], to: [278, 165] },
  { id: "H4", element: "H", from: [456, 205], to: [320, 165] },
];
export function waterAtomPosition(atom, progress) {
  const t = Math.max(0, Math.min(1, progress / 100)),
    s = t * t * (3 - 2 * t),
    arc = Math.sin(Math.PI * t) * (atom.element === "O" ? -60 : 60);
  return [
    atom.from[0] + (atom.to[0] - atom.from[0]) * s,
    atom.from[1] + (atom.to[1] - atom.from[1]) * s + arc,
  ];
}
export default function WaterAtomBalance() {
  const [progress, setProgress] = useState(0),
    [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return;
    let frame, last;
    const tick = (now) => {
      if (document.hidden) {
        last = undefined;
      } else {
        if (last !== undefined) {
          const dt = Math.min(100, now - last);
          setProgress((p) => Math.min(100, p + dt / 40));
        }
        last = now;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing]);
  useEffect(() => {
    if (progress >= 100) setPlaying(false);
  }, [progress]);
  const seek = (value) => {
    setPlaying(false);
    setProgress(value);
  };
  const points = waterAtoms.map((a) => waterAtomPosition(a, progress));
  return (
    <section className="water-atom-balance" aria-label="电解水原子守恒模型">
      <h3>分子重新组合，原子没有减少</h3>
      <p>2H₂O → 2H₂ + O₂：追踪同一组四个氢原子、两个氧原子。</p>
      <div className="water-atom-scroll">
        <svg
          viewBox="0 0 640 330"
          role="img"
          aria-label="两份水的原子重组为两份氢气和一份氧气"
        >
          <text x="320" y="45" textAnchor="middle">
            {progress === 0
              ? "反应物：2 个水分子"
              : progress === 100
                ? "生成物：2 个氢分子 + 1 个氧分子"
                : "保持原子种类与数量，观察重新组合"}
          </text>
          {[
            [0, 1],
            [0, 2],
            [3, 4],
            [3, 5],
          ].map(([a, b]) => (
            <line
              key={`before${a}${b}`}
              x1={points[a][0]}
              y1={points[a][1]}
              x2={points[b][0]}
              y2={points[b][1]}
              stroke="var(--ui-muted)"
              strokeWidth="5"
              opacity={Math.max(0, 1 - progress / 25)}
            />
          ))}
          {[
            [1, 2],
            [4, 5],
            [0, 3],
          ].map(([a, b]) => (
            <line
              key={`after${a}${b}`}
              x1={points[a][0]}
              y1={points[a][1]}
              x2={points[b][0]}
              y2={points[b][1]}
              stroke="var(--ui-muted)"
              strokeWidth="5"
              opacity={Math.max(0, (progress - 75) / 25)}
            />
          ))}
          {waterAtoms.map((atom, i) => (
            <g
              key={atom.id}
              data-atom={atom.id}
              transform={`translate(${points[i].join(" ")})`}
            >
              <circle
                r={atom.element === "O" ? 22 : 17}
                fill={atom.element === "O" ? "#ba573c" : "#376c91"}
                stroke="var(--ui-ink)"
              />
              <text textAnchor="middle" y="6" style={{ fill: "#fff" }}>
                {atom.element}
              </text>
            </g>
          ))}
          <text x="320" y="290" textAnchor="middle">
            氢原子：4 个　氧原子：2 个　始终守恒
          </text>
        </svg>
      </div>
      <div className="water-atom-actions">
        <Button
          primary
          onClick={() => {
            if (progress >= 100) setProgress(0);
            setPlaying((v) => !v);
          }}
        >
          {playing ? "暂停原子重排" : "播放原子重排"}
        </Button>
        {[
          [0, "反应前"],
          [50, "追踪原子"],
          [100, "反应后"],
        ].map(([value, label]) => (
          <Button
            key={value}
            aria-pressed={progress === value}
            onClick={() => seek(value)}
          >
            {label}
          </Button>
        ))}
        <label>
          重排进度
          <input
            aria-label="原子重排进度"
            type="range"
            min="0"
            max="100"
            step="1"
            value={progress}
            onChange={(e) => seek(Number(e.target.value))}
          />
        </label>
      </div>
      <p>
        分子个数比 2∶1；按相对分子质量 H₂≈2、O₂≈32，质量比为
        (2×2)∶(1×32)=1∶8。不能把分子个数比直接当成质量比。
      </p>
      <details>
        <summary>这是不是电解的真实微观过程？</summary>
        <p>
          这是用于理解方程式配平的原子重排模型，线段只表示原子成组关系，不表示键级。真实电解涉及两极的电荷转移和界面反应，不是水分子在溶液中直接按这些轨迹拆开再结合。局部动画独立播放，不改变主实验电流、时间和收集量；原子大小、间距与动画时长不按真实尺度。
        </p>
      </details>
    </section>
  );
}
