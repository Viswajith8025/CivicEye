import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Lock, Shield } from "lucide-react";
import api from "./lib/apiClient";
import { Logo } from "./components/common/Logo";
import { ThemeToggle } from "./components/common/ThemeToggle";

export const CivicEyeLoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/user/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("id", res.data.id);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("role", res.data.role);
      toast.success("Welcome back!");
      navigate(res.data.role === "admin" ? "/overview" : "/userhome");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bgColor dark:bg-slate-950 flex items-center justify-center p-6">
      <Toaster position="top-right" />
      <div className="absolute top-6 right-6"><ThemeToggle /></div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6"><Logo className="h-8 mx-auto dark:brightness-0 dark:invert" /></Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back</h1>
          <p className="text-slate-500 text-sm mt-1">Sign in to your Civic Eye account</p>
        </div>

        <form onSubmit={submit} className="governance-card p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="you@example.com" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium">Password</label>
              <Link to="/forgot-password" className="text-xs text-primary font-medium hover:underline">Forgot password?</Link>
            </div>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field pr-10" placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? <><Loader2 className="animate-spin" size={18} /> Signing in...</> : <><Lock size={18} /> Sign in</>}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-primary font-semibold hover:underline">Create one</Link>
        </p>

        {import.meta.env.VITE_API_URL?.includes("localhost") && (
          <div className="mt-6 p-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <p className="font-semibold">Local demo accounts</p>
            <p>Admin: admin@civiceye.local / Admin@12345</p>
            <p>Citizen: citizen@civiceye.local / Citizen@12345</p>
          </div>
        )}

        <div className="flex items-center justify-center gap-2 mt-8 text-xs text-slate-400">
          <Shield size={12} /> Secured with encrypted authentication
        </div>
      </motion.div>
    </div>
  );
};
