import React, { useMemo } from "react";
import Button from "./LabButton.jsx";
import { polarizationState } from "./comparisonLessons.mjs";
import "./PolarizationStudy.css";
export function polarizationSweep(angle) {
  return Array.from({ length: 181 }, (_, i) => {
    const middle = i / 2;
    return {
      angle: middle,
      ...polarizationState({ angle, insert: 1, middle }),
    };
  });
}
export function brightestMiddle(angle) {
  return angle / 2;
}
export default function PolarizationStudy({ p, onChange }) {
  const samples = useMemo(() => polarizationSweep(p.angle), [p.angle]);
  const two = polarizationState({ ...p, insert: 0 }).output;
  const q = polarizationState(p),
    best = brightestMiddle(p.angle);
  const bestOutput = polarizationState({
    ...p,
    insert: 1,
    middle: best,
  }).output;
  const x = (a) => 75 + a * 6.5,
    y = (i) => 320 - i * 500;
  const curve = (key) =>
    samples
      .map((s, i) => `${i ? "L" : "M"}${x(s.angle)},${y(s[key])}`)
      .join(" ");
  const paths = useMemo(
    () => ({ middle: curve("middle"), output: curve("output") }),
    [samples],
  );
  const setMiddle = (middle) => onChange({ ...p, middle });
  return (
    <section className="polarization-study" aria-label="偏振角度与光强探究">
      <header>
        <div>
          <span>固定首尾方向 · 只改变中间片</span>
          <h3>哪一个角度让光屏最亮？</h3>
        </div>
        <strong>检偏片 {p.angle}°</strong>
      </header>
      <p>
        横轴只表示中间片方向。绿线是经过中间片的光强，金线是再经过检偏片的光强；虚线是移出中间片后的两片对照。所有光强都相对于入射自然光。
      </p>
      <div className="polarization-study-actions" aria-label="定位中间片方向">
        {[0, 30, 45, 60, 90].map((angle) => (
          <Button
            key={angle}
            disabled={!p.insert}
            aria-pressed={!!p.insert && p.middle === angle}
            onClick={() => setMiddle(angle)}
          >
            {angle}°
          </Button>
        ))}
        <Button disabled={!p.insert} onClick={() => setMiddle(best)}>
          定位最亮方向 · {best}°
        </Button>
      </div>
      {!p.insert && (
        <p role="status">
          中间片已移出：当前光强沿虚线显示；实线保留为插入后的预测。请在右侧插入中间片，再定位曲线上的角度。
        </p>
      )}
      <div
        className="polarization-study-scroll"
        role="region"
        aria-label="中间片角度与透射光强曲线，可横向滚动"
        tabIndex="0"
      >
        <svg
          viewBox="0 0 720 410"
          role="img"
          aria-label={`检偏片${p.angle}度，两片光强${(two * 100).toFixed(1)}%，三片最亮方向${best}度`}
        >
          <text x="25" y="29">
            光强 / I₀（%）
          </text>
          {[0, 0.125, 0.25, 0.375, 0.5].map((i) => (
            <g key={i}>
              <path d={`M75 ${y(i)}H660`} stroke="var(--ui-line)" />
              <text x="63" y={y(i) + 6} textAnchor="end">
                {i * 100}
              </text>
            </g>
          ))}
          {[0, 15, 30, 45, 60, 75, 90].map((a) => (
            <g key={a}>
              <path d={`M${x(a)} 70V326`} stroke="var(--ui-line)" />
              <text x={x(a)} y="350" textAnchor="middle">
                {a}°
              </text>
            </g>
          ))}
          <path
            d={paths.middle}
            fill="none"
            stroke="var(--ui-primary)"
            strokeWidth="3"
          />
          <path
            d={paths.output}
            fill="none"
            stroke="var(--ui-gold)"
            strokeWidth="4"
          />
          <path
            d={`M75 ${y(two)}H660`}
            stroke="var(--ui-ink)"
            strokeWidth="2"
            strokeDasharray="8 5"
          />
          {p.insert && (
            <g>
              <path
                d={`M${x(p.middle)} 70V320`}
                stroke="var(--ui-muted)"
                strokeDasharray="3 5"
              />
              <circle
                cx={x(p.middle)}
                cy={y(q.middle)}
                r="6"
                fill="var(--ui-primary)"
                stroke="var(--ui-surface)"
                strokeWidth="2"
              />
              <circle
                cx={x(p.middle)}
                cy={y(q.output)}
                r="7"
                fill="var(--ui-gold)"
                stroke="var(--ui-surface)"
                strokeWidth="2"
              />
            </g>
          )}
          <text x="370" y="391" textAnchor="middle">
            中间片方向 θ（起偏片固定为 0°）
          </text>
        </svg>
      </div>
      <div className="polarization-study-legend">
        <span>绿线 · 中间片后</span>
        <span>金线 · 检偏片后</span>
        <span>虚线 · 两片对照</span>
      </div>
      <dl>
        <div>
          <dt>两片对照</dt>
          <dd>{(two * 100).toFixed(2)}%</dd>
        </div>
        <div>
          <dt>{p.insert ? `当前三片 · ${p.middle}°` : "当前两片"}</dt>
          <dd>{(q.output * 100).toFixed(2)}%</dd>
        </div>
        <div>
          <dt>三片最大 · {best}°</dt>
          <dd>{(bestOutput * 100).toFixed(2)}%</dd>
        </div>
      </dl>
      <p>
        本图范围内，最亮方向在首尾透振方向的中间：θ = {p.angle}° ÷ 2 = {best}
        °。改变检偏片方向会重新计算整条曲线；定位角度会暂停并保留演示进度。
      </p>
    </section>
  );
}
