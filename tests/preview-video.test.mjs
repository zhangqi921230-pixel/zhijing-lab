import { it, expect } from "vitest";
import { readFileSync, statSync } from "node:fs";
import { workbenches } from "../src/courseCatalog.mjs";
import { nativeMotionPreviewIds } from "../src/motionTopics.mjs";
it("every recorded theme has a compact 24fps looping-video asset; native previews use the scene model", () => {
  const list = JSON.parse(
    readFileSync("public/previews/motion/video-manifest.json"),
  );
  expect(list.map((x) => x.id).sort()).toEqual(
    workbenches
      .filter((x) => !nativeMotionPreviewIds.includes(x.id))
      .map((x) => x.id)
      .sort(),
  );
  let size = 0;
  for (const x of list) {
    const path = `public/previews/motion/${x.id}.mp4`;
    expect(readFileSync(path).subarray(4, 8).toString()).toBe("ftyp");
    expect(x.fps).toBe(24);
    expect(statSync(path).size).toBe(x.bytes);
    size += x.bytes;
  }
  expect(size).toBeLessThan(3_000_000);
});
