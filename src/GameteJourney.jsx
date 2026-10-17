import { gameteRoute } from "./gameteRoute.mjs";
import React, { useState, useEffect } from "react";
import Button from "./LabButton.jsx";
import { genotypeNames } from "./geneticsSampling.mjs";
import "./GameteJourney.css";
const clamp = (x) => Math.max(0, Math.min(1, x));
export const journeyAlleles = (p, selected) => [
  genotypeNames[p.parent1][Math.floor(selected / 2)],
  genotypeNames[p.parent2][selected % 2],
];
export default function GameteJourney({
  p,
  selected,
  onSelect,
  onPauseSampling = () => {},
}) {
  const [time, setTime] = useState(0),
    [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    let frame, last;
    const tick = (now) => {
      if (document.hidden) last = undefined;
      else {
        if (last !== undefined) {
          const dt = Math.min(0.05, (now - last) / 1000);
          setTime((t) => Math.min(6, t + dt));
        }
        last = now;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running]);
  useEffect(() => {
    if (time >= 6) setRunning(false);
  }, [time]);
  const seek = (t) => {
    onPauseSampling();
    setRunning(false);
    setTime(t);
  };
  const split = clamp(time / 2),
    travel = clamp((time - 2) / 3),
    finish = clamp(time - 5),
    alleles = journeyAlleles(p, selected),
    genotype = [...alleles].sort().join("");
  return (
    <section className="gamete-journey" aria-label="从配子到受精的逐步演示">
      <h3>追踪一个子代的两个等位基因</h3>
      <p>
        选择要观察的组合，再播放。每个配子在这个基因位点只携带一个等位基因；结合后子代得到两个，分别来自两个亲本。
      </p>
      <div
        className="gamete-journey-scroll"
        tabIndex="0"
        role="region"
        aria-label="配子形成与结合示意图，可横向滚动"
      >
        <svg
          viewBox="0 0 800 400"
          role="img"
          aria-label={`亲本${genotypeNames[p.parent1]}与${genotypeNames[p.parent2]}，选定${alleles[0]}和${alleles[1]}，子代${genotype}`}
        >
          {[0, 1].map((parent) => (
            <path
              key={parent}
              d={
                gameteRoute(
                  parent,
                  parent ? selected % 2 : Math.floor(selected / 2),
                  0,
                ).path
              }
              fill="none"
              stroke={parent ? "#b68ac4" : "#6fa9b7"}
              strokeWidth="2"
              strokeDasharray="6 6"
              opacity={split * 0.65}
            />
          ))}
          {[p.parent1, p.parent2].map((parent, j) => {
            const center = j ? 580 : 220,
              chosen = j ? selected % 2 : Math.floor(selected / 2);
            return (
              <g key={j}>
                <text x={center} y="30" textAnchor="middle">
                  亲本{j ? "二" : "一"} · {genotypeNames[parent]}
                </text>
                <ellipse
                  cx={center}
                  cy="110"
                  rx="74"
                  ry="53"
                  fill="var(--ui-selected)"
                  stroke="var(--ui-muted)"
                  opacity={1 - split}
                />
                {[0, 1].map((i) => {
                  const startX = center + (i ? 24 : -24),
                    gameteX = center + (i ? 65 : -65),
                    moving = i === chosen;
                  const route = gameteRoute(j, i, travel),
                    x =
                      moving && travel > 0
                        ? route.x
                        : startX + (gameteX - startX) * split,
                    y = moving && travel > 0 ? route.y : 110 + 45 * split;
                  return (
                    <g key={i} opacity={moving ? 1 : 1 - travel * 0.55}>
                      <circle
                        cx={x}
                        cy={y}
                        r="32"
                        fill="var(--ui-surface)"
                        stroke={
                          moving ? "var(--ui-primary)" : "var(--ui-muted)"
                        }
                        strokeWidth={moving ? 3 : 1}
                        opacity={split * (1 - (moving ? finish : 0))}
                      />
                      <rect
                        x={x - 12}
                        y={y - 26}
                        width="24"
                        height="52"
                        rx="12"
                        fill={j ? "#b68ac4" : "#6fa9b7"}
                        stroke="var(--ui-ink)"
                      />
                      <text
                        x={x}
                        y={y + 7}
                        textAnchor="middle"
                        style={{
                          fill: "#10252a",
                          fontSize: 22,
                          fontWeight: 700,
                        }}
                      >
                        {genotypeNames[parent][i]}
                      </text>
                      {split > 0.8 && travel < 0.1 && (
                        <text
                          x={x}
                          y={y + 54}
                          textAnchor="middle"
                          fontSize="16"
                        >
                          位置 {i + 1}
                        </text>
                      )}
                    </g>
                  );
                })}
                <text
                  x={center}
                  y="220"
                  textAnchor="middle"
                  fontSize="16"
                  opacity={1 - travel}
                >
                  {parent === 1
                    ? "配子 A、a：各 50%"
                    : "配子 " + (parent === 0 ? "A" : "a") + "：100%"}
                </text>
              </g>
            );
          })}
          <ellipse
            cx="400"
            cy="290"
            rx="73"
            ry="48"
            fill="none"
            stroke="var(--ui-primary)"
            strokeWidth="3"
            opacity={finish}
          />
          <text x="400" y="370" textAnchor="middle">
            {time < 2
              ? "① 两个等位基因，分别进入配子"
              : time < 5
                ? "② 两亲本各选一个配子，靠近结合"
                : "③ 结合后恢复成对：" + genotype}
          </text>
        </svg>
      </div>
      <div
        className="genetics-actions"
        role="group"
        aria-label="追踪的配子组合"
      >
        {[0, 1, 2, 3].map((index) => {
          const a = journeyAlleles(p, index);
          return (
            <Button
              key={index}
              aria-pressed={selected === index}
              onClick={() => {
                seek(0);
                onSelect(index);
              }}
            >
              组合 {index + 1}：{a[0]} ＋ {a[1]}
            </Button>
          );
        })}
      </div>
      <div className="genetics-actions">
        <Button
          primary
          onClick={() => {
            onPauseSampling();
            if (time >= 6) setTime(0);
            setRunning((v) => !v);
          }}
        >
          {running ? "暂停结合过程" : "播放结合过程"}
        </Button>
        <Button onClick={() => seek(0)}>重新观察</Button>
        {[2, 5, 6].map((t, i) => (
          <Button key={t} onClick={() => seek(t)}>
            {["配子已形成", "结合前", "查看子代"][i]}
          </Button>
        ))}
      </div>
      <label className="gamete-progress">
        过程进度 <output>{time.toFixed(2)} / 6 秒</output>
        <input
          aria-label="配子结合进度"
          type="range"
          min="0"
          max="6"
          step=".01"
          value={time}
          onChange={(e) => seek(Number(e.target.value))}
        />
      </label>
      <p className="gamete-source-legend">
        蓝色条形来自亲本一，紫色条形来自亲本二；颜色标记来源，不表示显性或隐性。虚线是教学追踪路线，不代表配子的真实游动轨迹。
      </p>
      <p>
        当前选定：亲本一提供 {alleles[0]}，亲本二提供 {alleles[1]}，组合为{" "}
        <strong>{genotype}</strong>
        。这是对指定组合的追踪，不会增加随机抽样区的样本数。
      </p>
      <details>
        <summary>两个位置，是否一定是两种配子？</summary>
        <p>
          不是。AA 的两个位置都标 A，产生的配子在这个位点都携带 A；Aa 才有 A、a
          两种配子。四个位置组合各占 25%
          的机会，相同基因型需要合并。条形只标示等位基因的来源，不代表全部染色体；此处省略复制、减数分裂的细胞过程以及受精结构，不能把两个图示配子当作一次减数分裂的完整产物。
        </p>
      </details>
    </section>
  );
}
