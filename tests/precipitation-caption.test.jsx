import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { AdvancedOverlay } from "../src/AdvancedOverlay.jsx";
it("scene caption follows dosing and never claims precipitate without reactants", () => {
  const caption = (t, copper = 50, base = 75) =>
    renderToStaticMarkup(
      <AdvancedOverlay id="precipitation" p={{ copper, base }} t={t} />,
    );
  expect(caption(0)).toContain("滴加前");
  expect(caption(0.4)).toContain("尚无可见沉淀");
  expect(caption(4)).toContain("絮团生成");
  expect(caption(20)).toContain("静置观察");
  expect(caption(20, 50, 0)).toContain("未准备 NaOH");
  expect(caption(20, 0, 75)).toContain("无 Cu(OH)₂ 沉淀生成");
});
