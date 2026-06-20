import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Shield, Users } from "lucide-react";
import { Logo } from "./components/common/Logo";
import { ThemeToggle } from "./components/common/ThemeToggle";

export const CivicEyeAboutPage = () => (
  <div className="min-h-screen bg-bgColor dark:bg-slate-950">
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
      <div className="section-container flex items-center justify-between h-16">
        <Link to="/"><Logo className="h-7 dark:brightness-0 dark:invert" /></Link>
        <div className="flex items-center gap-4">
          <Link to="/" className="text-sm text-slate-600 dark:text-slate-300 hover:text-primary">Home</Link>
          <ThemeToggle />
        </div>
      </div>
    </header>

    <section className="section-container py-20 md:py-28">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
        <h1 className="text-4xl font-bold mb-6">About Civic Eye</h1>
        <p className="text-lg text-slate-500 leading-relaxed mb-8">
          Civic Eye is a citizen reporting platform that empowers communities to report road and civic issues — potholes, damaged roads, waste dumping, water leakage, streetlight failures, and traffic violations — with transparency and accountability.
        </p>

        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Users, title: "For Citizens", desc: "Report issues easily with photos, GPS, and track resolution." },
            { icon: Shield, title: "For Authorities", desc: "Manage, assign, and resolve reports with analytics." },
            { icon: Heart, title: "For Communities", desc: "Earn rewards and climb leaderboards for civic engagement." },
          ].map((item) => (
            <div key={item.title} className="governance-card p-6">
              <item.icon className="text-primary mb-3" size={24} />
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>

        <Link to="/signup" className="btn-primary">
          Join Civic Eye <ArrowRight size={18} />
        </Link>
      </motion.div>
    </section>
  </div>
);
