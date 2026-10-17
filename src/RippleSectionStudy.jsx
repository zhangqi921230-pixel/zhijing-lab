import React, { useMemo } from "react";
import Button from "./LabButton.jsx";
import { rippleSection } from "./rippleField.mjs";
import { rippleState } from "./intuitiveLessons.mjs";
import "./RippleSectionStudy.css";
const x = (v) => 70 + (v + 24) * 12,
  y = (v) => 220 - v * 80;
export default function RippleSectionStudy({ p, onChange }) {
  const samples = useMemo(
    () => rippleSection(p),
    [p.separation, p.wavelength, p.phase, p.probeY],
  );
  const q = rippleState(p, 0);
  const move = (value) => onChange({ ...p, probeX: value });
  return (
    <section className="ripple-section-study" aria-label="沿横线寻找干涉条纹">
      <h3>从空间条纹，到一条振幅曲线</h3>
      <p>
        固定纵坐标 y = {p.probeY} cm，沿水面横向移动 P
        点。下图横轴是位置，纵轴是合振幅；它不随时间变化，与上方随时间起伏的位移曲线不同。
      </p>
      <div
        className="motion-shortcuts"
        role="group"
        aria-label="横向移动观察点"
      >
        <Button disabled={p.probeX <= -24} onClick={() => move(p.probeX - 1)}>
          向左 1 cm
        </Button>
        <Button onClick={() => move(0)}>回到中线</Button>
        <Button disabled={p.probeX >= 24} onClick={() => move(p.probeX + 1)}>
          向右 1 cm
        </Button>
      </div>
      <div
        className="ripple-section-scroll"
        role="region"
        tabIndex={0}
        aria-label="合振幅与横坐标图，可横向滚动"
      >
        <svg
          viewBox="0 0 720 300"
          role="img"
          aria-label={`纵坐标${p.probeY}厘米，横坐标${p.probeX}厘米处合振幅${q.amplitude.toFixed(2)}`}
        >
          {[0, 1, 2].map((v) => (
            <g key={v}>
              <path d={`M70 ${y(v)}H646`} stroke="var(--ui-line)" />
              <text x="48" y={y(v) + 6} textAnchor="end">
                {v}
              </text>
            </g>
          ))}
          {[-24, -12, 0, 12, 24].map((v) => (
            <g key={v}>
              <path
                d={`M${x(v)} 60V225`}
                stroke="var(--ui-line)"
                strokeDasharray="4 4"
              />
              <text x={x(v)} y="252" textAnchor="middle">
                {v}
              </text>
            </g>
          ))}
          <text x="70" y="30">
            合振幅（单源 = 1）
          </text>
          <text x="540" y="285">
            横坐标 / cm
          </text>
          <path
            data-testid="ripple-section-curve"
            d={samples
              .map((s, i) => `${i ? "L" : "M"}${x(s.x)},${y(s.amplitude)}`)
              .join(" ")}
            fill="none"
            stroke="var(--ui-primary)"
            strokeWidth="3"
          />
          <line
            x1={x(p.probeX)}
            x2={x(p.probeX)}
            y1="55"
            y2="220"
            stroke="var(--ui-gold)"
            strokeDasharray="5 4"
          />
          <circle
            data-testid="ripple-section-probe"
            cx={x(p.probeX)}
            cy={y(q.amplitude)}
            r="7"
            fill="var(--ui-paper)"
            stroke="var(--ui-gold)"
            strokeWidth="3"
          />
        </svg>
      </div>
      <p className="ripple-section-reading">
        P 点：x = {p.probeX} cm，y = {p.probeY} cm；合振幅{" "}
        <strong>{q.amplitude.toFixed(2)}</strong>
        。移动只暂停并改变观察点，保留波源、波长、相位和演示进度。
      </p>
      <p>
        同相时，波程差为整倍波长的位置加强，半奇数倍波长的位置抵消。反相时两者交换；中间相位需要同时考虑波程差与波源相位。底色仅作分布示意，精确值以读数和曲线为准。
      </p>
    </section>
  );
}
