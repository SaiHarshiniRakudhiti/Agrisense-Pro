import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sprout, Mail, Lock, User, MapPin, Tractor } from "lucide-react";
import { authAPI } from "../services/api";
import { useAuth } from "../store/authStore";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import toast from "react-hot-toast";

export default function Login() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ email:"", password:"", full_name:"", farm_name:"", location:"" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const set = (k,v) => setForm(f => ({...f,[k]:v}));

  const validate = () => {
    const e = {};
    if (!form.email)    e.email    = "Email is required";
    if (!form.password || form.password.length < 8) e.password = "Min 8 characters";
    if (mode === "register" && !form.full_name) e.full_name = "Name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const fn   = mode === "login" ? authAPI.login : authAPI.register;
      const body = mode === "login"
        ? { email: form.email, password: form.password }
        : { email: form.email, password: form.password, full_name: form.full_name, farm_name: form.farm_name, location: form.location };
      const r    = await fn(body);
      login(r.data.access_token, r.data.user);
      toast.success(mode === "login" ? "Welcome back!" : "Account created!");
      navigate("/dashboard");
    } catch(e) {
      toast.error(e.response?.data?.error?.message || "Something went wrong");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"var(--bg-base)", padding:24 }}>
      <div style={{ width:"100%", maxWidth:440 }}>
        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <div style={{ width:64, height:64, borderRadius:16, background:"linear-gradient(135deg,#22c55e,#16a34a)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", boxShadow:"0 8px 24px rgba(34,197,94,0.35)" }}>
            <Sprout size={32} color="#fff" />
          </div>
          <h1 style={{ fontSize:28, fontWeight:800, color:"var(--text-primary)" }}>AgriSense</h1>
          <p style={{ color:"var(--text-muted)", fontSize:14, marginTop:4 }}>AI-powered Crop Intelligence Platform</p>
        </div>

        {/* Card */}
        <div style={{ background:"var(--bg-surface)", border:"1px solid var(--border)", borderRadius:"var(--radius-xl)", padding:32 }}>
          {/* Tabs */}
          <div style={{ display:"flex", background:"var(--bg-elevated)", borderRadius:"var(--radius-md)", padding:4, marginBottom:28 }}>
            {["login","register"].map(m => (
              <button key={m} onClick={()=>{setMode(m);setErrors({});}} style={{
                flex:1, padding:"9px 0", borderRadius:8, border:"none", cursor:"pointer", fontSize:14, fontWeight:600, fontFamily:"Inter,sans-serif",
                background: mode===m ? "linear-gradient(135deg,#22c55e,#16a34a)" : "transparent",
                color: mode===m ? "#fff" : "var(--text-muted)", transition:"all 0.2s",
              }}>{m === "login" ? "Sign In" : "Register"}</button>
            ))}
          </div>

          {mode === "register" && (
            <>
              <Input label="Full Name" placeholder="Harsha Vardhan" value={form.full_name} onChange={e=>set("full_name",e.target.value)} prefix={<User size={14}/>} error={errors.full_name} />
              <Input label="Farm Name" placeholder="Vardhan Farms" value={form.farm_name} onChange={e=>set("farm_name",e.target.value)} prefix={<Tractor size={14}/>} />
              <Input label="Location" placeholder="Visakhapatnam, AP" value={form.location} onChange={e=>set("location",e.target.value)} prefix={<MapPin size={14}/>} />
            </>
          )}

          <Input label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={e=>set("email",e.target.value)} prefix={<Mail size={14}/>} error={errors.email} />
          <Input label="Password" type="password" placeholder="Min. 8 characters" value={form.password} onChange={e=>set("password",e.target.value)} prefix={<Lock size={14}/>} error={errors.password} />

          <Button fullWidth size="lg" loading={loading} onClick={submit} style={{ marginTop:8 }}>
            {mode === "login" ? "Sign In" : "Create Account"}
          </Button>

          <p style={{ textAlign:"center", color:"var(--text-muted)", fontSize:13, marginTop:20 }}>
            {mode === "login" ? "New to AgriSense? " : "Already have an account? "}
            <button onClick={()=>setMode(mode==="login"?"register":"login")} style={{ background:"none", border:"none", color:"var(--green-400)", cursor:"pointer", fontWeight:600, fontSize:13 }}>
              {mode === "login" ? "Register" : "Sign In"}
            </button>
          </p>
        </div>

        <p style={{ textAlign:"center", color:"var(--text-muted)", fontSize:12, marginTop:20 }}>
          Built for Optficial Labs — AI for Agriculture 🌾
        </p>
      </div>
    </div>
  );
}