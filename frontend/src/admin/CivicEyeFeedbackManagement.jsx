import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import api from "../lib/apiClient";
import { extractPaginatedData } from "../lib/pagination";
import { AdminLayout } from "../components/layout/AdminLayout";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { EmptyState } from "../components/ui/EmptyState";
import { Pagination } from "../components/ui/Pagination";

export const CivicEyeFeedbackManagement = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-feedback", page],
    queryFn: () => api.get("/feedback/all", { params: { page, limit: 15 } }),
  });

  const { data: feedbacks, pagination } = extractPaginatedData(data);

  const filtered = feedbacks.filter(
    (f) =>
      !search ||
      f.description?.toLowerCase().includes(search.toLowerCase()) ||
      f.userId?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Feedback" subtitle="Review citizen feedback submissions">
      <div className="space-y-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search feedback..." className="input-field pl-10" />
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : filtered.length === 0 ? (
          <EmptyState title="No feedback" description="No feedback submissions found" />
        ) : (
          <div className="governance-card overflow-hidden">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((f) => (
                <div key={f._id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm leading-relaxed">{f.description}</p>
                    <p className="text-xs text-slate-500 mt-2">{f.userId?.name} · {new Date(f.timestamp).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                      f.status === "accepted" ? "bg-emerald-100 text-emerald-700" :
                      f.status === "rejected" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                    }`}>{f.status}</span>
                    <Link to={`/adminfeedbackdetails/${f._id}`} className="text-primary text-sm font-medium hover:underline">Review</Link>
                  </div>
                </div>
              ))}
            </div>
            <Pagination pagination={pagination} onPageChange={setPage} />
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
