import React from "react";
import Button from "./LabButton.jsx";
import { moonState, moonLitPath } from "./explorationModels.mjs";
import "./MoonPhasePair.css";
export function moonPhasePair(angle) {
  const current = moonState(angle),
    other = moonState(360 - current.angle);
  return [current, other].map((q) => ({ ...q, next: moonState(q.angle + 15) }));
}
export default function MoonPhasePair({ angle, onChange }) {
  const pair = moonPhasePair(angle),
    same = Math.abs(pair[0].angle - pair[1].angle) < 1e-8;
  return (
    <section className="moon-phase-pair" aria-label="相同比例的两个月相">
      <h3>一样亮多少，接下来却不同</h3>
      <p>
        左边随当前观察位置变化；右边取周期角 360°−θ。两者的可见亮面比例相等。
      </p>
      <div className="moon-phase-pair-grid">
        {pair.map((q, i) => (
          <div className="moon-phase-pair-card" key={i}>
            <span>{i === 0 ? "当前观察" : "等亮面对照"}</span>
            <h4>
              {q.name} · {q.angle.toFixed(1)}°
            </h4>
            <svg
              viewBox="0 0 180 180"
              role="img"
              aria-label={`${i === 0 ? "当前" : "对照"}${q.name}，可见亮面${(q.fraction * 100).toFixed(1)}%`}
            >
              <g transform="translate(90 90)">
                <circle r="72" fill="#17232d" stroke="#71848c" />
                <path d={moonLitPath(q.angle, 71)} fill="#e7deca" />
              </g>
            </svg>
            <strong>亮面 {(q.fraction * 100).toFixed(1)}%</strong>
            <p>
              各自再前进15° →<br />
              {q.next.name} · {(q.next.fraction * 100).toFixed(1)}%
            </p>
          </div>
        ))}
      </div>
      <div className="moon-phase-pair-actions">
        <Button
          disabled={same}
          onClick={() => onChange("angle", pair[1].angle)}
        >
          切换到对照月相
        </Button>
        <Button onClick={() => onChange("angle", pair[0].next.angle)}>
          当前月相前进15°
        </Button>
      </div>
      <p>
        {same
          ? "新月和满月是特殊位置：对照回到同一个月相，切换按钮不重复定位。"
          : "盈月与亏月的亮侧不同，继续沿同一公转方向前进，亮面变化也不同。"}
        按钮会暂停并联动上方轨道、月面和曲线。此处为北半球常见朝向的示意，不能据亮侧直接判断任意地点的实际天空方向。
      </p>
    </section>
  );
}
