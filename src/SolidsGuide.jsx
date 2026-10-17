import React, { useState } from "react";
import SolidAxialSection from "./SolidAxialSection.jsx";
import { solidsState } from "./advancedModels.mjs";
import { format } from "./models.mjs";
import SolidNets from "./SolidNets.jsx";
import SolidVolumeGuide from "./SolidVolumeGuide.jsx";
export default function SolidsGuide({ p, t, onChange, chapter }) {
  const [axial, setAxial] = useState(false);
  if (chapter === 3) return <SolidNets p={p} />;
  if (chapter >= 4) return <SolidVolumeGuide p={p} t={t} onChange={onChange} />;
  const q = solidsState(p, t),
    ratio = 1 - q.fraction;
  return (
    <div className="solids-guide">
      <div className="solids-sections">
        <span>同一高度的截面 · {axial ? "轴截面对照" : "俯视对照"}</span>
        <div className="cube-pairs" role="group" aria-label="截面对照视图">
          <button aria-pressed={!axial} onClick={() => setAxial(false)}>
            俯视截面
          </button>
          <button aria-pressed={axial} onClick={() => setAxial(true)}>
            轴截面与相似三角形
          </button>
        </div>
        {axial ? (
          <SolidAxialSection
            radius={p.radius}
            height={p.height}
            fraction={q.fraction}
            onChange={onChange}
          />
        ) : (
          <svg
            viewBox="0 0 360 170"
            role="img"
            aria-label={`圆柱截面半径 ${p.radius}，圆锥截面半径 ${format(q.sectionRadius)} 厘米`}
          >
            <circle cx="90" cy="75" r="55" fill="#6aac9c55" stroke="#327c6c" />
            <circle
              cx="270"
              cy="75"
              r="55"
              fill="none"
              stroke="#d3c9ac"
              strokeDasharray="4 4"
            />
            <circle
              cx="270"
              cy="75"
              r={55 * ratio}
              fill="#dcbb6455"
              stroke="#ae873c"
            />
            {ratio === 0 && <circle cx="270" cy="75" r="2.5" fill="#ae873c" />}
            <path d={`M90 75h55M270 75h${55 * ratio}`} stroke="#667c5e" />
            <text
              x="90"
              y="151"
              textAnchor="middle"
              fontSize="15"
              fill="#376956"
            >
              r = {format(p.radius)} cm
            </text>
            <text
              x="270"
              y="151"
              textAnchor="middle"
              fontSize="15"
              fill="#876a32"
            >
              ρ = {format(q.sectionRadius)} cm
            </text>
          </svg>
        )}
      </div>
      <div>
        <span>截面距底面 z = {format(q.z)} cm</span>
        <strong>ρ / r = (h − z) / h</strong>
        <div className="solid-ratios" aria-label="半径与面积比例对照">
          {[
            ["半径比 ρ / r", ratio, "#328477"],
            ["面积比 A / A底", ratio * ratio, "#ae873c"],
          ].map(([label, value, color]) => (
            <div className="solid-ratio-row" key={label}>
              <div>{label}</div>
              <div
                className="solid-ratio-track"
                role="img"
                aria-label={`${label} ${(value * 100).toFixed(1)}%`}
              >
                <i
                  style={{ width: `${value * 100}%`, backgroundColor: color }}
                />
              </div>
              <output>{(value * 100).toFixed(1)}%</output>
            </div>
          ))}
          <small>两条满格均为 100%，以各自底面量为基准。</small>
        </div>
        {ratio === 0 && (
          <p>
            到达顶点：圆锥截面退化为一个点，半径和面积均为 0；圆柱截面仍为圆。
          </p>
        )}
        <p>
          圆柱截面保持不变；圆锥截面面积是底面积的{" "}
          {(ratio * ratio * 100).toFixed(1)}
          %。在半高处，半径减半，面积变为四分之一。
        </p>
        <div className="cube-pairs">
          {[
            [0, "底面"],
            [50, "半高"],
            [100, "顶点"],
          ].map(([value, name]) => (
            <button
              key={name}
              aria-pressed={Math.abs(q.fraction * 100 - value) < 0.001}
              onClick={() => onChange("slice", value)}
            >
              {name}
            </button>
          ))}
        </div>
        <p>
          体积：V圆柱 = πr²h；V圆锥 =
          ⅓πr²h。截面积的比例随高度变化，不能用某一个截面直接替代体积比。
        </p>
      </div>
    </div>
  );
}
