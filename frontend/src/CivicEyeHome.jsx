import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import {
  ArrowRight, Camera, CheckCircle2, MapPin, Shield, Users, Zap,
} from "lucide-react";
import { Logo } from "./components/common/Logo";
import { ThemeToggle } from "./components/common/ThemeToggle";

const ISSUE_TYPES = [
  { emoji: "🕳️", label: "Potholes", count: "2,400+" },
  { emoji: "💡", label: "Streetlights", count: "890+" },
  { emoji: "🗑️", label: "Waste dumping", count: "1,100+" },
  { emoji: "💧", label: "Water leaks", count: "650+" },
  { emoji: "🚗", label: "Traffic issues", count: "1,800+" },
  { emoji: "🌳", label: "Tree hazards", count: "320+" },
];

export const CivicEyeHome = () => {
  const [stats, setStats] = useState({ total: 0, resolved: 0, citizens: 0, resolutionRate: 0 });

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/complaint/public-stats`)
      .then((res) => setStats(res.data))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-bgColor dark:bg-slate-950">
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
        <div className="section-container flex items-center justify-between h-16">
          <Link to="/"><Logo className="h-7 dark:brightness-0 dark:invert" /></Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link to="/about" className="hover:text-teal-600 transition-colors">About</Link>
            <Link to="/login" className="hover:text-teal-600 transition-colors">Sign in</Link>
            <Link to="/signup" className="btn-primary !py-2.5 !px-5 text-sm">Report an Issue</Link>
          </nav>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero */}
      <section className="section-container pt-16 pb-20 md:pt-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <p className="text-teal-600 font-semibold text-sm mb-4">Your city. Your voice. Real fixes.</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
              See a problem?<br />
              <span className="text-teal-600">Report it.</span><br />
              Track it. Fix it.
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed mb-8 max-w-lg">
              Pothole on your street? Streetlight out? Garbage piling up? Snap a photo, pin the location, and watch your city respond.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/signup" className="btn-primary text-base px-8 py-4">
                Start Reporting <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn-secondary text-base px-8 py-4">I have an account</Link>
            </div>
          </motion.div>

          {/* Live stats card */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="governance-card p-8 bg-white dark:bg-slate-900">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-6">Live platform stats</p>
            <div className="grid grid-cols-2 gap-6">
              {[
                { value: stats.total || "—", label: "Reports filed", icon: Camera },
                { value: stats.resolved || "—", label: "Issues resolved", icon: CheckCircle2 },
                { value: stats.citizens || "—", label: "Active citizens", icon: Users },
                { value: stats.resolutionRate ? `${stats.resolutionRate}%` : "—", label: "Resolution rate", icon: Zap },
              ].map((s) => (
                <div key={s.label}>
                  <s.icon className="text-teal-500 mb-2" size={20} />
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{s.value}</p>
                  <p className="text-xs text-slate-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Issue types */}
      <section className="bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 py-16">
        <div className="section-container">
          <h2 className="text-2xl font-bold mb-2">What can you report?</h2>
          <p className="text-slate-500 mb-10">20+ issue categories across your city</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {ISSUE_TYPES.map((t) => (
              <div key={t.label} className="governance-card p-4 text-center hover:shadow-md transition-shadow">
                <span className="text-3xl block mb-2">{t.emoji}</span>
                <p className="font-semibold text-sm">{t.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works - real steps */}
      <section className="section-container py-20">
        <h2 className="text-2xl font-bold text-center mb-12">Four steps to a better neighborhood</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            { step: "01", title: "Snap & pin", desc: "Take a photo, drop a pin on the interactive map, pick severity.", icon: Camera },
            { step: "02", title: "We route it", desc: "Your report goes to the right municipal department automatically.", icon: MapPin },
            { step: "03", title: "Track live", desc: "Get notifications as status changes. Comment and get community support.", icon: Zap },
            { step: "04", title: "Earn rewards", desc: "Points, badges, and leaderboard ranks for active citizens.", icon: Shield },
          ].map((item) => (
            <div key={item.step} className="relative">
              <span className="text-5xl font-black text-teal-100 dark:text-teal-900/40 absolute -top-4 -left-1">{item.step}</span>
              <div className="relative pt-8">
                <item.icon className="text-teal-600 mb-3" size={24} />
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-teal-700 text-white py-20">
        <div className="section-container text-center">
          <h2 className="text-3xl font-bold mb-4">Your street won't fix itself</h2>
          <p className="text-teal-100 mb-8 max-w-md mx-auto">Join {stats.citizens || "thousands of"} citizens already making their cities better.</p>
          <Link to="/signup" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-teal-700 rounded-xl font-bold hover:bg-teal-50 transition-all">
            Create free account <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-200 dark:border-slate-800 py-10">
        <div className="section-container flex flex-col md:flex-row justify-between items-center gap-4">
          <Logo className="h-5 opacity-60 dark:brightness-0 dark:invert" />
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} Civic Eye</p>
          <div className="flex gap-6 text-sm text-slate-500">
            <Link to="/about" className="hover:text-teal-600">About</Link>
            <Link to="/login" className="hover:text-teal-600">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
