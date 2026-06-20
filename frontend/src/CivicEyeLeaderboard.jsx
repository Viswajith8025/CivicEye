import { useEffect, useState } from "react";
import { Medal, Trophy } from "lucide-react";
import api from "./lib/apiClient";
import { CitizenLayout } from "./components/layout/CitizenLayout";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";

const rankColors = ["text-amber-500", "text-slate-400", "text-amber-700"];

export const CivicEyeLeaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/user/leaderboard")
      .then((res) => setLeaders(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <CitizenLayout title="Leaderboard" subtitle="Top civic reporters in your community">
      {loading ? (
        <LoadingSpinner message="Loading rankings..." />
      ) : (
        <div className="max-w-2xl mx-auto">
          <div className="governance-card overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <Trophy className="text-amber-500" size={24} />
              <div>
                <h3 className="font-semibold">Community Champions</h3>
                <p className="text-xs text-slate-500">Ranked by reward points</p>
              </div>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {leaders.map((user, i) => (
                <div key={user._id} className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className={`w-8 text-center font-bold text-lg ${rankColors[i] || "text-slate-400"}`}>
                    {i < 3 ? <Medal size={22} className="mx-auto" /> : i + 1}
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary">
                    {user.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.reports} reports</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{user.points}</p>
                    <p className="text-[10px] text-slate-400">points</p>
                  </div>
                </div>
              ))}
              {leaders.length === 0 && (
                <p className="p-8 text-center text-slate-500 text-sm">No rankings yet. Be the first to report!</p>
              )}
            </div>
          </div>
        </div>
      )}
    </CitizenLayout>
  );
};
