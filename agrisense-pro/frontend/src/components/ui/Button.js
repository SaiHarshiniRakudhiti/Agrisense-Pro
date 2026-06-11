import { Loader } from "lucide-react";

export default function Button({ children, loading, variant = "primary", fullWidth, size = "md", style = {}, ...props }) {
  const base = { display:"flex", alignItems:"center", justifyContent:"center", gap:8, border:"none", cursor: loading || props.disabled ? "not-allowed" : "pointer", borderRadius:"var(--radius-md)", fontWeight:700, fontFamily:"Inter,sans-serif", transition:"all 0.2s", opacity: loading ? 0.8 : 1 };
  const sizes = { sm:{padding:"8px 16px",fontSize:13}, md:{padding:"12px 24px",fontSize:14}, lg:{padding:"14px 28px",fontSize:15} };
  const variants = {
    primary:  { background:"linear-gradient(135deg,#22c55e,#16a34a)", color:"#fff", boxShadow:"0 4px 12px rgba(34,197,94,0.3)" },
    secondary:{ background:"var(--bg-elevated)", color:"var(--text-primary)", border:"1px solid var(--border-light)" },
    danger:   { background:"linear-gradient(135deg,#ef4444,#dc2626)", color:"#fff" },
    ghost:    { background:"transparent", color:"var(--text-secondary)", border:"1px solid var(--border)" },
  };
  return (
    <button style={{ ...base, ...sizes[size], ...variants[variant], width: fullWidth ? "100%" : undefined, ...style }} disabled={loading} {...props}>
      {loading ? <Loader size={16} className="spin" /> : null}
      {children}
    </button>
  );
}