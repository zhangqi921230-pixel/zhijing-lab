import React, { useRef } from "react";
import { solidVolumePointer, solidVolumeKey } from "./solidVolumeInput.mjs";

const X = (f) => 48 + 420 * f;
const Y = (v) => 174 - 138 * v;
const coneVolume = (f) => (1 - (1 - f) ** 3) / 3;
const conePath = Array.from({ length: 101 }, (_, i) => {
  const f = i / 100;
  return `${i ? "L" : "M"}${X(f)},${Y(coneVolume(f))}`;
}).join(" ");

export default function SolidVolumeCurve({ fraction, onSelect }) {
  const f = Math.max(0, Math.min(1, fraction));
  const pointer = useRef(null);
  const choose = (event) => {
    const value = solidVolumePointer(
      event.clientX,
      event.currentTarget.getBoundingClientRect(),
    );
    if (value !== null) onSelect?.(value);
  };
  return (
    <div className="solid-volume-curve">
      <strong>高度增加时，体积怎样增长？</strong>
      <svg
        viewBox="0 0 520 220"
        role={onSelect ? "slider" : "img"}
        tabIndex={onSelect ? 0 : undefined}
        aria-valuemin={onSelect ? 0 : undefined}
        aria-valuemax={onSelect ? 100 : undefined}
        aria-valuenow={onSelect ? f * 100 : undefined}
        aria-valuetext={
          onSelect ? `截面高度为总高的${(f * 100).toFixed(1)}%` : undefined
        }
        onKeyDown={(event) => {
          if (!onSelect) return;
          const value = solidVolumeKey(f * 100, event.key);
          if (value !== null) {
            event.preventDefault();
            onSelect(value);
          }
        }}
        onPointerDown={(event) => {
          if (!onSelect || event.button !== 0 || pointer.current !== null)
            return;
          pointer.current = event.pointerId;
          event.currentTarget.setPointerCapture(event.pointerId);
          event.currentTarget.focus();
          choose(event);
        }}
        onPointerMove={(event) => {
          if (pointer.current === event.pointerId) choose(event);
        }}
        onPointerUp={(event) => {
          if (pointer.current !== event.pointerId) return;
          choose(event);
          pointer.current = null;
          event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onPointerCancel={(event) => {
          if (pointer.current === event.pointerId) pointer.current = null;
        }}
        onLostPointerCapture={(event) => {
          if (pointer.current === event.pointerId) pointer.current = null;
        }}
        aria-label={`截面高度为总高的${(f * 100).toFixed(1)}%；圆柱累计体积为完整圆柱的${(f * 100).toFixed(1)}%，圆锥为${(coneVolume(f) * 100).toFixed(1)}%。`}
      >
        <text x="48" y="18" fontSize="11" fill="currentColor">
          累计体积 / 完整圆柱体积
        </text>
        {[0, 1 / 3, 2 / 3, 1].map((v) => (
          <g key={v}>
            <line
              x1="48"
              x2="468"
              y1={Y(v)}
              y2={Y(v)}
              stroke="currentColor"
              opacity="0.12"
            />
            <text
              x="40"
              y={Y(v) + 4}
              textAnchor="end"
              fontSize="11"
              fill="currentColor"
            >
              {(v * 100).toFixed(0)}%
            </text>
          </g>
        ))}
        {[0, 0.5, 1].map((v) => (
          <text
            key={v}
            x={X(v)}
            y="191"
            textAnchor="middle"
            fontSize="11"
            fill="currentColor"
          >
            {v === 0 ? "底面" : v === 1 ? "顶点高度" : "半高"}
          </text>
        ))}
        <text
          x="258"
          y="213"
          textAnchor="middle"
          fontSize="11"
          fill="currentColor"
        >
          截面高度 z / 总高 h
        </text>
        <path
          d={`M48,174 L468,36`}
          fill="none"
          stroke="#328477"
          strokeWidth="2.5"
        />
        <path d={conePath} fill="none" stroke="#b78b39" strokeWidth="2.5" />
        <line
          x1={X(f)}
          x2={X(f)}
          y1="32"
          y2="174"
          stroke="currentColor"
          opacity="0.5"
          strokeDasharray="4 4"
        />
        <circle
          data-series="cylinder"
          cx={X(f)}
          cy={Y(f)}
          r="4"
          fill="#328477"
          stroke="var(--surface)"
          strokeWidth="1.5"
        />
        <circle
          data-series="cone"
          cx={X(f)}
          cy={Y(coneVolume(f))}
          r="4"
          fill="#b78b39"
          stroke="var(--surface)"
          strokeWidth="1.5"
        />
        <text x="410" y="31" fill="#328477" fontSize="12">
          圆柱
        </text>
        <text x="430" y="121" fill="#a27624" fontSize="12">
          圆锥
        </text>
      </svg>
      {onSelect && (
        <p>在图上横向拖动选择高度；方向键微调，Home / End 定位底面与顶点。</p>
      )}
      <p>
        两条曲线使用同一体积基准。圆锥顶部的小圆锥越来越窄，因此曲线逐渐变平；到完整高度时，圆锥与圆柱的体积比为
        1∶3。
      </p>
    </div>
  );
}
