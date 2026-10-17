import React, { useRef } from "react";
import { solidAxialLayout } from "./solidAxialLayout.mjs";
import { format } from "./models.mjs";
export default function SolidAxialSection({
  radius,
  height,
  fraction,
  onChange,
}) {
  const dragging = useRef(false);
  const { r, top, y, rho } = solidAxialLayout(radius, height, fraction);
  function move(event) {
    if (!dragging.current || !onChange) return;
    const matrix = event.currentTarget.ownerSVGElement.getScreenCTM();
    if (!matrix) return;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(
      matrix.inverse(),
    );
    const value = Math.round(
      Math.max(0, Math.min(1, (185 - point.y) / (185 - top))) * 100,
    );
    onChange("slice", value);
  }
  return (
    <svg
      viewBox="0 0 360 245"
      role="group"
      aria-label={`轴截面对照：截面距底面 ${format(height * fraction)} 厘米，圆锥剩余高度 ${format(height * (1 - fraction))} 厘米，截面半径 ${format(radius * (1 - fraction))} 厘米`}
    >
      <path
        d={`M${90 - r} ${top}H${90 + r}V185H${90 - r}Z`}
        fill="#6aac9c22"
        stroke="#327c6c"
        strokeWidth="2"
      />
      <path
        d={`M${270 - r} 185L270 ${top}L${270 + r} 185Z`}
        fill="#dcbb6422"
        stroke="#ae873c"
        strokeWidth="2"
      />
      <path
        d={`M${270 - rho} ${y}L270 ${top}L${270 + rho} ${y}Z`}
        fill="#dcbb6444"
      />
      <path
        d={`M90 ${top - 8}V193M270 ${top - 8}V193`}
        stroke="#879185"
        strokeDasharray="4 4"
      />
      <path d={`M25 ${y}H155M205 ${y}H335`} stroke="#b28634" strokeWidth="2" />
      <path
        d={`M90 ${y}H${90 + r}M270 ${y}H${270 + rho}`}
        stroke="#855c15"
        strokeWidth="4"
      />
      <circle cx="270" cy={top} r="3" fill="#855c15" />
      <text
        x={90 + r / 2}
        y={y - 9}
        textAnchor="middle"
        fill="#327c6c"
        fontSize="14"
      >
        r
      </text>
      {fraction < 0.98 && (
        <text
          x={270 + rho / 2}
          y={y - 9}
          textAnchor="middle"
          fill="#855c15"
          fontSize="14"
        >
          ρ
        </text>
      )}
      <path d={`M174 ${top}V185M170 ${top}H178M170 185H178`} stroke="#879185" />
      <text
        x="166"
        y={(top + 185) / 2}
        textAnchor="end"
        fill="#53665d"
        fontSize="12"
      >
        h
      </text>
      <text x="180" y="22" textAnchor="middle" fill="#53665d" fontSize="12">
        r = {format(radius)} cm · h = {format(height)} cm
      </text>
      <text x="90" y="213" textAnchor="middle" fill="#376956" fontSize="14">
        圆柱轴截面
      </text>
      <text x="270" y="213" textAnchor="middle" fill="#876a32" fontSize="14">
        圆锥轴截面
      </text>
      {onChange && (
        <g
          role="slider"
          tabIndex="0"
          aria-label="拖动轴截面高度"
          aria-orientation="vertical"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow={Math.round(fraction * 100)}
          aria-valuetext={`距底面 ${format(height * fraction)} 厘米，${Math.round(fraction * 100)}% 高度`}
          style={{ cursor: "ns-resize", touchAction: "none" }}
          onPointerDown={(e) => {
            if (e.button !== 0 || e.isPrimary === false) return;
            e.preventDefault();
            dragging.current = true;
            e.currentTarget.focus();
            e.currentTarget.setPointerCapture(e.pointerId);
            move(e);
          }}
          onPointerMove={move}
          onPointerUp={(e) => {
            dragging.current = false;
            e.currentTarget.releasePointerCapture(e.pointerId);
          }}
          onPointerCancel={() => {
            dragging.current = false;
          }}
          onLostPointerCapture={() => {
            dragging.current = false;
          }}
          onKeyDown={(e) => {
            const values = {
              Home: 0,
              End: 100,
              ArrowUp: fraction * 100 + 1,
              ArrowRight: fraction * 100 + 1,
              ArrowDown: fraction * 100 - 1,
              ArrowLeft: fraction * 100 - 1,
            };
            if (!(e.key in values)) return;
            e.preventDefault();
            onChange(
              "slice",
              Math.round(Math.max(0, Math.min(100, values[e.key]))),
            );
          }}
        >
          <path
            d={`M25 ${y}H155M205 ${y}H335`}
            stroke="transparent"
            strokeWidth="24"
          />
          <circle
            cx="335"
            cy={y}
            r="8"
            fill="#fffaf0"
            stroke="#ae873c"
            strokeWidth="2"
          />
          <path
            d={`M332 ${y - 2}l3-3 3 3M332 ${y + 2}l3 3 3-3`}
            fill="none"
            stroke="#855c15"
          />
        </g>
      )}
      <text x="180" y="237" textAnchor="middle" fill="#53665d" fontSize="12">
        {onChange
          ? "拖动金线调节高度 · 方向键微调 · Home/End 到端点"
          : "金线：当前水平截面 · 横纵使用相同比例"}
      </text>
    </svg>
  );
}
