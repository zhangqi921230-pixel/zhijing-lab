import {
  allExperiments as experiments,
  workbenches as benches,
  groupFor,
} from "./courseCatalog.mjs";
import { scienceCommunityTopics } from "./science/catalog.mjs";
import { contentGroups } from "./science/publication.mjs";
const science = scienceCommunityTopics.filter(
  (t) => contentGroups[t.id.slice(8)],
);
export const allExperiments = [...experiments, ...science];
export const workbenches = [...benches, ...science];
export { groupFor };
