import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, UserPlus } from "lucide-react";
import api from "./lib/apiClient";
import { Logo } from "./components/common/Logo";
import { ThemeToggle } from "./components/common/ThemeToggle";

export const CivicEyeSignUp = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", mobile: "", age: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/user/register", form);
      toast.success("Account created! Please sign in.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
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
          <Link to="/"><Logo className="h-8 mx-auto mb-6 dark:brightness-0 dark:invert" /></Link>
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-slate-500 text-sm mt-1">Join thousands of citizens making a difference</p>
        </div>

        <form onSubmit={submit} className="governance-card p-8 space-y-4">
          {[
            { name: "name", label: "Full Name", type: "text" },
            { name: "email", label: "Email", type: "email" },
            { name: "mobile", label: "Mobile", type: "tel" },
            { name: "age", label: "Age", type: "number" },
          ].map((f) => (
            <div key={f.name}>
              <label className="block text-sm font-medium mb-1.5">{f.label}</label>
              <input type={f.type} name={f.name} required value={form[f.name]} onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })} className="input-field" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium mb-1.5">Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} name="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field pr-10" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            {loading ? <><Loader2 className="animate-spin" size={18} /> Creating...</> : <><UserPlus size={18} /> Create Account</>}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};
