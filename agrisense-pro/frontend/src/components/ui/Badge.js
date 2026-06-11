export default function Badge({ children, color = "#22c55e", size = "sm" }) {
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", padding: size==="sm" ? "3px 10px" : "5px 14px",
      background:`${color}18`, color, borderRadius:20, fontSize: size==="sm" ? 12 : 13, fontWeight:600, border:`1px solid ${color}30`,
    }}>{children}</span>
  );
}