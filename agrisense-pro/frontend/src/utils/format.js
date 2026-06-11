export const fmt = {
  currency: (n) => `₹${Number(n).toLocaleString("en-IN")}`,
  pct:      (n) => `${Number(n).toFixed(1)}%`,
  tonnes:   (n) => `${Number(n).toFixed(2)} t`,
  date:     (d) => new Date(d).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" }),
};

export const severityColor = (s) => ({
  Critical:"#ef4444", High:"#f97316", Moderate:"#f59e0b", None:"#22c55e", Low:"#22c55e"
})[s] ?? "#6b7280";

export const trendColor = (t) => ({ rising:"#22c55e", volatile:"#ef4444", stable:"#94a3b8" })[t] ?? "#6b7280";