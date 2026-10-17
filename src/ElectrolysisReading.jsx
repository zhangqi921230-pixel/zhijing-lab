import React, { useId, useState } from "react";
import Button from "./LabButton.jsx";
import { electrolysisState } from "./chemistryTopics.mjs";
import { electrolysisColumn } from "./electrolysisColumn.mjs";
export default function ElectrolysisReading({ p, time, onSeek }) {
  const [reveal, setReveal] = useState(false),
    uid = useId().replace(/:/g, "");
  const q = electrolysisState(p.current, time);
  return (
    <section className="electrolysis-compare" aria-label="倒置集气管读数练习">
      <h3>读气体柱，不是剩余水柱</h3>
      <p>
        两管内径相同，气体从封闭顶部向下积累，把水排出。先对照刻度估读，再显示模型数值核对。
      </p>
      <div className="motion-shortcuts">
        <Button aria-pressed={reveal} onClick={() => setReveal((v) => !v)}>
          {reveal ? "隐藏精确读数" : "显示精确读数"}
        </Button>
        {[0, 300, 600].map((t) => (
          <Button key={t} onClick={() => onSeek(t)}>
            观察 {t} 秒集气
          </Button>
        ))}
      </div>
      <div
        className="electrolysis-reading-scroll"
        role="region"
        tabIndex="0"
        aria-label="集气刻度放大图，可横向滚动"
      >
        <svg
          viewBox="0 0 700 510"
          role="img"
          aria-label="等内径倒置集气管，气体体积刻度自上向下增加"
        >
          <defs>
            <pattern
              id={uid}
              width="8"
              height="8"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 8L8 0"
                stroke="var(--ui-primary)"
                strokeOpacity=".18"
              />
            </pattern>
          </defs>
          {[
            ["阴极 − · H₂", q.hydrogen, 130],
            ["阳极 + · O₂", q.oxygen, 450],
          ].map(([label, volume, x]) => {
            const height = (electrolysisColumn(volume).gasHeight / 1.75) * 320,
              y = 80 + height;
            return (
              <g key={label}>
                <text x={x + 30} y="34" textAnchor="middle">
                  {label}
                </text>
                <path
                  d={`M${x} 414V88Q${x} 80 ${x + 8} 80H${x + 52}Q${x + 60} 80 ${x + 60} 88V414`}
                  fill="var(--ui-paper)"
                  stroke="var(--ui-muted)"
                  strokeWidth="2"
                />
                <rect
                  x={x + 2}
                  y="82"
                  width="56"
                  height={Math.max(0, height - 2)}
                  fill={`url(#${uid})`}
                />
                <rect
                  x={x + 2}
                  y={y}
                  width="56"
                  height={414 - y}
                  fill="var(--ui-primary)"
                  opacity=".15"
                />
                <line
                  data-testid="gas-reading-interface"
                  x1={x}
                  x2={x + 60}
                  y1={y}
                  y2={y}
                  stroke="var(--ui-gold)"
                  strokeWidth="3"
                />
                {[0, 20, 40, 60, 80, 100, 120, 140, 160].map((v) => (
                  <g key={v}>
                    <path
                      d={`M${x + 62} ${80 + v * 2}h${v % 40 ? 7 : 14}`}
                      stroke="var(--ui-muted)"
                    />
                    <text x={x + 84} y={85 + v * 2}>
                      {v % 40 === 0 ? `${v} mL` : ""}
                    </text>
                  </g>
                ))}
                <path
                  d={`M${x - 12} 80h-8V${y}h8`}
                  fill="none"
                  stroke="var(--ui-gold)"
                  strokeWidth="2"
                />
                <text x={x + 30} y="455" textAnchor="middle">
                  {reveal
                    ? `${volume.toFixed(2)} mL`
                    : "估读：气液界面对应哪条刻度？"}
                </text>
              </g>
            );
          })}
          <text x="350" y="492" textAnchor="middle">
            斜线区域：气体　淡色区域：水　金线：气液界面
          </text>
        </svg>
      </div>
      <p>
        {time === 0
          ? "尚未产气，两管都为零，不能计算0∶0。"
          : reveal
            ? "同温同压下，H₂体积∶O₂体积 = 2∶1；等内径使气柱高度比也为2∶1。"
            : "提示：比较金色括号的长度。两管必须使用相同的体积刻度，不能分别拉伸图像。"}
      </p>
      <p>
        这是与主装置同步的理想读数示意，量程为160 mL；数值按25°C、1
        atm干燥理想气体计算。实际测量还需处理气压差、水蒸气等影响，本图不模拟弯月面或视差，也不作为真实量筒标定。
      </p>
    </section>
  );
}
