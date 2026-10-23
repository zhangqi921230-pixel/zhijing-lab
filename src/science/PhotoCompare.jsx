import React, { useState } from "react";
import Button from "../LabButton.jsx";
import { natureAssets } from "./natureAssets.mjs";
export default function PhotoCompare({ topic }) {
  const items = natureAssets.filter((a) => a.topic === topic),
    [other, setOther] = useState(1),
    [zoom, setZoom] = useState(false),
    [reveal, setReveal] = useState(false);
  return (
    <div className="science-photo-compare">
      <div className="science-controls">
        <Button aria-pressed={!zoom} onClick={() => setZoom(false)}>
          看完整样本
        </Button>
        <Button aria-pressed={zoom} onClick={() => setZoom(true)}>
          放大关键部位
        </Button>
        {items.length > 2 && (
          <label>
            右侧对照样本
            <select value={other} onChange={(e) => setOther(+e.target.value)}>
              {items.slice(1).map((a, i) => (
                <option key={a.id} value={i + 1}>
                  {a.name}
                </option>
              ))}
            </select>
          </label>
        )}
        <Button onClick={() => setReveal(!reveal)}>
          {reveal ? "隐藏观察线索" : "显示观察线索"}
        </Button>
      </div>
      <div className="science-photo-pair">
        {[items[0], items[other]].map((a) => (
          <figure key={a.id}>
            <div className="science-photo-window">
              <img
                src={`${import.meta.env.BASE_URL}${a.file}`}
                width={a.width}
                height={a.height}
                alt={a.alt}
                style={{
                  transform: zoom ? "scale(1.8)" : "none",
                  transformOrigin: `${a.focus[0]}% ${a.focus[1]}%`,
                }}
              />
            </div>
            <figcaption>
              <strong>{a.name}</strong>
              <i>{a.species}</i>
              {reveal && <p>{a.note}</p>}
              <small>
                <a href={a.source} target="_blank" rel="noreferrer">
                  {a.author} · 来源
                </a>{" "}
                /{" "}
                <a href={a.licenseUrl} target="_blank" rel="noreferrer">
                  {a.license}
                </a>
              </small>
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="science-caption">
        先比较结构，再展开线索。局部放大不会补出原图没有的细节；遮挡或模糊时可以保留“线索不足”的判断。
      </p>
    </div>
  );
}
