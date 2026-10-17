import { waveFrame } from "./waveFrame.mjs";
import WaveTimeStudy from "./WaveTimeStudy.jsx";
import React from "react";
import { waveState, buoyancyState } from "./visualPhysics.mjs";
import BuoyancyPlot from "./BuoyancyPlot.jsx";
import "./VisualPhysicsScene.css";
export const waveDisplacementText = (value) =>
  Number(value.toFixed(3)).toFixed(3);
export default function VisualPhysicsScene({ id, p, t, onChange }) {
  if (id === "waves") {
    const frame = waveFrame(p, t);
    const path = (key, base) =>
      frame.samples
        .map(
          (point, i) =>
            `${i ? "L" : "M"}${(60 + point.x * 60).toFixed(3)},${(base - point[key] * 60).toFixed(3)}`,
        )
        .join(" ");
    const q = waveState(p, p.probe, t);
    const rows =
      p.mode === 0
        ? [["total", 135, "单列行波 →", "var(--ui-primary)"]]
        : [
            ["first", 135, "波 1 →", "var(--ui-gold)"],
            [
              "second",
              395,
              p.mode === 2 ? "← 波 2" : "波 2 →",
              "var(--ui-ink)",
            ],
            ["total", 655, "合成位移", "var(--ui-primary)"],
          ];
    return (
      <section className="visual-physics" aria-label="波的传播观察台">
        <header>
          <small>WAVE STUDIO · 追踪同一个质点</small>
          <h2>
            {
              [
                "振动向前传，质点不搬家。",
                "两列波相遇，位移逐点相加。",
                "波形在振动，波节留在原地。",
              ][p.mode]
            }
          </h2>
          <p>
            波长 {(p.speed / p.frequency).toFixed(2)} m · 周期{" "}
            {(1 / p.frequency).toFixed(2)} s · 时间 {t.toFixed(2)} s
          </p>
        </header>
        <div className="vp-modes">
          {["单列行波", "同向叠加", "相向驻波"].map((s, i) => (
            <button
              key={s}
              aria-pressed={p.mode === i}
              onClick={() => onChange("mode", i)}
            >
              {s}
            </button>
          ))}
        </div>
        <div
          className="vp-wave-scroll"
          role="region"
          tabIndex="0"
          aria-label="空间波形图，可横向滚动"
        >
          <svg
            className="vp-wave-diagram"
            viewBox={`0 0 840 ${rows.length * 260}`}
            role="img"
            aria-label={
              p.mode === 0
                ? "单列行波：质点位置与当前位移"
                : "三条同尺度曲线：第一列波、第二列波和合成位移"
            }
          >
            {rows.map(([key, base, label, color]) => (
              <g key={key} data-wave-row={key}>
                <text x="24" y={base - 113}>
                  {label}
                </text>
                <path d={`M60 ${base}H780`} className="vp-axis" />
                {[-1.6, 1.6].map((v) => (
                  <g key={v}>
                    <path d={`M60 ${base - v * 60}H780`} className="vp-grid" />
                    <text x="50" y={base - v * 60 + 6} textAnchor="end">
                      {v}
                    </text>
                  </g>
                ))}
                <text x="780" y={base - 113} textAnchor="end">
                  位移 / m
                </text>
                {[0, 2, 4, 6, 8, 10, 12].map((x) => (
                  <g key={x}>
                    <path
                      d={`M${60 + x * 60} ${base - 100}v200`}
                      className="vp-grid"
                    />
                    <text
                      x={60 + x * 60}
                      y={base + 110}
                      textAnchor={x === 0 ? "start" : "middle"}
                      fontSize="20"
                    >
                      {x}m
                    </text>
                  </g>
                ))}
                <path
                  d={path(key, base)}
                  fill="none"
                  stroke={color}
                  strokeWidth="3"
                />
                {key === "total" &&
                  frame.markers.map((point, i) => {
                    const x = point.x;
                    return (
                      <circle
                        key={i}
                        cx={60 + x * 60}
                        cy={base - point.total * 60}
                        r="3"
                        fill="var(--ui-primary)"
                      />
                    );
                  })}
                <path
                  d={`M${60 + p.probe * 60} ${base - 100}v200`}
                  stroke="var(--ui-muted)"
                  strokeDasharray="3 5"
                />
                <circle
                  cx={60 + p.probe * 60}
                  cy={base - q[key] * 60}
                  r="7"
                  fill={color}
                  stroke="var(--ui-paper)"
                  strokeWidth="2"
                />
              </g>
            ))}
          </svg>
        </div>
        <div className="vp-readout">
          <strong>标记点 x = {p.probe.toFixed(1)} m</strong>
          <span>
            {waveDisplacementText(q.first)} +{" "}
            {q.second < -0.0005
              ? `(${waveDisplacementText(q.second)})`
              : waveDisplacementText(q.second)}{" "}
            = {waveDisplacementText(q.total)} m
          </span>
        </div>
        <p>
          {p.mode === 0 ? "单列模式只显示一列波。" : "上方三行横纵尺度相同。"}
          虚线固定观察位置，圆点随时间上下振动；下方“播放”启动，调节参数会暂停。
        </p>
        <WaveTimeStudy p={p} t={t} />
      </section>
    );
  }
  const q = buoyancyState(p),
    height = 100 * Math.cbrt(p.volume),
    width = height * 0.85;
  const bottom =
    p.mode === 1 && p.solid > p.liquid
      ? 438
      : 240 +
        height * q.fraction +
        (p.mode === 1 && p.solid === p.liquid ? 30 : 0);
  const top = bottom - height,
    x = 350 - width / 2;
  const maxForce = Math.max(q.weight, q.force, 1),
    scale = 95 / maxForce;
  const arrow = (at, y, length, color, label, up) => (
    <g>
      <path
        d={`M${at} ${y}v${up ? -length : length}`}
        stroke={color}
        strokeWidth="4"
      />
      <path
        d={`M${at - 7} ${y + (up ? -length : length) + (up ? 10 : -10)}L${at} ${y + (up ? -length : length)}L${at + 7} ${y + (up ? -length : length) + (up ? 10 : -10)}`}
        fill="none"
        stroke={color}
        strokeWidth="3"
      />
      <text x={at + 14} y={y + (up ? -length : length)} fill={color}>
        {label}
      </text>
    </g>
  );
  return (
    <section className="visual-physics" aria-label="浮力观察台">
      <header>
        <small>BUOYANCY STUDIO · 透明水槽</small>
        <h2>{q.state} · 观察排水与受力</h2>
        <p>
          同一受力图使用相同力长比例；箭头为受力示意，长度比例会随本组最大力调整。
        </p>
      </header>
      <div className="vp-modes">
        {["受控浸入", "观察最终平衡"].map((s, i) => (
          <button
            key={s}
            aria-pressed={p.mode === i}
            onClick={() => onChange("mode", i)}
          >
            {s}
          </button>
        ))}
      </div>
      <svg
        viewBox="0 0 840 530"
        role="img"
        aria-label={`${q.state}，排水${q.displaced.toFixed(2)}升，浮力${q.force.toFixed(2)}牛，重力${q.weight.toFixed(2)}牛`}
      >
        <defs>
          <linearGradient id="vp-water" x2="0" y2="1">
            <stop stopColor="#75c9d5" stopOpacity=".2" />
            <stop offset="1" stopColor="#277e99" stopOpacity=".5" />
          </linearGradient>
          <linearGradient id="vp-block" x2="1" y2="1">
            <stop stopColor="#d8b878" />
            <stop offset="1" stopColor="#936532" />
          </linearGradient>
        </defs>
        <path
          d="M120 140V440H580V140"
          fill="none"
          stroke="var(--ui-muted)"
          strokeWidth="5"
        />
        <path d="M123 240H577V437H123Z" fill="url(#vp-water)" />
        <path d="M123 240H577" stroke="#4196b0" strokeWidth="2" />
        {p.mode === 0 && (
          <path d={`M350 90V${top}`} stroke="var(--ui-muted)" strokeWidth="5" />
        )}
        <rect
          x={x}
          y={top}
          width={width}
          height={height}
          rx="3"
          fill="url(#vp-block)"
          stroke="#70532e"
          strokeWidth="2"
        />
        <rect
          x={x}
          y={Math.max(top, 240)}
          width={width}
          height={Math.max(0, bottom - Math.max(top, 240))}
          fill="#3b92ad"
          opacity=".4"
        />
        <path
          d={`M${x - 12} 240H${x + width + 12}`}
          stroke="#73d6e5"
          strokeDasharray="4 4"
        />
        <text x="140" y="224">
          水面 · 浸入 {(q.fraction * 100).toFixed(1)}%
        </text>
        {q.force > 0 &&
          arrow(
            630,
            320,
            q.force * scale,
            "#378eaa",
            `浮力 ${q.force.toFixed(2)} N`,
            true,
          )}
        {p.mode === 0 &&
          Math.abs(q.support) > 1e-8 &&
          arrow(
            190,
            330,
            Math.abs(q.support) * scale,
            "var(--ui-primary)",
            `外力 ${Math.abs(q.support).toFixed(2)} N`,
            q.support > 0,
          )}
        {arrow(
          630,
          330,
          q.weight * scale,
          "#bd763e",
          `重力 ${q.weight.toFixed(2)} N`,
          false,
        )}
        <text x="140" y="484">
          排开液体 {q.displaced.toFixed(2)} L × 液体密度 {p.liquid} kg/m³
        </text>
        <text x="140" y="510">
          F浮 = {q.force.toFixed(2)} N · G = {q.weight.toFixed(2)} N
        </text>
        {p.mode === 1 &&
          p.solid > p.liquid &&
          arrow(
            350,
            bottom,
            q.support * scale,
            "var(--ui-primary)",
            `支持 ${q.support.toFixed(2)} N`,
            true,
          )}
      </svg>
      <div className="vp-readout">
        <strong>
          {p.mode === 0
            ? "保持此位置的外力"
            : q.state === "沉底平衡"
              ? "槽底支持力"
              : "竖直合力"}
        </strong>
        <span>
          {p.mode === 0
            ? Math.abs(q.support) < 1e-8
              ? "0 N · 无需额外竖直力"
              : `${q.support > 0 ? "向上" : "向下"} ${Math.abs(q.support).toFixed(2)} N`
            : q.state === "沉底平衡"
              ? `向上 ${q.support.toFixed(2)} N`
              : "0 N"}
        </span>
      </div>
      <p>
        {p.mode === 0
          ? "顶部刚性杆可提起或向下压住物体。播放演示浸入体积增加；这不是自由下落。"
          : "这里直接定位最终平衡；密度相等时物体可在液体内部悬浮，画面只选一个位置表示。"}
      </p>
      <BuoyancyPlot p={p} onChange={onChange} />
    </section>
  );
}
