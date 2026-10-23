import { expect, it, vi } from "vitest";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { addLaboratorySoftboxes } from "../src/LaboratorySoftboxes.js";

it("bakes shared reflection cards and disposes their resources once", () => {
  const room = new RoomEnvironment();
  addLaboratorySoftboxes(room);
  const cards = room.children.filter((o) =>
    o.name.startsWith("laboratory-reflection-card"),
  );
  expect(cards).toHaveLength(4);
  expect(new Set(cards.map((o) => o.geometry)).size).toBe(1);
  expect(new Set(cards.map((o) => o.material)).size).toBe(1);
  expect(cards.reduce((sum, o) => sum + o.geometry.index.count / 3, 0)).toBe(8);
  expect(cards.every((o) => !o.castShadow && !o.isLight)).toBe(true);
  const disposeGeometry = vi.spyOn(cards[0].geometry, "dispose");
  const disposeMaterial = vi.spyOn(cards[0].material, "dispose");
  room.dispose();
  expect(disposeGeometry).toHaveBeenCalledTimes(1);
  expect(disposeMaterial).toHaveBeenCalledTimes(1);
});
