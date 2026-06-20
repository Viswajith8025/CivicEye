export function escapeRegex(value) {
  if (!value || typeof value !== "string") return "";
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function buildSearchFilter(search, fields) {
  if (!search?.trim()) return null;
  const safe = escapeRegex(search.trim());
  return {
    $or: fields.map((field) => ({ [field]: { $regex: safe, $options: "i" } })),
  };
}
