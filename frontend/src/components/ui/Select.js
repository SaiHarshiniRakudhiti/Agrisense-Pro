export default function Select({ label, options, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display:"block", fontSize:12, fontWeight:600, color:"var(--text-muted)", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.05em" }}>{label}</label>}
      <select style={{
        width:"100%", padding:"10px 14px", background:"var(--bg-elevated)",
        border:"1px solid var(--border)", borderRadius:"var(--radius-sm)",
        color:"var(--text-primary)", fontSize:14, outline:"none", fontFamily:"Inter,sans-serif", cursor:"pointer",
      }} {...props}>
        {options.map(o => typeof o === "string" ? <option key={o} value={o}>{o}</option> : <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}