import { scienceById } from "./catalog.mjs";
export const STORAGE_KEY = "zhijing:science:v1";
export function parseScienceRoute(route) {
  const [path, query = ""] = route.replace(/^#/, "").split("?");
  const params = new URLSearchParams(query);
  return {
    id: path.startsWith("science/") ? path.slice(8) : "",
    category: params.get("category") || "all",
    q: params.get("q") || "",
    mode: params.get("mode") || "all",
    saved: params.get("saved") === "1",
    limit: Math.min(120, Math.max(24, Number(params.get("limit")) || 24)),
    chapter: params.get("chapter") || "",
  };
}
export function readLearning(storage) {
  try {
    const x = JSON.parse((storage || localStorage).getItem(STORAGE_KEY));
    return {
      saved: Array.isArray(x?.saved)
        ? x.saved.filter((id) => scienceById[id])
        : [],
      recent: Array.isArray(x?.recent)
        ? x.recent
            .filter(
              (v) => v && scienceById[v.id] && typeof v.chapter === "string",
            )
            .slice(0, 12)
        : [],
    };
  } catch {
    return { saved: [], recent: [] };
  }
}
export function saveLearning(value, storage) {
  try {
    (storage || localStorage).setItem(STORAGE_KEY, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
export function filterTopics(topics, route, learning) {
  const q = route.q.trim().toLocaleLowerCase();
  return topics.filter(
    (t) =>
      (route.category === "all" || t.category === route.category) &&
      (route.mode === "all" || t.template === route.mode) &&
      (!route.saved || learning.saved.includes(t.id)) &&
      `${t.title} ${t.keywords} ${t.summary || ""}`
        .toLocaleLowerCase()
        .includes(q),
  );
}
export function listHash(filters) {
  const q = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value && value !== "all" && key !== "id" && key !== "chapter")
      q.set(key, String(value));
  }
  return `science${q.size ? "?" + q : ""}`;
}
