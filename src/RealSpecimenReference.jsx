import React, { useState } from "react";

export default function RealSpecimenReference() {
  const [open, setOpen] = useState(false);

  return (
    <section className="real-specimen-reference" aria-label="真实显微照片参考">
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)}>
        {open ? "收起真实标本参考" : "查看真实标本参考"}
      </button>
      {open && (
        <figure>
          <figcaption>洋葱表皮 · 真实显微照片</figcaption>
          <p>
            观察细胞壁的连续边界、细胞排列与明暗差异。来源说明这张照片未显示细胞核，不应把每个暗点都认作细胞核。
          </p>
          <p>
            这是独立参考照片，不随当前物镜、调焦或照明设置变化；缺少尺度标定，不用于尺寸测量。
          </p>
          <small>
            摄影：SaraKasa ·{" "}
            <a
              href="https://commons.wikimedia.org/wiki/File:Onion_epidermis.jpg"
              target="_blank"
              rel="noreferrer"
            >
              来源与原图
            </a>
            {" · "}
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noreferrer"
            >
              CC BY 4.0
            </a>
            <br />
            照片在来源站点打开，需要联网；本站尚未内置实拍预览。
          </small>
        </figure>
      )}
    </section>
  );
}
