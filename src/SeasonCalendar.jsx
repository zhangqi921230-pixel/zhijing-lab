import LatitudeDayBands from "./LatitudeDayBands.jsx";
import React, { useMemo } from "react";
import { solar } from "./models.mjs";
import "./SeasonCalendar.css";
import NoonShadow from "./NoonShadow.jsx";
export function seasonDayAt(clientX, bounds) {
  return Math.round(
    Math.max(
      0,
      Math.min(
        365,
        ((((clientX - bounds.left) / bounds.width) * 400 - 42) / 338) * 365,
      ),
    ),
  );
}
const latitudeLabel = (lat) =>
  lat === 0 ? "赤道" : `${lat > 0 ? "北纬" : "南纬"} ${Math.abs(lat)}°`;
export default function SeasonCalendar({ p, onChange, chapter = 0 }) {
  const q = solar(p.day, p.lat),
    opposite = solar(p.day, -p.lat),
    x = (day) => 42 + (day / 365) * 338,
    y = (hours) => 185 - (hours / 24) * 144;
  const curve = (lat) =>
    Array.from({ length: 147 }, (_, i) => {
      const day = (i / 146) * 365;
      return `${i ? "L" : "M"}${x(day)},${y(solar(day, lat).daylight)}`;
    }).join(" ");
  const paths = useMemo(() => [curve(p.lat), curve(-p.lat)], [p.lat]);
  const choose = (e) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    if (bounds.width) onChange("day", seasonDayAt(e.clientX, bounds));
  };
  return (
    <section className="season-calendar" aria-label="全年昼长与半球对照">
      <header>
        <strong>一年中的白昼</strong>
        <span>同一公转位置 · 对称纬度</span>
      </header>
      <div className="season-main-layout">
        <div>
          <svg
            viewBox="0 0 400 240"
            role="slider"
            tabIndex="0"
            aria-label="全年昼长曲线选日"
            aria-valuemin={0}
            aria-valuemax={365}
            aria-valuenow={p.day}
            aria-valuetext={`距春分${p.day}天，${latitudeLabel(p.lat)}昼长${q.daylight.toFixed(2)}小时`}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              choose(e);
            }}
            onPointerMove={(e) => {
              if (e.currentTarget.hasPointerCapture(e.pointerId)) choose(e);
            }}
            onPointerUp={(e) => {
              if (e.currentTarget.hasPointerCapture(e.pointerId))
                e.currentTarget.releasePointerCapture(e.pointerId);
            }}
            onKeyDown={(e) => {
              const value =
                e.key === "Home"
                  ? 0
                  : e.key === "End"
                    ? 365
                    : e.key === "ArrowRight"
                      ? p.day + 1
                      : e.key === "ArrowLeft"
                        ? p.day - 1
                        : null;
              if (value !== null) {
                e.preventDefault();
                onChange("day", Math.max(0, Math.min(365, value)));
              }
            }}
          >
            {[0, 6, 12, 18, 24].map((h) => (
              <g key={h}>
                <line
                  x1="42"
                  x2="380"
                  y1={y(h)}
                  y2={y(h)}
                  className="season-grid"
                />
                <text x="34" y={y(h) + 5} textAnchor="end">
                  {h}
                </text>
              </g>
            ))}
            <text x="42" y="20">
              昼长 / 小时
            </text>
            <path d={paths[1]} className="season-opposite" />
            <path d={paths[0]} className="season-current" />
            <line
              x1={x(p.day)}
              x2={x(p.day)}
              y1="41"
              y2="185"
              className="season-cursor"
            />
            <circle
              cx={x(p.day)}
              cy={y(q.daylight)}
              r="5"
              fill="var(--ui-primary)"
            />
            {[0, 91, 183, 274, 365].map((d, i) => (
              <text
                key={d}
                x={x(d)}
                y="207"
                textAnchor={i === 0 ? "start" : i === 4 ? "end" : "middle"}
              >
                {d}
              </text>
            ))}
            <text x="210" y="233" textAnchor="middle">
              距北半球春分 / 天
            </text>
          </svg>
          <div className="season-legend">
            <span>实线 · {latitudeLabel(p.lat)}</span>
            <span>虚线 · {latitudeLabel(-p.lat)}</span>
          </div>
        </div>
        <div>
          <strong>{latitudeLabel(p.lat)}</strong>
          <div
            className="season-daybar"
            role="img"
            aria-label={`白昼${q.daylight.toFixed(2)}小时，黑夜${(24 - q.daylight).toFixed(2)}小时`}
          >
            <i style={{ width: `${(q.daylight / 24) * 100}%` }} />
          </div>
          <div className="season-lengths">
            <span>昼 {q.daylight.toFixed(2)} h</span>
            <span>夜 {(24 - q.daylight).toFixed(2)} h</span>
          </div>
          <strong>{latitudeLabel(-p.lat)} · 对称纬度</strong>
          <div
            className="season-daybar"
            role="img"
            aria-label={`对称纬度白昼${opposite.daylight.toFixed(2)}小时，黑夜${(24 - opposite.daylight).toFixed(2)}小时`}
          >
            <i style={{ width: `${(opposite.daylight / 24) * 100}%` }} />
          </div>
          <div className="season-lengths">
            <span>昼 {opposite.daylight.toFixed(2)} h</span>
            <span>夜 {(24 - opposite.daylight).toFixed(2)} h</span>
          </div>
          <p>两条共用24小时量程：金色为白昼，深色为黑夜。</p>
          <dl>
            <div>
              <dt>对称纬度昼长</dt>
              <dd>{opposite.daylight.toFixed(2)} h</dd>
            </div>
            <div>
              <dt>太阳直射纬度</dt>
              <dd>{q.decl.toFixed(2)}°</dd>
            </div>
            <div>
              <dt>当地正午太阳高度</dt>
              <dd>{q.noon.toFixed(2)}°</dd>
            </div>
          </dl>
          <p>
            {q.daylight === 24
              ? "当前模型为极昼，太阳全天不落。"
              : q.daylight === 0
                ? "当前模型为极夜，太阳全天不升。"
                : "白昼与黑夜长度合计24小时。"}
            {q.noon < 0 ? " 正午太阳仍在地平线以下。" : ""}
          </p>
          <p>
            点按曲线选日；方向键微调。播放公转时，选日线和读数同步移动。赤道两条曲线重合。春分从0天起算，节气日期为近似值；不计大气折射、地形遮挡与太阳视半径，不用于实际日出日落预报。
          </p>
        </div>
      </div>
      {chapter === 2 && <LatitudeDayBands p={p} onChange={onChange} />}
      <NoonShadow p={p} />
    </section>
  );
}
