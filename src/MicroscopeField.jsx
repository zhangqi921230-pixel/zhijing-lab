import MicroscopeFieldScale from "./MicroscopeFieldScale.jsx";
import MicroscopeMotionStudy from "./MicroscopeMotionStudy.jsx";
import { microscopeObservationCaption } from "./microscopeObservation.mjs";
import MicroscopeObjectiveChoice from "./MicroscopeObjectiveChoice.jsx";
import { microscopeFocusAdvice } from "./microscopeFocusAdvice.mjs";
import RealSpecimenReference from "./RealSpecimenReference.jsx";
import { installMicroscopeWheel } from "./MicroscopeWheel.mjs";
import { installMicroscopeFieldDrag } from "./MicroscopeFieldDrag.mjs";
import { pondMotion } from "./pondMotion.mjs";
import { ciliateCurves, ciliaRoots, ciliumTip } from "./ciliateOutline.mjs";
import { onionTissue, onionWallControl } from "./onionTissue.mjs";
import React, { useEffect, useRef, useState } from "react";
import { validateSpecimenHeader } from "./specimenImage.mjs";

export function microscopeOptics(p) {
  const zoom = p.mag / 100;
  return {
    zoom,
    illuminated: p.power !== 0,
    // Relative area cue only; neither photometry nor a diffraction/contrast solver.
    apertureTransmission: Math.min(1, ((p.aperture ?? 70) / 70) ** 2),
    fieldDiameter: 180000 / p.mag,
    blur: Math.min(
      10,
      Math.abs((p.coarse - 50) * 0.2 + (p.focus - 50) * 0.035) *
        Math.sqrt(zoom),
    ),
    dx: -p.x * zoom,
    dy: p.y * zoom,
  };
}
function random(seed) {
  let n = seed >>> 0;
  return () => {
    n = (Math.imul(n, 1664525) + 1013904223) >>> 0;
    return n / 4294967296;
  };
}
function ellipse(c, x, y, rx, ry, fill, stroke) {
  c.beginPath();
  c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  if (fill) {
    c.fillStyle = fill;
    c.fill();
  }
  if (stroke) {
    c.strokeStyle = stroke;
    c.stroke();
  }
}
const onionCells = onionTissue();
function onionSlide(context = null, bounds = null) {
  const canvas = context ? context.canvas : document.createElement("canvas");
  if (!context) canvas.width = canvas.height = 1536;
  const c = context || canvas.getContext("2d");
  c.fillStyle = "#f1e5cb";
  c.fillRect(0, 0, 1536, 1536);
  for (const cell of onionCells) {
    const points = cell.points;
    const minX = Math.min(...points.map((p) => p[0])),
      maxX = Math.max(...points.map((p) => p[0])),
      minY = Math.min(...points.map((p) => p[1])),
      maxY = Math.max(...points.map((p) => p[1]));
    if (
      bounds &&
      (maxX < bounds.minX ||
        minX > bounds.maxX ||
        maxY < bounds.minY ||
        minY > bounds.maxY)
    )
      continue;
    const rng = random(721 + cell.row * 103 + cell.col * 7919);
    const center = points.reduce(
      (sum, v) => [sum[0] + v[0] / 4, sum[1] + v[1] / 4],
      [0, 0],
    );
    c.save();
    c.beginPath();
    c.moveTo(...points[0]);
    points.forEach((a, i) => {
      const b = points[(i + 1) % points.length];
      c.quadraticCurveTo(...onionWallControl(a, b), ...b);
    });
    c.closePath();
    c.fillStyle = `hsl(${39 + cell.shade * 5},35%,${84 + cell.shade * 7}%)`;
    c.fill();
    c.lineWidth = 1.6;
    c.strokeStyle = "rgba(112,101,70,.62)";
    c.stroke();
    c.lineWidth = 0.55;
    c.strokeStyle = "rgba(248,242,209,.8)";
    c.stroke();
    c.clip();
    // Thin peripheral cytoplasm and a pale interior, without cartoon organelles.
    c.beginPath();
    points.forEach(([x, y], i) => {
      const px = center[0] + (x - center[0]) * 0.88,
        py = center[1] + (y - center[1]) * 0.72;
      i ? c.lineTo(px, py) : c.moveTo(px, py);
    });
    c.closePath();
    c.fillStyle = "rgba(255,253,238,.24)";
    c.fill();
    for (let i = 0; i < 90; i++) {
      c.fillStyle = `rgba(130,113,72,${0.015 + rng() * 0.065})`;
      c.fillRect(
        minX + rng() * (maxX - minX),
        minY + rng() * (maxY - minY),
        0.3 + rng() * 0.65,
        0.3 + rng() * 0.65,
      );
    }
    const [nx, ny] = cell.nucleus;
    const shade = c.createRadialGradient(nx - 1, ny - 0.7, 0.2, nx, ny, 4.4);
    shade.addColorStop(0, "rgba(127,103,100,.58)");
    shade.addColorStop(0.65, "rgba(151,126,111,.38)");
    shade.addColorStop(1, "rgba(170,150,124,0)");
    ellipse(c, nx, ny, 4.4, 3.2, shade);
    ellipse(c, nx + 0.6, ny - 0.4, 0.7, 0.55, "rgba(105,86,87,.45)");
    c.restore();
  }
  return canvas;
}
function organism(c, index, t, viewport) {
  const rng = random(index * 191 + 92),
    { x, y, heading } = pondMotion(index, t);
  if (Math.hypot(x - viewport.x, y - viewport.y) > viewport.radius + 40) return;
  c.save();
  c.translate(x, y);
  c.rotate(heading);
  c.lineWidth = 0.55;
  if (index % 3 === 0) {
    // Paramecium-like ciliate: oral groove, vacuoles and a fine fringe.
    const g = c.createRadialGradient(0, 0, 1, 0, 0, 18);
    g.addColorStop(0, "rgba(186,181,136,.38)");
    g.addColorStop(1, "rgba(136,146,109,.16)");
    c.beginPath();
    c.moveTo(18, 0);
    ciliateCurves.forEach((curve) => c.bezierCurveTo(...curve.slice(1).flat()));
    c.fillStyle = g;
    c.fill();
    c.strokeStyle = "#8e9679";
    c.stroke();
    c.beginPath();
    ciliaRoots.forEach((root, j) => {
      const tip = ciliumTip(root, j, t + index * 0.3);
      c.moveTo(...root.position);
      c.quadraticCurveTo(
        root.position[0] + root.normal[0],
        root.position[1] + root.normal[1],
        ...tip,
      );
    });
    c.strokeStyle = "rgba(112,126,102,.38)";
    c.stroke();
    c.beginPath();
    c.moveTo(8, 2);
    c.quadraticCurveTo(-2, 0, -5, 5);
    c.strokeStyle = "#9c9b7e";
    c.stroke();
    ellipse(c, -3, -1, 4, 2, "rgba(113,111,92,.3)");
    for (const vx of [-11, 11]) {
      ellipse(c, vx, 0, 1.7, 1.7, "rgba(250,248,214,.55)", "#9ea28b");
    }
  } else if (index % 3 === 1) {
    c.beginPath();
    c.moveTo(-18, 0);
    c.bezierCurveTo(-10, -9, 10, -7, 17, 0);
    c.bezierCurveTo(8, 7, -8, 8, -18, 0);
    c.fillStyle = "rgba(104,138,75,.22)";
    c.fill();
    c.strokeStyle = "#799265";
    c.stroke();
    for (let j = 0; j < 9; j++)
      ellipse(
        c,
        -10 + rng() * 22,
        -3 + rng() * 6,
        1.8,
        0.9,
        "rgba(93,125,60,.6)",
      );
    ellipse(c, 9, -2, 1, 0.8, "#ae7655");
    c.beginPath();
    c.moveTo(17, 0);
    c.bezierCurveTo(23, Math.sin(t * 4 + index) * 6, 26, 0, 32, 3);
    c.strokeStyle = "rgba(112,131,90,.6)";
    c.stroke();
  } else {
    c.beginPath();
    for (let j = 0; j <= 40; j++) {
      const a = (j * Math.PI) / 20,
        r =
          11 +
          Math.sin(a * 3 + t * 0.3 + index) * 2.6 +
          Math.cos(a * 2 - t * 0.17) * 2;
      const px = Math.cos(a) * r,
        py = Math.sin(a) * r * 0.75;
      j ? c.lineTo(px, py) : c.moveTo(px, py);
    }
    c.closePath();
    c.fillStyle = "rgba(164,166,132,.18)";
    c.fill();
    c.strokeStyle = "#a5aa8d";
    c.stroke();
    ellipse(c, 0, 1, 2.7, 2.2, "rgba(134,133,108,.35)");
    ellipse(c, 5, -2, 2, 2, "rgba(252,249,224,.5)", "#a9ac93");
  }
  for (let j = 0; j < 24; j++)
    ellipse(
      c,
      (rng() - 0.5) * 20,
      (rng() - 0.5) * 6,
      0.2 + rng() * 0.4,
      0.2 + rng() * 0.4,
      "rgba(124,129,95,.23)",
    );
  c.restore();
}
export default function MicroscopeField({
  p,
  t,
  onChange,
  specimenSelection = 0,
  chapter = 0,
}) {
  const [photo, setPhoto] = useState(null);
  const [showReference, setShowReference] = useState(false);
  useEffect(() => setShowReference(false), [specimenSelection]);
  const [expanded, setExpanded] = useState(false);
  const expandButton = useRef(null);
  const [photoZoom, setPhotoZoom] = useState(1);
  const [showPointer, setShowPointer] = useState(true);
  const [photoStatus, setPhotoStatus] = useState("");
  const [exportStatus, setExportStatus] = useState("");
  const [exporting, setExporting] = useState(false);
  const [comparison, setComparison] = useState(null);
  const [comparisonError, setComparisonError] = useState("");
  const fieldPanel = useRef(null);
  useEffect(() => {
    if (comparison && fieldPanel.current) fieldPanel.current.scrollTop = 0;
  }, [comparison]);
  const loadSerial = useRef(0);
  const lastSelection = useRef([p.specimen, specimenSelection]);
  useEffect(() => {
    if (
      lastSelection.current[0] === p.specimen &&
      lastSelection.current[1] === specimenSelection
    )
      return;
    lastSelection.current = [p.specimen, specimenSelection];
    // A same-value explicit selection also leaves photo mode; focusing and
    // changing magnification do not. Invalidate any pending photo decode.
    loadSerial.current++;
    setPhoto(null);
    setPhotoZoom(1);
    setExportStatus("");
    setPhotoStatus(
      `已切换到${["字母 e", "洋葱表皮", "池塘微生物"][p.specimen]}示意标本。`,
    );
  }, [p.specimen, specimenSelection]);
  useEffect(
    () => () => {
      loadSerial.current++;
    },
    [],
  );
  async function loadPhoto(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const serial = ++loadSerial.current;
    setPhotoStatus("正在读取本地照片…");
    let url;
    try {
      const header = new Uint8Array(await file.slice(0, 12).arrayBuffer());
      const error = validateSpecimenHeader(header, file.size);
      if (error) throw new Error(error);
      url = URL.createObjectURL(file);
      const image = new Image();
      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = () =>
          reject(new Error("无法解码这张照片，请选择其他文件。"));
        image.src = url;
      });
      if (image.naturalWidth * image.naturalHeight > 32000000)
        throw new Error("照片超过 3200 万像素，请先降低分辨率。");
      if (serial !== loadSerial.current) return;
      setPhoto({ image, name: file.name });
      setPhotoZoom(1);
      setPhotoStatus("已载入本地照片；未上传，离开此实验后清除。");
    } catch (error) {
      if (serial === loadSerial.current) setPhotoStatus(error.message);
    } finally {
      if (url) URL.revokeObjectURL(url);
    }
  }
  const clamp = (x) => Math.max(-40, Math.min(40, Math.round(x)));
  const ref = useRef(null),
    slide = useRef(null),
    state = microscopeOptics(
      photo ? { ...p, mag: photoZoom * 100, power: 1, aperture: 70 } : p,
    );
  const specimenTime = !photo && p.specimen === 2 && p.power !== 0 ? t : 0;
  const dragState = useRef(null);
  dragState.current = { p, onChange, zoom: state.zoom, source: photo };
  useEffect(
    () => installMicroscopeFieldDrag(ref.current, () => dragState.current),
    [],
  );
  const liveCaption = microscopeObservationCaption(
    p,
    specimenTime,
    photo ? photoZoom : null,
  );
  function pinObservation() {
    try {
      const snapshot = document.createElement("canvas");
      snapshot.width = snapshot.height = 560;
      snapshot.getContext("2d").drawImage(ref.current, 0, 0, 560, 560);
      setComparison({
        image: snapshot.toDataURL("image/png"),
        caption: microscopeObservationCaption(
          p,
          specimenTime,
          photo ? photoZoom : null,
          photo?.name,
        ),
      });
      setExpanded(true);
      setComparisonError("");
    } catch {
      setComparisonError("未能固定观察图，请重试。");
    }
  }
  const wheelState = useRef({ p, onChange });
  wheelState.current = { p, onChange };
  useEffect(
    () => installMicroscopeWheel(ref.current, () => wheelState.current),
    [],
  );
  async function exportObservation() {
    if (!ref.current || exporting) return;
    setExporting(true);
    setExportStatus("");
    try {
      // Freeze the currently rendered pixels before the asynchronous PNG encode.
      const source = ref.current,
        output = document.createElement("canvas");
      output.width = source.width;
      const lines = microscopeObservationCaption(
        p,
        specimenTime,
        photo ? photoZoom : null,
        photo?.name,
      );
      output.height = source.height + 29 + lines.length * 29;
      const c = output.getContext("2d");
      c.fillStyle = "#101b21";
      c.fillRect(0, 0, output.width, output.height);
      c.drawImage(source, 0, 0);
      lines.forEach((line, i) => {
        c.font = i === 0 ? "bold 21px sans-serif" : "15px sans-serif";
        c.fillStyle = i === 0 ? "#e6ce92" : "#d0dbd6";
        c.fillText(line, 22, source.height + 30 + i * 29, output.width - 44);
      });
      const blob = await new Promise((resolve) =>
        output.toBlob(resolve, "image/png"),
      );
      if (!blob) throw new Error("图片生成失败，请重试。");
      const url = URL.createObjectURL(blob),
        link = document.createElement("a");
      link.href = url;
      link.download = `知境-显微观察-${photo ? "照片" : p.mag + "倍"}-${Date.now()}.png`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 30000);
      setExportStatus("已生成 PNG 并交给浏览器下载。");
    } catch (error) {
      setExportStatus(error.message || "导出失败，请重试。");
    } finally {
      setExporting(false);
    }
  }

  useEffect(() => {
    const canvas = ref.current,
      c = canvas.getContext("2d");
    const pixelScale = expanded ? 3 : 2;
    c.setTransform(pixelScale, 0, 0, pixelScale, 0, 0);
    c.clearRect(0, 0, 280, 280);
    ellipse(c, 140, 140, 133, 133, "#243838");
    if (!state.illuminated) {
      ellipse(c, 140, 140, 124, 124, "#060a0c");
      return;
    }
    c.save();
    c.beginPath();
    c.arc(140, 140, 124, 0, Math.PI * 2);
    c.clip();
    c.fillStyle = "#f4eedc";
    c.fillRect(0, 0, 280, 280);
    c.save();
    c.filter = `blur(${state.blur}px)`;
    c.translate(140 + state.dx, 140 + state.dy);
    c.scale(state.zoom, state.zoom);
    if (photo) {
      const factor =
        360 / Math.min(photo.image.naturalWidth, photo.image.naturalHeight);
      const width = photo.image.naturalWidth * factor,
        height = photo.image.naturalHeight * factor;
      c.drawImage(photo.image, -width / 2, -height / 2, width, height);
    } else if (p.specimen === 1) {
      if (p.mag >= 400) {
        // Draw only visible cells directly at display resolution. Magnifying a
        // 1536px cached slide would also magnify its raster interpolation.
        const radius = 140 / state.zoom,
          cx = 768 - state.dx / state.zoom,
          cy = 768 - state.dy / state.zoom;
        c.save();
        c.translate(-768, -768);
        onionSlide(c, {
          minX: cx - radius,
          maxX: cx + radius,
          minY: cy - radius,
          maxY: cy + radius,
        });
        c.restore();
      } else {
        if (!slide.current) slide.current = onionSlide();
        c.drawImage(slide.current, -768, -768);
      }
    } else if (p.specimen === 0) {
      c.rotate(Math.PI);
      c.font = "110px Georgia";
      c.textAlign = "center";
      c.fillStyle = "#35423c";
      c.fillText("e", 0, 0);
    } else {
      const viewport = {
        x: -state.dx / state.zoom,
        y: -state.dy / state.zoom,
        radius: 140 / state.zoom,
      };
      for (let i = 0; i < 54; i++) organism(c, i, specimenTime, viewport);
    }
    c.restore();
    if (!photo && showReference) {
      c.beginPath();
      c.arc(140 + state.dx, 140 + state.dy, 4, 0, Math.PI * 2);
      c.fillStyle = "#e3ae54";
      c.fill();
      c.strokeStyle = "#183d36";
      c.lineWidth = 1.2;
      c.stroke();
      c.beginPath();
      c.moveTo(132 + state.dx, 140 + state.dy);
      c.lineTo(148 + state.dx, 140 + state.dy);
      c.moveTo(140 + state.dx, 132 + state.dy);
      c.lineTo(140 + state.dx, 148 + state.dy);
      c.stroke();
    }
    const vignette = c.createRadialGradient(128, 130, 42, 140, 140, 130);
    vignette.addColorStop(0, "rgba(124,114,71,0)");
    vignette.addColorStop(0.82, "rgba(108,103,73,.06)");
    vignette.addColorStop(1, "rgba(75,76,53,.4)");
    c.fillStyle = vignette;
    c.fillRect(0, 0, 280, 280);
    c.fillStyle = `rgba(8,15,12,${1 - (0.3 + p.light * 0.007) * state.apertureTransmission})`;
    c.fillRect(0, 0, 280, 280);
    c.restore();
    if (showPointer) {
      c.beginPath();
      c.moveTo(18, 140);
      c.lineTo(76, 140);
      c.lineTo(18, 138);
      c.fillStyle = "#525c53";
      c.fill();
    }
    // FN 18 mm / objective magnification; scale is a model reference, not image metrology.
    if (!photo) {
      const microns = p.mag === 40 ? 1000 : p.mag === 100 ? 250 : 100,
        w = (248 * microns) / state.fieldDiameter;
      c.fillStyle = "#344a40";
      c.fillRect(140 - w / 2, 239, w, 1.5);
      c.font = "10px sans-serif";
      c.textAlign = "center";
      c.fillText(`${microns} µm · 示意`, 140, 253);
    }
  }, [p, specimenTime, photo, photoZoom, expanded, showPointer, showReference]);
  return (
    <div
      ref={fieldPanel}
      className={
        "microscope-field" +
        (expanded ? " expanded" : "") +
        (comparison ? " comparing" : "")
      }
      onKeyDown={(e) => {
        if (expanded && e.key === "Escape") {
          e.stopPropagation();
          setExpanded(false);
          expandButton.current?.focus();
        }
      }}
    >
      <header>
        <span>{photo ? "照片数字观察" : "目镜视野"}</span>
        <b>{photo ? photoZoom : p.mag}×</b>
        <button
          ref={expandButton}
          type="button"
          className="field-expand"
          aria-expanded={expanded}
          aria-label={expanded ? "收起目镜视野" : "放大目镜视野"}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "收起 ↙" : "放大 ↗"}
        </button>
      </header>
      {!photo && (
        <div
          className="microscope-light-controls"
          role="group"
          aria-label="目镜旁照明控制"
        >
          <button
            type="button"
            aria-label={p.power === 0 ? "开启显微镜光源" : "关闭显微镜光源"}
            aria-pressed={p.power !== 0}
            disabled={!onChange}
            onClick={() => onChange?.("power", p.power === 0 ? 1 : 0)}
          >
            光源{p.power === 0 ? "关" : "开"}
          </button>
          <label>
            亮度 {p.light}%
            <input
              type="range"
              aria-label="目镜照明亮度"
              min="10"
              max="100"
              step="5"
              value={p.light}
              disabled={!onChange || p.power === 0}
              onChange={(e) => onChange?.("light", Number(e.target.value))}
            />
          </label>
        </div>
      )}
      <div className="microscope-observation-caption" aria-label="当前观察标本">
        <strong>
          {photo
            ? photo.name
            : ["字母 e", "洋葱表皮", "池塘微生物"][p.specimen]}
        </strong>
        <span>
          {photo
            ? "本地照片 · 数字缩放，未标定尺寸"
            : `绘制示意 · 目镜 10× × 物镜 ${p.mag / 10}×`}
        </span>
      </div>
      {!photo && (
        <MicroscopeObjectiveChoice
          mag={p.mag}
          onChange={onChange}
          label="目镜旁切换物镜"
        />
      )}
      <div className="microscope-comparison-fields">
        <figure className="microscope-live-field">
          {comparison && <figcaption>当前视野 · 可继续调焦与移动</figcaption>}
          <canvas
            ref={ref}
            tabIndex={0}
            onKeyDown={(e) => {
              const direction = {
                ArrowRight: ["x", 1],
                ArrowLeft: ["x", -1],
                ArrowUp: ["y", 1],
                ArrowDown: ["y", -1],
              }[e.key];
              if (direction) {
                e.preventDefault();
                onChange?.(direction[0], clamp(p[direction[0]] + direction[1]));
              }
            }}
            width={expanded ? 840 : 560}
            height={expanded ? 840 : 560}
            role="img"
            aria-label={
              photo
                ? `本地照片数字观察，数字缩放${photoZoom}倍，未标定尺度，不能测量`
                : `模拟显微视野，${p.mag}倍，视野直径${(state.fieldDiameter / 1000).toFixed(2)}毫米，玻片与物像反向移动`
            }
          />
          {comparison && (
            <>
              <small>{liveCaption[0].replace("知境 · ", "")}</small>
              <small>{liveCaption[1]}</small>
              <small>{liveCaption[2]}</small>
              <details>
                <summary>当前完整参数</summary>
                {liveCaption.slice(3).map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </details>
            </>
          )}
        </figure>
        {comparison && (
          <figure className="microscope-pinned-field">
            <figcaption>固定对照 · 不随操作变化</figcaption>
            <img
              src={comparison.image}
              alt={"固定观察图：" + comparison.caption.join("；")}
            />
            <small>{comparison.caption[0].replace("知境 · ", "")}</small>
            <small>{comparison.caption[1]}</small>
            <small>{comparison.caption[2]}</small>
            <details>
              <summary>拍摄时的完整参数</summary>
              {comparison.caption.slice(3).map((line) => (
                <p key={line}>{line}</p>
              ))}
            </details>
          </figure>
        )}
      </div>
      <div
        className="field-stage-controls"
        role="group"
        aria-label={photo ? "照片数字位移" : "玻片小步移动"}
      >
        <small>
          {photo ? "数字位移 · 不移动真实标本" : "移动玻片 · 物像反向移动"}
        </small>
        <div>
          {[
            ["x", -1, "向左", "←"],
            ["y", 1, "向上", "↑"],
            ["y", -1, "向下", "↓"],
            ["x", 1, "向右", "→"],
          ].map(([key, delta, label, arrow]) => (
            <button
              key={label}
              type="button"
              aria-label={`${photo ? "数字位移" : "玻片"}${label}一步`}
              disabled={!onChange || (delta < 0 ? p[key] <= -40 : p[key] >= 40)}
              onClick={() => onChange?.(key, clamp(p[key] + delta))}
            >
              {arrow}
            </button>
          ))}
          <button
            type="button"
            disabled={!onChange || (p.x === 0 && p.y === 0)}
            title="仅将水平、垂直位移恢复为零，保留标本、倍率、调焦与照明"
            onClick={() => {
              onChange?.("x", 0);
              onChange?.("y", 0);
            }}
          >
            回到起点
          </button>
        </div>
      </div>
      <div
        className="field-fine-controls"
        role="group"
        aria-label="目镜视野细调"
      >
        <button
          type="button"
          disabled={p.focus <= 0}
          onClick={() => onChange?.("focus", Math.max(0, p.focus - 1))}
        >
          细准焦 −
        </button>
        <output aria-label="细准焦当前值">{p.focus}</output>
        <button
          type="button"
          disabled={p.focus >= 100}
          onClick={() => onChange?.("focus", Math.min(100, p.focus + 1))}
        >
          细准焦 +
        </button>
        {expanded && <small>仅放大显示 · 不改变光学倍率 · Esc 收起</small>}
      </div>
      <footer>
        {photo
          ? state.blur > 0.6
            ? "正在叠加模拟离焦效果"
            : "原片清晰度 · 未模拟额外离焦"
          : !state.illuminated
            ? "光源已关闭 · 开灯后观察标本"
            : microscopeFocusAdvice(p, state).canAssessFocus === false
              ? "照明较暗 · 先调整光阑与灯光，再判断清晰度"
              : state.blur > 0.6
                ? "物像尚未清晰 · 调整粗/细准焦"
                : "已合焦 · 移动玻片观察倒像"}
        <small>
          拖动物像 · 方向键移动玻片 · 滚轮细调 · Shift + 滚轮粗调
          <br />
          {photo ? "本地照片 · 调焦与照明为数字模拟" : "程序绘制标本 · 非实拍"}
          <br />
          {photo
            ? "未标定尺度，不显示测量标尺；数字缩放不增加光学分辨率。"
            : `视场数 18 mm · 直径 ${(state.fieldDiameter / 1000).toFixed(2)} mm`}
        </small>
      </footer>
      {!photo && (
        <MicroscopeFieldScale
          mag={p.mag}
          fieldDiameter={state.fieldDiameter}
          x={p.x}
          y={p.y}
          reference={showReference}
          onReference={setShowReference}
          onChange={onChange}
        />
      )}
      {!photo && chapter === 3 && (
        <MicroscopeMotionStudy
          p={p}
          onChange={onChange}
          onReference={setShowReference}
        />
      )}
      <RealSpecimenReference />
      <div className="specimen-photo-controls">
        <button
          type="button"
          aria-pressed={showPointer}
          onClick={() => setShowPointer(!showPointer)}
        >
          {showPointer ? "隐藏目镜指针" : "显示目镜指针"}
        </button>
        {showPointer && (
          <small>左侧尖线是目镜指针，固定在视野中，不属于标本结构。</small>
        )}
        <button type="button" onClick={pinObservation}>
          {comparison ? "用当前视野更新对照" : "固定当前视野作对照"}
        </button>
        {comparison && (
          <>
            <button type="button" onClick={() => setComparison(null)}>
              清除对照图
            </button>
            <span role="status">
              对照图仅保留在本页，离开实验后清除；未上传。
            </span>
          </>
        )}
        {comparisonError && <span role="alert">{comparisonError}</span>}
        <button type="button" onClick={exportObservation} disabled={exporting}>
          {exporting ? "正在生成观察图…" : "保存当前观察图 PNG"}
        </button>
        {exportStatus && <span role="status">{exportStatus}</span>}
        {photo && (
          <>
            <span className="specimen-photo-name" title={photo.name}>
              {photo.name}
            </span>
            <div role="group" aria-label="照片数字缩放">
              {[1, 2, 4].map((value) => (
                <button
                  type="button"
                  key={value}
                  aria-pressed={photoZoom === value}
                  onClick={() => setPhotoZoom(value)}
                >
                  {value}×
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                loadSerial.current++;
                setPhoto(null);
                setPhotoStatus("已返回程序示意标本。");
              }}
            >
              返回示意标本
            </button>
          </>
        )}
        <label className="specimen-file-label">
          {photo ? "更换本地照片" : "载入本地显微照片"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={loadPhoto}
            aria-label="载入本地显微照片"
          />
        </label>
        <span role="status">
          {photoStatus || "JPG / PNG / WebP · ≤10 MB · 仅本机处理"}
        </span>
      </div>
    </div>
  );
}
