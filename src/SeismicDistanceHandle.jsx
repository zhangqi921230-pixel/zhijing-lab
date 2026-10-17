import React, { useRef } from "react";
export default function SeismicDistanceHandle({
  kind,
  point,
  value,
  onChange,
}) {
  const dragging = useRef(false),
    depth = kind === "depth",
    min = depth ? 5 : 10,
    max = depth ? 30 : 80,
    step = depth ? 1 : 5;
  const set = (v) =>
    onChange?.(kind, Math.max(min, Math.min(max, Math.round(v / step) * step)));
  const move = (e) => {
    if (!dragging.current) return;
    const matrix = e.currentTarget.ownerSVGElement.getScreenCTM();
    if (!matrix) return;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(
      matrix.inverse(),
    );
    set(depth ? (p.y - 36) / 3.125 : (p.x - 45) / 3.125);
  };
  return (
    <g
      className="seismic-distance-handle"
      role="slider"
      tabIndex={0}
      aria-label={depth ? "拖动震源深度" : "拖动台站震中距"}
      aria-orientation={depth ? "vertical" : "horizontal"}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={`${value} 千米`}
      onPointerDown={(e) => {
        if (e.button !== 0 || e.isPrimary === false) return;
        e.preventDefault();
        e.currentTarget.focus();
        e.currentTarget.setPointerCapture(e.pointerId);
        dragging.current = true;
        move(e);
      }}
      onPointerMove={move}
      onPointerUp={(e) => {
        if (!dragging.current) return;
        dragging.current = false;
        e.currentTarget.releasePointerCapture(e.pointerId);
      }}
      onPointerCancel={() => (dragging.current = false)}
      onLostPointerCapture={() => (dragging.current = false)}
      onKeyDown={(e) => {
        if (e.key === "Home") set(min);
        else if (e.key === "End") set(max);
        else if (e.key === "ArrowRight" || e.key === "ArrowDown")
          set(value + step);
        else if (e.key === "ArrowLeft" || e.key === "ArrowUp")
          set(value - step);
        else return;
        e.preventDefault();
      }}
    >
      <circle
        cx={point[0]}
        cy={point[1]}
        r="9"
        fill="transparent"
        stroke="transparent"
        strokeWidth="22"
        vectorEffect="non-scaling-stroke"
        pointerEvents="all"
      />
      <circle
        className="seismic-distance-knob"
        cx={point[0]}
        cy={point[1]}
        r="5"
        fill={depth ? "#d4a65a" : "#70ccd5"}
        stroke="currentColor"
        strokeWidth="1"
      />
    </g>
  );
}
