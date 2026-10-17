import React from "react";
import { dandelinTangents } from "./conicDandelin.mjs";

export default function DandelinReadout({ spheres, foci, point }) {
  const rows = spheres.flatMap((sphere, i) => {
    if (!sphere.visible) return [];
    const proof = dandelinTangents(sphere, point);
    const index = foci.findIndex(
      (f) =>
        Math.hypot(...f.point.map((v, axis) => v - sphere.focus[axis])) < 1e-8,
    );
    if (!proof || index < 0) return [];
    return [{ i, proof, focus: foci.length === 1 ? "F" : `F${index + 1}` }];
  });
  if (!rows.length) return null;
  const maximum = Math.max(
    1e-10,
    ...rows.flatMap(({ proof }) => [proof.toFocus, proof.toCone]),
  );
  return (
    <div
      className="dandelin-readout"
      role="group"
      aria-label="实时切线长度对照"
    >
      <strong>同一点引出的两条切线</strong>
      {rows.map(({ i, proof, focus }) => (
        <div
          className="dandelin-readout-pair"
          key={i}
          style={{ color: i ? "#8d5524" : "#285f52" }}
        >
          {[
            [`P${focus}`, proof.toFocus],
            [`PT${i + 1}`, proof.toCone],
          ].map(([label, value]) => (
            <div className="dandelin-readout-row" key={label}>
              <span>{label}</span>
              <span className="dandelin-length-track" aria-hidden="true">
                <i style={{ width: `${(100 * value) / maximum}%` }} />
              </span>
              <output aria-label={`${label} 长度`}>{value.toFixed(4)}</output>
            </div>
          ))}
        </div>
      ))}
      <small>条长采用同一比例 · 模型单位</small>
    </div>
  );
}
