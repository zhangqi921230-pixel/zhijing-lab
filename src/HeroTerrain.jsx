import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import { PreviewBoundary } from "./AnimatedPreview.jsx";
const SpatialPreview = lazy(() => import("./SpatialPreview.jsx"));
export default function HeroTerrain() {
  const host = useRef(null);
  const [visible, setVisible] = useState(false);
  const [enabled, setEnabled] = useState(
    () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [hidden, setHidden] = useState(document.hidden);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    observer.observe(host.current);
    const visibility = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  return (
    <div className="hero-terrain" ref={host}>
      <PreviewBoundary
        onFailure={() => setFailed(true)}
        fallback={
          <div className="scene-loading" role="status">
            三维预览暂不可用，可进入课程重试
          </div>
        }
      >
        <Suspense
          fallback={
            <div className="scene-loading" role="status">
              正在准备地形动画…
            </div>
          }
        >
          {visible && !hidden && !failed ? (
            <SpatialPreview
              id="contour"
              playing={enabled}
              onFailure={() => setFailed(true)}
            />
          ) : (
            <div className="scene-loading">
              {failed ? "三维预览暂不可用，可进入课程重试" : "地形自动环视"}
            </div>
          )}
        </Suspense>
      </PreviewBoundary>
      <button
        className="hero-preview-start"
        disabled={failed}
        aria-pressed={enabled}
        onClick={() => setEnabled((v) => !v)}
      >
        {enabled ? "暂停地形动画" : "播放地形动画"}
      </button>
    </div>
  );
}
