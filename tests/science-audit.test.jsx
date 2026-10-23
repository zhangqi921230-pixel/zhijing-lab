// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { it, expect } from "vitest";
import ScienceScene from "../src/science/ScienceScene.jsx";
import { StoryPicture } from "../src/science/VisualStory.jsx";
import { scienceTopics } from "../src/science/catalog.mjs";
import { contentGroups } from "../src/science/publication.mjs";
import { storyboards } from "../src/science/storyboards.mjs";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("all published topic entry views render, including topics without a generic scene config", async () => {
  for (const topic of scienceTopics) {
    const content = (
      await import(`../src/science/content/${contentGroups[topic.id]}.mjs`)
    ).default[topic.id];
    const html = renderToStaticMarkup(
      <ScienceScene
        topic={topic}
        scene={content.scene}
        chapter={content.chapters[0][0]}
      />,
    );
    expect(html, topic.id).not.toMatch(/NaN|undefined/);
    expect(html.length).toBeGreaterThan(100);
    if (topic.id === "solar-system") {
      expect(html).toContain("science-scale-data");
      expect(html).toContain("海王星");
    }
  }
});
it("a failed comparison photo does not suppress the next photo", () => {
  const host = document.createElement("div");
  document.body.append(host);
  const root = createRoot(host),
    entry = storyboards["spring-flowers"];
  act(() => root.render(<StoryPicture entry={entry} index={0} />));
  act(() => host.querySelector("img").dispatchEvent(new Event("error")));
  expect(host.textContent).toContain("图片暂未加载");
  act(() => root.render(<StoryPicture entry={entry} index={1} />));
  expect(host.querySelector("img")).not.toBeNull();
  act(() => root.unmount());
  host.remove();
});
