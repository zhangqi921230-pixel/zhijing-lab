import React, { useMemo } from "react";
import ThreeScene from "./ThreeScene.jsx";
import { CONTOUR_DEFAULTS } from "./contourSession.mjs";
import { lessons } from "./lessons.mjs";
export default function SpatialPreview({ id, onFailure, playing = true }) {
  const p = useMemo(
    () => ({
      ...Object.fromEntries(
        lessons.find((l) => l.id === id).params.map((f) => [f.key, f.value]),
      ),
      quality: "fluent",
      labels: 0,
      ...(id === "contour"
        ? {
            ...CONTOUR_DEFAULTS,
            labels: false,
            projection: false,
            flow: playing,
          }
        : {}),
      ...(id === "cube" ? { fold: 50 } : {}),
      ...(id === "incline" ? { forces: 1 } : {}),
    }),
    [id, playing],
  );
  return (
    <div className="spatial-preview">
      <ThreeScene
        id={id}
        p={p}
        small
        preview={playing}
        onPreviewError={onFailure}
      />
      <span className="preview-caption">三维结构 · 自动环视</span>
    </div>
  );
}
