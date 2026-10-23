import React, { useId } from "react";
// One inlet/outlet pair isolates opening; this is not a complete mixing cartridge.
export default function FaucetPorts({ value }) {
  const uid = useId().replaceAll(":", ""),
    y = 170 + value * 0.8,
    open = value > 6.25;
  return (
    <g>
      <defs>
        <clipPath id={uid}>
          <rect x="220" y={y - 40} width="340" height="80" rx="40" />
        </clipPath>
      </defs>
      <text x="35" y="40" fill="#eef3ed" fontSize="23">
        贴合面的俯视示意：只追踪一路进水与出水
      </text>
      <rect x="160" y="185" width="460" height="150" rx="22" fill="#f1eee5" />
      {[260, 520].map((x, i) => (
        <g key={x}>
          <path
            d={`M${x} 285V380`}
            stroke={i === 0 ? "#58b6d0" : "#78949a"}
            strokeWidth="18"
          />
          <circle
            cx={x}
            cy="250"
            r="35"
            fill="#405c65"
            stroke="#1c333a"
            strokeWidth="3"
          />
        </g>
      ))}
      <rect
        x="185"
        y={y - 100}
        width="410"
        height="280"
        rx="25"
        fill="#b5c5c5"
        fillOpacity=".22"
        stroke="#d7af67"
        strokeWidth="4"
      />
      <rect
        x="220"
        y={y - 40}
        width="340"
        height="80"
        rx="40"
        fill={open ? "#58b6d0" : "#78949a"}
        fillOpacity=".3"
        stroke="#d7af67"
        strokeWidth="3"
      />
      <g clipPath={`url(#${uid})`}>
        <circle cx="260" cy="250" r="35" fill="#58b6d0" />
        <circle cx="520" cy="250" r="35" fill="#58b6d0" />
      </g>
      {open && (
        <path
          d="M520 285V380"
          stroke="#58b6d0"
          strokeWidth="12"
          strokeDasharray="10 5"
        />
      )}
      <text x="212" y="410" fill="#eef3ed" fontSize="22">
        进水口
      </text>
      <text x="480" y="410" fill="#eef3ed" fontSize="22">
        出水口
      </text>
      <text x="35" y="80" fill="#d7af67" fontSize="22">
        金色边界：活动片与它的水道
      </text>
      <text x="35" y="113" fill="#eef3ed" fontSize="22">
        白色底板：固定片；亮蓝色：连通部分
      </text>
    </g>
  );
}
