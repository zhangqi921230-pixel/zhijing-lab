import React, { useState } from "react";
export function abundanceRows(p, groups, mode) {
  const total = groups.reduce((sum, [key]) => sum + p[key], 0);
  return groups.map(([key, name]) => ({
    key,
    name,
    count: p[key],
    percent: total ? (p[key] / total) * 100 : null,
    width:
      mode === "count"
        ? (p[key] / 20) * 460
        : total
          ? (p[key] / total) * 460
          : 0,
  }));
}
const percentLabel = (value) =>
  value === null ? "未定义" : `${value.toFixed(1)}%`;
export default function CommunityAbundance({ p, reference, groups }) {
  const [mode, setMode] = useState("count");
  const rows = abundanceRows(p, groups, mode),
    previous = reference ? abundanceRows(reference, groups, mode) : null;
  return (
    <section
      className="community-abundance"
      aria-label="群落计数与占比对齐比较"
    >
      <h3>数量变了，比例一定会变吗？</h3>
      <div className="community-actions" role="group" aria-label="比较指标">
        <button
          aria-pressed={mode === "count"}
          onClick={() => setMode("count")}
        >
          按计数比较
        </button>
        <button
          aria-pressed={mode === "percent"}
          onClick={() => setMode("percent")}
        >
          按占比比较
        </button>
      </div>
      <p>
        {reference
          ? "上方空心条为 A，下方实心条为 B；每一行对照同一个示例种。"
          : "先保存 A，再改变计数，即可在同一行比较两个样方。当前只显示 B。"}{" "}
        {mode === "count"
          ? "统一标尺：0—20。"
          : "统一标尺：0—100%。各样方分别以自己的总计数为分母。"}
      </p>
      <div
        className="community-abundance-scroll"
        role="region"
        tabIndex="0"
        aria-label="四个示例种对照图，可横向滚动"
      >
        <svg
          viewBox="0 0 800 430"
          role="img"
          aria-label={
            mode === "count"
              ? "样方A与B各示例种计数比较"
              : "样方A与B各示例种占比比较"
          }
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <path d={`M${140 + i * 115} 40V373`} stroke="var(--ui-line)" />
              <text x={140 + i * 115} y="28" textAnchor="middle">
                {mode === "count" ? i * 5 : `${i * 25}%`}
              </text>
            </g>
          ))}
          {rows.map((row, i) => {
            const y = 65 + i * 80;
            return (
              <g key={row.key}>
                <text x="12" y={y + 17}>
                  {row.name}
                </text>
                {previous && (
                  <>
                    <text x="108" y={y + 4}>
                      A
                    </text>
                    <rect
                      data-abundance={`a-${row.key}`}
                      x="140"
                      y={y - 9}
                      width={previous[i].width}
                      height="16"
                      fill="none"
                      stroke="var(--ui-muted)"
                      strokeWidth="2"
                    />
                    <text x="623" y={y + 5}>
                      {mode === "count"
                        ? previous[i].count
                        : percentLabel(previous[i].percent)}
                    </text>
                  </>
                )}
                <text x="108" y={y + 33}>
                  B
                </text>
                <rect
                  data-abundance={`b-${row.key}`}
                  x="140"
                  y={y + 19}
                  width={row.width}
                  height="16"
                  fill="var(--ui-primary)"
                />
                <text x="623" y={y + 34}>
                  {mode === "count" ? row.count : percentLabel(row.percent)}
                </text>
              </g>
            );
          })}
          <text x="12" y="411">
            四组各代表一个假想种；真菌按子实体清点，计数不表示生物量。
          </text>
        </svg>
      </div>
      <p>
        以每组4个与8个为例，再切换两种指标：计数条变长，占比条保持原样。增加个体数不等于增加物种数，也不必然提高
        H′。
      </p>
    </section>
  );
}
