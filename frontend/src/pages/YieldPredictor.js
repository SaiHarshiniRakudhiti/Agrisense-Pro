import { useState } from "react";
import { yieldAPI } from "../services/api";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Badge from "../components/ui/Badge";
import { BarChart2, TrendingUp } from "lucide-react";
import { fmt } from "../utils/format";
import toast from "react-hot-toast";

const catColor = c => ({High:"#22c55e",Medium:"#f59e0b",Low:"#ef4444"})[c]||"#6b7280";

export default function YieldPredictor() {
  const [form, setForm] = useState({ N:90,P:42,K:43,temperature:25,humidity:70,rainfall:150,ph:6.5,area_hectares:5,season:"Kharif",soil_type:"Loamy" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (k,v) => setForm(f=>({...f,[k]: isNaN(parseFloat(v))?v:parseFloat(v)}));

  const submit = async () => {
    setLoading(true);
    try {
      const r = await yieldAPI.predict(form);
      setResult(r.data);
      toast.success(`Predicted yield: ${r.data.total_yield_tonnes} tonnes`);
    } catch(e) {
      toast.error(e.response?.data?.error?.message || "Prediction failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="fade-in">
      <h1 style={{ fontSize:26, fontWeight:800, color:"var(--text-primary)", marginBottom:4 }}>📊 Yield Predictor</h1>
      <p style={{ color:"var(--text-muted)", marginBottom:28, fontSize:14 }}>Predict harvest yield and estimated revenue using ML models</p>

      <div style={{ display:"grid", gridTemplateColumns:"5fr 6fr", gap:24 }}>
        <Card>
          <h3 style={{ color:"var(--text-primary)", fontWeight:700, marginBottom:20, fontSize:15 }}>🌾 Farm Input Parameters</h3>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 12px" }}>
            <Input label="Nitrogen (kg/ha)"  type="number" value={form.N}           onChange={e=>set("N",e.target.value)} />
            <Input label="Phosphorus (kg/ha)"type="number" value={form.P}           onChange={e=>set("P",e.target.value)} />
            <Input label="Potassium (kg/ha)" type="number" value={form.K}           onChange={e=>set("K",e.target.value)} />
            <Input label="Temperature (°C)"  type="number" value={form.temperature} onChange={e=>set("temperature",e.target.value)} />
            <Input label="Humidity (%)"      type="number" value={form.humidity}    onChange={e=>set("humidity",e.target.value)} />
            <Input label="Rainfall (mm/mo)"  type="number" value={form.rainfall}    onChange={e=>set("rainfall",e.target.value)} />
            <Input label="Soil pH"           type="number" step="0.1" value={form.ph} onChange={e=>set("ph",e.target.value)} />
            <Input label="Area (hectares)"   type="number" step="0.5" value={form.area_hectares} onChange={e=>set("area_hectares",e.target.value)} />
          </div>
          <Select label="Season"    value={form.season}    onChange={e=>set("season",e.target.value)}    options={["Kharif","Rabi","Zaid"]} />
          <Select label="Soil Type" value={form.soil_type} onChange={e=>set("soil_type",e.target.value)} options={["Sandy","Loamy","Clay","Silt","Sandy Loam","Clay Loam","Black Cotton"]} />
          <Button fullWidth size="lg" loading={loading} onClick={submit} style={{ marginTop:8 }}>
            🔢 Predict Yield
          </Button>
        </Card>

        {result ? (
          <div style={{ display:"flex", flexDirection:"column", gap:14 }} className="fade-in">
            <div style={{ background:"linear-gradient(135deg,#0c1a3a,#1e3a8a20)", border:"1px solid rgba(59,130,246,0.3)", borderRadius:"var(--radius-lg)", padding:28 }}>
              <p style={{ fontSize:12, fontWeight:700, color:"#93c5fd", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:6 }}>Total Predicted Yield</p>
              <div style={{ fontSize:52, fontWeight:900, color:"#fff", lineHeight:1 }}>
                {result.total_yield_tonnes}
                <span style={{ fontSize:22, color:"#93c5fd", marginLeft:8 }}>tonnes</span>
              </div>
              <div style={{ marginTop:14, display:"flex", gap:10 }}>
                <Badge color={catColor(result.yield_category)}>{result.yield_category} Yield</Badge>
                <Badge color="#6b7280">{result.yield_per_hectare} t/ha</Badge>
                <Badge color="#f59e0b">{result.season}</Badge>
              </div>
            </div>

            <Card>
              <h4 style={{ color:"var(--text-primary)", fontWeight:700, marginBottom:10, fontSize:14 }}>💰 Revenue Estimate</h4>
              <div style={{ fontSize:34, fontWeight:800, color:"#22c55e" }}>{fmt.currency(result.estimated_revenue_inr)}</div>
              <p style={{ color:"var(--text-muted)", fontSize:12, marginTop:4 }}>At avg. market rate of ₹18,000/tonne</p>
            </Card>

            <Card>
              <h4 style={{ color:"var(--text-primary)", fontWeight:700, marginBottom:10, fontSize:14 }}>💡 Optimisation Tips</h4>
              {result.optimisation_tips?.map((t,i)=>(
                <div key={i} style={{ display:"flex", gap:10, padding:"9px 0", borderBottom:"1px solid var(--border)" }}>
                  <TrendingUp size={14} color="#22c55e" style={{ flexShrink:0, marginTop:2 }}/>
                  <span style={{ fontSize:13, color:"var(--text-secondary)" }}>{t}</span>
                </div>
              ))}
            </Card>
          </div>
        ) : (
          <div style={{ background:"var(--bg-surface)", border:"2px dashed var(--border)", borderRadius:"var(--radius-lg)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:400 }}>
            <BarChart2 size={52} color="var(--border-light)"/>
            <p style={{ color:"var(--text-muted)", marginTop:16, fontSize:14 }}>Results will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}