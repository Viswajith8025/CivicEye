import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Download, TrendingUp } from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import api from "../lib/apiClient";
import { formatDate } from "../lib/utils";
import { extractPaginatedData } from "../lib/pagination";
import { AdminLayout } from "../components/layout/AdminLayout";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { StatusBadge } from "../components/ui/Badge";

const COLORS = ["#F59E0B", "#3B82F6", "#10B981", "#EF4444"];

export const CivicEyeOverview = () => {
  const { data: statsRes, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => api.get("/complaint/stats").then((r) => r.data.stats),
  });

  const { data: listRes, isLoading: listLoading } = useQuery({
    queryKey: ["admin-recent-complaints"],
    queryFn: () => api.get("/complaint/alllist", { params: { page: 1, limit: 5 } }),
  });

  const { data: recent } = extractPaginatedData(listRes);
  const loading = statsLoading || listLoading;
  const stats = statsRes;

  const handleExport = async () => {
    const res = await api.get("/complaint/export", { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = "civiceye-reports.csv";
    a.click();
  };

  if (loading) {
    return <AdminLayout title="Overview"><LoadingSpinner /></AdminLayout>;
  }

  const pieData = Object.entries(stats?.statusCounts || {}).map(([name, value]) => ({ name, value }));
  const barData = Object.entries(stats?.categoryCounts || {}).slice(0, 6).map(([name, value]) => ({ name: name.slice(0, 15), value }));
  const sla = stats?.sla || {};

  return (
    <AdminLayout
      title="Analytics Dashboard"
      subtitle="Real-time overview of civic reports"
      actions={
        <button onClick={handleExport} className="btn-secondary !py-2 !px-4 text-xs">
          <Download size={14} /> Export CSV
        </button>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Reports", value: stats?.totalComplaints || 0 },
            { label: "Pending", value: stats?.statusCounts?.Pending || 0 },
            { label: "In Progress", value: stats?.statusCounts?.["In Progress"] || 0 },
            { label: "Resolved", value: stats?.statusCounts?.Resolved || 0 },
          ].map((s) => (
            <div key={s.label} className="stat-card">
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-slate-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Avg resolution time", value: `${sla.avgResolutionHours || 0}h` },
            { label: "Resolved (SLA tracked)", value: sla.resolvedWithSla || 0 },
            { label: "Awaiting citizen confirm", value: sla.pendingCitizenConfirmation || 0 },
          ].map((s) => (
            <div key={s.label} className="stat-card border-l-4 border-l-teal-500">
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-slate-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="governance-card p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><TrendingUp size={18} /> Status Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="governance-card p-6">
            <h3 className="font-semibold mb-4">Top Categories</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#4338CA" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="governance-card overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h3 className="font-semibold">Recent Reports</h3>
            <Link to="/complaintmanagement" className="text-sm text-primary font-medium hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recent.map((r) => (
              <Link key={r._id} to={`/admincomplaintdetail/${r._id}`} className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{r.type}</p>
                  <p className="text-xs text-slate-500">{r.userId?.name} · {formatDate(r.createdAt || r.createdAtLegacy)}</p>
                </div>
                <StatusBadge status={r.status} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
