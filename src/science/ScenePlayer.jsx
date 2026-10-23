import React, { useState, useEffect, lazy, Suspense } from "react";
import Button from "../LabButton.jsx";
import { LaboratoryBoundary } from "../LaboratoryLoader.jsx";
const Spatial = lazy(() => import("./ScienceSpatial.jsx"));
// Shared control contract: conditions reset time, view changes only pause it.
export default function ScenePlayer({
  topic,
  chapter,
  scene,
  Diagram,
  variants = [],
  motion = false,
  range = true,
  initial = 0,
  caption,
  children,
}) {
  const [value, setValue] = useState(initial),
    [variant, setVariant] = useState(0),
    [playing, setPlaying] = useState(false),
    [view, setView] = useState(false),
    [loaded, setLoaded] = useState(false);
  useEffect(() => setPlaying(false), [chapter, view]);
  useEffect(() => {
    const stop = () => {
      if (document.hidden) setPlaying(false);
    };
    document.addEventListener("visibilitychange", stop);
    return () => document.removeEventListener("visibilitychange", stop);
  }, []);
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(
      () =>
        setValue((v) => {
          if (v >= 100) {
            setPlaying(false);
            return 100;
          }
          return v + 1;
        }),
      90,
    );
    return () => clearInterval(t);
  }, [playing]);
  const set = (v) => {
    setPlaying(false);
    setValue(v);
  };
  const diagram = <Diagram id={topic.id} value={value} variant={variant} />;
  const fallback = (
    <>
      {diagram}
      <div className="science-controls">
        <Button onClick={() => setView(false)}>返回原理图继续操作</Button>
      </div>
    </>
  );
  return (
    <div>
      {topic.spatial && (
        <div className="science-controls">
          <Button aria-pressed={!view} onClick={() => setView(false)}>
            原理与变化
          </Button>
          <Button
            aria-pressed={view}
            onClick={() => {
              setLoaded(true);
              setView(true);
            }}
          >
            三维结构
          </Button>
        </div>
      )}
      <div hidden={view}>{diagram}</div>
      {loaded && (
        <div hidden={!view}>
          <LaboratoryBoundary fallback={fallback}>
            <Suspense
              fallback={
                <p role="status" className="science-caption">
                  正在准备结构…
                </p>
              }
            >
              <Spatial
                topic={topic}
                chapter={chapter}
                active={view}
                fallback={fallback}
                progress={value}
              />
            </Suspense>
          </LaboratoryBoundary>
        </div>
      )}
      <div hidden={view}>
        <div className="science-controls">
          {variants.map((v, i) => (
            <Button
              key={v}
              aria-pressed={variant === i}
              onClick={() => {
                setVariant(i);
                set(initial);
              }}
            >
              {v}
            </Button>
          ))}
          {range && (
            <label>
              {scene.control}
              <output>{value} / 100</output>
              <input
                type="range"
                min="0"
                max="100"
                value={value}
                onChange={(e) => set(Number(e.target.value))}
              />
            </label>
          )}
          {motion && (
            <>
              <Button
                onClick={() => {
                  if (value >= 100) setValue(0);
                  setPlaying((v) => !v);
                }}
              >
                {playing ? "暂停" : "播放过程"}
              </Button>
              <Button
                disabled={value >= 100}
                onClick={() => set(Math.min(100, value + 10))}
              >
                下一步
              </Button>
            </>
          )}
          <Button
            onClick={() => {
              set(initial);
              setVariant(0);
            }}
          >
            恢复初始状态
          </Button>
        </div>
        <p className="science-caption" role="status">
          {caption
            ? caption(value, variant)
            : scene.states[Math.min(variant, scene.states.length - 1)]}
        </p>
        {children}
      </div>
    </div>
  );
}
