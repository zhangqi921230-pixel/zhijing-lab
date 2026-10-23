import { expect, it } from "vitest";
import * as T from "three";
import { createVacuoleDetail, vacuoleRadii } from "../src/Vacuole.js";
import { buildCell } from "../src/CellModel.js";

it("virtual section closes at the ellipsoid equator, with the sap inside the membrane rim", () => {
  const group = createVacuoleDetail();
  group.updateMatrixWorld(true);
  const shell = group.getObjectByName("vacuole-tonoplast"),
    plane = group.getObjectByName("vacuole-sap-section"),
    rim = group.getObjectByName("vacuole-cut-rim");
  const bounds = new T.Box3().setFromObject(shell);
  expect(bounds.max.y).toBeCloseTo(group.position.y, 6);
  expect(bounds.min.y).toBeCloseTo(group.position.y - vacuoleRadii[1], 6);
  const surface = new T.Box3().setFromObject(plane);
  expect(surface.max.y).toBeCloseTo(surface.min.y, 6);
  expect(plane.scale.x).toBeCloseTo(
    rim.scale.x * rim.geometry.parameters.innerRadius,
    12,
  );
  expect(plane.scale.y).toBeCloseTo(
    rim.scale.y * rim.geometry.parameters.innerRadius,
    12,
  );
});

it("isolates the vacuole detail and reuses geometry when switching section and full-cell views", () => {
  const root = new T.Group();
  buildCell(root, { cut: 100, part: 2, vacuoleSection: 1 });
  const detail = root.getObjectByName("vacuole-detail"),
    full = root.getObjectByName("vacuole-intact"),
    section = root.getObjectByName("vacuole-section"),
    geometry = full.geometry;
  expect(detail.visible).toBe(false);
  root.userData.setInspection(2);
  expect(root.children.filter((o) => o.visible)).toEqual([detail]);
  expect(section.visible).toBe(true);
  root.userData.update({ cut: 100, part: 2, vacuoleSection: 0 });
  expect(section.visible).toBe(false);
  expect(full.visible).toBe(true);
  expect(full.geometry).toBe(geometry);
  root.userData.setInspection(0);
  expect(detail.visible).toBe(false);
  expect(root.getObjectByName("cell-nucleus").visible).toBe(true);
});
