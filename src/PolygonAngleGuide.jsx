import React from "react";
export function angleArc(center, radius, start, sweep) {
  const point = (a) => [
    center[0] + radius * Math.cos(a),
    center[1] + radius * Math.sin(a),
  ];
  const a = point(start),
    b = point(start + sweep);
  return `M${a} A${radius} ${radius} 0 ${Math.abs(sweep) > Math.PI ? 1 : 0} ${sweep > 0 ? 1 : 0} ${b}`;
}
export default function PolygonAngleGuide({
  a,
  b,
  exterior,
  interior,
  direction,
  turn,
}) {
  const start = Math.atan2(b[1] - a[1], b[0] - a[0]);
  const sweep = (-direction * exterior * Math.PI) / 180;
  const arc = angleArc(b, 46, start, sweep);
  const initial = [b[0] + 46 * Math.cos(start), b[1] + 46 * Math.sin(start)];
  return (
    <g aria-label="顶点外角与内角">
      <path
        d={`M${b} L${initial} ${arc.slice(arc.indexOf("A"))} Z`}
        fill="var(--ui-gold)"
        fillOpacity=".12"
      />
      <path d={arc} fill="none" stroke="var(--ui-gold)" strokeWidth="3" />
      <path
        d={angleArc(
          b,
          32,
          start + Math.PI,
          (direction * interior * Math.PI) / 180,
        )}
        fill="none"
        stroke="var(--ui-muted)"
        strokeWidth="2"
        strokeDasharray="4 3"
      />
      {turn > 0 && (
        <path
          data-testid="turn-sweep"
          d={angleArc(b, 53, start, sweep * turn)}
          fill="none"
          stroke="var(--ui-primary)"
          strokeWidth="5"
          strokeLinecap="round"
        />
      )}
    </g>
  );
}
