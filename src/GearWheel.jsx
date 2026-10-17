import React, { memo, useMemo } from "react";
export function teachingGearPath(teeth, r) {
  return (
    Array.from({ length: teeth * 4 }, (_, i) => {
      const a = (i * Math.PI * 2) / (teeth * 4);
      const radius = r + ([0, 3].includes(i % 4) ? -3 : 3);
      return `${i ? "L" : "M"}${Math.cos(a) * radius},${Math.sin(a) * radius}`;
    }).join(" ") + "Z"
  );
}
// Rotation belongs to the parent; wheel geometry changes only with tooth count.
export default memo(function GearWheel({ teeth, r, color, driver }) {
  const outline = useMemo(() => teachingGearPath(teeth, r), [teeth, r]);
  return (
    <g>
      <path
        d={outline}
        fill={color}
        fillOpacity=".22"
        stroke={color}
        strokeWidth="2"
      />
      <circle
        r={r - 7}
        fill="none"
        stroke={color}
        strokeOpacity=".6"
        strokeWidth="2"
      />
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <g key={angle} transform={`rotate(${angle})`}>
          <circle
            cx={r * 0.6}
            r={r * 0.12}
            fill="var(--ui-paper)"
            stroke={color}
            strokeWidth="1.5"
          />
          <path
            d={`M${r * 0.27} 0H${r * 0.34}`}
            stroke={color}
            strokeWidth="3"
          />
        </g>
      ))}
      <circle r="18" fill="var(--ui-surface)" stroke={color} strokeWidth="3" />
      <circle r="10" fill="var(--ui-paper)" stroke={color} strokeWidth="1.5" />
      <path d="M-3 -9v5h6v-5" fill="none" stroke={color} strokeWidth="1.5" />
      {driver ? (
        <circle cx={r * 0.82} r="5" fill={color} />
      ) : (
        <path d={`M${r * 0.82 - 6} -6l12 6-12 6Z`} fill={color} />
      )}
    </g>
  );
});
