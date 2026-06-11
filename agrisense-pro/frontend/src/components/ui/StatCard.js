import Card from "./Card";

export default function StatCard({ icon: Icon, label, value, sub, color = "var(--green-500)", trend }) {
  return (
    <Card>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div style={{ flex:1 }}>
          <p style={{ fontSize:12, fontWeight:600, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:8 }}>{label}</p>
          <p style={{ fontSize:30, fontWeight:800, color:"var(--text-primary)", lineHeight:1 }}>{value}</p>
          {sub && <p style={{ fontSize:12, color:"var(--text-muted)", marginTop:6 }}>{sub}</p>}
        </div>
        <div style={{ width:48, height:48, borderRadius:12, background:`${color}18`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <Icon size={22} color={color} />
        </div>
      </div>
    </Card>
  );
}