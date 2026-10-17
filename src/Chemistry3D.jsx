import React, { useEffect, useRef, useState } from "react";
import * as T from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { useTheme } from "./Theme.jsx";
import { buildChemistryApparatus } from "./ChemistryApparatus.js";
import {
  chemistryOverview,
  displacementSurfaceView,
} from "./chemistryViews.mjs";
export default function Chemistry3D({
  id,
  p,
  time,
  running,
  labels,
  onFallback,
}) {
  const host = useRef(),
    engine = useRef(),
    latest = useRef({ p, time, running, labels }),
    { theme } = useTheme();
  const [error, setError] = useState(false),
    [annotations, setAnnotations] = useState([]);
  latest.current = { p, time, running, labels };
  useEffect(() => {
    let renderer;
    try {
      renderer = new T.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: "low-power",
      });
    } catch {
      setError(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.35));
    renderer.setClearColor(theme === "dark" ? "#10191e" : "#f3f4ee");
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    const scene = new T.Scene(),
      camera = new T.PerspectiveCamera(38, 1, 0.1, 60);
    camera.position.set(5, 4.5, 7);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1.35, 0);
    controls.enableDamping = false;
    controls.minDistance = 4.5;
    controls.maxDistance = 14;
    controls.maxPolarAngle = Math.PI * 0.49;
    controls.enablePan = false;
    scene.add(new T.HemisphereLight("#f0f8ff", "#657366", 2.4));
    const key = new T.DirectionalLight("#fff1d8", 3);
    key.position.set(-3, 7, 5);
    scene.add(key);
    const rim = new T.DirectionalLight("#b5dcff", 1.8);
    rim.position.set(4, 3, -4);
    scene.add(rim);
    const model = buildChemistryApparatus(id);
    model.setTheme(theme === "dark");
    scene.add(model.root);
    setAnnotations(model.labels);
    const canvas = renderer.domElement;
    canvas.setAttribute(
      "aria-label",
      "可旋转的三维化学器材，拖动或方向键旋转，滚轮或加减键缩放，Home复位",
    );
    canvas.setAttribute("role", "img");
    canvas.tabIndex = 0;
    host.current.prepend(canvas);
    let frame = 0,
      visible = true,
      disposed = false,
      renderedState;
    const pos = new T.Vector3();
    function draw() {
      frame = 0;
      if (disposed || !visible || document.hidden) return;
      const state = latest.current;
      if (
        !renderedState ||
        renderedState.p !== state.p ||
        renderedState.time !== state.time ||
        renderedState.running !== state.running
      ) {
        model.update(state.p, state.time, state.running);
        renderedState = state;
      }
      controls.update();
      renderer.render(scene, camera);
      const width = host.current.clientWidth,
        height = host.current.clientHeight;
      host.current.querySelectorAll(".chem-3d-label").forEach((el, i) => {
        const l = model.labels[i];
        if (!l) return;
        pos.set(...l.pos).project(camera);
        el.style.transform = `translate(-50%,-50%) translate(${(pos.x * 0.5 + 0.5) * width + (l.offset?.[0] || 0)}px,${(-pos.y * 0.5 + 0.5) * height + (l.offset?.[1] || 0)}px)`;
        el.style.display =
          state.labels &&
          l.visible !== false &&
          pos.z > -1 &&
          pos.z < 1 &&
          Math.abs(pos.x) < 1 &&
          Math.abs(pos.y) < 1
            ? ""
            : "none";
      });
    }
    const invalidate = () => {
      if (!frame && !disposed && visible && !document.hidden)
        frame = requestAnimationFrame(draw);
    };
    const resize = new ResizeObserver(() => {
      if (!host.current) return;
      const w = host.current.clientWidth,
        h = host.current.clientHeight;
      if (w && h) {
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        invalidate();
      }
    });
    resize.observe(host.current);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      invalidate();
    });
    observer.observe(host.current);
    const visibility = () => invalidate();
    document.addEventListener("visibilitychange", visibility);
    controls.addEventListener("change", invalidate);
    const lost = (e) => {
      e.preventDefault();
      setError(true);
    };
    canvas.addEventListener("webglcontextlost", lost);
    engine.current = {
      invalidate,
      renderer,
      model,
      reset() {
        this.focus(chemistryOverview);
      },
      focus(view) {
        camera.position.set(...view.position);
        controls.target.set(...view.target);
        controls.minDistance = view.minDistance;
        controls.update();
        invalidate();
      },
      zoom(factor) {
        camera.position
          .sub(controls.target)
          .multiplyScalar(factor)
          .clampLength(controls.minDistance, controls.maxDistance)
          .add(controls.target);
        controls.update();
        invalidate();
      },
    };
    const orbit = new T.Spherical(),
      offset = new T.Vector3();
    const keyboard = (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === "Home") engine.current.reset();
      else if (["+", "="].includes(event.key)) engine.current.zoom(0.85);
      else if (["-", "_"].includes(event.key)) engine.current.zoom(1.15);
      else if (
        ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)
      ) {
        orbit.setFromVector3(offset.copy(camera.position).sub(controls.target));
        const step = Math.PI / 36;
        if (event.key === "ArrowLeft") orbit.theta -= step;
        if (event.key === "ArrowRight") orbit.theta += step;
        if (event.key === "ArrowUp") orbit.phi -= step;
        if (event.key === "ArrowDown") orbit.phi += step;
        orbit.phi = Math.max(0.08, Math.min(controls.maxPolarAngle, orbit.phi));
        camera.position
          .copy(offset.setFromSpherical(orbit))
          .add(controls.target);
        controls.update();
        invalidate();
      } else return;
      event.preventDefault();
    };
    canvas.addEventListener("keydown", keyboard);
    invalidate();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resize.disconnect();
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      controls.dispose();
      canvas.removeEventListener("webglcontextlost", lost);
      canvas.removeEventListener("keydown", keyboard);
      model.dispose();
      renderer.dispose();
      canvas.remove();
      engine.current = null;
    };
  }, [id]);
  useEffect(() => {
    const e = engine.current;
    if (e) {
      e.renderer.setClearColor(theme === "dark" ? "#10191e" : "#f3f4ee");
      e.model.setTheme(theme === "dark");
      e.invalidate();
    }
  }, [theme]);
  useEffect(
    () => engine.current?.invalidate(),
    [p, time, running, labels, annotations],
  );
  return (
    <div className="chem-3d" ref={host}>
      {annotations.map((l, i) => (
        <span key={i} className="chem-3d-label" aria-hidden={!labels}>
          {l.text}
        </span>
      ))}
      <div className="chem-3d-tools">
        <button
          aria-label="放大器材"
          onClick={() => engine.current?.zoom(0.85)}
        >
          ＋
        </button>
        <button
          aria-label="缩小器材"
          onClick={() => engine.current?.zoom(1.15)}
        >
          −
        </button>
        <button onClick={() => engine.current?.reset()}>复位视角</button>
        {id === "displacement" && (
          <button
            onClick={() => engine.current?.focus(displacementSurfaceView)}
          >
            观察金属表面
          </button>
        )}
      </div>
      <span className="chem-3d-hint">
        拖动或方向键旋转 · 滚轮/加减缩放 · Home 复位 · 器材结构示意
      </span>
      {error && (
        <div className="chem-3d-error" role="alert">
          当前设备无法显示三维器材。
          <button onClick={onFallback}>切换原理剖面</button>
        </div>
      )}
    </div>
  );
}
