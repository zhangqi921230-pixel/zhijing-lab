import { format } from "./models.mjs";

export function recordedParameter(param, value, legacyOptions) {
  if (value === undefined || value === null) return "未记录";
  const label =
    param.options?.find((option) => option.value === value)?.label ??
    legacyOptions?.[value];
  return label ?? `${format(value)}${param.unit ?? ""}`;
}
