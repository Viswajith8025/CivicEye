import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AlertCircle, ArrowRight, CheckCircle2, Clock, FileText, MapPin, Plus, TrendingUp, Zap,
} from "lucide-react";
import api from "./lib/apiClient";
import { formatDate } from "./lib/utils";
import { extractPaginatedData } from "./lib/pagination";
import { CitizenLayout } from "./components/layout/CitizenLayout";
import { TrendChart } from "./components/charts/TrendChart";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";
import { StatusBadge } from "./components/ui/Badge";

export const CivicEyeUserHome = () => {
  const [data, setData] = useState(null);
  const [community, setCommunity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/complaint/dashboard"),
      api.get("/complaint/community", { params: { limit: 4 } }),
    ])
      .then(([dash, comm]) => {
        setData(dash.data);
        setCommunity(extractPaginatedData(comm).data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <CitizenLayout title="Dashboard"><LoadingSpinner message="Loading your dashboard..." /></CitizenLayout>;
  }

  const stats = data?.stats || {};
  const user = data?.user || {};
  const recent = data?.recentReports || [];

  return (
    <CitizenLayout title={`Hey, ${user.name?.split(" ")[0] || "there"} 👋`} subtitle="Here's what's happening in your area">
      <div className="space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 governance-card p-6 bg-gradient-to-br from-teal-600 to-emerald-700 text-white">
            <p className="text-white/80 text-sm mb-1">Spotted something broken?</p>
            <h2 className="text-2xl font-bold mb-3">Report it in under 2 minutes</h2>
            <p className="text-white/70 text-sm mb-5 max-w-md">Snap a photo, drop a pin on the map, and we'll route it to the right department.</p>
            <div className="flex flex-wrap gap-3">
              <Link to="/registercomplaint" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-teal-700 rounded-xl font-semibold text-sm hover:bg-white/90">
                <Plus size={16} /> New Report
              </Link>
              <Link to="/community" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/15 text-white rounded-xl font-semibold text-sm hover:bg-white/25">
                <MapPin size={16} /> See Community Map
              </Link>
            </div>
          </motion.div>

          <div className="governance-card p-6 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="text-amber-500" size={24} />
              <span className="text-3xl font-bold text-slate-900 dark:text-white">{stats.points || 0}</span>
            </div>
            <p className="text-sm text-slate-500">Reward points earned</p>
            <Link to="/rewards" className="text-sm text-teal-600 font-medium mt-3 hover:underline">View rewards & tiers →</Link>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "My Reports", value: stats.total || 0, icon: FileText, color: "text-teal-600" },
            { label: "Pending", value: stats.pending || 0, icon: Clock, color: "text-amber-500" },
            { label: "In Progress", value: stats.inProgress || 0, icon: AlertCircle, color: "text-blue-500" },
            { label: "Resolved", value: stats.resolved || 0, icon: CheckCircle2, color: "text-emerald-500" },
          ].map((s) => (
            <div key={s.label} className="stat-card">
              <s.icon className={`${s.color} mb-2`} size={20} />
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="governance-card p-6">
            <h3 className="font-semibold flex items-center gap-2 mb-4"><TrendingUp size={18} /> Your activity (14 days)</h3>
            <TrendChart data={data?.trends} />
          </div>

          <div className="governance-card overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-semibold">Community reports</h3>
              <Link to="/community" className="text-xs text-teal-600 font-medium hover:underline">See all</Link>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {community.map((r) => (
                <Link key={r._id} to={`/community/${r._id}`} className="flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <div className="w-9 h-9 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center shrink-0">
                    <MapPin size={16} className="text-teal-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{r.type}</p>
                    <p className="text-xs text-slate-500 truncate">{r.location}</p>
                  </div>
                  <StatusBadge status={r.status} />
                </Link>
              ))}
              {community.length === 0 && <p className="p-6 text-sm text-slate-500 text-center">No community reports yet</p>}
            </div>
          </div>
        </div>

        <div className="governance-card overflow-hidden">
          <div className="flex justify-between items-center p-5 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-semibold">Your recent reports</h3>
            <Link to="/complaintlist" className="text-sm text-teal-600 font-medium flex items-center gap-1 hover:underline">
              All reports <ArrowRight size={14} />
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="p-8 text-center text-slate-500 text-sm">No reports yet — <Link to="/registercomplaint" className="text-teal-600 font-medium">file your first one</Link></p>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recent.map((r) => (
                <Link key={r._id} to={`/complaintdetail/${r._id}`} className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{r.type}</p>
                    <p className="text-xs text-slate-500">{formatDate(r.createdAt || r.createdAtLegacy)}</p>
                  </div>
                  <StatusBadge status={r.status} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </CitizenLayout>
  );
};
