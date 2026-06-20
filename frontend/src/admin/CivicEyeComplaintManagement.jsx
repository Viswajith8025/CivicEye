import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import api from "../lib/apiClient";
import { formatDate, truncate } from "../lib/utils";
import { extractPaginatedData } from "../lib/pagination";
import { STATUS_OPTIONS } from "../constants/categories";
import { AdminLayout } from "../components/layout/AdminLayout";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { EmptyState } from "../components/ui/EmptyState";
import { Pagination } from "../components/ui/Pagination";
import { SeverityBadge, StatusBadge } from "../components/ui/Badge";

export const CivicEyeComplaintManagement = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-complaints", { search, status, page }],
    queryFn: () =>
      api.get("/complaint/alllist", {
        params: { search: search || undefined, status: status || undefined, page, limit: 20 },
      }),
  });

  const { data: complaints, pagination } = extractPaginatedData(data);

  return (
    <AdminLayout title="Report Management" subtitle="Review, assign, and resolve civic issues">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search reports..."
              className="input-field pl-10"
            />
          </div>
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="input-field w-auto">
            <option value="">All Status</option>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : complaints.length === 0 ? (
          <EmptyState title="No reports found" description="Try adjusting your search or filters" />
        ) : (
          <div className="governance-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-left">
                    <th className="px-6 py-4 font-semibold text-slate-500">Issue</th>
                    <th className="px-6 py-4 font-semibold text-slate-500">Reporter</th>
                    <th className="px-6 py-4 font-semibold text-slate-500">Severity</th>
                    <th className="px-6 py-4 font-semibold text-slate-500">Status</th>
                    <th className="px-6 py-4 font-semibold text-slate-500">Date</th>
                    <th className="px-6 py-4" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {complaints.map((c) => (
                    <tr key={c._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                      <td className="px-6 py-4">
                        <p className="font-medium">{c.type}</p>
                        <p className="text-xs text-slate-500">{truncate(c.location, 30)}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{c.userId?.name || "—"}</td>
                      <td className="px-6 py-4"><SeverityBadge severity={c.severity || "Medium"} /></td>
                      <td className="px-6 py-4"><StatusBadge status={c.status} /></td>
                      <td className="px-6 py-4 text-xs text-slate-500">{formatDate(c.createdAt || c.createdAtLegacy)}</td>
                      <td className="px-6 py-4">
                        <Link to={`/admincomplaintdetail/${c._id}`} className="text-primary font-medium text-sm hover:underline">Manage</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination pagination={pagination} onPageChange={setPage} />
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
