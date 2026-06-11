import { useState } from "react";
import { cropAPI } from "../services/api";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Badge from "../components/ui/Badge";
import { Sprout, CheckCircle, AlertCircle } from "lucide-react";
import { severityColor } from "../utils/format";
import toast from "react-hot-toast";

const FIELDS = [
  { key:"N",           label:"Nitrogen",     unit:"kg/ha",  min:0,   max:300,  step:1,   default:90 },
  { key:"P",           label:"Phosphorus",   unit:"kg/ha",  min:0,   max:150,  step:1,   default:42 },
  { key:"K",           label:"Potassium",    unit:"kg/ha",  min:0,   max:500,  step:1,   default:43 },
  { key:"temperature", label:"Temperature",  unit:"°C",     min:0,   max:50,   step:0.1, default:21 },
  { key:"humidity",    label:"Humidity",     unit:"%",      min:0,   max:100,  step:1,   default:82 },
  { key:"ph",          label:"Soil pH",      unit:"",       min:3.0, max:10.0, step:0.1, default:6.5 },
  { key:"rainfall",    label:"Rainfall",     unit:"mm/mo",  min:0,   max:400,  step:1,   default:202 },
];

const scoreColor = s => s>=80?"#22c55e":s>=60?"#f59e0b":s>=40?"#f97316":"#ef4444";

export default function CropAdvisor() {
  const [form, setForm] = useState(() => Object.fromEntries(FIELDS.map(f=>[f.key, f.default])));
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (k,v) => setForm(f=>({...f,[k]:parseFloat(v)||0}));

  const submit = async () => {
    setLoading(true);
    try {
      const r = await cropAPI.recommend(form);
      setResult(r.data);
      toast.success(`Best crop: ${r.data.top_recommendation}`);
    } catch(e) {
      toast.error(e.response?.data?.error?.message || "Prediction failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="fade-in">
      <h1 style={{ fontSize:26, fontWeight:800, color:"var(--text-primary)", marginBottom:4 }}>🌱 Crop Advisor</h1>
      <p style={{ color:"var(--text-muted)", marginBottom:28, fontSize:14 }}>Enter soil & weather data for AI-powered crop recommendations</p>

      <div style={{ display:"grid", gridTemplateColumns:"5fr 6fr", gap:24 }}>
        <Card>
          <h3 style={{ color:"var(--text-primary)", fontWeight:700, marginBottom:20, fontSize:15 }}>📋 Soil & Climate Parameters</h3>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 12px" }}>
            {FIELDS.map(f=>(
              <Input key={f.key} label={`${f.label}${f.unit?" ("+f.unit+")":""}`} type="number"
                value={form[f.key]} onChange={e=>set(f.key,e.target.value)}
                min={f.min} max={f.max} step={f.step} />
            ))}
          </div>
          <Button fullWidth size="lg" loading={loading} onClick={submit} style={{ marginTop:8 }}>
            🔍 Get AI Recommendation
          </Button>
        </Card>

        {result ? (
          <div style={{ display:"flex", flexDirection:"column", gap:14 }} className="fade-in">
            {/* Top pick */}
            <div style={{ background:"linear-gradient(135deg,#052e16,#064e20)", border:"1px solid rgba(34,197,94,0.3)", borderRadius:"var(--radius-lg)", padding:24 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                <CheckCircle size={18} color="#22c55e"/>
                <span style={{ color:"#86efac", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em" }}>Top Recommendation</span>
              </div>
              <div style={{ fontSize:38, fontWeight:900, color:"#fff", marginBottom:10 }}>{result.top_recommendation}</div>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                <Badge color="#22c55e">{result.confidence}% confidence</Badge>
                <Badge color="#3b82f6">{result.alternatives?.[0]?.suitability || "Excellent"} match</Badge>
              </div>
            </div>

            {/* Soil Health */}
            <Card>
              <h4 style={{ color:"var(--text-primary)", fontWeight:700, marginBottom:12, fontSize:14 }}>🧪 Soil Health Score</h4>
              <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:12 }}>
                <div style={{ fontSize:36, fontWeight:900, color:scoreColor(result.soil_health?.score) }}>{result.soil_health?.score}</div>
                <div>
                  <Badge color={scoreColor(result.soil_health?.score)}>{result.soil_health?.rating}</Badge>
                  <div style={{ fontSize:12, color:"var(--text-muted)", marginTop:4 }}>out of 100</div>
                </div>
                {/* Score bar */}
                <div style={{ flex:1, height:8, background:"var(--bg-elevated)", borderRadius:4 }}>
                  <div style={{ width:`${result.soil_health?.score}%`, height:8, borderRadius:4, background:scoreColor(result.soil_health?.score), transition:"width 0.8s ease" }}/>
                </div>
              </div>
              {result.soil_health?.issues?.length > 0
                ? result.soil_health.issues.map((i,idx)=>(
                    <div key={idx} style={{ display:"flex", gap:8, alignItems:"flex-start", marginBottom:6 }}>
                      <AlertCircle size={13} color="#f59e0b" style={{ flexShrink:0, marginTop:2 }}/>
                      <span style={{ fontSize:13, color:"#fcd34d" }}>{i}</span>
                    </div>
                  ))
                : <p style={{ fontSize:13, color:"#86efac" }}>✅ Soil conditions are optimal for cultivation</p>
              }
            </Card>

            {/* Alternatives */}
            <Card>
              <h4 style={{ color:"var(--text-primary)", fontWeight:700, marginBottom:12, fontSize:14 }}>🔄 Alternative Crops</h4>
              {result.alternatives?.map((a,i)=>(
                <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:"1px solid var(--border)" }}>
                  <div>
                    <span style={{ color:"var(--text-primary)", fontWeight:600, fontSize:14 }}>{a.crop}</span>
                    <span style={{ fontSize:12, color:"var(--text-muted)", marginLeft:8 }}>{a.suitability}</span>
                  </div>
                  <Badge color="#3b82f6" size="sm">{a.confidence}%</Badge>
                </div>
              ))}
            </Card>

            {/* Agronomic notes */}
            {result.agronomic_notes?.length > 0 && (
              <Card>
                <h4 style={{ color:"var(--text-primary)", fontWeight:700, marginBottom:10, fontSize:14 }}>💡 Agronomic Insights</h4>
                {result.agronomic_notes.map((n,i)=>(
                  <div key={i} style={{ fontSize:13, color:"var(--text-secondary)", padding:"6px 0", borderBottom:"1px solid var(--border)", display:"flex", gap:8 }}>
                    <span>→</span><span>{n}</span>
                  </div>
                ))}
              </Card>
            )}
          </div>
        ) : (
          <div style={{ background:"var(--bg-surface)", border:"2px dashed var(--border)", borderRadius:"var(--radius-lg)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:400 }}>
            <Sprout size={52} color="var(--border-light)" />
            <p style={{ color:"var(--text-muted)", marginTop:16, textAlign:"center", fontSize:14 }}>
              Fill in the soil parameters<br/>and click <strong style={{ color:"var(--text-secondary)" }}>Get AI Recommendation</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}