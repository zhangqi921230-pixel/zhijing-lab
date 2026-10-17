import React, { useMemo } from "react";
import { solubility } from "./models.mjs";
import "./DilutionPlot.css";
import CrystallizationBalance from "./CrystallizationBalance.jsx";

export function SolubilityPlot({ p, onChange }) {
  const plot = useMemo(() => {
    const max = Math.max(
      50,
      Math.ceil(Math.max((solubility(80) * p.water) / 100, p.mass) / 50) * 50,
    );
    const y = (mass) => 220 - (mass / max) * 176;
    return {
      max,
      y,
      path: [0, 20, 40, 60, 80]
        .map(
          (temp, i) =>
            `${i ? "L" : "M"}${54 + temp * 6},${y((solubility(temp) * p.water) / 100)}`,
        )
        .join(" "),
    };
  }, [p.water, p.mass]);
  const capacity = (solubility(p.temp) * p.water) / 100;
  const dissolved = Math.min(p.mass, capacity),
    solid = Math.max(0, p.mass - capacity);
  const x = 54 + p.temp * 6;
  return (
    <section className="dilution-plot" aria-label="温度与溶解容量图">
      <div className="dilution-plot-heading">
        <h3>投料与溶解容量</h3>
        <span>固定 {p.water} g 水 · 平衡模型</span>
      </div>
      <svg
        viewBox="0 0 590 280"
        role="img"
        aria-label={`${p.temp.toFixed(1)}摄氏度时最多溶解${capacity.toFixed(2)}克，投料${p.mass}克，已溶解${dissolved.toFixed(2)}克，剩余固体${solid.toFixed(2)}克。`}
      >
        <text x="16" y="20">
          硝酸钾质量 / g
        </text>
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i}>
            <path
              className="dilution-grid"
              d={`M54 ${plot.y((plot.max * i) / 4)}H534`}
            />
            <text x="44" y={plot.y((plot.max * i) / 4) + 4} textAnchor="end">
              {(plot.max * i) / 4}
            </text>
          </g>
        ))}
        {[0, 20, 40, 60, 80].map((temp) => (
          <g key={temp}>
            <path className="dilution-grid" d={`M${54 + temp * 6} 44V220`} />
            <text x={54 + temp * 6} y="240" textAnchor="middle">
              {temp}
            </text>
          </g>
        ))}
        <path className="dilution-axis" d="M54 38V220H541" />
        <path className="dilution-curve" d={plot.path} />
        <path className="dilution-probe" d={`M54 ${plot.y(p.mass)}H534`} />
        <path className="dilution-probe" d={`M${x} 220V${plot.y(capacity)}`} />
        {solid > 0 && (
          <path
            stroke="#dc947b"
            strokeWidth="6"
            d={`M${x} ${plot.y(p.mass)}V${plot.y(capacity)}`}
          />
        )}
        <circle
          className="dilution-current"
          cx={x}
          cy={plot.y(dissolved)}
          r="5"
        />
        <text x="534" y="269" textAnchor="end">
          温度 / °C
        </text>
      </svg>
      <p>
        实线曲线：最多可溶解量；金色横虚线：投料量；圆点：当前已溶解量。红色线段表示剩余固体质量。
      </p>
      <div className="dilution-plot-samples" aria-label="比较不同温度">
        {[20, 40, 60, 80].map((temp) => (
          <button
            key={temp}
            onClick={() => onChange("temp", temp)}
            aria-pressed={Math.abs(p.temp - temp) < 0.01}
          >
            {temp}°C{" "}
            <strong>
              容量 {((solubility(temp) * p.water) / 100).toFixed(1)} g
            </strong>
          </button>
        ))}
      </div>
      <p>
        当前已溶解 {dissolved.toFixed(2)} g，剩余固体 {solid.toFixed(2)}{" "}
        g。容量按教学数据分段线性插值；这不是实测曲线，也不是晶体生长速度。
      </p>
      <CrystallizationBalance
        key={`${p.mass}-${p.water}`}
        p={p}
        onChange={onChange}
      />
    </section>
  );
}
