import React, { useState, useEffect, lazy, Suspense, useId } from "react";
import Button from "../LabButton.jsx";
import RocketAtlas from "./RocketAtlas.jsx";
import WeatherScene from "./WeatherScene.jsx";
import EarthScene, { EarthDiagram } from "./EarthScene.jsx";
import ScenePlayer from "./ScenePlayer.jsx";
import MechanismScene from "./MechanismScene.jsx";
import SpaceScene from "./SpaceScene.jsx";
import HomeScene from "./HomeScene.jsx";
import MaterialsScene from "./MaterialsScene.jsx";
import SignalsScene from "./SignalsScene.jsx";
import TransportScene from "./TransportScene.jsx";
import KitchenScene from "./KitchenScene.jsx";
import BodyScene from "./BodyScene.jsx";
import AnimalScene from "./AnimalScene.jsx";
import PlantScene from "./PlantScene.jsx";
import AirConditionerAtlas from "./AirConditionerAtlas.jsx";
import StructureAtlas from "./StructureAtlas.jsx";
import { structureAtlases } from "./structureAtlases.mjs";
import VisualStory from "./VisualStory.jsx";
import { storyboards } from "./storyboards.mjs";
import { supplementalVisuals } from "./supplementalVisuals.mjs";
import { LaboratoryBoundary } from "../LaboratoryLoader.jsx";
import { flowerAssets } from "./assets.mjs";
const Spatial = lazy(() => import("./ScienceSpatial.jsx"));
function AirConditionerScene({ topic, scene, chapter }) {
  const [view, setView] = useState("atlas"),
    [loaded, setLoaded] = useState(false);
  return (
    <div>
      <div className="science-controls" role="group" aria-label="空调观察方式">
        {[
          ["atlas", "写实图鉴"],
          ["cycle", "制冷循环"],
          ["structure", "三维结构"],
        ].map(([id, title]) => (
          <Button
            key={id}
            aria-pressed={view === id}
            onClick={() => {
              setView(id);
              if (id === "structure") setLoaded(true);
            }}
          >
            {title}
          </Button>
        ))}
      </div>
      <div hidden={view !== "atlas"}>
        <AirConditionerAtlas />
      </div>
      <div hidden={view !== "cycle"}>
        <HomeScene
          topic={topic}
          scene={scene}
          chapter={chapter}
          active={view === "cycle"}
        />
      </div>
      {loaded && (
        <div hidden={view !== "structure"}>
          <LaboratoryBoundary
            fallback={
              <HomeScene topic={topic} scene={scene} chapter={chapter} />
            }
          >
            <Suspense
              fallback={
                <p className="science-caption" role="status">
                  正在准备空调结构…
                </p>
              }
            >
              <Spatial
                topic={topic}
                chapter={chapter}
                active={view === "structure"}
              />
            </Suspense>
          </LaboratoryBoundary>
        </div>
      )}
    </div>
  );
}
function MechanismWithSpatial({ topic, scene, chapter }) {
  const [show, setShow] = useState(false);
  const [loaded, setLoaded] = useState(false);
  return (
    <div>
      <div className="science-controls">
        <Button aria-pressed={!show} onClick={() => setShow(false)}>
          观察工作过程
        </Button>
        <Button
          aria-pressed={show}
          onClick={() => {
            setLoaded(true);
            setShow(true);
          }}
        >
          查看三维结构
        </Button>
      </div>
      <div hidden={show}>
        <MechanismScene
          topic={topic}
          scene={scene}
          chapter={chapter}
          active={!show}
        />
      </div>
      {loaded && (
        <div hidden={!show}>
          <LaboratoryBoundary
            fallback={
              <MechanismScene topic={topic} scene={scene} chapter={chapter} />
            }
          >
            <Suspense
              fallback={
                <p className="science-caption" role="status">
                  正在准备结构模型…
                </p>
              }
            >
              <Spatial topic={topic} chapter={chapter} active={show} />
            </Suspense>
          </LaboratoryBoundary>
        </div>
      )}
    </div>
  );
}
export function OpticalDiagram({
  id,
  value = 65,
  reflection = true,
  particles = false,
  atmosphere = true,
  direction = "sky",
}) {
  const uid = useId().replaceAll(":", "");
  const sea = id === "sea-blue";
  const low = value < 30;
  const sx = 100 + Math.cos((value * Math.PI) / 180) * 400,
    sy = 315 - Math.sin((value * Math.PI) / 180) * 260;
  const water = `rgb(${Math.round(70 - value * 0.55)},${Math.round(170 - value * 0.5)},${Math.round(205 - value * 0.2)})`;
  return (
    <svg
      viewBox="0 0 800 450"
      role="img"
      aria-label={
        sea
          ? "水体光程、吸收与表面反射分层示意"
          : `太阳高度 ${value} 度的天空与散射光路示意`
      }
    >
      <defs>
        <linearGradient id={`${uid}sky`} x2="0" y2="1">
          <stop
            stopColor={atmosphere ? (low ? "#537a96" : "#3279b5") : "#071625"}
          />
          <stop
            offset="1"
            stopColor={atmosphere ? (low ? "#efc29b" : "#c1e5ee") : "#152130"}
          />
        </linearGradient>
        <linearGradient id={`${uid}water`} x2="0" y2="1">
          <stop stopColor={particles ? "#8b9d85" : water} />
          <stop offset="1" stopColor={particles ? "#4b6c65" : "#153b70"} />
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill={`url(#${uid}sky)`} />
      {sea ? (
        <>
          <path
            d="M0 170 Q80 154 160 170 T320 170 T480 170 T640 170 T800 170 V450 H0Z"
            fill={`url(#${uid}water)`}
          />
          <circle cx="120" cy="70" r="28" fill="#fff0ac" />
          <path
            d={`M120 100 L260 174 L${300 + value * 2.4} 365`}
            stroke="#ffedb0"
            strokeWidth="4"
            fill="none"
          />
          {["#f28769", "#e7d979", "#8ac9fc"].map((color, i) => (
            <g key={color}>
              <path
                d={`M${260 + i * 15} 180 l${(i === 0 ? 1 - value / 110 : 1) * 180} 155`}
                stroke={color}
                strokeWidth="6"
                opacity={i === 0 ? 1 - value / 110 : 0.9}
              />
              <text x={385} y={240 + i * 30} fill="white">
                {["红光衰减较强", "不同波长衰减不同", "蓝光相对传播更远"][i]}
              </text>
            </g>
          ))}
          {reflection && (
            <path
              d="M100 70 L275 172 L660 85"
              fill="none"
              stroke="#e0f2ff"
              strokeWidth="3"
              strokeDasharray="8 8"
            />
          )}
          {reflection && (
            <text x="480" y="115" fill="white">
              海面反射 → 视线
            </text>
          )}
          {particles &&
            Array.from({ length: 25 }, (_, i) => (
              <circle
                key={i}
                cx={30 + ((i * 101) % 740)}
                cy={190 + ((i * 47) % 230)}
                r="3"
                fill="#d1ba77"
                opacity=".8"
              />
            ))}
          <text x="30" y="405" fill="white">
            水中光程：{value < 35 ? "短" : value < 70 ? "中" : "长"}（定性示意）
          </text>
        </>
      ) : (
        <>
          <path d="M0 366 Q160 320 320 365 T800 350 V450 H0Z" fill="#536f63" />
          <circle cx={sx} cy={sy} r="27" fill={low ? "#ffcf84" : "#fff4c2"} />
          <path
            d={`M${sx} ${sy + 28} L450 250 L650 355`}
            fill="none"
            stroke={low ? "#ec9666" : "#fff0b9"}
            strokeWidth="4"
          />
          {atmosphere &&
            [0, 1, 2, 3, 4].map((n) => (
              <g key={n}>
                <circle
                  cx={250 + n * 90}
                  cy={160 + (n % 2) * 40}
                  r="6"
                  fill="#fff"
                  opacity=".5"
                />
                <path
                  d={`M${sx} ${sy} L${250 + n * 90} ${160 + (n % 2) * 40} L650 355`}
                  stroke="#75bfff"
                  strokeWidth={direction === "sky" ? 3 : 1}
                  fill="none"
                  opacity={direction === "sky" ? 0.8 : 0.25}
                />
              </g>
            ))}
          <circle cx="650" cy="355" r="8" fill="#fff" />
          <text x="675" y="350" fill="white">
            观察者
          </text>
          <text x="35" y="405" fill="white">
            {atmosphere
              ? "空气分子将一部分光散射到视线中"
              : "缺少大气散射，天空背景很暗"}
          </text>
          <text x="35" y="40" fill="white">
            {direction === "sky" ? "观察侧方天空" : "比较太阳方向的直射光"}
          </text>
        </>
      )}
    </svg>
  );
}
function FlowerScene() {
  const [feature, setFeature] = useState(0),
    [zoom, setZoom] = useState(1),
    [pair, setPair] = useState("all");
  return (
    <div className="science-flower">
      <div className="science-flower-grid" data-pair={pair}>
        {flowerAssets.map((a, index) => (
          <figure
            key={a.id}
            className={
              pair !== "all" && !pair.includes(String(index))
                ? "is-excluded"
                : ""
            }
          >
            <div className="science-photo-window">
              <img
                src={`${import.meta.env.BASE_URL}${a.file}`}
                alt={a.alt}
                width={a.width}
                height={a.height}
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: `${a.focus[feature][0]}% ${a.focus[feature][1]}%`,
                }}
                onError={(e) => {
                  e.currentTarget.hidden = true;
                  e.currentTarget.parentElement.dataset.failed =
                    "照片未能加载，请查看下方来源原图。";
                }}
              />
            </div>
            <figcaption>
              <strong>{a.name}</strong>
              <i>{a.species}</i>
              <p>{a.feature[feature]}</p>
              <a href={a.source} target="_blank" rel="noreferrer">
                完整原图 ↗
              </a>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="science-controls">
        <div role="group" aria-label="观察部位">
          {["看花梗", "看花序", "看花瓣与花药"].map((x, i) => (
            <Button
              key={x}
              aria-pressed={feature === i}
              onClick={() => {
                setFeature(i);
                setZoom(1.5);
              }}
            >
              {x}
            </Button>
          ))}
        </div>
        <label>
          同步放大
          <input
            type="range"
            min="1"
            max="2"
            step=".1"
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
          />
        </label>
        <label>
          对照样本
          <select value={pair} onChange={(e) => setPair(e.target.value)}>
            <option value="all">三组样本</option>
            <option value="01">桃与樱</option>
            <option value="12">樱与梨</option>
            <option value="02">桃与梨</option>
          </select>
        </label>
      </div>
      <p className="science-caption">
        实拍样本 ·
        照片保持原文件，放大仅改变视图。看不到的特征应记为“线索不足”。
      </p>
    </div>
  );
}
export default function ScienceScene(props) {
  const [mode, setMode] = useState(
    props.topic.id === "solar-system"
      ? "process"
      : props.topic.id === "germination"
        ? "supplement"
        : "atlas",
  );
  const story = storyboards[props.topic.id];
  const supplement = supplementalVisuals[props.topic.id];
  const task =
    {
      "sky-blue":
        "降低太阳高度，再切换直射光与侧方散射光，比较光路和颜色；最后比较有无大气。",
      brakes:
        "先看摩擦片贴住盘的两个平面，再观察盘面转动与发热提示，区分接触前后。",
      bicycle: "固定前盘，分别推进一圈脚踏；比较16齿和32齿后齿轮的后轮转数。",
      elevator: "同时跟踪轿厢、对重与曳引轮，比较两侧行程和方向。",
      ship: "逐格增加载荷，比较水线与船舷，注意每一格都是一个静态平衡位置。",
      vacuum: "先逐段追踪空气穿过袋材与滤层，再比较积尘时整条气路的变化。",
      "air-filter":
        "依次观察惯性碰撞、拦截、扩散：比较颗粒路径与空气流线的差别。",
      thermos: "分别查看气体、辐射和杯口传热；切换条件后比较同一种机制。",
      hairdryer: "逐段追踪气流，比较主动加热开关前后：送风是否还在？",
      umbrella:
        "从合拢推到撑开，观察滑套上移和撑杆转动；再往回拖，确认杆长没有改变。",
      ballpoint:
        "播放后盯住球珠上的白点，并对照纸面墨迹增长；白点不是实际零件。",
      washer: "先看低速翻落，再切换脱水；比较衣物位置与水离开内筒后的去向。",
      "hook-loop": "先按合钩环，再切换边缘剥离，观察脱开前沿如何逐排移动。",
      faucet:
        "推进开度，观察活动片水道与固定片口何时相通；这是简化的单路连通示意，不是流量刻度。",
      sunset: "把太阳从高处移到低处，比较直射光的大气路径和颜色。",
      "sea-blue":
        "增加水中光程，再分别切换表面反射和悬浮颗粒，分清三种因素的作用。",
      "solar-system":
        "分别切换直径比例和距离比例，对照地球与木星、地球与海王星；两种比例不能混读。",
      hiccups:
        "慢慢推进到中间阶段，观察膈肌先收缩、声门随后关闭；再看本次动作结束后的状态。",
      "stainless-steel":
        "推进到中间阶段观察划伤，再继续观察保护膜；切换环境后重复，比较能否重新钝化。",
    }[props.topic.id] ||
    (props.scene?.control
      ? `操作下方“${props.scene.control}”，对照画面与结果说明，找出变化发生在哪里，再恢复初始状态比较。`
      : "改变下方的观察条件，对照画面和结果说明，再恢复初始状态比较。");
  if (!structureAtlases[props.topic.id] && !story)
    return <CoreScienceScene {...props} />;
  return (
    <div className="science-observation" data-topic={props.topic.id}>
      <div className="science-controls" role="group" aria-label="主题观察方式">
        <Button
          aria-pressed={mode === "atlas"}
          onClick={() => setMode("atlas")}
        >
          {story ? "分步观察图鉴" : "写实结构图鉴"}
        </Button>
        {supplement && (
          <Button
            aria-pressed={mode === "supplement"}
            onClick={() => setMode("supplement")}
          >
            {supplement.label}
          </Button>
        )}
        <Button
          aria-pressed={mode === "process"}
          onClick={() => setMode("process")}
        >
          {props.topic.spatial ? "原理互动与三维" : "原理互动"}
        </Button>
      </div>
      {mode === "process" && (
        <p className="science-observation-goal">
          <strong>这次重点观察：</strong>
          {task}
        </p>
      )}
      {mode === "supplement" && supplement ? (
        <div className="science-supplement" data-topic={props.topic.id}>
          <p className="science-caption">{supplement.reason}</p>
          {supplement.type === "structure" ? (
            <StructureAtlas
              key={`${props.topic.id}:supplement`}
              id={props.topic.id}
              entry={supplement.entry}
            />
          ) : (
            <VisualStory
              key={`${props.topic.id}:supplement`}
              id={props.topic.id}
              entry={supplement.entry}
            />
          )}
        </div>
      ) : mode === "atlas" ? (
        story ? (
          <VisualStory key={props.topic.id} id={props.topic.id} />
        ) : (
          <StructureAtlas key={props.topic.id} id={props.topic.id} />
        )
      ) : (
        <CoreScienceScene {...props} />
      )}
      {mode !== "process" && (
        <div className="science-observation-task">
          <strong>看过图，再验证一次</strong>
          <p>{task}</p>
          <Button onClick={() => setMode("process")}>进入原理互动验证</Button>
        </div>
      )}
    </div>
  );
}
function CoreScienceScene({ topic, chapter, scene }) {
  const [view, setView] = useState("atlas");
  const [spatialLoaded, setSpatialLoaded] = useState(false);
  const [value, setValue] = useState(65),
    [reflection, setReflection] = useState(true),
    [particles, setParticles] = useState(false),
    [atmosphere, setAtmosphere] = useState(true),
    [direction, setDirection] = useState("sky");
  useEffect(() => {
    if (topic.id === "sky-blue" || topic.id === "sunset")
      setValue(chapter === "sunset" || topic.id === "sunset" ? 15 : 65);
  }, [chapter, topic.id]);
  if (topic.id === "spring-flowers") return <FlowerScene />;
  if (topic.category === "body")
    return <BodyScene topic={topic} scene={scene} chapter={chapter} />;
  if (topic.category === "plants" && topic.id !== "spring-flowers")
    return <PlantScene topic={topic} scene={scene} chapter={chapter} />;
  if (topic.category === "animals")
    return <AnimalScene topic={topic} scene={scene} chapter={chapter} />;
  if (topic.category === "kitchen")
    return <KitchenScene topic={topic} scene={scene} chapter={chapter} />;
  if (topic.category === "transport")
    return <TransportScene topic={topic} scene={scene} chapter={chapter} />;
  if (topic.category === "signals")
    return <SignalsScene topic={topic} scene={scene} chapter={chapter} />;
  if (topic.id === "air-conditioner")
    return (
      <AirConditionerScene topic={topic} scene={scene} chapter={chapter} />
    );
  if (topic.category === "home")
    return <HomeScene topic={topic} scene={scene} chapter={chapter} />;
  if (topic.category === "space" && topic.id !== "rocket")
    return <SpaceScene topic={topic} scene={scene} chapter={chapter} />;
  if (topic.category === "objects")
    return topic.spatial ? (
      <MechanismWithSpatial topic={topic} scene={scene} chapter={chapter} />
    ) : (
      <MechanismScene topic={topic} scene={scene} chapter={chapter} />
    );
  if (
    topic.category === "weather" &&
    !["sky-blue", "sunset"].includes(topic.id)
  )
    return <WeatherScene topic={topic} />;
  if (topic.id === "rocket")
    return (
      <div>
        <div
          className="science-controls"
          role="group"
          aria-label="火箭观察方式"
        >
          <Button
            aria-pressed={view === "atlas"}
            onClick={() => setView("atlas")}
          >
            写实图鉴
          </Button>
          <Button
            aria-pressed={view === "structure"}
            onClick={() => {
              setSpatialLoaded(true);
              setView("structure");
            }}
          >
            三维结构与分离
          </Button>
        </div>
        <div hidden={view !== "atlas"}>
          <RocketAtlas chapter={chapter} />
        </div>
        {spatialLoaded && (
          <div hidden={view !== "structure"}>
            <LaboratoryBoundary
              fallback={
                <>
                  <p role="status" className="science-caption">
                    三维未能加载，可继续使用图鉴和正文。
                  </p>
                  <RocketAtlas />
                </>
              }
            >
              <Suspense
                fallback={
                  <div className="science-stage-loading" role="status">
                    正在准备结构模型…
                  </div>
                }
              >
                <Spatial
                  topic={topic}
                  chapter={chapter}
                  active={view === "structure"}
                />
              </Suspense>
            </LaboratoryBoundary>
          </div>
        )}
      </div>
    );
  if (topic.category === "materials")
    return <MaterialsScene topic={topic} scene={scene} chapter={chapter} />;
  if (topic.id === "volcano")
    return (
      <ScenePlayer
        topic={topic}
        chapter={chapter}
        scene={scene}
        Diagram={EarthDiagram}
        motion
      />
    );
  if (topic.category === "earth" && topic.id !== "sea-blue")
    return <EarthScene topic={topic} scene={scene} />;
  const sea = topic.id === "sea-blue";
  return (
    <div>
      <OpticalDiagram
        id={topic.id}
        value={value}
        reflection={reflection}
        particles={particles}
        atmosphere={atmosphere}
        direction={direction}
      />
      <div className="science-controls">
        <label>
          {sea ? "光在水中的相对路程" : "太阳高度"}{" "}
          <output>{sea ? `${value} / 100` : `${value}°`}</output>
          <input
            type="range"
            min={sea ? 5 : 5}
            max={sea ? 100 : 85}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
          />
        </label>
        {sea ? (
          <>
            <Button
              aria-pressed={reflection}
              onClick={() => setReflection(!reflection)}
            >
              {reflection ? "隐藏" : "显示"}表面反射
            </Button>
            <Button
              aria-pressed={particles}
              onClick={() => setParticles(!particles)}
            >
              {particles ? "恢复清水" : "加入悬浮颗粒"}
            </Button>
          </>
        ) : (
          <>
            <Button
              aria-pressed={atmosphere}
              onClick={() => setAtmosphere(!atmosphere)}
            >
              {atmosphere ? "比较无大气" : "恢复大气"}
            </Button>
            <Button
              onClick={() => setDirection(direction === "sky" ? "sun" : "sky")}
            >
              {direction === "sky" ? "看直射光路径" : "看侧方散射光"}
            </Button>
          </>
        )}
        <Button
          onClick={() => {
            setValue(topic.id === "sunset" ? 15 : 65);
            setReflection(true);
            setParticles(false);
            setAtmosphere(true);
            setDirection("sky");
          }}
        >
          恢复初始状态
        </Button>
      </div>
      <p className="science-caption" role="status">
        {sea
          ? particles
            ? "颗粒会改变光的散射与吸收；颜色不直接代表水质。"
            : `光程${value < 35 ? "较短，差异不明显" : "增大，选择性吸收积累得更明显"}。${reflection ? "虚线另示表面反射。" : "当前隐藏表面反射。"}`
          : atmosphere
            ? value < 30
              ? "低太阳高度：直射光经过更长的大气路径，剩余光偏暖。"
              : "较高太阳高度：空气散射的短波光进入侧方视线。"
            : "没有空气散射，远离太阳的天空不呈现同样的蓝色。"}
      </p>
    </div>
  );
}
