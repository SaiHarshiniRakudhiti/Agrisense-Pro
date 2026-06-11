import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sprout, BarChart2, FlaskConical, TrendingUp, LayoutDashboard, Menu, X, LogOut, User } from "lucide-react";
import { useAuth } from "../../store/authStore";
import toast from "react-hot-toast";

const NAV = [
  { path:"/dashboard",   label:"Dashboard",       icon:LayoutDashboard },
  { path:"/crop",        label:"Crop Advisor",     icon:Sprout },
  { path:"/yield",       label:"Yield Predictor",  icon:BarChart2 },
  { path:"/fertilizer",  label:"Fertilizer AI",    icon:FlaskConical },
  { path:"/market",      label:"Market Intel",     icon:TrendingUp },
];

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);
  const { user, logout }        = useAuth();
  const navigate                = useNavigate();
  const { pathname }            = useLocation();

  const handleLogout = () => { logout(); toast.success("Logged out"); navigate("/login"); };

  return (
    <aside style={{
      width: expanded ? 240 : 68, transition:"width 0.25s cubic-bezier(.4,0,.2,1)",
      background:"var(--bg-surface)", borderRight:"1px solid var(--border)",
      display:"flex", flexDirection:"column", position:"fixed", top:0, left:0, height:"100vh", zIndex:100, overflow:"hidden",
    }}>
      {/* Logo */}
      <div style={{ padding:"20px 14px", display:"flex", alignItems:"center", gap:12, borderBottom:"1px solid var(--border)", minHeight:72 }}>
        <div style={{ width:40, height:40, borderRadius:10, background:"linear-gradient(135deg,#22c55e,#16a34a)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 4px 12px rgba(34,197,94,0.35)" }}>
          <Sprout size={22} color="#fff" />
        </div>
        {expanded && <div style={{ overflow:"hidden" }}>
          <div style={{ fontWeight:800, fontSize:16, color:"var(--text-primary)", whiteSpace:"nowrap" }}>AgriSense</div>
          <div style={{ fontSize:11, color:"var(--text-muted)", whiteSpace:"nowrap" }}>Crop Intelligence AI</div>
        </div>}
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:"10px 8px", overflowY:"auto" }}>
        {NAV.map(({ path, label, icon: Icon }) => {
          const active = pathname === path;
          return (
            <button key={path} onClick={() => navigate(path)} style={{
              width:"100%", display:"flex", alignItems:"center", gap:12,
              padding:"10px 12px", borderRadius:10, border:"none", cursor:"pointer", marginBottom:2,
              background: active ? "linear-gradient(135deg,rgba(34,197,94,0.15),rgba(22,163,74,0.08))" : "transparent",
              color: active ? "var(--green-400)" : "var(--text-muted)",
              borderLeft: `3px solid ${active ? "var(--green-500)" : "transparent"}`,
              transition:"all 0.15s",
            }}>
              <Icon size={20} style={{ flexShrink:0 }} />
              {expanded && <span style={{ fontSize:14, fontWeight: active ? 600 : 400, whiteSpace:"nowrap" }}>{label}</span>}
            </button>
          );
        })}
      </nav>

      {/* User */}
      {expanded && user && (
        <div style={{ padding:"12px 14px", borderTop:"1px solid var(--border)", background:"var(--bg-elevated)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:"var(--green-600)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <User size={16} color="#fff" />
            </div>
            <div style={{ overflow:"hidden" }}>
              <div style={{ fontSize:13, fontWeight:600, color:"var(--text-primary)", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", maxWidth:140 }}>{user.full_name}</div>
              <div style={{ fontSize:11, color:"var(--text-muted)", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", maxWidth:140 }}>{user.farm_name || "AgriSense User"}</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{ width:"100%", display:"flex", alignItems:"center", gap:8, padding:"8px 10px", borderRadius:8, border:"1px solid var(--border)", background:"transparent", color:"var(--text-muted)", cursor:"pointer", fontSize:13 }}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      )}

      {/* Toggle */}
      <button onClick={() => setExpanded(!expanded)} style={{ margin:"12px 14px", padding:"10px", borderRadius:8, border:"1px solid var(--border)", background:"transparent", color:"var(--text-muted)", cursor:"pointer", display:"flex", justifyContent:"center", transition:"all 0.15s" }}>
        {expanded ? <X size={16}/> : <Menu size={16}/>}
      </button>
    </aside>
  );
}