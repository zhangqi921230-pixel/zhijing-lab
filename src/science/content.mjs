const groups = import.meta.glob("./content/*.mjs");
export async function loadTopic(id) {
  // Small group files stay out of the initial application bundle.
  const index = await import("./publication.mjs");
  const group = index.contentGroups[id];
  if (!group || !groups[`./content/${group}.mjs`]) return null;
  const module = await groups[`./content/${group}.mjs`]();
  return module.default[id] || null;
}
