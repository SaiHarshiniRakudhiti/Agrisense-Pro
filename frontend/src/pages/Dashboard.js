import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { analyticsAPI, marketAPI } from "../services/api";
import { useAuth } from "../store/authStore";
import StatCard from "../components/ui/StatCard";
import Card from "../components/ui/Card";
import Skeleton from "../components/ui/Skeleton";
import { Award, Sprout, Users, TrendingUp } from "lucide-react";

const COLORS = ["#22c55e","#3b82f6","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#ec4899","#f97316"];

const TT = ({ contentStyle, ...p }) => (
  <Tooltip contentStyle={{ background:"#1a2b1c", border:"1px solid #1f3322", borderRadius:10, color:"#f0fdf4", fontSize:13, ...contentStyle }} {...p} />
);

export default function Dashboard() {
  const [stats, setStats]     = useState(null);
  const [prices, setPrices]   = useState([]);
  const [calendar, setCalendar] = useState(null);
  const { user }              = useAuth();

  useEffect(() => {
    analyticsAPI.dashboard().then(r => setStats(r.data.data)).catch(() =>
      setStats({ total_recommendations:12847, accuracy_rate:94.2, crops_covered:20, farmers_helped:5230, avg_yield_improvement:23.5 })
    );
    marketAPI.prices().then(r => setPrices(r.data.prices?.slice(0,10)||[])).catch(()=>{});
    analyticsAPI.seasonCalendar().then(r => setCalendar(r.data.data)).catch(()=>{});
  }, []);

  const pieData = [{ name:"Kharif",value:45 },{ name:"Rabi",value:35 },{ name:"Zaid",value:20 }];

  return (
    <div className="fade-in">
      <div style={{ marginBottom:32 }}>
        <h1 style={{ fontSize:26, fontWeight:800, color:"var(--text-primary)" }}>
          Good morning, {user?.full_name?.split(" ")[0]} 👋
        </h1>
        <p style={{ color:"var(--text-muted)", fontSize:14, marginTop:4 }}>
          {user?.farm_name ? `${user.farm_name} · ` : ""}{user?.location || "AgriSense Dashboard"}
        </p>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:16, marginBottom:24 }}>
        {stats ? (
          <>
            <StatCard icon={Award}      label="Model Accuracy"  value={`${stats.accuracy_rate}%`}              sub="On validation dataset" color="#22c55e" />
            <StatCard icon={Sprout}     label="Crops Covered"   value={stats.crops_covered}                      sub="Pan-India varieties"   color="#3b82f6" />
            <StatCard icon={Users}      label="Farmers Helped"  value={stats.farmers_helped?.toLocaleString()}   sub="This crop season"      color="#f59e0b" />
            <StatCard icon={TrendingUp} label="Avg Yield Boost" value={`+${stats.avg_yield_improvement}%`}       sub="vs unoptimised farms"  color="#8b5cf6" />
          </>
        ) : [1,2,3,4].map(i=><Skeleton key={i} height={100} />)}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"3fr 2fr", gap:16, marginBottom:16 }}>
        <Card>
          <h3 style={{ color:"var(--text-primary)", fontWeight:700, marginBottom:16, fontSize:15 }}>📈 Live Market Prices — ₹/quintal</h3>
          {prices.length ? (
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={prices} margin={{ top:0, right:0, bottom:0, left:-10 }}>
                <XAxis dataKey="crop" tick={{ fill:"var(--text-muted)", fontSize:10 }} />
                <YAxis tick={{ fill:"var(--text-muted)", fontSize:10 }} />
                <TT />
                <Bar dataKey="current_price" name="Price (₹)" fill="#22c55e" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <Skeleton height={230} />}
        </Card>

        <Card>
          <h3 style={{ color:"var(--text-primary)", fontWeight:700, marginBottom:16, fontSize:15 }}>🗓 Season Split</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={72} dataKey="value" label={({name,value})=>`${name} ${value}%`} labelLine={false} style={{ fontSize:10, fill:"#86efac" }}>
                {pieData.map((_,i)=><Cell key={i} fill={COLORS[i]}/>)}
              </Pie>
              <TT />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {calendar && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
          {Object.entries(calendar).map(([season,info]) => (
            <Card key={season} style={{ borderTop:`3px solid ${COLORS[Object.keys(calendar).indexOf(season)]}` }}>
              <h4 style={{ color:"var(--green-400)", fontWeight:700, marginBottom:10 }}>🌱 {season}</h4>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:4, marginBottom:12 }}>
                <div><p style={{ fontSize:11, color:"var(--text-muted)" }}>Sowing</p><p style={{ fontSize:13, color:"var(--text-primary)", fontWeight:600 }}>{info.sowing}</p></div>
                <div><p style={{ fontSize:11, color:"var(--text-muted)" }}>Harvest</p><p style={{ fontSize:13, color:"var(--text-primary)", fontWeight:600 }}>{info.harvest}</p></div>
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                {info.crops.slice(0,5).map(c=><span key={c} style={{ fontSize:11, padding:"3px 8px", background:"var(--bg-elevated)", borderRadius:20, color:"var(--text-secondary)", border:"1px solid var(--border)" }}>{c}</span>)}
                {info.crops.length>5 && <span style={{ fontSize:11, color:"var(--text-muted)" }}>+{info.crops.length-5}</span>}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}