import MicroscopeFieldTriptych from "./MicroscopeFieldTriptych.jsx";
import Button from "./LabButton.jsx";
import { microscopeReference } from "./microscopeReference.mjs";
import React from "react";
import "./MicroscopeFieldScale.css";
export default function MicroscopeFieldScale({
  mag,
  fieldDiameter,
  x = 0,
  y = 0,
  reference = false,
  onReference,
  onChange,
}) {
  const point = microscopeReference({ mag, x, y });
  const ratio = 40 / mag,
    area = ratio * ratio;
  return (
    <details className="microscope-field-scale">
      <summary>换物镜后，还能看到多大范围？</summary>
      <p>同一标本平面的范围比较：虚线外圈为40×，实线内圈为当前倍率。</p>
      <svg
        viewBox="0 0 170 170"
        role="img"
        aria-label={`当前${mag}倍视野直径为40倍的${(ratio * 100).toFixed(0)}%，面积为${(area * 100).toFixed(0)}%`}
      >
        <circle
          cx="85"
          cy="85"
          r="70"
          fill="none"
          stroke="currentColor"
          strokeOpacity=".5"
          strokeDasharray="4 4"
        />
        <circle
          cx="85"
          cy="85"
          r={70 * ratio}
          fill="var(--ui-primary)"
          fillOpacity=".18"
          stroke="var(--ui-primary)"
          strokeWidth="2"
        />
        <path d="M79 85H91M85 79V91" stroke="currentColor" strokeWidth="1.5" />
        {reference && (
          <circle
            data-testid="field-reference-point"
            cx={85 + point.lowX}
            cy={85 + point.lowY}
            r="3"
            fill="var(--ui-gold)"
            stroke="var(--ui-ink)"
          />
        )}
      </svg>
      <div className="microscope-field-scale-readout">
        <strong>
          当前总倍率 {mag}× · 直径 {(fieldDiameter / 1000).toFixed(2)} mm
        </strong>
        <strong>面积保留 {(area * 100).toFixed(0)}%</strong>
        <span>外圈：40× · 直径4.50 mm</span>
      </div>
      <p>
        {mag === 40
          ? "先在低倍下找到目标并移到中央。目标居中后，再换高倍观察细节。"
          : `相对40×，倍率增至${mag / 40}倍，视野直径变为1/${mag / 40}，面积变为1/${(mag / 40) ** 2}。原来靠近视野边缘的目标可能移出可见范围。`}
      </p>
      <div
        className="microscope-magnification-table"
        role="region"
        tabIndex="0"
        aria-label="三种物镜范围对照，可横向滚动"
      >
        <table>
          <caption>同一10×目镜、视场数18 mm · 三种物镜</caption>
          <thead>
            <tr>
              <th scope="col">物镜</th>
              <th scope="col">总倍率</th>
              <th scope="col">视野直径</th>
              <th scope="col">相对40×面积</th>
              <th scope="col">切换观察</th>
            </tr>
          </thead>
          <tbody>
            {[40, 100, 400].map((total) => (
              <tr key={total} aria-current={mag === total ? "true" : undefined}>
                <th scope="row">{total / 10}×</th>
                <td>{total}×</td>
                <td>{(180 / total).toFixed(2)} mm</td>
                <td>{((40 / total) ** 2 * 100).toFixed(0)}%</td>
                <td>
                  <Button
                    disabled={!onChange}
                    aria-pressed={mag === total}
                    onClick={() => onChange("mag", total)}
                  >
                    {mag === total ? `正在观察${total}×` : `观察${total}×`}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        视野直径 = 视场数 ÷ 物镜倍率；总倍率 = 目镜倍率 ×
        物镜倍率。放大倍数提高，并不等于分辨率按相同比例提高。
      </p>
      {onReference && (
        <div className="field-reference-study">
          <Button
            type="button"
            aria-pressed={reference}
            onClick={() => onReference(!reference)}
          >
            {reference ? "隐藏教学参考点" : "显示教学参考点"}
          </Button>
          {reference && (
            <>
              <MicroscopeFieldTriptych {...{ x, y, mag, onChange }} />
              <p role="status">
                {point.visible ? "参考点在当前视野内" : "参考点已离开当前视野"}{" "}
                · 距视野中心为半径的 {(point.edgeFraction * 100).toFixed(0)}%。
              </p>
              <p>
                金色点标记玻片原点，不是细胞结构。它与目镜内的参考标记同步；虚线图用于找回已移出当前视野的点。
              </p>
              <div className="field-reference-actions">
                <Button
                  type="button"
                  disabled={!onChange}
                  onClick={() => {
                    onChange("mag", 40);
                    onChange("x", 32);
                    onChange("y", 24);
                  }}
                >
                  准备低倍偏心参考
                </Button>
                <Button
                  type="button"
                  disabled={!onChange || mag === 400}
                  onClick={() => onChange("mag", 400)}
                >
                  换到400×
                </Button>
                <Button
                  type="button"
                  disabled={!onChange || (x === 0 && y === 0)}
                  onClick={() => {
                    onChange("x", 0);
                    onChange("y", 0);
                  }}
                >
                  把参考点移到中央
                </Button>
              </div>
            </>
          )}
        </div>
      )}
      <small>
        按视场数18
        mm计算的理想范围示意。参考点位置与当前玻片位移联动，但不追踪特定细胞，也不表示分辨率或亮度；光源关闭或失焦时，范围判断不等于已看清目标。实际视野取决于显微镜配置。
      </small>
    </details>
  );
}
