import { writeFileSync } from "node:fs";
import { format } from "prettier";
import { contentGroups } from "../src/science/publication.mjs";
const previews = {};
for (const [id, group] of Object.entries(contentGroups)) {
  const content = (await import(`../src/science/content/${group}.mjs`)).default[
    id
  ];
  if (!content?.summary) throw Error(`Missing science text: ${id}`);
  previews[id] = content.summary.split("。")[0] + "。";
}
writeFileSync(
  "src/science/previews.mjs",
  await format(
    `// Generated from published editorial summaries.\nexport const previews = ${JSON.stringify(previews, null, 2)};\n`,
    { parser: "babel" },
  ),
);
console.log(`Science preview index: ${Object.keys(previews).length} topics`);
