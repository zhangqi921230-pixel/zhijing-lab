import React from "react";
import Button from "./LabButton.jsx";
import { ph } from "./models.mjs";
import {
  indicators,
  indicatorAppearance,
  volumeForPH,
} from "./indicatorModel.mjs";
import "./IndicatorStudy.css";
export default function IndicatorStudy({ p, onPrepare }) {
  const current = ph(p.acid, p.base, p.c);
  return (
    <section className="indicator-study" aria-label="指示剂与中和点对照">
      <header>
        <span>INDICATOR STUDY</span>
        <h2>相同 pH，为什么颜色不同？</h2>
        <p>
          独立比色窗 · 当前 pH <strong>{current.toFixed(2)}</strong> · 当前加碱{" "}
          {p.base.toFixed(6)} mL
        </p>
      </header>
      <div className="indicator-samples">
        {indicators.map((indicator) => {
          const appearance = indicatorAppearance(indicator, current);
          return (
            <article key={indicator.id}>
              <h3>{indicator.name}</h3>
              <div className="indicator-cuvette">
                <svg
                  viewBox="0 0 180 150"
                  role="img"
                  aria-label={`${indicator.name}在当前pH下为${appearance.label}`}
                >
                  <ellipse
                    cx="90"
                    cy="139"
                    rx="56"
                    ry="5"
                    fill="var(--ui-ink)"
                    opacity=".08"
                  />
                  <path
                    d="M45 20V125Q45 135 55 135H125Q135 135 135 125V20"
                    fill="var(--ui-paper)"
                    stroke="var(--ui-muted)"
                    strokeWidth="2"
                  />
                  <path
                    d="M49 65H131V125Q131 131 124 131H56Q49 131 49 125Z"
                    fill={appearance.color}
                  />
                  <ellipse
                    cx="90"
                    cy="65"
                    rx="41"
                    ry="4"
                    fill={appearance.color}
                    stroke="var(--ui-muted)"
                    strokeOpacity=".3"
                  />
                  <path
                    d="M53 27V120"
                    stroke="white"
                    strokeWidth="4"
                    opacity=".6"
                  />
                  <path
                    d="M42 20H138"
                    stroke="var(--ui-muted)"
                    strokeWidth="3"
                  />
                </svg>
                <strong>{appearance.label}</strong>
              </div>
              <p>
                近似变色区间 pH {indicator.low.toFixed(1)}–
                {indicator.high.toFixed(1)}
                <br />
                {indicator.acid} → {indicator.base}
              </p>
              <div
                className="indicator-scale"
                role="img"
                aria-label={`pH刻度0至14，变色范围${indicator.low}至${indicator.high}，当前${current.toFixed(2)}`}
              >
                <span
                  className="indicator-band"
                  style={{
                    left: `${(indicator.low / 14) * 100}%`,
                    width: `${((indicator.high - indicator.low) / 14) * 100}%`,
                  }}
                />
                <i
                  style={{
                    left: `${(Math.max(0, Math.min(14, current)) / 14) * 100}%`,
                  }}
                />
              </div>
              <div className="indicator-axis">
                <span>pH 0</span>
                <span>7</span>
                <span>14</span>
              </div>
              <div className="indicator-targets">
                {[
                  indicator.low,
                  (indicator.low + indicator.high) / 2,
                  indicator.high,
                ].map((target) => {
                  const volume = volumeForPH(p.acid, p.c, target);
                  return (
                    <Button
                      key={target}
                      disabled={volume === null}
                      onClick={() => onPrepare({ base: volume })}
                    >
                      {indicator.name} pH {target.toFixed(1)}
                    </Button>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>
      <Button onClick={() => onPrepare({ base: p.acid })}>
        对照恰好中和 · pH 7
      </Button>
      <p className="indicator-conclusion">
        中和点由酸碱物质的量决定，本模型为 {p.acid} mL；指示剂在一个 pH
        区间内变色，肉眼判断的滴定终点不等于精确的中和点。
      </p>
      <details>
        <summary>比色与模型定位说明</summary>
        <p>
          假设分别向同一溶液的两份样品加入微量指示剂，其对原溶液 pH
          的影响忽略。颜色为显示器近似，区间内仅作视觉渐变，不表示吸收光谱或指示剂浓度。三维主烧杯仍为未加指示剂的无色溶液。定位按钮精确求解模型体积，六位小数用于区分近邻状态，不代表滴定管的测量精度；超过
          0–100 mL 行程时禁用。不模拟酚酞在强碱中的长时间褪色。
        </p>
      </details>
    </section>
  );
}
