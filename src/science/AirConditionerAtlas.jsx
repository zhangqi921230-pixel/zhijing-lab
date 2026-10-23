import React from "react";
import ScienceAtlas from "./ScienceAtlas.jsx";
const points = [
  [
    "室内换热器",
    29,
    13,
    "制冷工况下，制冷剂在这里蒸发吸热；室内空气流过表面后温度降低。",
  ],
  [
    "贯流风扇",
    29,
    24,
    "推动房间空气流过换热器并送回室内；不是把制冷剂吹进房间。",
  ],
  ["室外风扇", 60, 63, "让室外空气流过换热器，帮助把热量排向环境。"],
  [
    "室外换热器",
    77,
    60,
    "制冷工况下承担冷凝放热；放出的热量包括室内移来的热和输入的功。",
  ],
  [
    "压缩机",
    85,
    68,
    "压缩低压制冷剂蒸气，消耗电能推动循环。具体内部结构和管线以原理图为准。",
  ],
];
export default function AirConditionerAtlas() {
  return (
    <ScienceAtlas
      asset={{
        file: "science/air-conditioner-cutaway.png",
        width: 1536,
        height: 1024,
        alt: "典型分体空调宏观剖面概念插画，展示室内机、室外风扇、换热器与压缩机",
      }}
      points={points}
      annotations={[
        {
          x: 62,
          y: 2,
          short: "蒸发吸热，让室内空气降温。",
          line: "29,13 57,6 62,6",
        },
        {
          x: 3,
          y: 41,
          short: "推动空气经过换热器，送回房间。",
          line: "29,24 35,37 28,41",
        },
        {
          x: 3,
          y: 59,
          short: "带走室外换热器放出的热量。",
          line: "60,63 40,64 35,64",
        },
        {
          x: 62,
          y: 26,
          short: "制冷剂在这里冷凝，向室外放热。",
          line: "77,60 79,40 79,37",
        },
        {
          x: 3,
          y: 80,
          short: "压缩制冷剂蒸气，推动整个循环。",
          line: "85,68 95,94 39,94 35,87",
        },
      ]}
      notice="AI 辅助概念插画 · 仅用于识别宏观部件；细管与阀件不作为维修或连接依据。"
    />
  );
}
