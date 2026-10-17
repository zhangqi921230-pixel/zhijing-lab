import React, { useMemo, useState } from "react";
import { ph } from "./models.mjs";
import {
  titrationKeyboardValue,
  titrationVolumeLabel,
} from "./titrationInput.mjs";
import "./PhotoResponsePlot.css";

export function titrationSamples(acid, c, min, max) {
  const volumes = new Set(
    Array.from({ length: 201 }, (_, i) => min + ((max - min) * i) / 200),
  );
  volumes.add(acid);
  // Resolve the steep, continuous transition rather than drawing a jump past pH 7.
  for (let power = -7; power <= 1; power += 0.25) {
    volumes.add(acid - 10 ** power);
    volumes.add(acid + 10 ** power);
  }
  return [...volumes]
    .filter((v) => v >= min && v <= max)
    .sort((a, b) => a - b)
    .map((volume) => ({ volume, pH: ph(acid, volume, c) }));
}

export default function TitrationCurve({ p, onPrepare }) {
  const [near, setNear] = useState(false);
  const min = near ? Math.max(0, p.acid - 0.5) : 0;
  const max = near ? Math.min(100, p.acid + 0.5) : 100;
  const x = (v) => 42 + (300 * (v - min)) / (max - min),
    y = (v) => 178 - 10 * v;
  const samples = useMemo(
    () => titrationSamples(p.acid, p.c, min, max),
    [p.acid, p.c, min, max],
  );
  const path = samples
    .map(({ volume, pH }, i) => `${i ? "L" : "M"}${x(volume)},${y(pH)}`)
    .join(" ");
  const current = ph(p.acid, p.base, p.c);
  const visible = p.base >= min && p.base <= max;
  return (
    <section
      className="photo-response titration-curve"
      aria-label="酸碱滴定曲线"
    >
      <header>
        <strong>加入量与 pH</strong>
        <span>25°C · 理想模型</span>
      </header>
      <div className="acid-equivalence" role="group" aria-label="滴定曲线范围">
        <button
          className="btn"
          aria-pressed={!near}
          onClick={() => setNear(false)}
        >
          全过程
        </button>
        <button
          className="btn"
          aria-pressed={near}
          onClick={() => setNear(true)}
        >
          中和点附近
        </button>
      </div>
      <svg
        viewBox="0 0 360 220"
        role="img"
        aria-label={`滴定曲线，横轴加入体积 ${min} 至 ${max} mL，纵轴 pH 0 至 14`}
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          if (!bounds.width) return;
          const fraction = Math.max(
            0,
            Math.min(
              1,
              (((event.clientX - bounds.left) / bounds.width) * 360 - 42) / 300,
            ),
          );
          onPrepare({
            base: Number((min + (max - min) * fraction).toFixed(2)),
          });
        }}
      >
        {[0, 7, 14].map((v) => (
          <g key={v}>
            <line className="photo-grid" x1="42" x2="342" y1={y(v)} y2={y(v)} />
            <text x="34" y={y(v) + 4} textAnchor="end">
              {v}
            </text>
          </g>
        ))}
        <text x="42" y="19">
          pH
        </text>
        <line
          className="photo-guide-line"
          x1={x(p.acid)}
          x2={x(p.acid)}
          y1="38"
          y2="178"
        />
        <path d={path} fill="none" stroke="#d4a65a" strokeWidth="2.5" />
        <circle
          cx={x(p.acid)}
          cy={y(7)}
          r="4"
          fill="none"
          stroke="currentColor"
        />
        {visible && (
          <circle
            cx={x(p.base)}
            cy={y(current)}
            r="5"
            fill="#338064"
            stroke="#fff"
            strokeWidth="2"
          />
        )}
        {[min, (min + max) / 2, max].map((v) => (
          <text key={v} x={x(v)} y="195" textAnchor="middle">
            {Number(v.toFixed(2))}
          </text>
        ))}
        <text x="192" y="217" textAnchor="middle">
          累计加入 NaOH / mL
        </text>
      </svg>
      <p className="photo-current">
        {titrationVolumeLabel(p.base, p.acid)} mL →{" "}
        <strong>pH {current.toFixed(2)}</strong>
        {!visible && " · 当前点在放大范围外"}
      </p>
      <label>
        对照加入量{" "}
        <input
          type="range"
          min="0"
          max="100"
          step="any"
          value={p.base}
          aria-label="曲线对照加入量"
          aria-valuetext={`${titrationVolumeLabel(p.base, p.acid)} mL，pH ${current.toFixed(2)}`}
          onChange={(event) => onPrepare({ base: Number(event.target.value) })}
          onKeyDown={(event) => {
            const next = titrationKeyboardValue(p.base, event.key);
            if (next !== null) {
              event.preventDefault();
              onPrepare({ base: next });
            }
          }}
          style={{ width: "100%", "--range-progress": `${p.base}%` }}
        />
      </label>
      <p>
        点按曲线或用滑块准备对照状态，会暂停滴加；减小体积表示重新准备，不是从混合液中取出碱。中和点{" "}
        {p.acid} mL，pH 7。
      </p>
      <p>
        固定盐酸 {p.acid} mL、共同浓度 {p.c}{" "}
        mol/L。曲线为模型预测，不是实测记录。
      </p>
    </section>
  );
}
