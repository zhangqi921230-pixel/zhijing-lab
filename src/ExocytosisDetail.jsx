import React from "react";
import Button from "./LabButton.jsx";
import "./ExocytosisDetail.css";
export function exocytosisState(progress) {
  const p = Math.max(0, Math.min(100, Number(progress) || 0));
  return {
    open: p >= 90,
    cy: 240 - 60 * Math.max(0, Math.min(1, (p - 60) / 30)),
    cargoY:
      p < 90
        ? 240 - 60 * Math.max(0, (p - 60) / 30)
        : 180 - (110 * (p - 90)) / 10,
    stage:
      p < 60
        ? "先完成内质网与高尔基体的加工运输"
        : p < 90
          ? "囊泡靠近细胞膜"
          : p < 100
            ? "融合开口，货物向外释放"
            : "货物已释放到细胞外",
  };
}
export default function ExocytosisDetail({ progress, onSeek }) {
  const q = exocytosisState(progress),
    ink = "var(--ui-ink)",
    membrane = "var(--ui-primary)";
  const boundary = q.open
    ? "M40 130H240C250 130 228 183 240 210C255 245 305 245 320 210C332 183 310 130 320 130H520"
    : "M40 130H520";
  return (
    <section className="exocytosis-detail" aria-label="胞吐局部示意">
      <h3>胞吐时，膜和货物各去了哪里？</h3>
      <p>{q.stage}。下图是局部结构关系示意，与上方运输进度联动。</p>
      <div className="exocytosis-scroll">
        <svg
          viewBox="0 0 560 310"
          role="img"
          aria-label={
            q.open
              ? "囊泡膜与细胞膜连接形成开口，货物释放到外侧"
              : "细胞质内的囊泡靠近细胞膜"
          }
        >
          <rect
            x="25"
            y="130"
            width="510"
            height="165"
            fill="var(--ui-selected)"
            opacity=".45"
          />
          {q.open && <path d={`${boundary}V20H40Z`} fill="var(--ui-surface)" />}
          <text x="40" y="42" fill={ink}>
            细胞外
          </text>
          <text x="40" y="285" fill={ink}>
            细胞质侧
          </text>
          <path d={boundary} fill="none" stroke={membrane} strokeWidth="12" />
          <path
            d={boundary}
            fill="none"
            stroke="var(--ui-surface)"
            strokeWidth="4"
          />
          {!q.open && (
            <>
              <circle
                cx="280"
                cy={q.cy}
                r="40"
                fill="none"
                stroke={membrane}
                strokeWidth="12"
              />
              <circle
                cx="280"
                cy={q.cy}
                r="40"
                fill="none"
                stroke="var(--ui-surface)"
                strokeWidth="4"
              />
            </>
          )}
          {[-1, 0, 1].map((n) => (
            <circle
              key={n}
              data-cargo="true"
              cx={280 + n * 13}
              cy={q.cargoY + (n === 0 ? 7 : -7)}
              r="5"
              fill="var(--ui-gold)"
              stroke={ink}
            />
          ))}
          <text x="365" y="115" fill={ink}>
            细胞膜
          </text>
          <path d={`M330 ${q.cargoY}H390`} stroke={ink} strokeDasharray="4 4" />
          <text x="395" y={q.cargoY + 6} fill={ink}>
            分泌蛋白
          </text>
        </svg>
      </div>
      <div
        className="exocytosis-actions"
        role="group"
        aria-label="定位胞吐阶段"
      >
        {[
          [75, "囊泡靠近"],
          [90, "融合开口"],
          [100, "释放完成"],
        ].map(([p, label]) => (
          <Button
            key={p}
            primary={progress === p}
            aria-pressed={progress === p}
            onClick={() => onSeek(p)}
          >
            {label}
          </Button>
        ))}
      </div>
      <p>
        双线表示膜的结构边界，金色点表示货物。融合后囊泡膜与细胞膜相连，货物经开口释放；不是整颗囊泡穿过膜。图示放大了开口，不按真实尺度或速率绘制；只绘制细胞膜附近，省略细胞壁；不模拟分子级融合机制及后续膜回收。
      </p>
    </section>
  );
}
