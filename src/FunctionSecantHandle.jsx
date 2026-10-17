import React, { useRef } from "react";
import { graphPoint } from "./LinearScene.jsx";
import { format } from "./models.mjs";

export default function FunctionSecantHandle({
  p,
  rates,
  extent,
  svg,
  onChange,
  visible = true,
}) {
  const dragging = useRef(false);
  const [x, y] = graphPoint(rates.qx, rates.qy ?? 0, extent);
  const set = (value) =>
    onChange("dx", Math.max(-3, Math.min(3, Math.round(value * 20) / 20)));
  const end = (event) => {
    dragging.current = false;
    if (event.currentTarget.hasPointerCapture?.(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
  };
  return (
    <g
      className="graph-handle"
      role="slider"
      aria-label="拖动 Q 点调整两点间距"
      aria-orientation="horizontal"
      aria-valuemin={-3}
      aria-valuemax={3}
      aria-valuenow={rates.dx}
      aria-valuetext={`Δx = ${format(rates.dx, 2)}，Q (${format(rates.qx, 3)}, ${format(rates.qy, 3)})`}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible || undefined}
      visibility={visible ? "visible" : "hidden"}
      onPointerDown={(event) => {
        if (event.button !== 0 || event.isPrimary === false) return;
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.focus();
        dragging.current = true;
        event.currentTarget.setPointerCapture(event.pointerId);
        // Pause an active scan at its current P before the first drag movement.
        onChange("dx", rates.dx);
      }}
      onPointerMove={(event) => {
        if (!dragging.current) return;
        const matrix = svg.current?.getScreenCTM();
        if (!matrix) return;
        const point = new DOMPoint(
          event.clientX,
          event.clientY,
        ).matrixTransform(matrix.inverse());
        set(((point.x - 310) * extent) / 230 - p.probe);
      }}
      onPointerUp={end}
      onPointerCancel={end}
      onLostPointerCapture={() => (dragging.current = false)}
      onKeyDown={(event) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))
          return;
        event.preventDefault();
        set(
          event.key === "Home"
            ? -3
            : event.key === "End"
              ? 3
              : rates.dx + (event.key === "ArrowLeft" ? -0.05 : 0.05),
        );
      }}
    >
      <title>左右拖动 Q，或用方向键调整 Δx；P 保持不动</title>
      <circle
        cx={x}
        cy={y}
        r={rates.dx === 0 ? 18 : 20}
        fill={rates.dx === 0 ? "none" : "transparent"}
        stroke="transparent"
        strokeWidth={rates.dx === 0 ? 16 : 0}
      />
      <circle
        cx={x}
        cy={y}
        r={rates.dx === 0 ? 11 : 7}
        fill={rates.dx === 0 ? "none" : "#fffdf5"}
        stroke="#2878b5"
        strokeWidth="2"
      />
    </g>
  );
}
