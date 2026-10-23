import React, { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Button from "../LabButton.jsx";
import { buildSpatial, spatialParts } from "./spatialModels.mjs";
import RocketAtlas from "./RocketAtlas.jsx";
import { EarthDiagram } from "./EarthScene.jsx";
import { HomeDiagram } from "./HomeScene.jsx";
import { MechanismDiagram } from "./MechanismScene.jsx";
export default function ScienceSpatial({
  topic,
  chapter,
  active = true,
  variant = "geared",
  progress = 0,
  fallback,
}) {
  const host = useRef(null),
    api = useRef(null);
  const activeRef = useRef(active);
  activeRef.current = active;
  const [failed, setFailed] = useState(false),
    [cut, setCut] = useState(false),
    [explode, setExplode] = useState(false),
    [part, setPart] = useState(""),
    [phase, setPhase] = useState(0),
    [playing, setPlaying] = useState(false);
  const parts = (spatialParts[topic.id] || []).filter(
    (p) =>
      !(
        topic.id === "wind-turbine" &&
        variant === "direct" &&
        p[0] === "gearbox"
      ),
  );
  useEffect(() => {
    setPlaying(false);
  }, [chapter, active]);
  useEffect(() => {
    let renderer, controls, model, observer;
    let dead = false;
    const el = host.current;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
      renderer.setClearColor(0xe6edf0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      el.appendChild(renderer.domElement);
      const scene = new THREE.Scene(),
        camera = new THREE.PerspectiveCamera(37, 1, 0.1, 80);
      camera.position.set(6, 3, 9);
      camera.lookAt(0, 0, 0);
      scene.add(new THREE.HemisphereLight(0xffffff, 0x657986, 2.8));
      const light = new THREE.DirectionalLight(0xfff3df, 3.3);
      light.position.set(4, 7, 5);
      scene.add(light);
      model = buildSpatial(THREE, topic.id, variant);
      for (const mesh of model.parts.retina || [])
        mesh.material.side = THREE.DoubleSide;
      scene.add(model.root);
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = false;
      controls.enablePan = false;
      controls.minDistance = 5;
      controls.maxDistance = 18;
      const render = () => {
        if (!dead && !document.hidden && activeRef.current)
          renderer.render(scene, camera);
      };
      controls.addEventListener("change", render);
      const resize = () => {
        const w = el.clientWidth,
          h = el.clientHeight;
        if (w && h) {
          renderer.setSize(w, h);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          render();
        }
      };
      observer = new ResizeObserver(resize);
      observer.observe(el);
      const visibility = () => {
        setPlaying(false);
        render();
      };
      document.addEventListener("visibilitychange", visibility);
      let down;
      const ondown = (e) => {
        down = [e.clientX, e.clientY];
      };
      const onup = (e) => {
        if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 5)
          return;
        const b = renderer.domElement.getBoundingClientRect();
        const ray = new THREE.Raycaster();
        ray.setFromCamera(
          new THREE.Vector2(
            ((e.clientX - b.left) / b.width) * 2 - 1,
            (-(e.clientY - b.top) / b.height) * 2 + 1,
          ),
          camera,
        );
        const hit = ray
          .intersectObjects(model.root.children)
          .find((h) => h.object.visible);
        if (hit) setPart(hit.object.userData.part);
      };
      renderer.domElement.addEventListener("pointerdown", ondown);
      renderer.domElement.addEventListener("pointerup", onup);
      const lost = (e) => {
        e.preventDefault();
        setFailed(true);
        setPlaying(false);
      };
      renderer.domElement.addEventListener("webglcontextlost", lost);
      api.current = {
        update(c, e, p, stage, motion) {
          for (const [key, meshes] of Object.entries(model.parts)) {
            for (const m of meshes) {
              const h = m.userData.home;
              m.visible = !(c && m.userData.shell);
              m.position.set(...h);
              if (topic.id === "wind-turbine" && key === "blades") {
                const angle = (motion / 100) * Math.PI * 4;
                m.position.x =
                  h[0] * Math.cos(angle) - (h[1] - 0.9) * Math.sin(angle);
                m.position.y =
                  0.9 + h[0] * Math.sin(angle) + (h[1] - 0.9) * Math.cos(angle);
                m.rotation.z = (m.userData.bladeAngle || 0) + angle;
              }
              if (e)
                m.position.x +=
                  (parts.findIndex((x) => x[0] === key) - parts.length / 2) *
                  0.45;
              m.material.emissive.set(key === p ? 0x295d58 : 0x000000);
              if (
                topic.id === "rocket" &&
                stage >= 2 &&
                ["fuel", "oxidizer", "engine"].includes(key)
              )
                m.position.y -= 1.4;
              if (topic.id === "rocket" && stage >= 3 && key === "fairing")
                m.position.x += 2.2;
              if (topic.id === "rocket" && stage >= 4 && key === "payload")
                m.position.y += 1.2;
            }
          }
          render();
        },
        view(name) {
          camera.position.set(
            ...(name === "front"
              ? [0, 0.3, 10]
              : name === "side"
                ? [10, 0.3, 0]
                : [6, 3, 9]),
          );
          controls.target.set(0, 0, 0);
          controls.update();
          render();
        },
        cleanup() {
          document.removeEventListener("visibilitychange", visibility);
          renderer.domElement.removeEventListener("pointerdown", ondown);
          renderer.domElement.removeEventListener("pointerup", onup);
          renderer.domElement.removeEventListener("webglcontextlost", lost);
        },
      };
      resize();
    } catch {
      setFailed(true);
    }
    return () => {
      dead = true;
      api.current?.cleanup();
      api.current = null;
      observer?.disconnect();
      controls?.dispose();
      model?.dispose();
      renderer?.dispose();
      renderer?.domElement.remove();
    };
  }, [topic.id, variant]);
  useEffect(() => {
    api.current?.update(cut, explode, part, phase, progress);
  }, [cut, explode, part, phase, progress, variant, active]);
  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(
      () =>
        setPhase((p) => {
          if (p >= 4) {
            setPlaying(false);
            return p;
          }
          return p + 1;
        }),
      1600,
    );
    return () => clearInterval(timer);
  }, [playing]);
  const phases = [
    "发射准备",
    "一级工作",
    "一级分离，二级工作",
    "整流罩分离",
    "载荷释放",
  ];
  if (failed && fallback)
    return (
      <div>
        <p className="science-caption" role="status">
          三维暂不可用，已显示二维替代图；可返回原理视图继续操作。
        </p>
        {fallback}
      </div>
    );
  if (failed && ["air-conditioner", "tape-measure"].includes(topic.id))
    return (
      <div>
        <p role="status" className="science-caption">
          三维暂不可用。可返回工作过程视图继续操作，下方保留原理图。
        </p>
        {topic.id === "air-conditioner" ? (
          <HomeDiagram id={topic.id} />
        ) : (
          <MechanismDiagram id={topic.id} />
        )}
      </div>
    );
  if (failed && ["rocket", "volcano"].includes(topic.id))
    return (
      <div>
        <p role="status" className="science-caption">
          三维暂不可用，以下图鉴和正文仍可阅读。
        </p>
        {topic.id === "rocket" ? (
          <RocketAtlas chapter={chapter} />
        ) : (
          <EarthDiagram id="volcano" />
        )}
      </div>
    );
  return (
    <div className="science-spatial">
      <div
        ref={host}
        className="science-canvas"
        role="img"
        aria-label={`${topic.title}，可旋转的结构模型；部件选择与视角按钮在图下。`}
        hidden={failed}
      />
      {failed && (
        <div className="science-fallback">
          <p role="status">三维暂不可用，以下结构图与分步讲解仍可阅读。</p>
          <svg viewBox="0 0 800 400" role="img" aria-label="结构关系备选图">
            {parts.map((p, i) => (
              <g key={p[0]}>
                <rect
                  x={80 + (i % 3) * 240}
                  y={55 + Math.floor(i / 3) * 175}
                  width="190"
                  height="110"
                  rx="6"
                  fill={part === p[0] ? "#bdd6cf" : "#d8e2e6"}
                  stroke="#52747b"
                />
                <text
                  x={175 + (i % 3) * 240}
                  y={115 + Math.floor(i / 3) * 175}
                  textAnchor="middle"
                  fill="#183d36"
                >
                  {p[1]}
                </text>
              </g>
            ))}
          </svg>
        </div>
      )}
      <div className="science-controls">
        <Button
          disabled={failed}
          aria-pressed={cut}
          onClick={() => setCut(!cut)}
        >
          {cut ? "恢复外观" : "查看内部"}
        </Button>
        <Button
          disabled={failed}
          aria-pressed={explode}
          onClick={() => setExplode(!explode)}
        >
          {explode ? "合拢结构" : "拆开结构"}
        </Button>
        {[
          ["front", "正视"],
          ["side", "侧视"],
          ["all", "全景"],
        ].map(([v, t]) => (
          <Button
            key={v}
            disabled={failed}
            onClick={() => api.current?.view(v)}
          >
            {t}
          </Button>
        ))}
      </div>
      <div className="science-parts" role="group" aria-label="选择部件">
        {parts.map(([id, name]) => (
          <Button
            key={id}
            aria-pressed={part === id}
            onClick={() => setPart(id)}
          >
            {name}
          </Button>
        ))}
      </div>
      <p className="science-caption" role="status">
        {parts.find((p) => p[0] === part)?.[2] ||
          "拖动旋转，或使用正视、侧视按钮；点击部件查看它的作用。"}
      </p>
      {topic.id === "rocket" && (
        <div className="science-timeline">
          <p role="status">{phases[phase]}</p>
          <input
            aria-label="发射阶段"
            type="range"
            min="0"
            max="4"
            step="1"
            value={phase}
            onChange={(e) => {
              setPlaying(false);
              setPhase(Number(e.target.value));
            }}
          />
          <div className="science-controls">
            <Button
              onClick={() => {
                if (phase === 4) setPhase(0);
                setPlaying(!playing);
              }}
            >
              {playing ? "暂停" : "播放阶段"}
            </Button>
            <Button
              disabled={phase === 4}
              onClick={() => {
                setPlaying(false);
                setPhase((p) => Math.min(4, p + 1));
              }}
            >
              下一步
            </Button>
            <Button
              onClick={() => {
                setPlaying(false);
                setPhase(0);
              }}
            >
              回到起点
            </Button>
          </div>
          <p className="science-caption">
            阶段示意：准备与一级工作阶段结构相同，分离时才改变部件位置；不模拟飞行轨迹。
          </p>
        </div>
      )}
    </div>
  );
}
