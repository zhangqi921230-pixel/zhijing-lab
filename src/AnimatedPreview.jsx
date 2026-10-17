import React, { useEffect, useRef, useState, lazy, Suspense } from "react";
const MotionPreview = lazy(() => import("./MotionPreview.jsx"));
const SciencePreview = lazy(() => import("./SciencePreview.jsx"));
const SpatialPreview = lazy(() => import("./SpatialPreview.jsx"));
import { spatialPreviewIds, sciencePreviewIds } from "./previewCatalog.mjs";
import "./AnimatedPreview.css";
import { nativeMotionPreviewIds, motionPosterPath } from "./motionTopics.mjs";
export function usePreviewPlayback() {
  // Autoplay is the product default; the explicit pause control remains available.
  const [enabled, setEnabled] = useState(true);
  const [visible, setVisible] = useState([]);
  const visibility = (id, inView) =>
    setVisible((old) =>
      inView
        ? old.includes(id)
          ? old
          : [...old, id]
        : old.filter((x) => x !== id),
    );
  return {
    enabled,
    setEnabled,
    isPlaying: (id) => enabled && visible.includes(id),
    visibility,
  };
}
export default function AnimatedPreview({ id, title, playing, onVisible }) {
  const poster = motionPosterPath(id);
  const root = useRef(null),
    callback = useRef(onVisible),
    [failed, setFailed] = useState(false),
    [hidden, setHidden] = useState(document.hidden);
  callback.current = onVisible;
  useEffect(() => {
    if (!window.IntersectionObserver) {
      callback.current(id, true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) =>
        callback.current(
          id,
          entries[0].isIntersecting && entries[0].intersectionRatio >= 0.1,
        ),
      { threshold: 0.1 },
    );
    observer.observe(root.current);
    return () => {
      observer.disconnect();
      callback.current(id, false);
    };
  }, [id]);
  useEffect(() => {
    const listener = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", listener);
    return () => document.removeEventListener("visibilitychange", listener);
  }, []);
  const motion = playing && !hidden && !failed;
  return (
    <div className="animated-preview" ref={root}>
      {motion ? (
        <PreviewBoundary
          onFailure={() => setFailed(true)}
          fallback={<PreviewPoster id={id} poster={poster} title={title} />}
        >
          <Suspense
            fallback={<PreviewPoster id={id} poster={poster} title={title} />}
          >
            {nativeMotionPreviewIds.includes(id) ? (
              <MotionPreview id={id} playing />
            ) : spatialPreviewIds.includes(id) ? (
              <SpatialPreview id={id} onFailure={() => setFailed(true)} />
            ) : sciencePreviewIds.includes(id) ? (
              <SciencePreview id={id} playing />
            ) : (
              <PreviewPoster id={id} poster={poster} title={title} />
            )}
          </Suspense>
        </PreviewBoundary>
      ) : (
        <PreviewPoster id={id} poster={poster} title={title} />
      )}
      <span className="preview-state">
        {motion ? "● 动态演示" : "Ⅱ 静态封面"}
      </span>
    </div>
  );
}

function PreviewPoster({ id, poster, title }) {
  return (
    <div
      className={`preview-poster ${poster.endsWith(".webp") ? "preview-poster-legacy" : ""}`}
    >
      <img
        className="poster"
        src={poster}
        alt={`${title}预览`}
        loading="lazy"
        width="640"
        height="400"
      />
    </div>
  );
}
export class PreviewBoundary extends React.Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure();
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
