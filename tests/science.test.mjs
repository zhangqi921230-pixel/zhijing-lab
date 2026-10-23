import { describe, it, expect } from "vitest";
import * as THREE from "three";
import {
  scienceTopics,
  categories,
  templates,
  scienceById,
} from "../src/science/catalog.mjs";
import { contentGroups } from "../src/science/publication.mjs";
import {
  readLearning,
  saveLearning,
  parseScienceRoute,
  listHash,
  filterTopics,
} from "../src/science/state.mjs";
import { buildSpatial, spatialParts } from "../src/science/spatialModels.mjs";
describe("science directory and publication boundary", () => {
  it("keeps 120 unique questions, 12 balanced categories, 24 enhanced and 8 spatial briefs", () => {
    expect(scienceTopics).toHaveLength(120);
    expect(new Set(scienceTopics.map((t) => t.id)).size).toBe(120);
    expect(scienceTopics.filter((t) => t.enhanced)).toHaveLength(24);
    expect(scienceTopics.filter((t) => t.spatial)).toHaveLength(8);
    for (const c of categories)
      expect(scienceTopics.filter((t) => t.category === c.id)).toHaveLength(10);
    for (const t of scienceTopics) expect(templates[t.template]).toBeTruthy();
  });
  it("only exposes topics with complete text and an explained comprehension check", async () => {
    expect(Object.keys(contentGroups)).toHaveLength(120);
    for (const [id, group] of Object.entries(contentGroups)) {
      const content = (await import(`../src/science/content/${group}.mjs`))
        .default[id];
      expect(scienceById[id]).toBeTruthy();
      expect(content.summary.length).toBeGreaterThan(30);
      expect(content.chapters.length).toBeGreaterThanOrEqual(3);
      for (const ch of content.chapters) {
        expect(ch).toHaveLength(4);
        expect(ch[3].length).toBeGreaterThan(45);
      }
      expect(content.deeper.length).toBeGreaterThan(80);
      expect(content.quiz.choices[content.quiz.answer]).toBeTruthy();
      expect(content.quiz.explanation.length).toBeGreaterThan(10);
      expect(content.sources.every((s) => s.url.startsWith("https://"))).toBe(
        true,
      );
      expect(content.review.status).not.toBe("已审核");
    }
  });
});
describe("science links and local learning state", () => {
  it("round trips Chinese keywords and literal query punctuation", () => {
    const route = parseScienceRoute(
      listHash({
        category: "plants",
        q: "樱花 & 梨花",
        mode: "identify",
        limit: 48,
      }),
    );
    expect(route.q).toBe("樱花 & 梨花");
    expect(route.category).toBe("plants");
    expect(route.limit).toBe(48);
    expect(parseScienceRoute("science/sky-blue?chapter=observe").chapter).toBe(
      "observe",
    );
  });
  it("handles denied and corrupt storage without blocking reading", () => {
    expect(
      readLearning({
        getItem() {
          throw Error("denied");
        },
      }),
    ).toEqual({ saved: [], recent: [] });
    expect(readLearning({ getItem: () => "{bad" })).toEqual({
      saved: [],
      recent: [],
    });
    expect(
      saveLearning(
        {},
        {
          setItem() {
            throw Error("denied");
          },
        },
      ),
    ).toBe(false);
    expect(
      readLearning({
        getItem: () =>
          JSON.stringify({
            saved: ["sky-blue", "unknown"],
            recent: [
              null,
              { id: "rocket", chapter: "engine" },
              { id: "unknown", chapter: 1 },
            ],
          }),
      }),
    ).toEqual({
      saved: ["sky-blue"],
      recent: [{ id: "rocket", chapter: "engine" }],
    });
  });
  it("searches aliases and combines category, template and bookmarks", () => {
    const r = parseScienceRoute(
      "science?q=春天的花&category=plants&mode=identify&saved=1",
    );
    expect(
      filterTopics(scienceTopics, r, { saved: ["spring-flowers"] }),
    ).toEqual([scienceById["spring-flowers"]]);
  });
});
describe("spatial models", () => {
  it("all planned models contain their selectable structures and finite geometry", () => {
    for (const id of Object.keys(spatialParts)) {
      const m = buildSpatial(THREE, id);
      for (const [key] of spatialParts[id])
        expect(m.parts[key]?.length).toBeGreaterThan(0);
      m.root.traverse((o) => {
        if (!o.isMesh) return;
        for (const v of o.geometry.attributes.position.array)
          expect(Number.isFinite(v)).toBe(true);
      });
      m.dispose();
    }
  });
  it("the rocket fairing contains only the nose, and each stage has distinct tank volumes", () => {
    const m = buildSpatial(THREE, "rocket");
    expect(m.parts.fairing.every((x) => x.userData.home[1] > 1.8)).toBe(true);
    expect(
      m.parts.fuel.filter(
        (x) => x.geometry.type === "CylinderGeometry" && !x.userData.shell,
      ),
    ).toHaveLength(1);
    expect(
      m.parts.oxidizer.filter(
        (x) => x.geometry.type === "CylinderGeometry" && !x.userData.shell,
      ),
    ).toHaveLength(1);
    expect(
      m.parts.upper.filter(
        (x) =>
          x.geometry.type === "CylinderGeometry" && x.userData.home[1] > 0.8,
      ),
    ).toHaveLength(2);
    m.dispose();
  });
});
