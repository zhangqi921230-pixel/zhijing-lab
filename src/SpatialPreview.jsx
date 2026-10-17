import React, { useMemo } from "react";
import ThreeScene from "./ThreeScene.jsx";
import { lessons } from "./lessons.mjs";
export default function SpatialPreview({ id, onFailure }) {
  const p = useMemo(
    () => ({
      ...Object.fromEntries(
        lessons.find((l) => l.id === id).params.map((f) => [f.key, f.value]),
      ),
      quality: "fluent",
      labels: 0,
      ...(id === "contour"
        ? { trees: 1, water: 1, contours: 1, rocks: 0, flow: 0 }
        : {}),
      ...(id === "cube" ? { fold: 50 } : {}),
      ...(id === "incline" ? { forces: 1 } : {}),
    }),
    [id],
  );
  return (
    <div className="spatial-preview">
      <ThreeScene id={id} p={p} small preview onPreviewError={onFailure} />
      <span className="preview-caption">三维结构 · 自动环视</span>
    </div>
  );
}
