import React from "react";
import Button from "./LabButton.jsx";
import { expansionState } from "./expansionLessons.mjs";
import "./ColorMixStudy.css";
const combinations = [
  ["红 + 绿 → 黄", [100, 100, 0]],
  ["绿 + 蓝 → 青", [0, 100, 100]],
  ["红 + 蓝 → 品红", [100, 0, 100]],
  ["三光等强 → 白", [100, 100, 100]],
  ["三光各 25% → 灰", [25, 25, 25]],
  ["关闭全部光源", [0, 0, 0]],
];
export default function ColorMixStudy({ p, onChange }) {
  const values = [p.red, p.green, p.blue],
    { rgb } = expansionState("additive-light", p);
  const equal = p.red === p.green && p.green === p.blue;
  const description = equal
    ? p.red === 0
      ? "无入射光"
      : p.red === 100
        ? "中性白"
        : "中性灰"
    : "有色光：三个通道不等强";
  return (
    <section className="color-mix-study" aria-label="三原色混合对照">
      <h2>先选组合，再改变一个通道</h2>
      <p>
        点击组合会暂停并将光斑移到重叠位置。下方色块表示各束光与三束完全重叠时的结果；不是颜料调色。
      </p>
      <div className="color-mix-presets">
        {combinations.map(([name, v]) => {
          const selected = v.every((n, i) => n === values[i]);
          return (
            <Button
              key={name}
              primary={selected}
              aria-pressed={selected}
              onClick={() => onChange({ red: v[0], green: v[1], blue: v[2] })}
            >
              {name}
            </Button>
          );
        })}
      </div>
      <div className="color-mix-swatches">
        {[0, 1, 2, 3].map((i) => {
          const color = i === 3 ? rgb : rgb.map((n, j) => (j === i ? n : 0));
          return (
            <figure key={i}>
              <div
                className="color-mix-swatch"
                role="img"
                aria-label={
                  i === 3
                    ? `完全重叠结果：${description}`
                    : `${["红", "绿", "蓝"][i]}光 ${values[i]}%`
                }
                style={{ backgroundColor: `rgb(${color.join(",")})` }}
              />
              <figcaption>
                <strong>{["红光 R", "绿光 G", "蓝光 B", "完全重叠"][i]}</strong>
                <span>{i === 3 ? description : `线性强度 ${values[i]}%`}</span>
              </figcaption>
            </figure>
          );
        })}
      </div>
      <p className="color-mix-explanation">
        三个通道同时从 100% 降至 25%，仍然中性，但更暗。屏幕经过颜色编码，所以
        25% 光强不等于 RGB 数值的 25%；这里显示的编码值为 ({rgb.join(", ")})。
      </p>
    </section>
  );
}
