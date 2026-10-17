import React, { useState } from "react";
import Button from "./LabButton.jsx";
import { expansionState } from "./expansionLessons.mjs";
import "./CylinderAreaStudy.css";
export default function CylinderAreaStudy({ p, onChange, onPause }) {
  const [reference, setReference] = useState({ radius: 1, height: 2 });
  const a = expansionState("cylinder-net", reference),
    b = expansionState("cylinder-net", p),
    max = Math.max(a.total, b.total);
  return (
    <section className="cylinder-area-study" aria-label="圆柱尺寸与面积对照">
      <h3>固定一个圆柱，再比较面积</h3>
      <p>
        参照尺寸：r = {reference.radius} cm，h = {reference.height}{" "}
        cm。绿色代表侧面，金色代表两个底面；两条面积条使用同一比例尺。
      </p>
      <div className="motion-shortcuts">
        <Button
          onClick={() => {
            setReference({ ...p });
            onPause();
          }}
        >
          固定当前尺寸作参照
        </Button>
        <Button onClick={() => onChange({ ...reference })}>恢复参照尺寸</Button>
        <Button
          disabled={reference.radius * 2 > 3}
          onClick={() =>
            onChange({ ...reference, radius: reference.radius * 2 })
          }
        >
          参照半径 × 2
        </Button>
        <Button
          disabled={reference.height * 2 > 6}
          onClick={() =>
            onChange({ ...reference, height: reference.height * 2 })
          }
        >
          参照高度 × 2
        </Button>
      </div>
      <p>超出当前尺寸范围的加倍按钮不可用；可先调小尺寸再固定参照。</p>
      {[
        ["参照", a],
        ["当前", b],
      ].map(([name, q]) => (
        <div className="cylinder-area-row" key={name}>
          <strong>
            {name} · 总面积 {q.total.toFixed(2)} cm²
          </strong>
          <div className="cylinder-area-bar" aria-hidden="true">
            <i style={{ width: `${(q.side / max) * 100}%` }} />
            <b style={{ width: `${((2 * q.base) / max) * 100}%` }} />
          </div>
          <span>
            侧面 {q.side.toFixed(2)} cm² + 两底面 {(2 * q.base).toFixed(2)} cm²
          </span>
        </div>
      ))}
      <p>
        <strong>当前 / 参照：</strong>侧面积 {(b.side / a.side).toFixed(2)}{" "}
        倍；底面积 {(b.base / a.base).toFixed(2)} 倍；总面积{" "}
        {(b.total / a.total).toFixed(2)} 倍。
      </p>
      <p>
        高度加倍只改变侧面；半径加倍使侧面变为两倍、底面变为四倍。这里对照完整圆柱，无盖模型需减去一个底面。
      </p>
    </section>
  );
}
