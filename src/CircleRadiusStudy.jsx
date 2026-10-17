import React, { useEffect, useRef, useState } from "react";
import RadiusScaleStudy from "./RadiusScaleStudy.jsx";
import Button from "./LabButton.jsx";

export default function CircleRadiusStudy({ p, onRadius }) {
  const [running, setRunning] = useState(false);
  const callback = useRef(onRadius),
    expected = useRef(p.radius);
  callback.current = onRadius;
  useEffect(() => {
    if (p.radius !== expected.current) setRunning(false);
  }, [p.radius]);
  useEffect(() => {
    if (!running) return;
    let radius = 2;
    const handle = setInterval(() => {
      if (document.hidden) return;
      radius = Math.min(4, radius + 0.5);
      expected.current = radius;
      callback.current(radius);
      if (radius === 4) setRunning(false);
    }, 700);
    return () => clearInterval(handle);
  }, [running]);
  return (
    <div>
      <div className="radius-scale-actions">
        <Button
          disabled={running}
          onClick={() => {
            expected.current = 2;
            onRadius(2);
            setRunning(true);
          }}
        >
          演示 2 → 4 cm 半径缩放
        </Button>
        <Button disabled={!running} onClick={() => setRunning(false)}>
          暂停半径缩放
        </Button>
      </div>
      <RadiusScaleStudy
        p={{ r: p.radius }}
        maxRadius={4}
        instruction="播放上方分步缩放，或调节右侧半径；手动操作会暂停。"
        onChange={(_, value) => {
          setRunning(false);
          onRadius(value);
        }}
      />
    </div>
  );
}
