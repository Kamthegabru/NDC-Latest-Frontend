
export function formatDateUS(value, {
  sep = "-",
  timeZone = "America/Chicago",
  fallback = "N/A",
} = {}) {
  if (!value) return fallback;
  const d = new Date(value);
  if (isNaN(d)) return fallback;

  
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);

  const get = t => parts.find(p => p.type === t)?.value || "";
  const mm = get("month");
  const dd = get("day");
  const yyyy = get("year");

  return [mm, dd, yyyy].join(sep);
}
