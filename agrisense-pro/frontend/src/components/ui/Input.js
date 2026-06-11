import { useState } from "react";

export default function Input({ label, error, prefix, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display:"block", fontSize:12, fontWeight:600, color:"var(--text-muted)", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.05em" }}>{label}</label>}
      <div style={{ position:"relative", display:"flex", alignItems:"center" }}>
        {prefix && <span style={{ position:"absolute", left:12, color:"var(--text-muted)", fontSize:14 }}>{prefix}</span>}
        <input onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)} style={{
          width:"100%", padding: prefix ? "10px 14px 10px 32px" : "10px 14px",
          background:"var(--bg-elevated)", border:`1px solid ${focused?"var(--green-500)":error?"var(--red-500)":"var(--border)"}`,
          borderRadius:"var(--radius-sm)", color:"var(--text-primary)", fontSize:14,
          outline:"none", transition:"border 0.2s", fontFamily:"Inter,sans-serif",
        }} {...props} />
      </div>
      {error && <p style={{ color:"var(--red-500)", fontSize:12, marginTop:4 }}>{error}</p>}
    </div>
  );
}