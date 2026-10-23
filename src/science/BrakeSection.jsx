import React from "react";
import { brakeModel } from "./transportModels.mjs";
export default function BrakeSection({ value }) {
  const { gap, contact, heat, angle } = brakeModel(value);
  const warm = `rgb(${150 + heat * 55},${170 - heat * 40},${170 - heat * 60})`;
  return (
    <g>
      <text x="30" y="42" fill="#edf3ed" fontSize="22">
        单活塞浮动钳：沿盘厚度看两侧接触
      </text>
      <path
        d={`M${290 + gap} 285V145H${450 + gap}V285`}
        stroke="#8ba8b1"
        strokeWidth="24"
        fill="none"
      />
      <rect
        x="390"
        y="180"
        width="20"
        height="170"
        fill={warm}
        data-part="disc-section"
      />
      <rect
        x={365 - gap}
        y="205"
        width="25"
        height="100"
        fill="#dfc391"
        data-part="inner-pad"
      />
      <rect
        x={410 + gap}
        y="205"
        width="25"
        height="100"
        fill="#dfc391"
        data-part="outer-pad"
      />
      <rect
        x={325 + gap}
        y="222"
        width={40 - 2 * gap}
        height="66"
        fill="#b7cccd"
      />
      <path
        d={`M70 255H${325 + gap}`}
        stroke={contact ? "#edca83" : "#8fa7ac"}
        strokeWidth="8"
      />
      <path
        d="M85 225l40 30-40 30"
        fill="none"
        stroke="#e3c388"
        strokeWidth="4"
      />
      <text x="40" y="205" fill="#edf3ed" fontSize="20">
        压力传递
      </text>
      <text x="255" y="335" fill="#edf3ed" fontSize="20">
        活塞侧
      </text>
      <text x="420" y="335" fill="#edf3ed" fontSize="20">
        钳指侧
      </text>
      <text x="335" y="390" fill="#edf3ed" fontSize="20">
        盘的两个平面
      </text>
      <circle cx="650" cy="255" r="72" fill={warm} />
      <path
        d="M650 255V190"
        stroke="#e8dfc6"
        strokeWidth="6"
        transform={`rotate(${angle} 650 255)`}
      />
      <circle cx="650" cy="255" r="18" fill="#345864" />
      <text x="555" y="150" fill="#edf3ed" fontSize="20">
        盘面正视（另图）
      </text>
      <text x="545" y="365" fill="#edf3ed" fontSize="20">
        {contact ? "接触后逐渐减速" : "接触前保持转动"}
      </text>
      <text x="30" y="440" fill="#edf3ed" fontSize="20">
        间隙、位移与发热配色被放大；不表示制动距离或温度
      </text>
    </g>
  );
}
