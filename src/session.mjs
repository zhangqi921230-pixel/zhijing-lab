import { topicChapters } from "./topicChapters.mjs";
import { conicObservation } from "./conicObservation.mjs";
import { rcObservation } from "./rcObservation.mjs";
import { defaults } from "./lessons.mjs";
import { calculate } from "./models.mjs";
import { normalizeInclineFriction } from "./advancedModels.mjs";
import { cellObservation } from "./cellNavigation.mjs";
import { titrationObservation } from "./titrationNavigation.mjs";
import { dilutionObservation } from "./dilutionViews.mjs";
import { solubilityObservation } from "./solubilityViews.mjs";
import { functionObservation } from "./functionObservation.mjs";
const key = (id) => `zhijing:experiment:v1:${id}`;
function basicObservation(value, id) {
  return {
    chapter:
      Number.isInteger(value?.chapter) &&
      value.chapter >= 0 &&
      value.chapter < (topicChapters[id]?.length ?? 0)
        ? value.chapter
        : 0,
    view: [
      "perspective",
      "front",
      "top",
      ...(id === "earthquake" ? ["station"] : []),
      ...(id === "incline" ? ["block"] : []),
      ...(id === "biodiversity" ? ["plant", "fungus", "insect"] : []),
      ...(id === "photosynthesis" ? ["leaf", "lamp", "readout"] : []),
      ...(id === "volcano" ? ["volcanoCrater", "volcanoInterior"] : []),
    ].includes(value?.view)
      ? value.view
      : "perspective",
    representation: value?.representation === "diagram" ? "diagram" : "3d",
  };
}
function parameters(lesson, value) {
  if (!value || typeof value !== "object") return null;
  if (lesson.id === "cell")
    value = {
      ...value,
      secretoryMode: value.secretoryMode === 1 && value.part === 0 ? 1 : 0,
      secretoryProgress: Number.isFinite(value.secretoryProgress)
        ? Math.max(0, Math.min(100, value.secretoryProgress))
        : 0,
    };

  const result = {};
  for (const param of lesson.params) {
    const v =
      lesson.id === "incline" &&
      param.key === "muStatic" &&
      value.muStatic === undefined
        ? value.mu
        : value[param.key] === undefined
          ? param.value
          : value[param.key];
    if (
      typeof v !== "number" ||
      !Number.isFinite(v) ||
      v < param.min ||
      v > param.max ||
      (param.options && !param.options.some((option) => option.value === v))
    )
      return null;
    result[param.key] = v;
  }
  return lesson.id === "incline" ? normalizeInclineFriction(result) : result;
}
export function restoreSession(lesson, storage) {
  const empty = { p: defaults(lesson), t: 0, records: [], restored: false };
  try {
    const data = JSON.parse(storage.getItem(key(lesson.id)));
    const p = parameters(lesson, data?.p);
    if (
      data?.version !== 1 ||
      !p ||
      !Number.isFinite(data.t) ||
      data.t < 0 ||
      data.t > 1e4 ||
      !Array.isArray(data.records)
    )
      return empty;
    const records = data.records
      .slice(-200)
      .flatMap((row) => {
        const values = parameters(lesson, row.parameters);
        if (!values || !Number.isFinite(row.t) || row.t < 0 || row.t > 1e4)
          return [];
        return [
          {
            t: row.t,
            parameters: values,
            values: calculate(lesson.id, values, row.t),
          },
        ];
      })
      .map((row, i) => ({ ...row, number: i + 1 }));
    return {
      p,
      t: data.t,
      records,
      restored: true,
      ...(lesson.id === "cell"
        ? {
            observation: cellObservation(
              p.secretoryMode === 1
                ? { chapter: 6, view: data.observation?.view ?? "perspective" }
                : data.observation,
              p.part,
            ),
          }
        : lesson.id === "acid"
          ? { observation: titrationObservation(data.observation) }
          : lesson.id === "dilution"
            ? { observation: dilutionObservation(data.observation) }
            : lesson.id === "solubility"
              ? { observation: solubilityObservation(data.observation) }
              : lesson.id === "conics"
                ? { observation: conicObservation(data.observation, p) }
                : lesson.id === "functions"
                  ? { observation: functionObservation(data.observation, p) }
                  : lesson.id === "capacitor"
                    ? { observation: rcObservation(data.observation, p) }
                    : Object.hasOwn(topicChapters, lesson.id)
                      ? {
                          observation: basicObservation(
                            data.observation,
                            lesson.id,
                          ),
                        }
                      : {}),
    };
  } catch {
    return empty;
  }
}
export function saveSession(lesson, session, storage) {
  try {
    storage.setItem(
      key(lesson.id),
      JSON.stringify({
        version: 1,
        p: session.p,
        t: session.t,
        records: session.records.slice(-200),
        ...(lesson.id === "cell"
          ? {
              observation: cellObservation(session.observation, session.p.part),
            }
          : lesson.id === "acid"
            ? { observation: titrationObservation(session.observation) }
            : lesson.id === "dilution"
              ? { observation: dilutionObservation(session.observation) }
              : lesson.id === "solubility"
                ? { observation: solubilityObservation(session.observation) }
                : lesson.id === "conics"
                  ? {
                      observation: conicObservation(
                        session.observation,
                        session.p,
                      ),
                    }
                  : lesson.id === "functions"
                    ? {
                        observation: functionObservation(
                          session.observation,
                          session.p,
                        ),
                      }
                    : lesson.id === "capacitor"
                      ? {
                          observation: rcObservation(
                            session.observation,
                            session.p,
                          ),
                        }
                      : Object.hasOwn(topicChapters, lesson.id)
                        ? {
                            observation: basicObservation(
                              session.observation,
                              lesson.id,
                            ),
                          }
                        : {}),
      }),
    );
    return true;
  } catch {
    return false;
  }
}
