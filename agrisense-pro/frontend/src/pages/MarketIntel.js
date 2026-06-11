import { useEffect, useState } from "react";
import { marketAPI } from "../services/api";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { trendColor } from "../utils/format";

const TT = p => <Tooltip contentStyle={{ background:"#1a2b1c", border:"1px solid #1f3322", borderRadius:10, color:"#f0fdf4", fontSize:13 }} {...p} />;

export default function MarketIntel() {
  const [prices, setPrices]   = useState([]);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    marketAPI.prices().then(r=>{ setPrices(r.data.prices||[]); setLoading(false); }).catch(()=>setLoading(false));
  },[]);

  const select = async (p) => {
    setSelected(p.crop);
    const r = await marketAPI.cropPrice(p.crop);
    setDetail(r.data);
  };

  const tIcon = t => t==="rising"?<TrendingUp size={12} color="#22c55e"/>:t==="volatile"?<TrendingDown size={12} color="#ef4444"/>:<Minus size={12} color="#6b7280"/>;

  return (
    <div className="fade-in">
      <h1 style={{ fontSize:26, fontWeight:800, color:"var(--text-primary)", marginBottom:4 }}>📈 Market Intelligence</h1>
      <p style={{ color:"var(--text-muted)", marginBottom:28, fontSize:14 }}>Live crop prices, MSP rates and monthly price trends</p>

      <div style={{ display:"grid", gridTemplateColumns:"5fr 7fr", gap:24 }}>
        <Card style={{ padding:0, overflow:"hidden" }}>
          <div style={{ padding:"18px 20px", borderBottom:"1px solid var(--border)" }}>
            <h3 style={{ color:"var(--text-primary)", fontWeight:700, fontSize:15 }}>🏷 Current Prices — Click for trend</h3>
            <p style={{ color:"var(--text-muted)", fontSize:12, marginTop:2 }}>As of today · Source: AgriSense Market Feed</p>
          </div>
          <div style={{ overflowY:"auto", maxHeight:560 }}>
            {loading ? <p style={{ color:"var(--text-muted)", padding:20 }}>Loading...</p> :
            prices.map((p,i)=>(
              <div key={i} onClick={()=>select(p)} style={{
                display:"flex", justifyContent:"space-between", alignItems:"center",
                padding:"13px 20px", cursor:"pointer", transition:"background 0.15s",
                background: selected===p.crop ? "var(--bg-elevated)" : "transparent",
                borderBottom:"1px solid var(--border)",
              }}
              onMouseEnter={e=>{ if(selected!==p.crop) e.currentTarget.style.background="var(--bg-elevated)20"; }}
              onMouseLeave={e=>{ if(selected!==p.crop) e.currentTarget.style.background="transparent"; }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ fontWeight:600, color:"var(--text-primary)", fontSize:14 }}>{p.crop}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                    {tIcon(p.trend)}
                    <span style={{ fontSize:11, color:trendColor(p.trend) }}>{p.trend}</span>
                  </div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontWeight:700, color:"var(--text-primary)", fontSize:14 }}>₹{p.current_price?.toLocaleString()}</div>
                  <div style={{ fontSize:11, color: p.change_pct>=0?"#22c55e":"#ef4444" }}>{p.change_pct>=0?"+":""}{p.change_pct}%</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {detail ? (
          <div style={{ display:"flex", flexDirection:"column", gap:14 }} className="fade-in">
            <Card>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
                <div>
                  <h3 style={{ color:"var(--text-primary)", fontWeight:700, fontSize:17 }}>{detail.crop}</h3>
                  <p style={{ color:"var(--text-muted)", fontSize:13, marginTop:2 }}>Peak season: {detail.season_peak}</p>
                </div>
                <Badge color={trendColor(detail.trend)}>{detail.trend}</Badge>
              </div>
              <div style={{ fontSize:36, fontWeight:900, color:"#22c55e", marginBottom:16 }}>
                ₹{detail.current?.toLocaleString()}
                <span style={{ fontSize:14, color:"var(--text-muted)", marginLeft:8 }}>{detail.unit}</span>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={detail.monthly_trend}>
                  <defs>
                    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fill:"var(--text-muted)", fontSize:11 }}/>
                  <YAxis tick={{ fill:"var(--text-muted)", fontSize:11 }} domain={["auto","auto"]}/>
                  <TT/>
                  <Area type="monotone" dataKey="price" name="Price (₹)" stroke="#22c55e" strokeWidth={2} fill="url(#g)" dot={false}/>
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </div>
        ) : (
          <div style={{ background:"var(--bg-surface)", border:"2px dashed var(--border)", borderRadius:"var(--radius-lg)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:400 }}>
            <TrendingUp size={52} color="var(--border-light)"/>
            <p style={{ color:"var(--text-muted)", marginTop:16, fontSize:14 }}>Click a crop to view price trend</p>
          </div>
        )}
      </div>
    </div>
  );
}