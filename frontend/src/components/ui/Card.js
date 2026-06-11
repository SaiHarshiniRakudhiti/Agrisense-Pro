export default function Card({ children, className = "", style = {}, glass = false }) {
  return (
    <div style={{
      background: glass ? "rgba(26,43,28,0.6)" : "var(--bg-surface)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)",
      padding: "24px",
      backdropFilter: glass ? "blur(12px)" : undefined,
      ...style
    }} className={className}>
      {children}
    </div>
  );
}