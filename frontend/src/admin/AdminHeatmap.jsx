import { useEffect, useState } from "react";
import api from "../lib/apiClient";
import { AdminLayout } from "../components/layout/AdminLayout";
import { ReportsMap } from "../components/map/ReportMap";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { SeverityBadge, StatusBadge } from "../components/ui/Badge";

export const AdminHeatmap = () => {
  const [reports, setReports] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");

  useEffect(() => {
    api.get("/complaint/heatmap")
      .then((res) => setReports(res.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = reports.filter((r) => {
    if (statusFilter && r.status !== statusFilter) return false;
    if (severityFilter && r.severity !== severityFilter) return false;
    return true;
  });

  const counts = {
    total: filtered.length,
    critical: filtered.filter((r) => r.severity === "Critical").length,
    pending: filtered.filter((r) => r.status === "Pending").length,
  };

  return (
    <AdminLayout title="Issue Heatmap" subtitle="Geographic view of all reported civic issues">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ReportsMap reports={filtered} height="600px" onMarkerClick={setSelected} />
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "On map", value: counts.total },
                { label: "Critical", value: counts.critical },
                { label: "Pending", value: counts.pending },
              ].map((s) => (
                <div key={s.label} className="stat-card !p-4 text-center">
                  <p className="text-xl font-bold">{s.value}</p>
                  <p className="text-[10px] text-slate-500">{s.label}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-2">Status</p>
              <div className="flex flex-wrap gap-2">
                {["", "Pending", "In Progress", "Resolved"].map((f) => (
                  <button
                    key={f || "all-status"}
                    type="button"
                    onClick={() => setStatusFilter(f)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                      statusFilter === f ? "border-teal-500 bg-teal-50 text-teal-700" : "border-slate-200 text-slate-500"
                    }`}
                  >
                    {f || "All"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-2">Severity</p>
              <div className="flex flex-wrap gap-2">
                {["", "Low", "Medium", "High", "Critical"].map((f) => (
                  <button
                    key={f || "all-severity"}
                    type="button"
                    onClick={() => setSeverityFilter(f)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                      severityFilter === f ? "border-red-400 bg-red-50 text-red-700" : "border-slate-200 text-slate-500"
                    }`}
                  >
                    {f || "All"}
                  </button>
                ))}
              </div>
            </div>
            {selected ? (
              <div className="governance-card p-4">
                <h4 className="font-semibold">{selected.type}</h4>
                <p className="text-xs text-slate-500 mt-1">{selected.location}</p>
                <div className="flex gap-2 mt-3">
                  <StatusBadge status={selected.status} />
                  <SeverityBadge severity={selected.severity} />
                </div>
                <a href={`/admincomplaintdetail/${selected._id}`} className="text-sm text-teal-600 font-medium mt-3 inline-block hover:underline">
                  Manage report →
                </a>
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center py-8">Click a marker to see details</p>
            )}
            <div className="governance-card p-4">
              <p className="text-xs font-semibold text-slate-500 mb-2">Legend</p>
              {[
                { color: "#64748b", label: "Low" },
                { color: "#f59e0b", label: "Medium" },
                { color: "#f97316", label: "High" },
                { color: "#ef4444", label: "Critical" },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-2 text-xs mb-1">
                  <span className="w-3 h-3 rounded-full" style={{ background: l.color }} />
                  {l.label} severity
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
