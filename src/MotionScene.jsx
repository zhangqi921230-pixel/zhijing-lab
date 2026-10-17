import NatureScene from "./NatureScene.jsx";
import { natureTopics } from "./natureTopics.mjs";
import GeometricScene from "./GeometricScene.jsx";
import ComparisonScene from "./ComparisonScene.jsx";
import SignalScene from "./SignalScene.jsx";
import IntuitiveScene from "./IntuitiveScene.jsx";
import VividScene from "./VividScene.jsx";
import MechanismScene from "./MechanismScene.jsx";
import ExpansionScene from "./ExpansionScene.jsx";
import ConeSlices from "./ConeSlices.jsx";
import SectionScene from "./SectionScene.jsx";
import ShadowSimilarity from "./ShadowSimilarity.jsx";
import CircularComparison from "./CircularComparison.jsx";
import ObservableScene from "./ObservableScene.jsx";
import NetworkScene from "./NetworkScene.jsx";
import RevealScene from "./RevealScene.jsx";
import OpticalGeometryScene from "./OpticalGeometryScene.jsx";
import VisualProofScene from "./VisualProofScene.jsx";
import InsightScene from "./InsightScene.jsx";
import DiscoveryScene from "./DiscoveryScene.jsx";
import ConstructionScene from "./ConstructionScene.jsx";
import VisualMotionScene from "./VisualMotionScene.jsx";
import OscillationScene from "./OscillationScene.jsx";
import React, { useMemo, useId } from "react";
import { rollingPoint, dopplerState } from "./motionModels.mjs";
export default function MotionScene({
  id,
  p,
  time,
  guides = true,
  showField = true,
  trace = true,
  chapter = 0,
  selectedPoint = -1,
  shadowStep = 0,
  onSeek,
}) {
  const uid = useId().replace(/:/g, "");
  const samples = useMemo(
    () =>
      id === "cycloid"
        ? Array.from({ length: 451 }, (_, i) =>
            rollingPoint(p.radius, p.ratio, (i * Math.PI) / 180),
          )
        : [],
    [id, p.radius, p.ratio],
  );
  const theta = (time * Math.PI) / 3;
  const point =
    id === "cycloid" ? rollingPoint(p.radius, p.ratio, theta) : null;
  const q = id === "doppler" ? dopplerState(p.mach, p.frequency, time) : null;
  const x = (v) => 85 + v * 52,
    y = (v) => 350 - v * 52;
  const dx = (v) => 440 + v * 24;
  if (natureTopics.some((x) => x.id === id))
    return <NatureScene {...{ id, p, time, guides }} />;
  if (["vector-sum", "fence-area"].includes(id))
    return <GeometricScene {...{ id, p, time, guides }} />;
  if (["similar-area", "polarization"].includes(id))
    return <ComparisonScene {...{ id, p, time, guides }} />;
  if (["radian-arc", "beat-frequency"].includes(id))
    return <SignalScene {...{ id, p, time, guides }} />;
  if (["square-difference", "ripple-interference"].includes(id))
    return <IntuitiveScene {...{ id, p, time, guides, showField }} />;
  if (["polygon-turn", "thermal-length"].includes(id))
    return <VividScene {...{ id, p, time, chapter, guides, trace }} />;
  if (["gear-drive", "buoyancy-lift"].includes(id))
    return <MechanismScene {...{ id, p, time, chapter, guides }} />;
  if (["cylinder-net", "additive-light"].includes(id))
    return <ExpansionScene {...{ id, p, time, chapter, guides }} />;
  if (id === "solid-volume" && chapter === 5)
    return <ConeSlices {...{ p, time, guides, onSeek }} />;
  if (["solid-volume", "water-pressure"].includes(id))
    return <SectionScene {...{ id, p, time, chapter, guides }} />;
  if (id === "shadow-height" && chapter === 1)
    return <ShadowSimilarity {...{ p, time, guides }} step={shadowStep} />;
  if (id === "circular-motion" && chapter >= 2 && chapter <= 4)
    return <CircularComparison {...{ p, time, chapter, guides }} />;
  if (["shadow-height", "circular-motion"].includes(id))
    return <ObservableScene {...{ id, p, time, guides }} />;
  if (id === "resistor-network")
    return <NetworkScene {...{ p, time, guides }} />;
  if (["prism", "circle-area"].includes(id))
    return <RevealScene {...{ id, p, time, guides }} />;
  if (["pinhole", "inscribed-angle"].includes(id))
    return (
      <OpticalGeometryScene
        {...{ id, p, time, guides, chapter, selectedPoint }}
      />
    );
  if (["pythagoras-proof", "plane-mirror"].includes(id))
    return <VisualProofScene {...{ id, p, time, guides, chapter, trace }} />;
  if (["triangle-angles", "communicating"].includes(id))
    return <InsightScene {...{ id, p, time, guides }} />;
  if (["area-cut", "hydraulic"].includes(id))
    return <DiscoveryScene {...{ id, p, time, guides }} />;
  if (id === "symmetry" || id === "pulley")
    return <ConstructionScene {...{ id, p, time, guides, trace }} />;
  if (id === "polar" || id === "ballistics")
    return <VisualMotionScene {...{ id, p, time, guides, trace }} />;
  if (id === "lissajous" || id === "standing")
    return <OscillationScene {...{ id, p, time, guides, trace }} />;
  return (
    <svg
      className="motion-diagram"
      style={{
        width: "100%",
        display: "block",
        fill: "var(--ui-ink)",
        fontFamily: "Microsoft YaHei, sans-serif",
        fontSize: 16,
      }}
      viewBox="0 0 900 480"
      role="img"
      aria-label={
        id === "cycloid"
          ? "滚轮、描迹杆与同尺度摆线轨迹"
          : "移动声源及其发射的圆形波面"
      }
    >
      <defs>
        <pattern
          id={`grid${uid}`}
          width="26"
          height="26"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M26 0H0V26"
            fill="none"
            stroke="var(--ui-line)"
            strokeWidth=".7"
          />
        </pattern>
        <linearGradient id={`rim${uid}`}>
          <stop stopColor="#6e8b89" />
          <stop offset=".4" stopColor="#dbe7de" />
          <stop offset="1" stopColor="#65827e" />
        </linearGradient>
        <clipPath id={`clip${uid}`}>
          <rect x="24" y="48" width="852" height="350" rx="12" />
        </clipPath>
      </defs>
      <rect width="900" height="480" fill="var(--ui-paper)" />
      <rect
        x="24"
        y="48"
        width="852"
        height="350"
        fill={`url(#grid${uid})`}
        rx="12"
      />
      <text x="34" y="30">
        {id === "cycloid"
          ? "ROLLING GEOMETRY / 无滑动滚动"
          : "WAVE FIELD / 静止介质中的传播"}
      </text>
      {point ? (
        <>
          <path d="M34 350H866" stroke="var(--ui-muted)" strokeWidth="2" />
          {Array.from({ length: 15 }, (_, i) => (
            <g key={i}>
              <path d={`M${x(i)} 350v8`} stroke="var(--ui-muted)" />
              <text x={x(i)} y="384" textAnchor="middle">
                {i}
              </text>
            </g>
          ))}
          <text x="850" y="416">
            x / m
          </text>
          {trace && (
            <path
              d={[
                ...samples.slice(0, Math.floor((theta * 180) / Math.PI) + 1),
                point,
              ]
                .map((v, i) => `${i ? "L" : "M"}${x(v.x)} ${y(v.y)}`)
                .join(" ")}
              fill="none"
              stroke="var(--ui-gold)"
              strokeWidth="3.5"
            />
          )}
          {trace && p.ratio > 1 && time === 6 && (
            <>
              <path
                d={samples
                  .slice(360)
                  .map((v, i) => `${i ? "L" : "M"}${x(v.x)} ${y(v.y)}`)
                  .join(" ")}
                fill="none"
                stroke="var(--ui-gold)"
                strokeWidth="2"
                strokeDasharray="6 5"
              />
              <text x="440" y="461">
                虚线：下一周轨迹参考
              </text>
            </>
          )}
          {guides && (
            <>
              <path
                d={`M85 ${y(p.radius)}H${x(point.centerX)}`}
                stroke="var(--ui-muted)"
                strokeDasharray="6 5"
              />
              <path
                d={`M85 437H${x(point.centerX)}`}
                stroke="var(--ui-primary)"
                strokeWidth="2"
              />
              <text x="85" y="461">
                轮心前进 {point.distance.toFixed(2)} m · 转角{" "}
                {((theta * 180) / Math.PI).toFixed(0)}°
              </text>
            </>
          )}
          <g
            transform={`translate(${x(point.centerX)} ${y(p.radius)}) rotate(${(theta * 180) / Math.PI})`}
          >
            <circle
              r={p.radius * 52}
              fill="var(--ui-primary)"
              fillOpacity=".06"
              stroke={`url(#rim${uid})`}
              strokeWidth="8"
            />
            <circle
              r={p.radius * 52 - 7}
              fill="none"
              stroke="var(--ui-primary)"
              strokeWidth="1"
            />
            {Array.from({ length: 8 }, (_, i) => (
              <path
                key={i}
                d={`M0 0L${Math.sin((i * Math.PI) / 4) * p.radius * 48} ${Math.cos((i * Math.PI) / 4) * p.radius * 48}`}
                stroke="var(--ui-muted)"
                strokeWidth="1.5"
              />
            ))}
            <path
              d={`M0 0V${p.radius * p.ratio * 52}`}
              stroke="var(--ui-gold)"
              strokeWidth="4"
            />
            <circle r="6" fill="var(--ui-ink)" />
          </g>
          <circle
            cx={x(point.x)}
            cy={y(point.y)}
            r="7"
            fill="var(--ui-gold)"
            stroke="var(--ui-surface)"
            strokeWidth="2"
          />
          <text x="550" y="30">
            ● 描迹点　— 已走过的轨迹
          </text>
        </>
      ) : (
        <>
          <g clipPath={`url(#clip${uid})`}>
            <path
              d="M30 232H870"
              stroke="var(--ui-muted)"
              strokeDasharray="5 6"
            />
            {q.fronts.map((front, i) => (
              <g key={i}>
                <circle
                  cx={dx(front.x)}
                  cy="232"
                  r={front.radius * 24}
                  fill="none"
                  data-testid={
                    selectedPoint === i ? "tracked-wavefront" : undefined
                  }
                  stroke={
                    selectedPoint === i ? "var(--ui-gold)" : "var(--ui-primary)"
                  }
                  strokeWidth={selectedPoint === i ? 4 : i === 0 ? 2.5 : 1.5}
                  opacity={
                    selectedPoint === i
                      ? 1
                      : 0.38 + (0.5 * (i + 1)) / q.fronts.length
                  }
                />
                {selectedPoint === i && (
                  <g>
                    <path
                      data-testid="tracked-wave-radius"
                      d={`M${dx(front.x)} 232l${(front.radius * 24) / Math.sqrt(2)} ${(-front.radius * 24) / Math.sqrt(2)}`}
                      stroke="var(--ui-gold)"
                      strokeWidth="2"
                    />
                    <circle
                      cx={dx(front.x)}
                      cy="232"
                      r="5"
                      fill="var(--ui-gold)"
                    />
                  </g>
                )}
                {guides && (
                  <circle
                    cx={dx(front.x)}
                    cy="232"
                    r="2.5"
                    fill="var(--ui-gold)"
                  />
                )}
              </g>
            ))}
            <g transform={`translate(${dx(q.sourceX)} 232)`}>
              <circle
                r="17"
                fill="var(--ui-surface)"
                stroke="var(--ui-gold)"
                strokeWidth="3"
              />
              <circle r="7" fill="var(--ui-gold)" />
              {p.mach !== 0 && (
                <path
                  d={`M0 -28H${Math.sign(p.mach) * 38}M${Math.sign(p.mach) * 30} -34L${Math.sign(p.mach) * 38} -28L${Math.sign(p.mach) * 30} -22`}
                  fill="none"
                  stroke="var(--ui-gold)"
                  strokeWidth="2"
                />
              )}
            </g>
          </g>
          {[-12, 12].map((v, i) => (
            <g key={v}>
              <path
                d={`M${dx(v)} 274v28m-10 0h20`}
                stroke="var(--ui-muted)"
                strokeWidth="3"
              />
              <rect
                x={dx(v) - 9}
                y="250"
                width="18"
                height="27"
                rx="8"
                fill="var(--ui-surface)"
                stroke="var(--ui-ink)"
                strokeWidth="2"
              />
              <text x={dx(v)} y="333" textAnchor="middle">
                {i ? "右侧" : "左侧"}观察者
              </text>
              <text x={dx(v)} y="359" textAnchor="middle">
                {(i ? q.rightFrequency : q.leftFrequency).toFixed(2)} Hz
              </text>
            </g>
          ))}
          <text x="34" y="433">
            ● 声源　{guides ? "· 发射位置　" : ""}○ 每一圈代表一次发射的波面
          </text>
          <text x="34" y="461">
            发射周期 {(1 / p.frequency).toFixed(2)}{" "}
            s；波面圆心固定，半径随时间增大。
          </text>
        </>
      )}
    </svg>
  );
}
