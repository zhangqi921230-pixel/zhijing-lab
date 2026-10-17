import fs from "node:fs";
import assert from "node:assert/strict";
import { gzipSync } from "node:zlib";
const manifest = JSON.parse(
  fs.readFileSync("dist/.vite/manifest.json", "utf8"),
);
const startup = new Set();
function collect(key) {
  if (startup.has(key)) return;
  assert(manifest[key], `Missing chunk ${key}`);
  startup.add(key);
  for (const child of manifest[key].imports ?? []) collect(child);
}
collect("index.html");
for (const key of startup)
  assert(
    !/three/i.test(manifest[key].name),
    `3D engine leaked into startup: ${key}`,
  );
assert(
  manifest["index.html"].dynamicImports?.includes("src/ThreeScene.jsx"),
  "Missing lazy scene entry",
);
assert(
  manifest["index.html"].dynamicImports?.includes("src/Laboratory.jsx"),
  "Missing lazy laboratory entry",
);
assert(!startup.has("src/Laboratory.jsx"), "Laboratory leaked into startup");
let bytes = 0,
  gzipBytes = 0;
for (const key of startup) {
  const buffer = fs.readFileSync("dist/" + manifest[key].file);
  bytes += buffer.length;
  gzipBytes += gzipSync(buffer).length;
}
assert(bytes < 300000, "Homepage startup JavaScript exceeds 300 kB");
assert(
  gzipBytes < 100000,
  "Homepage compressed startup JavaScript exceeds 100 kB",
);
const report = {
  generatedAt: new Date().toISOString(),
  startupFiles: [...startup].map((k) => manifest[k].file),
  bytes,
  gzipBytes,
  threeDeferred: true,
  laboratoryDeferred: true,
};
fs.writeFileSync(
  "docs/startup-bundle-check.json",
  JSON.stringify(report, null, 2) + "\n",
);
console.log(JSON.stringify(report, null, 2));
