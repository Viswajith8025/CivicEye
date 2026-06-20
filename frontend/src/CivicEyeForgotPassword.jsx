import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import api from "./lib/apiClient";
import { Logo } from "./components/common/Logo";
import { ThemeToggle } from "./components/common/ThemeToggle";

export const CivicEyeForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/user/forgot-password", { email });
      setSent(true);
      toast.success("Check your email for reset instructions");
    } catch (err) {
      toast.error(err.response?.data?.message || "Request failed");
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
          <h1 className="text-2xl font-bold mt-6">Forgot password?</h1>
          <p className="text-slate-500 text-sm mt-1">We&apos;ll email you a reset link</p>
        </div>
        {sent ? (
          <div className="governance-card p-8 text-center text-sm text-slate-600">
            <p>If <strong>{email}</strong> is registered, you&apos;ll receive a link within a few minutes.</p>
            <Link to="/login" className="text-primary font-medium mt-4 inline-block hover:underline">Back to sign in</Link>
          </div>
        ) : (
          <form onSubmit={submit} className="governance-card p-8 space-y-5">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="you@example.com" />
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? <Loader2 className="animate-spin mx-auto" size={18} /> : "Send reset link"}
            </button>
            <Link to="/login" className="block text-center text-sm text-primary hover:underline">Back to sign in</Link>
          </form>
        )}
      </div>
    </div>
  );
};
