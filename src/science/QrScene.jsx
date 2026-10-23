import React, { useMemo, useState } from "react";
import QRCode from "qrcode";
import jsQR from "jsqr";
import Button from "../LabButton.jsx";
export function qrExperiment(text, cover = 0, corner = false) {
  const qr = QRCode.create(text, { errorCorrectionLevel: "H" }),
    n = qr.modules.size;
  const side = Math.round(cover),
    x = corner ? 0 : Math.floor((n - side) / 2),
    y = corner ? 0 : Math.floor((n - side) / 2);
  const visible = Array.from(qr.modules.data, (v, i) =>
    i % n >= x &&
    i % n < x + side &&
    Math.floor(i / n) >= y &&
    Math.floor(i / n) < y + side
      ? 0
      : v,
  );
  const scale = 6,
    w = (n + 8) * scale,
    rgba = new Uint8ClampedArray(w * w * 4).fill(255);
  for (let row = 0; row < n; row++)
    for (let col = 0; col < n; col++)
      if (visible[row * n + col])
        for (let dy = 0; dy < scale; dy++)
          for (let dx = 0; dx < scale; dx++) {
            const k =
              (((row + 4) * scale + dy) * w + (col + 4) * scale + dx) * 4;
            rgba[k] = rgba[k + 1] = rgba[k + 2] = 0;
          }
  const decoded = jsQR(rgba, w, w, { inversionAttempts: "dontInvert" });
  return { n, visible, text: decoded?.data || null, x, y, side };
}
export default function QrScene() {
  const [cover, setCover] = useState(0),
    [corner, setCorner] = useState(false),
    [message, setMessage] = useState(false),
    [highlight, setHighlight] = useState(false);
  const payload = message ? "LOOK CLOSELY" : "ZHIJING SCIENCE";
  const result = useMemo(
    () => qrExperiment(payload, cover, corner),
    [payload, cover, corner],
  );
  const { n, visible, x, y, side } = result;
  return (
    <div>
      <div className="science-qr">
        <svg
          viewBox={`-4 -4 ${n + 8} ${n + 8}`}
          role="img"
          aria-label="真实编码的二维码，当前遮挡与解码输入一致"
          shapeRendering="crispEdges"
        >
          <rect x="-4" y="-4" width={n + 8} height={n + 8} fill="white" />
          {visible.map((v, i) =>
            v ? (
              <rect
                key={i}
                x={i % n}
                y={Math.floor(i / n)}
                width="1"
                height="1"
                fill="#111"
              />
            ) : null,
          )}
          {highlight &&
            [
              [0, 0],
              [n - 7, 0],
              [0, n - 7],
            ].map(([a, b]) => (
              <rect
                key={`${a}-${b}`}
                x={a - 0.3}
                y={b - 0.3}
                width="7.6"
                height="7.6"
                fill="none"
                stroke="#159787"
                strokeWidth=".3"
              />
            ))}
          {side > 0 && (
            <rect
              x={x}
              y={y}
              width={side}
              height={side}
              fill="none"
              stroke="#c56e3b"
              strokeWidth=".15"
            />
          )}
        </svg>
      </div>
      <div className="science-controls">
        <label>
          遮挡边长<output>{cover} 个模块</output>
          <input
            type="range"
            min="0"
            max="18"
            value={cover}
            onChange={(e) => setCover(Number(e.target.value))}
          />
        </label>
        <Button aria-pressed={corner} onClick={() => setCorner((v) => !v)}>
          {corner ? "遮挡图案中央" : "遮挡左上定位角"}
        </Button>
        <Button
          aria-pressed={highlight}
          onClick={() => setHighlight((v) => !v)}
        >
          定位结构高亮
        </Button>
        <Button
          onClick={() => {
            setMessage((v) => !v);
            setCover(0);
          }}
        >
          更换编码文本
        </Button>
        <Button
          onClick={() => {
            setCover(0);
            setCorner(false);
            setHighlight(false);
            setMessage(false);
          }}
        >
          恢复初始状态
        </Button>
      </div>
      <p className="science-caption">编码文本：{payload} · H 级纠错</p>
      <p className="science-caption" role="status">
        {result.text
          ? `本次实际解码成功：${result.text}`
          : "本次未能识别。缩小遮挡或换位置后再比较。"}
      </p>
      <p className="science-caption">
        彩色轮廓只供观察，不参与解码。成功与否来自本地解码器，不按遮挡面积预设结果。
      </p>
    </div>
  );
}
