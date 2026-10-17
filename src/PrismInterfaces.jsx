import React from "react";
import Button from "./LabButton.jsx";
import { prismState, visiblePrismRays } from "./revealModels.mjs";
import "./PrismInterfaces.css";
export function rayArrow(from, to) {
  const dx = to[0] - from[0],
    dy = to[1] - from[1],
    length = Math.hypot(dx, dy);
  const ux = dx / length,
    uy = dy / length;
  const tip = [from[0] + dx * 0.68, from[1] + dy * 0.68];
  return `M${tip[0] - ux * 9 - uy * 4} ${tip[1] - uy * 9 + ux * 4}L${tip}L${tip[0] - ux * 9 + uy * 4} ${tip[1] - uy * 9 - ux * 4}`;
}
export function InterfaceDiagram({
  incidence,
  refraction,
  color,
  title,
  entering = true,
}) {
  const visibleColor = `color-mix(in srgb, ${color} 65%, var(--ui-ink))`;
  const rad = Math.PI / 180,
    x = 180,
    y = 125,
    length = 92;
  const point = (angle, below) => [
    x + length * Math.sin(angle * rad),
    y + (below ? 1 : -1) * length * Math.cos(angle * rad),
  ];
  const start = [
    x - length * Math.sin(incidence * rad),
    y - length * Math.cos(incidence * rad),
  ];
  const end = point(refraction ?? incidence, refraction !== null);
  return (
    <svg viewBox="0 0 360 280" role="img" aria-label={title}>
      <rect
        x="24"
        y={entering ? 125 : 20}
        width="312"
        height="105"
        fill="var(--ui-primary)"
        opacity=".08"
      />
      <text x="28" y="43">
        {entering ? "空气" : "棱镜"}
      </text>
      <text x="28" y="216">
        {entering ? "棱镜" : "空气"}
      </text>
      <path d="M24 125H336" stroke="var(--ui-ink)" />
      <path d="M180 20V226" stroke="var(--ui-muted)" strokeDasharray="5 6" />
      <text x="192" y="25">
        法线
      </text>
      <path
        d={`M${start}L180 125L${end}`}
        stroke={visibleColor}
        strokeWidth="3"
        fill="none"
      />
      <path
        data-testid="incident-direction"
        d={rayArrow(start, [x, y])}
        stroke={visibleColor}
        strokeWidth="2"
        fill="none"
      />
      <path
        data-testid="outgoing-direction"
        d={rayArrow([x, y], end)}
        stroke={visibleColor}
        strokeWidth="2"
        fill="none"
      />
      <path
        data-testid="outgoing-angle"
        d={`M180 ${refraction === null ? 87 : 163} A38 38 0 0 ${refraction === null ? 1 : 0} ${180 + 38 * Math.sin((refraction ?? incidence) * rad)} ${125 + (refraction === null ? -1 : 1) * 38 * Math.cos((refraction ?? incidence) * rad)}`}
        stroke={visibleColor}
        fill="none"
        strokeDasharray="3 3"
      />
      <circle cx={end[0]} cy={end[1]} r="4" fill={visibleColor} />
      <path
        d={`M180 78 A47 47 0 0 0 ${180 - 47 * Math.sin(incidence * rad)} ${125 - 47 * Math.cos(incidence * rad)}`}
        fill="none"
        stroke={visibleColor}
      />
      <text x="24" y="249">
        入射 {incidence.toFixed(2)}°
      </text>
      <text x="182" y="249">
        {refraction === null
          ? `反射 ${incidence.toFixed(2)}°`
          : `折射 ${refraction.toFixed(2)}°`}
      </text>
    </svg>
  );
}
export default function PrismInterfaces({ p, onSeek, chapter = 0 }) {
  const v = p.color === 0 ? prismState(p)[2] : visiblePrismRays(p)[0];
  const critical = (Math.asin(1 / v.index) * 180) / Math.PI;
  return (
    <details className="prism-interfaces" open={chapter === 4}>
      <summary>逐界面检查 · 法线、角度与全反射条件</summary>
      <p>
        当前用{v.name}光（{v.wavelength} nm）检查，n = {v.index.toFixed(4)}
        。两幅局部图把界面转为水平，便于从法线量角；实际棱镜方向以上方主图为准。白光模式用绿光作代表，红紫对照模式用红光作代表。
      </p>
      <div className="prism-interface-grid">
        <section aria-label="第一界面角度检查">
          <h3>① 空气 → 棱镜</h3>
          <InterfaceDiagram
            incidence={p.angle}
            refraction={v.r1}
            color={v.color}
            title="第一界面的入射与折射角"
          />
          <p>
            sin {p.angle.toFixed(2)}° = {v.index.toFixed(4)} × sin{" "}
            {v.r1.toFixed(2)}°
          </p>
          <Button onClick={() => onSeek(2)}>定位第一界面</Button>
        </section>
        <section aria-label="第二界面角度检查">
          <h3>② 棱镜 → 空气</h3>
          <InterfaceDiagram
            entering={false}
            incidence={v.i2}
            refraction={v.r2}
            color={v.color}
            title="第二界面的折射或全反射角"
          />
          <p>
            临界角 {critical.toFixed(2)}°；入射角 {v.i2.toFixed(2)}°{" "}
            {v.tir
              ? "大于临界角，发生全反射。"
              : "未超过临界角，可从右侧出射。"}
          </p>
          <Button onClick={() => onSeek(4)}>定位第二界面</Button>
        </section>
      </div>
      <p>
        箭头表示光传播方向；实线角弧标记入射角，虚线角弧标记折射角（全反射时为反射角），都从法线量起。阴影表示棱镜介质。棱镜内两个角满足
        r₁ + i₂ = 60°。第二次入射角是 {v.i2.toFixed(2)}
        °，并不是第一次的 {p.angle.toFixed(2)}°。
      </p>
      <Button onClick={() => onSeek(6)}>查看完整光路</Button>
    </details>
  );
}
