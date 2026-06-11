import { useState } from "react";
import { fertAPI } from "../services/api";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Badge from "../components/ui/Badge";
import { FlaskConical, AlertTriangle } from "lucide-react";
import { severityColor } from "../utils/format";
import toast from "react-hot-toast";

const CROPS = ["Rice","Wheat","Maize","Soybean","Cotton","Sugarcane","Groundnut","Sunflower","Barley","Sorghum","Millet","Chickpea","Lentil","Mustard","Turmeric","Ginger","Potato","Tomato","Onion","Banana"];

export default function FertilizerAdvisor() {
  const [form, setForm] = useState({ N:50,P:15,K:30,ph:6.0,organic_matter:1.5,moisture:45,crop:"Rice" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const set = (k,v) => setForm(f=>({...f,[k]: isNaN(parseFloat(v))?v:parseFloat(v)}));

  const submit = async () => {
    setLoading(true);
    try {
      const r = await fertAPI.advise(form);
      setResult(r.data);
      toast.success(`Recommended: ${r.data.recommended_fertilizer}`);
    } catch(e) {
      toast.error(e.response?.data?.error?.message || "Advisory failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="fade-in">
      <h1 style={{ fontSize:26, fontWeight:800, color:"var(--text-primary)", marginBottom:4 }}>🧪 Fertilizer AI Advisor</h1>
      <p style={{ color:"var(--text-muted)", marginBottom:28, fontSize:14 }}>Personalised fertilizer recommendations based on your soil test report</p>

      <div style={{ display:"grid", gridTemplateColumns:"5fr 6fr", gap:24 }}>
        <Card>
          <h3 style={{ color:"var(--text-primary)", fontWeight:700, marginBottom:20, fontSize:15 }}>🧾 Soil Test Data</h3>
          <Select label="Crop" value={form.crop} onChange={e=>set("crop",e.target.value)} options={CROPS} />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 12px" }}>
            <Input label="N (kg/ha)"          type="number" value={form.N}              onChange={e=>set("N",e.target.value)} />
            <Input label="P (kg/ha)"          type="number" value={form.P}              onChange={e=>set("P",e.target.value)} />
            <Input label="K (kg/ha)"          type="number" value={form.K}              onChange={e=>set("K",e.target.value)} />
            <Input label="Soil pH"            type="number" step="0.1" value={form.ph}  onChange={e=>set("ph",e.target.value)} />
            <Input label="Organic Matter (%)" type="number" step="0.1" value={form.organic_matter} onChange={e=>set("organic_matter",e.target.value)} />
            <Input label="Moisture (%)"       type="number" value={form.moisture}        onChange={e=>set("moisture",e.target.value)} />
          </div>
          <Button fullWidth size="lg" loading={loading} onClick={submit} style={{ marginTop:8, background:"linear-gradient(135deg,#f59e0b,#d97706)" }}>
            🔬 Get Fertilizer Plan
          </Button>
        </Card>

        {result ? (
          <div style={{ display:"flex", flexDirection:"column", gap:14 }} className="fade-in">
            <div style={{ background:"linear-gradient(135deg,#1c0a00,#451a0320)", border:"1px solid rgba(245,158,11,0.3)", borderRadius:"var(--radius-lg)", padding:24 }}>
              <p style={{ fontSize:12, fontWeight:700, color:"#fcd34d", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:6 }}>Recommended Fertilizer</p>
              <div style={{ fontSize:30, fontWeight:800, color:"#fff", marginBottom:12 }}>{result.recommended_fertilizer}</div>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                <Badge color="#f59e0b">NPK {result.npk_ratio}</Badge>
                <Badge color="#6b7280">{result.dose_kg_per_hectare} kg/ha</Badge>
                <Badge color="#22c55e">{result.confidence}% confidence</Badge>
              </div>
              <div style={{ marginTop:14, display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <div><p style={{ fontSize:11, color:"#9ca3af" }}>Application</p><p style={{ fontSize:13, color:"#fcd34d", fontWeight:600 }}>{result.application_timing}</p></div>
                <div><p style={{ fontSize:11, color:"#9ca3af" }}>Cost Est.</p><p style={{ fontSize:13, color:"#22c55e", fontWeight:700 }}>₹{result.cost_estimate_inr_per_ha?.toLocaleString()}/ha</p></div>
              </div>
            </div>

            {result.deficiencies_detected?.length > 0 && (
              <Card>
                <h4 style={{ color:"var(--text-primary)", fontWeight:700, marginBottom:12, fontSize:14 }}>⚠️ Nutrient Deficiencies</h4>
                {result.deficiencies_detected.map((d,i)=>(
                  <div key={i} style={{ background:`${severityColor(d.severity)}10`, border:`1px solid ${severityColor(d.severity)}30`, borderRadius:10, padding:12, marginBottom:8 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                      <span style={{ fontWeight:600, color:"var(--text-primary)", fontSize:14 }}>{d.nutrient}</span>
                      <Badge color={severityColor(d.severity)} size="sm">{d.severity}</Badge>
                    </div>
                    <p style={{ fontSize:12, color:"var(--text-muted)" }}>→ {d.fix}</p>
                  </div>
                ))}
              </Card>
            )}

            <Card>
              <h4 style={{ color:"var(--text-primary)", fontWeight:700, marginBottom:8, fontSize:14 }}>🌱 Organic Matter Status</h4>
              <p style={{ fontSize:14, color: result.organic_matter_status?.includes("Low")?"#fcd34d":"#86efac" }}>{result.organic_matter_status}</p>
            </Card>
          </div>
        ) : (
          <div style={{ background:"var(--bg-surface)", border:"2px dashed var(--border)", borderRadius:"var(--radius-lg)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:400 }}>
            <FlaskConical size={52} color="var(--border-light)"/>
            <p style={{ color:"var(--text-muted)", marginTop:16, fontSize:14 }}>Fertilizer plan appears here</p>
          </div>
        )}
      </div>
    </div>
  );
}