import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import api from "./lib/apiClient";
import { Logo } from "./components/common/Logo";
import { ThemeToggle } from "./components/common/ThemeToggle";

export const CivicEyeResetPassword = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token") || "";
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Invalid reset link");
      return;
    }
    setLoading(true);
    try {
      await api.post("/user/reset-password", { token, password });
      toast.success("Password updated!");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bgColor dark:bg-slate-950 flex items-center justify-center p-6">
      <Toaster position="top-right" />
      <div className="absolute top-6 right-6"><ThemeToggle /></div>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/"><Logo className="h-8 mx-auto dark:brightness-0 dark:invert" /></Link>
          <h1 className="text-2xl font-bold mt-6">Set new password</h1>
        </div>
        <form onSubmit={submit} className="governance-card p-8 space-y-5">
          <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" placeholder="New password (6+ characters)" />
          <button type="submit" disabled={loading || !token} className="btn-primary w-full">
            {loading ? <Loader2 className="animate-spin mx-auto" size={18} /> : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
};
