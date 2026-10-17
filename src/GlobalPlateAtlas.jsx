import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { globePoint, boundarySegments } from "./plateGlobeGeometry.mjs";
import { atmosphere } from "./SceneCraft.js";
import { disposeSceneResources } from "./disposeSceneResources.mjs";
import { addAtlasEarthquakes } from "./AtlasEarthquakes.js";
import { pickAtlasEarthquake } from "./pickAtlasEarthquake.js";
import { depthBands, earthquakeDepthBand } from "./earthquakeDepth.mjs";

const regions = [
  {
    title: "太平洋",
    lon: 180,
    lat: 15,
    text: "绕球旋转，对照太平洋两侧的边界走向；橙色只代表数据标识的俯冲边界。",
  },
  {
    title: "亚洲与印度洋",
    lon: 90,
    lat: 20,
    text: "观察亚洲南缘、印度洋和印度尼西亚附近的边界空间关系。",
  },
  {
    title: "大西洋",
    lon: -30,
    lat: 15,
    text: "观察穿过大西洋的边界。青色表示本数据中未标注为俯冲的边界，不能据此判断具体运动类型。",
  },
];

export default function GlobalPlateAtlas({ onClose }) {
  const [catalog, setCatalog] = useState(null),
    [quakeError, setQuakeError] = useState("");
  const [quakes, setQuakes] = useState(false),
    [minimumMag, setMinimumMag] = useState(5.5),
    [selectedEvent, setSelectedEvent] = useState("");
  const filteredEvents =
    catalog?.events.filter((event) => event.magnitude >= minimumMag) || [];
  const event = filteredEvents.find((item) => item.id === selectedEvent);
  const [depthColor, setDepthColor] = useState(false);
  const picking = useRef(null);
  picking.current = { catalog, quakes, minimumMag };
  const dialog = useRef(null),
    host = useRef(null),
    engine = useRef(null);
  const [region, setRegion] = useState(0),
    [grid, setGrid] = useState(false);
  const [boundaries, setBoundaries] = useState(true),
    [status, setStatus] = useState("正在加载板块边界…");
  useEffect(() => {
    const node = dialog.current;
    node.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const abort = new AbortController();
    let disposed = false,
      renderer;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#071019");
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    } catch {
      setStatus("此浏览器暂时无法创建三维视图，请关闭后重试。");
      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 30);
    camera.position.set(...globePoint(180, 15, 5.6));
    scene.add(camera);
    scene.add(new THREE.AmbientLight("#ffffff", 1.7));
    const light = new THREE.DirectionalLight("#fff5df", 2);
    light.position.set(3, 4, 5);
    camera.add(light);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.minDistance = 2.8;
    controls.maxDistance = 14;
    host.current.appendChild(renderer.domElement);
    renderer.domElement.setAttribute("role", "img");
    renderer.domElement.setAttribute("aria-label", "可旋转的全球板块边界地球");
    let frames = 0;
    const render = () => {
      if (disposed) return;
      renderer.render(scene, camera);
      renderer.domElement.dataset.renderCount = String(++frames);
    };
    const texture = new THREE.TextureLoader().load(
      "./textures/earth_atmos_2048.jpg",
      render,
      undefined,
      () => {
        if (!disposed) setStatus("地球纹理加载失败，请关闭后重试。");
      },
    );
    texture.colorSpace = THREE.SRGBColorSpace;
    scene.userData.ownedTexture = texture;
    scene.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(1.8, 96, 64),
        new THREE.MeshStandardMaterial({ map: texture, roughness: 0.95 }),
      ),
    );
    atmosphere(scene, 1.8);
    const gridPoints = [];
    for (let lat = -60; lat <= 60; lat += 30)
      for (let lon = -180; lon < 180; lon += 3)
        gridPoints.push(
          ...globePoint(lon, lat, 1.806),
          ...globePoint(lon + 3, lat, 1.806),
        );
    for (let lon = -180; lon < 180; lon += 30)
      for (let lat = -90; lat < 90; lat += 3)
        gridPoints.push(
          ...globePoint(lon, lat, 1.806),
          ...globePoint(lon, lat + 3, 1.806),
        );
    const gridLines = new THREE.LineSegments(
      new THREE.BufferGeometry().setAttribute(
        "position",
        new THREE.Float32BufferAttribute(gridPoints, 3),
      ),
      new THREE.LineBasicMaterial({
        color: "#96bcc5",
        transparent: true,
        opacity: 0.22,
      }),
    );
    gridLines.visible = false;
    scene.add(gridLines);
    const lines = new THREE.Group();
    scene.add(lines);
    engine.current = {
      camera,
      controls,
      render,
      gridLines,
      lines,
      fitDistance: 5.6,
    };
    controls.addEventListener("change", render);
    let pointer = null;
    const down = (e) => {
      if (!e.isPrimary || e.button !== 0) {
        pointer = null;
        return;
      }
      pointer = { id: e.pointerId, x: e.clientX, y: e.clientY, moved: false };
    };
    const move = (e) => {
      if (
        pointer &&
        Math.hypot(e.clientX - pointer.x, e.clientY - pointer.y) > 5
      )
        pointer.moved = true;
    };
    const cancel = () => {
      pointer = null;
    };
    const up = (e) => {
      const start = pointer;
      pointer = null;
      const state = picking.current;
      if (
        !start ||
        start.id !== e.pointerId ||
        start.moved ||
        !state?.quakes ||
        !state.catalog
      )
        return;
      const rect = renderer.domElement.getBoundingClientRect();
      const selected = pickAtlasEarthquake(
        state.catalog.events,
        state.minimumMag,
        camera,
        rect,
        e.clientX - rect.left,
        e.clientY - rect.top,
      );
      if (selected) setSelectedEvent(selected.id);
    };
    renderer.domElement.addEventListener("pointerdown", down);
    renderer.domElement.addEventListener("pointermove", move);
    renderer.domElement.addEventListener("pointerup", up);
    renderer.domElement.addEventListener("pointercancel", cancel);
    const resize = new ResizeObserver(() => {
      if (disposed) return;
      const { width, height } = host.current.getBoundingClientRect();
      renderer.setSize(width, height);
      camera.aspect = width / Math.max(height, 1);
      const halfAngle = Math.atan(
        Math.tan(THREE.MathUtils.degToRad(21)) * Math.min(1, camera.aspect),
      );
      const fitDistance = Math.max(5.6, 1.95 / Math.sin(halfAngle));
      engine.current.fitDistance = fitDistance;
      camera.position.setLength(fitDistance);
      camera.updateProjectionMatrix();
      render();
    });
    resize.observe(host.current);
    fetch("./data/tectonics/usgs-2025-m55.json", { signal: abort.signal })
      .then((response) => {
        if (!response.ok) throw new Error("catalog");
        return response.json();
      })
      .then((data) => {
        if (disposed) return;
        engine.current.updateQuakes = addAtlasEarthquakes(
          scene,
          data.events,
          renderer.getPixelRatio(),
        );
        engine.current.updateQuakes(false, 5.5, "");
        setCatalog(data);
        render();
      })
      .catch((error) => {
        if (!disposed && error.name !== "AbortError")
          setQuakeError("地震目录加载失败，请关闭后重试。");
      });
    fetch("./data/tectonics/PB2002_boundaries.json", { signal: abort.signal })
      .then((response) => {
        if (!response.ok) throw new Error("data");
        return response.json();
      })
      .then((data) => {
        if (disposed) return;
        const groups = boundarySegments(data);
        for (const [key, points] of Object.entries(groups)) {
          lines.add(
            new THREE.LineSegments(
              new THREE.BufferGeometry().setAttribute(
                "position",
                new THREE.Float32BufferAttribute(points, 3),
              ),
              new THREE.LineBasicMaterial({
                color: key === "subduction" ? "#ffb078" : "#6edbce",
                toneMapped: false,
              }),
            ),
          );
        }
        setStatus(`${data.features.length} 段边界 · PB2002 模型`);
        render();
      })
      .catch((error) => {
        if (!disposed && error.name !== "AbortError")
          setStatus("边界数据加载失败，请关闭后重试。");
      });
    return () => {
      disposed = true;
      node.close();
      abort.abort();
      resize.disconnect();
      renderer.domElement.removeEventListener("pointerdown", down);
      renderer.domElement.removeEventListener("pointermove", move);
      renderer.domElement.removeEventListener("pointerup", up);
      renderer.domElement.removeEventListener("pointercancel", cancel);
      controls.dispose();
      disposeSceneResources(scene);
      renderer.dispose();
      renderer.domElement.remove();
      engine.current = null;
      document.body.style.overflow = previousOverflow;
    };
  }, []);
  useEffect(() => {
    const e = engine.current;
    if (!e?.updateQuakes) return;
    e.updateQuakes(quakes, minimumMag, selectedEvent, depthColor);
    e.render();
  }, [quakes, minimumMag, selectedEvent, catalog, depthColor]);
  function selectEvent(id) {
    setSelectedEvent(id);
    const selected = catalog?.events.find((item) => item.id === id),
      e = engine.current;
    if (!selected || !e) return;
    e.camera.position.set(
      ...globePoint(selected.longitude, selected.latitude, e.fitDistance),
    );
    e.controls.update();
    e.render();
    setRegion(-1);
  }
  function locate(index) {
    setRegion(index);
    const e = engine.current;
    if (!e) return;
    e.camera.position.set(
      ...globePoint(regions[index].lon, regions[index].lat, e.fitDistance),
    );
    e.controls.target.set(0, 0, 0);
    e.controls.update();
    e.render();
  }
  function toggle(which) {
    const e = engine.current;
    if (which === "grid") {
      setGrid(!grid);
      if (e) e.gridLines.visible = !grid;
    } else {
      setBoundaries(!boundaries);
      if (e) e.lines.visible = !boundaries;
    }
    e?.render();
  }
  return (
    <dialog
      ref={dialog}
      className="plate-atlas"
      aria-labelledby="atlas-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <header>
        <div>
          <small>GLOBAL CONTEXT · 全球视角</small>
          <h2 id="atlas-title">世界板块边界</h2>
        </div>
        <button autoFocus onClick={onClose}>
          返回实验 ×
        </button>
      </header>
      <div className="plate-atlas-body">
        <div className="plate-atlas-stage">
          <div ref={host} className="plate-atlas-canvas" />
          <div className="plate-atlas-hint" aria-live="polite">
            {quakes && event
              ? `M ${event.magnitude} · ${event.place} · 深度 ${event.depthKm} km`
              : "拖动旋转 · 滚轮缩放 · 北极朝上"}
            {quakes && <div>点击地震点查看记录；拖动旋转不会选择点位。</div>}
          </div>
        </div>
        <aside>
          <h3>从局部过程看全球联系</h3>
          <p>选择一个区域，再旋转地球观察边界在海洋和大陆中的延伸。</p>
          <div className="atlas-regions" role="group" aria-label="全球区域定位">
            {regions.map((item, i) => (
              <button
                key={item.title}
                aria-pressed={region === i}
                onClick={() => locate(i)}
              >
                {item.title}
              </button>
            ))}
          </div>
          <p>
            {region >= 0
              ? regions[region].text
              : "已定位所选事件；亮色圆环标记其震中位置。"}
          </p>
          <div className="atlas-legend">
            <span>
              <i style={{ background: "#ffb078" }} />
              俯冲边界
            </span>
            <span>
              <i style={{ background: "#6edbce" }} />
              其余边界（未细分）
            </span>
          </div>
          <div className="atlas-regions" role="group" aria-label="全球图层">
            <button
              aria-pressed={boundaries}
              onClick={() => toggle("boundaries")}
            >
              板块边界
            </button>
            <button aria-pressed={grid} onClick={() => toggle("grid")}>
              经纬网
            </button>
          </div>
          <p role="status">{status}</p>
          <section
            className="atlas-earthquake-controls"
            aria-label="历史地震目录"
          >
            <h3>地震分布 · 2025</h3>
            <button
              aria-pressed={quakes}
              disabled={!catalog}
              onClick={() => setQuakes(!quakes)}
            >
              显示地震记录
            </button>
            <p>
              USGS · 2025 年 UTC · M≥5.5
              <br />
              {catalog
                ? `${filteredEvents.length} / ${catalog.count} 条记录`
                : quakeError || "正在加载地震目录…"}
            </p>
            {quakes && catalog && (
              <>
                <button
                  aria-pressed={depthColor}
                  onClick={() => setDepthColor(!depthColor)}
                >
                  按震源深度着色
                </button>
                {depthColor && (
                  <div className="atlas-depth-legend" aria-label="震源深度图例">
                    {depthBands.map((band, i) => (
                      <div key={band.label}>
                        <i style={{ background: band.color }} />
                        <span>{band.label}</span>
                        <b>
                          {
                            filteredEvents.filter(
                              (item) => earthquakeDepthBand(item.depthKm) === i,
                            ).length
                          }{" "}
                          条
                        </b>
                      </div>
                    ))}
                    <p>
                      颜色表示震源深度，点仍标在地表震中。对照俯冲边界，观察中、深源记录的位置；本图不展示地下板片形状。
                    </p>
                    <a
                      href="https://www.usgs.gov/programs/earthquake-hazards/determining-depth-earthquake"
                      target="_blank"
                      rel="noreferrer"
                    >
                      深度分类依据：USGS ↗
                    </a>
                  </div>
                )}
                <label>
                  震级筛选
                  <select
                    aria-label="地震震级筛选"
                    value={minimumMag}
                    onChange={(e) => {
                      setMinimumMag(Number(e.target.value));
                      setSelectedEvent("");
                    }}
                  >
                    {[5.5, 6, 7].map((mag) => (
                      <option key={mag} value={mag}>
                        M ≥ {mag}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  选择记录并定位
                  <select
                    aria-label="选择地震记录"
                    value={selectedEvent}
                    onChange={(e) => selectEvent(e.target.value)}
                  >
                    <option value="">选择一条地震记录</option>
                    {filteredEvents.map((item) => (
                      <option key={item.id} value={item.id}>
                        {new Date(item.time).toISOString().slice(0, 10)} · M
                        {item.magnitude} · {item.place}
                      </option>
                    ))}
                  </select>
                </label>
                {event && (
                  <div className="atlas-event-detail">
                    <strong>
                      M {event.magnitude} · {event.magnitudeType}
                    </strong>
                    <p>
                      {event.place}
                      <br />
                      {new Date(event.time).toISOString().replace("T", " ")}
                      <br />
                      震源深度 {event.depthKm} km
                    </p>
                    <a href={event.url} target="_blank" rel="noreferrer">
                      USGS 原始记录 ↗
                    </a>
                  </div>
                )}
                <small>
                  地震点表示震中，点的显示大小不代表震级或影响范围。仅包含此时间段和震级门槛内的记录。
                </small>
              </>
            )}
          </section>
          <p className="atlas-note">
            这是板块边界模型，不是实时地震或火山目录；不用于灾害预测。PB2002
            的详细板块划分与课本概括的六大板块并不等同。
          </p>
          <footer>
            数据：Peter Bird；Hugo Ahlenius / Nordpil 转换。
            <a
              href="https://earthquake.usgs.gov/fdsnws/event/1/"
              target="_blank"
              rel="noreferrer"
            >
              地震目录：USGS FDSN ↗
            </a>
            <a
              href="https://github.com/fraxen/tectonicplates"
              target="_blank"
              rel="noreferrer"
            >
              来源与说明 ↗
            </a>
            <a
              href="./data/tectonics/LICENSE.md"
              target="_blank"
              rel="noreferrer"
            >
              ODC Attribution 许可 ↗
            </a>
          </footer>
        </aside>
      </div>
    </dialog>
  );
}
