import WaterBudgetFlow from "./WaterBudgetFlow.jsx";
import React, { useState } from "react";
import { calculate } from "./models.mjs";
import Button from "./LabButton.jsx";
import "./RainVolumeStudy.css";
export function rainfallVolume(p, area) {
  const values = calculate("water", p);
  return {
    total: (p.rain * area) / 1000,
    parts: values.map((v) => ({ ...v, volume: (v.value * area) / 1000 })),
  };
}
export default function RainVolumeStudy({ p }) {
  const [area, setArea] = useState(10000),
    [liters, setLiters] = useState(false);
  const q = rainfallVolume(p, area),
    unit = liters ? "L" : "m³",
    factor = liters ? 1000 : 1;
  const show = (v) =>
    (v * factor).toLocaleString("zh-CN", { maximumFractionDigits: 2 });
  const colors = ["var(--ui-primary)", "var(--ui-gold)", "var(--ui-muted)"];
  const height = (100 * p.rain) / 200;
  return (
    <section className="rain-volume-study" aria-label="降水深度与实际体积">
      <header>
        <div>
          <span>从毫米到体积</span>
          <h2>{p.rain} mm 降水，究竟有多少水？</h2>
        </div>
        <strong>
          {show(q.total)} {unit}
        </strong>
      </header>
      <div
        className="rain-volume-actions"
        role="group"
        aria-label="选择集水面积"
      >
        {[
          [100, "10 m × 10 m"],
          [10000, "100 m × 100 m"],
          [1000000, "1 km × 1 km"],
        ].map(([a, label]) => (
          <Button key={a} aria-pressed={area === a} onClick={() => setArea(a)}>
            {label}
          </Button>
        ))}
      </div>
      <div className="rain-volume-actions" role="group" aria-label="水量单位">
        <Button aria-pressed={!liters} onClick={() => setLiters(false)}>
          立方米 m³
        </Button>
        <Button aria-pressed={liters} onClick={() => setLiters(true)}>
          升 L
        </Button>
      </div>
      <div
        className="rain-volume-diagram"
        tabIndex="0"
        role="region"
        aria-label="集水面积与三个去向示意，可横向滚动"
      >
        <svg
          viewBox="0 0 900 390"
          role="img"
          aria-label="均匀降水覆盖集水区域，分为径流、下渗和蒸散"
        >
          <path
            d="M55 214L165 163L350 214L240 266Z"
            fill="var(--ui-selected)"
            stroke="var(--ui-primary)"
            strokeWidth="2"
          />
          <path
            d={`M55 214V${214 - height}L165 ${163 - height}L350 ${214 - height}V214L240 266Z`}
            fill="var(--ui-primary)"
            fillOpacity=".12"
            stroke="var(--ui-primary)"
          />
          <path
            d={`M55 ${214 - height}L240 ${266 - height}L350 ${214 - height}M240 ${266 - height}V266`}
            fill="none"
            stroke="var(--ui-primary)"
          />
          <path
            d={`M35 214V${214 - height}m-6 0h12M29 214h12`}
            stroke="var(--ui-gold)"
            strokeWidth="2"
          />
          <text x="50" y="45">
            均匀覆盖 · 面积 {area.toLocaleString("zh-CN")} m²
          </text>
          <text x="50" y="78">
            雨深 {p.rain} mm（竖向放大）
          </text>
          <text x="75" y="313">
            总量 {show(q.total)} {unit}
          </text>
          <text x="75" y="344">
            平面轮廓仅示意，不随面积等比例缩放
          </text>
          {q.parts.map((v, i) => (
            <g key={v.label}>
              <path
                d={`M370 214H408V${90 + i * 105}H454`}
                fill="none"
                stroke={colors[i]}
                strokeWidth="2"
              />
              <text x="478" y={55 + i * 105}>
                {["地表径流", "下渗", "蒸散"][i]}
              </text>
              <rect
                x="478"
                y={68 + i * 105}
                width="368"
                height="19"
                rx="3"
                fill="var(--ui-line)"
              />
              <rect
                x="478"
                y={68 + i * 105}
                width={(368 * v.value) / 200}
                height="19"
                rx="3"
                fill={colors[i]}
              />
              <text x="478" y={111 + i * 105}>
                {show(v.volume)} {unit} · {v.value.toFixed(1)} mm
              </text>
            </g>
          ))}
          <text x="478" y="360">
            三条共用量程：{show(0.2 * area)} {unit}（200 mm）
          </text>
        </svg>
      </div>
      <p className="rain-volume-equation">
        {p.rain} mm ÷ 1000 × {area.toLocaleString("zh-CN")} m² ={" "}
        {q.total.toLocaleString("zh-CN", { maximumFractionDigits: 2 })} m³
      </p>
      <p>
        1 mm 降水覆盖 1 m²，就是 1 L
        水。改变面积会改变总体积，不改变降水深度及分配比例。图中水柱表示输入水量，不是地表积水；河道流量还需要时间等信息，本模型不预测洪峰。
      </p>
      <p>
        面积和单位仅用于当前页面的换算；与上方三维流域共用降水和分配比例，不改变三维地形面积或地形比例尺。各去向体积之和
        = 输入体积。
      </p>
      <WaterBudgetFlow p={p} />
    </section>
  );
}
