import React from "react";
import { graphPoint } from "./LinearScene.jsx";
import { format } from "./models.mjs";
import { functionProbeLabel } from "./functionProbeLabel.mjs";

export default function FunctionSecantReadouts({
  rates,
  extent,
  xExtent,
  bounds,
  scale,
  curves,
}) {
  const reserved = [];
  const obstacles = [...curves];
  for (const slope of [rates.secant, rates.tangent]) {
    if (slope === null || rates.y === null) continue;
    obstacles.push(
      [-xExtent, xExtent].map((x) =>
        graphPoint(x, rates.y + slope * (x - rates.x), extent),
      ),
    );
  }
  const points =
    rates.dx === 0
      ? [["P = Q", rates.x, rates.y, "#936095"]]
      : [
          ["P", rates.x, rates.y, "#936095"],
          ["Q", rates.qx, rates.qy, "#2878b5"],
        ];
  return (
    <g aria-label="割线两点坐标读数" pointerEvents="none">
      {points.map(([name, x, y, color]) => {
        if (
          y === null ||
          !Number.isFinite(y) ||
          Math.abs(x) > xExtent ||
          Math.abs(y) > extent
        )
          return null;
        const position = graphPoint(x, y, extent);
        const text = `${name} (${format(x, 3)}, ${format(y, 3)})`;
        const label = functionProbeLabel(
          position,
          text,
          bounds,
          scale,
          obstacles,
          reserved,
        );
        reserved.push(label);
        return (
          <g key={name} aria-label={`${name} 坐标标签`}>
            <path
              d={`M${position}L${Math.max(label.x, Math.min(label.x + label.width, position[0]))} ${Math.max(label.y, Math.min(label.y + label.height, position[1]))}`}
              stroke={color}
              strokeWidth="0.7"
              vectorEffect="non-scaling-stroke"
            />
            <rect
              x={label.x}
              y={label.y}
              width={label.width}
              height={label.height}
              rx={3 * scale}
              fill="#fffdf7"
              stroke={color}
              strokeOpacity="0.3"
              strokeWidth="0.7"
              vectorEffect="non-scaling-stroke"
            />
            <text
              x={label.x + 8 * scale}
              y={label.y + 16 * scale}
              fill={color}
              fontSize="16"
            >
              {text}
            </text>
          </g>
        );
      })}
    </g>
  );
}
