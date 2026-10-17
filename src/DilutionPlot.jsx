import React, { useMemo } from "react";
import "./DilutionPlot.css";

export function dilutionFraction(solute, water, added) {
  return (100 * solute) / (solute + water + added);
}

export function DilutionPlot({ p, onChange }) {
  const plot = useMemo(() => {
    const max = Math.ceil(dilutionFraction(p.solute, p.water, 0));
    const y = (value) => 220 - (value / max) * 176;
    return {
      max,
      y,
      path: Array.from({ length: 151 }, (_, i) => {
        const added = i * 2;
        return `${i ? "L" : "M"}${54 + added * 1.6},${y(dilutionFraction(p.solute, p.water, added))}`;
      }).join(" "),
    };
  }, [p.solute, p.water]);
  const current = dilutionFraction(p.solute, p.water, p.add);
  const x = 54 + p.add * 1.6;
  return (
    <section className="dilution-plot" aria-label="加水量与质量分数曲线">
      <div className="dilution-plot-heading">
        <h3>加水越多，浓度怎样变化？</h3>
        <span>理论关系 · 非实测数据</span>
      </div>
      <svg
        viewBox="0 0 590 280"
        role="img"
        aria-label={`加入纯水 ${p.add.toFixed(1)} 克，溶质质量分数 ${current.toFixed(2)}%；曲线逐渐下降并趋近零。`}
      >
        <text x="16" y="20">
          质量分数 / %
        </text>
        {[0, 1, 2, 3, 4].map((i) => {
          const value = (plot.max * i) / 4;
          return (
            <g key={i}>
              <path className="dilution-grid" d={`M54 ${plot.y(value)}H534`} />
              <text x="44" y={plot.y(value) + 4} textAnchor="end">
                {Number(value.toFixed(2))}
              </text>
            </g>
          );
        })}
        {[0, 100, 200, 300].map((value) => (
          <g key={value}>
            <path className="dilution-grid" d={`M${54 + value * 1.6} 44V220`} />
            <text x={54 + value * 1.6} y="240" textAnchor="middle">
              {value}
            </text>
          </g>
        ))}
        <path className="dilution-axis" d="M54 38V220H541" />
        <path className="dilution-curve" d={plot.path} />
        <path
          className="dilution-probe"
          d={`M${x} 220V${plot.y(current)}H54`}
        />
        <circle
          className="dilution-current"
          cx={x}
          cy={plot.y(current)}
          r="5"
        />
        <text x="534" y="269" textAnchor="end">
          加入纯水的质量 / g
        </text>
      </svg>
      <div className="dilution-plot-samples" aria-label="比较不同加水量">
        {[0, 100, 200, 300].map((add) => (
          <button
            key={add}
            onClick={() => onChange("add", add)}
            aria-pressed={Math.abs(p.add - add) < 0.01}
          >
            加水 {add} g{" "}
            <strong>
              {dilutionFraction(p.solute, p.water, add).toFixed(2)}%
            </strong>
          </button>
        ))}
      </div>
      <p>
        保持溶质 {p.solute} g 与原有水 {p.water} g
        不变。每次增加相同质量的水，质量分数的下降幅度逐渐减小；有限次加水不会使它变成零。
      </p>
    </section>
  );
}
