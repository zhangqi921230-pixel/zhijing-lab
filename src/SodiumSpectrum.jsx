import React, { useMemo, useState } from "react";
import Button from "./LabButton.jsx";
import "./SodiumSpectrum.css";
import {
  SODIUM_LINES,
  sodiumResponse,
  sodiumProfile,
} from "./sodiumProfile.mjs";
export { SODIUM_LINES, sodiumResponse } from "./sodiumProfile.mjs";
export default function SodiumSpectrum() {
  const [width, setWidth] = useState(0.9);
  const [probe, setProbe] = useState(SODIUM_LINES[0]);
  const { points, peak } = useMemo(() => sodiumProfile(width), [width]);
  const x = (w) => 80 + ((w - 588) / 2.6) * 700,
    y = (v) => 350 - (v / peak) * 200;
  return (
    <section className="sodium-spectrum" aria-label="钠黄光双线观察">
      <h3>拓展：一片黄光，还是两条谱线？</h3>
      <p>
        换成光谱观察，可以分辨肉眼不容易区分的波长。这里仅截取钠黄光附近的两条谱线。
      </p>
      <div className="sodium-controls" role="group" aria-label="谱线展宽对照">
        {[
          [0.9, "混在一起"],
          [0.4, "开始分开"],
          [0.12, "清晰分开"],
        ].map(([value, label]) => (
          <Button
            key={value}
            primary={width === value}
            aria-pressed={width === value}
            onClick={() => setWidth(value)}
          >
            {label}
          </Button>
        ))}
      </div>
      <label className="sodium-width">
        仪器响应宽度（半高全宽）<output>{width.toFixed(2)} nm</output>
        <input
          aria-label="谱线半高全宽"
          type="range"
          min=".08"
          max="1.2"
          step=".01"
          value={width}
          onChange={(e) => setWidth(Number(e.target.value))}
        />
      </label>
      <div className="sodium-controls" role="group" aria-label="波长探针定位">
        {[
          ["第一条谱线", SODIUM_LINES[0]],
          ["两线中点", (SODIUM_LINES[0] + SODIUM_LINES[1]) / 2],
          ["第二条谱线", SODIUM_LINES[1]],
        ].map(([label, value]) => (
          <Button
            key={label}
            primary={probe === value}
            aria-pressed={probe === value}
            onClick={() => setProbe(value)}
          >
            {label}
          </Button>
        ))}
      </div>
      <label className="sodium-width">
        波长探针<output>{probe.toFixed(4)} nm</output>
        <input
          aria-label="观察波长"
          type="range"
          min="588"
          max="590.6"
          step=".0001"
          value={probe}
          onChange={(e) => setProbe(Number(e.target.value))}
        />
      </label>
      <p aria-label="波长探针读数">
        当前波长 {probe.toFixed(4)} nm；归一化示意响应 ≈{" "}
        {(sodiumResponse(probe, width) / peak).toFixed(3)}
        。改变展宽时探针保持原波长；先比较两线中点，再分别观察两条谱线。
      </p>
      <div
        className="sodium-scroll"
        role="region"
        aria-label="钠双线光谱，可横向滚动"
        tabIndex="0"
      >
        <svg
          viewBox="0 0 860 460"
          role="img"
          aria-label="钠黄光双线与展宽后的合成曲线"
        >
          <text x="80" y="38">
            空气中波长 · 钠原子 Na I
          </text>
          <text x="80" y="74">
            纵轴：归一化示意响应；横轴：波长 / nm
          </text>
          {[0, 0.5, 1].map((f) => (
            <g key={f}>
              <path d={`M80 ${350 - f * 200}H780`} stroke="var(--ui-line)" />
              <text x="28" y={357 - f * 200}>
                {f.toFixed(1)}
              </text>
            </g>
          ))}
          {[588, 588.5, 589, 589.5, 590, 590.5].map((w) => (
            <g key={w}>
              <path d={`M${x(w)} 350v8`} stroke="var(--ui-muted)" />
              <text x={x(w)} y="385" textAnchor="middle">
                {w.toFixed(1)}
              </text>
            </g>
          ))}
          {SODIUM_LINES.map((w, i) => (
            <g key={w}>
              <path
                d={`M${x(w)} 135V350`}
                stroke="var(--ui-muted)"
                strokeDasharray="6 5"
              />
              <text
                x={x(w) + (i ? 12 : -12)}
                y="120"
                textAnchor={i ? "start" : "end"}
              >
                {w.toFixed(4)} nm
              </text>
            </g>
          ))}
          <path
            d={points
              .map(
                (p, i) =>
                  `${i ? "L" : "M"}${x(p.wavelength).toFixed(2)} ${y(p.value).toFixed(2)}`,
              )
              .join(" ")}
            fill="none"
            stroke="var(--ui-gold)"
            strokeWidth="3"
          />
          <path
            d={`M${x(probe)} 145V350`}
            stroke="var(--ui-primary)"
            strokeDasharray="3 4"
          />
          <circle
            data-testid="sodium-probe"
            cx={x(probe)}
            cy={y(sodiumResponse(probe, width))}
            r="6"
            fill="var(--ui-primary)"
            stroke="var(--ui-surface)"
            strokeWidth="2"
          />
          <path d="M80 140V350H780" fill="none" stroke="var(--ui-muted)" />
          <text x="80" y="430">
            两线间距 0.5974 nm；缩小峰宽不会改变谱线位置
          </text>
        </svg>
      </div>
      <p>
        波长来自{" "}
        <a
          href="https://physics.nist.gov/PhysRefData/Handbook/Tables/sodiumtable2.htm"
          target="_blank"
          rel="noreferrer"
        >
          NIST 钠强谱线表 ↗
        </a>
        （Å 换算为 nm）。曲线采用高斯响应与固定 2∶1
        示意权重，并按当前峰值归一化；不模拟真实火焰的线宽、浓度或绝对强度，不能据此比较样品含量。
      </p>
    </section>
  );
}
