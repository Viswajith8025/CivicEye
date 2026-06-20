import { useEffect, useState } from "react";
import { Award, Gift, Star, Target, Zap } from "lucide-react";
import api from "./lib/apiClient";
import { CitizenLayout } from "./components/layout/CitizenLayout";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";

const TIERS = [
  { name: "Newcomer", min: 0, icon: Star, color: "text-slate-500" },
  { name: "Helper", min: 50, icon: Zap, color: "text-blue-500" },
  { name: "Advocate", min: 150, icon: Target, color: "text-teal-500" },
  { name: "Champion", min: 300, icon: Award, color: "text-amber-500" },
  { name: "Legend", min: 500, icon: Gift, color: "text-purple-500" },
];

const ACHIEVEMENTS = [
  { id: "first_report", title: "First Reporter", desc: "Submit your first civic report", pts: 10 },
  { id: "active_citizen", title: "Active Citizen", desc: "Submit 5 reports", pts: 50 },
  { id: "civic_champion", title: "Civic Champion", desc: "Submit 10 reports", pts: 100 },
  { id: "century", title: "Century Club", desc: "Earn 100+ points", pts: 100 },
];

export const CivicEyeRewards = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/complaint/dashboard").then((res) => setUser(res.data.user)).finally(() => setLoading(false));
  }, []);

  if (loading) return <CitizenLayout title="Rewards"><LoadingSpinner /></CitizenLayout>;

  const points = user?.points || 0;
  const currentTier = [...TIERS].reverse().find((t) => points >= t.min) || TIERS[0];
  const nextTier = TIERS.find((t) => t.min > points);
  const progress = nextTier ? ((points - currentTier.min) / (nextTier.min - currentTier.min)) * 100 : 100;

  return (
    <CitizenLayout title="Rewards & Achievements" subtitle="Earn points for making your community better">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="governance-card p-8 bg-gradient-to-br from-teal-600 to-emerald-700 text-white">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
              <currentTier.icon size={32} />
            </div>
            <div>
              <p className="text-white/70 text-sm">Your rank</p>
              <h2 className="text-3xl font-bold">{currentTier.name}</h2>
            </div>
          </div>
          <div className="flex items-end justify-between mb-2">
            <span className="text-4xl font-bold">{points}</span>
            <span className="text-white/70 text-sm">points</span>
          </div>
          {nextTier && (
            <>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs text-white/70 mt-2">{nextTier.min - points} pts to {nextTier.name}</p>
            </>
          )}
        </div>

        <div className="governance-card p-6">
          <h3 className="font-semibold mb-4">How to earn points</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { action: "Submit a report", pts: "+10" },
              { action: "Report gets resolved", pts: "+25" },
              { action: "Receive community support", pts: "+2" },
              { action: "First report bonus", pts: "+10" },
            ].map((item) => (
              <div key={item.action} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-sm">
                <span>{item.action}</span>
                <span className="font-bold text-teal-600">{item.pts}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="governance-card p-6">
          <h3 className="font-semibold mb-4">Achievements</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {ACHIEVEMENTS.map((a) => {
              const unlocked = user?.achievements?.some((x) => x.id === a.id);
              return (
                <div key={a.id} className={`p-4 rounded-xl border ${unlocked ? "border-amber-300 bg-amber-50 dark:bg-amber-900/20" : "border-slate-200 dark:border-slate-700 opacity-60"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Award size={16} className={unlocked ? "text-amber-500" : "text-slate-400"} />
                    <span className="font-semibold text-sm">{a.title}</span>
                  </div>
                  <p className="text-xs text-slate-500">{a.desc}</p>
                  {unlocked && <p className="text-xs text-amber-600 font-medium mt-1">Unlocked!</p>}
                </div>
              );
            })}
          </div>
        </div>

        <div className="governance-card p-6">
          <h3 className="font-semibold mb-4">Rank tiers</h3>
          <div className="space-y-2">
            {TIERS.map((t) => (
              <div key={t.name} className={`flex items-center gap-3 p-3 rounded-xl ${currentTier.name === t.name ? "bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800" : ""}`}>
                <t.icon size={20} className={t.color} />
                <span className="font-medium text-sm flex-1">{t.name}</span>
                <span className="text-xs text-slate-500">{t.min}+ pts</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CitizenLayout>
  );
};
