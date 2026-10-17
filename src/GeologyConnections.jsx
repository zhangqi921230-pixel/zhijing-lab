import React, { lazy, Suspense, useState } from "react";
const GlobalPlateAtlas = lazy(() => import("./GlobalPlateAtlas.jsx"));

const topics = [
  {
    id: "plates",
    title: "板块怎样运动",
    description: "观察板块边界的相对运动与地形变化。",
  },
  {
    id: "volcano",
    title: "火山怎样喷发",
    description: "进入剖面，追踪岩浆通道、熔岩和喷出碎屑。",
  },
  {
    id: "earthquake",
    title: "地震波怎样到达台站",
    description: "改变震源深度和距离，比较 P、S 波到时。",
  },
];

export default function GeologyConnections({ id, onOpen, onInspect }) {
  const [atlas, setAtlas] = useState(false);
  if (!topics.some((topic) => topic.id === id)) return null;
  return (
    <section className="geology-connections" aria-label="关联地理探究">
      <h3>把现象联系起来</h3>
      <p>对照板块运动、火山喷发与地震波传播，区分三种过程。</p>
      <button
        onClick={() => {
          onInspect?.();
          setAtlas(true);
        }}
      >
        <strong>打开全球板块图 ↗</strong>
        <span>在地球上观察板块边界，定位太平洋、亚洲和大西洋。</span>
      </button>
      {atlas && (
        <Suspense fallback={<p role="status">正在准备全球视图…</p>}>
          <GlobalPlateAtlas onClose={() => setAtlas(false)} />
        </Suspense>
      )}
      {topics
        .filter((topic) => topic.id !== id)
        .map((topic) => (
          <button key={topic.id} onClick={() => onOpen(topic.id)}>
            <strong>
              {topic.title}
              <span aria-hidden="true"> ↗</span>
            </strong>
            <span>{topic.description}</span>
          </button>
        ))}
    </section>
  );
}
