import React from "react";
export const launchDialPoint = (angle, radius) => [
  radius * Math.cos((angle * Math.PI) / 180),
  -radius * Math.sin((angle * Math.PI) / 180),
];
export default function ProjectileLauncher({ x, y, angle }) {
  const arcEnd = launchDialPoint(75, 44);
  return (
    <g aria-label={`发射器角度盘 ${angle} 度`}>
      {y < 414 && (
        <rect
          x={x - 7}
          y={y + 14}
          width="14"
          height={Math.max(3, 430 - y - 14)}
          rx="3"
          fill="url(#flight-metal)"
          stroke="#52695c"
        />
      )}
      <rect x={x - 22} y="425" width="44" height="8" rx="3" fill="#526c5e" />
      {y < 394 && (
        <g>
          <rect
            x={x - 11}
            y={y + 19}
            width="22"
            height="12"
            rx="2"
            fill="#8ea293"
            stroke="#52695c"
          />
          <circle
            cx={x + 14}
            cy={y + 25}
            r="5"
            fill="#314e44"
            stroke="#bac8b8"
          />
        </g>
      )}
      <g transform={`translate(${x} ${y})`}>
        <path
          d={`M0 0H44A44 44 0 0 0 ${arcEnd}Z`}
          fill="#f0ebd9"
          fillOpacity=".85"
          stroke="#9ca88e"
        />
        {Array.from({ length: 16 }, (_, i) => {
          const a = i * 5,
            start = launchDialPoint(a, i % 3 ? 40 : 36),
            end = launchDialPoint(a, 44),
            label = launchDialPoint(a, 52);
          return (
            <g key={a}>
              <path
                d={`M${start}L${end}`}
                stroke="#607660"
                strokeWidth={i % 3 ? 1 : 1.5}
              />
              {i % 3 === 0 && (
                <text
                  x={label[0]}
                  y={label[1] + 3}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#53694f"
                >
                  {a}°
                </text>
              )}
            </g>
          );
        })}
        <g transform={`rotate(${-angle})`}>
          <rect
            x="-50"
            y="-10"
            width="50"
            height="20"
            rx="4"
            fill="url(#flight-metal)"
            stroke="#536e5b"
          />
          <rect
            x="-5"
            y="-13"
            width="9"
            height="26"
            rx="2"
            fill="#718f7a"
            stroke="#38594b"
          />
          <path d="M-42-7V7M-35-7V7M-48 0H-25" stroke="#d3dec5" />
          <path d="M4 0H34" stroke="#a6782d" strokeWidth="2" />
        </g>
        <circle r="5" fill="#b9c5ac" stroke="#496a56" />
        <path d="M-2-2L2 2M-2 2L2-2" stroke="#496a56" />
      </g>
    </g>
  );
}
