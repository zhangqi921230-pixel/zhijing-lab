import React from "react";
import ScienceAtlas from "./ScienceAtlas.jsx";
const points = [
  [
    "发动机",
    12,
    79,
    "燃烧室和喷管将高温高压气体向后排出。管线和泵的细节为概念表达，不是制造图。",
  ],
  ["一级燃料贮箱", 31, 62, "一级中独立储存燃料的空间。金色只是教学区分色。"],
  [
    "一级氧化剂贮箱",
    47,
    46,
    "火箭自己携带氧化剂，因此不依赖从外界空气中取氧。蓝色只是教学区分色。",
  ],
  ["二级", 72, 26, "二级有自己的一组贮箱和发动机，在一级分离后继续加速。"],
  ["载荷", 90, 12, "载荷位于鼻部整流罩内部。图示小卫星仅表示载荷的相对位置。"],
];
const chapterMap = { payload: 4, tanks: 1, engine: 0, stages: 3 };
export default function RocketAtlas({ chapter }) {
  return (
    <ScienceAtlas
      asset={{
        file: "science/rocket-cutaway-v2.png",
        width: 1536,
        height: 1024,
        alt: "两级液体火箭的写实剖面概念插画，四个分开的贮箱、两级发动机与鼻部卫星沿纵轴排列",
      }}
      points={points}
      annotations={[
        {
          x: 3,
          y: 45,
          short: "向后高速排出气体，产生推力。",
          line: "12,79 8,64 8,59",
        },
        {
          x: 36,
          y: 82,
          short: "储存供一级发动机使用的燃料。",
          line: "31,62 31,89 36,89",
        },
        {
          x: 3,
          y: 19,
          short: "携带氧化剂，支持燃料燃烧。",
          line: "47,46 31,36 31,30",
        },
        {
          x: 65,
          y: 52,
          short: "一级分离后，用自身发动机继续加速。",
          line: "72,26 90,39 90,52",
        },
        {
          x: 46,
          y: 3,
          short: "被送往太空的卫星等有效载荷。",
          line: "90,12 81,9 78,9",
        },
      ]}
      chapter={chapter}
      chapterMap={chapterMap}
      notice="AI 辅助概念插画 · 已校正贮箱排列，细部仍待独立科学审核。完整原理以文字及结构示意为准。"
    />
  );
}
