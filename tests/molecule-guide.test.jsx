import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import MoleculeGuide from "../src/MoleculeGuide.jsx";

it("describes only visible aids and distinguishes ensemble motion from molecular dynamics", () => {
  const p = { type: 0, ensemble: 0, annotations: 1, scaffold: 1, lonePairs: 1 };
  const render = (patch) =>
    renderToStaticMarkup(<MoleculeGuide p={{ ...p, ...patch }} />);
  expect(render({})).toContain("金色弧线");
  expect(render({ annotations: 0 })).not.toContain("金色弧线");
  expect(render({ scaffold: 0 })).not.toContain("辅助面只是");
  const ensemble = render({ ensemble: 1 });
  expect(ensemble).not.toContain("金色弧线");
  expect(ensemble).not.toContain("紫色区域");
  expect(ensemble).toContain("不能用来测量温度、密度或扩散速度");
});
