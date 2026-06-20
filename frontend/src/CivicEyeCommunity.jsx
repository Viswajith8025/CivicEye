import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Globe, List, Map as MapIcon } from "lucide-react";
import api from "./lib/apiClient";
import { formatDate } from "./lib/utils";
import { extractPaginatedData } from "./lib/pagination";
import { CitizenLayout } from "./components/layout/CitizenLayout";
import { ReportsMap } from "./components/map/ReportMap";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";
import { Pagination } from "./components/ui/Pagination";
import { SeverityBadge, StatusBadge } from "./components/ui/Badge";

export const CivicEyeCommunity = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("feed");
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);

  const { data: feedRes, isLoading: feedLoading } = useQuery({
    queryKey: ["community-feed", filter, page],
    queryFn: () =>
      api.get("/complaint/community", {
        params: { status: filter || undefined, page, limit: 12 },
      }),
    enabled: tab === "feed",
  });

  const { data: mapRes, isLoading: mapLoading } = useQuery({
    queryKey: ["community-map"],
    queryFn: () => api.get("/complaint/map"),
    enabled: tab === "map",
  });

  const { data: feed, pagination } = extractPaginatedData(feedRes);
  const mapData = mapRes?.data || [];
  const loading = tab === "feed" ? feedLoading : mapLoading;

  return (
    <CitizenLayout title="Community" subtitle="See what your neighbors are reporting and what's getting fixed">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            {[
              { id: "feed", icon: List, label: "Feed" },
              { id: "map", icon: MapIcon, label: "Live Map" },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  tab === id ? "bg-white dark:bg-slate-900 shadow-sm text-teal-700" : "text-slate-500"
                }`}
              >
                <Icon size={16} /> {label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {["", "Pending", "In Progress", "Resolved"].map((s) => (
              <button
                key={s || "all"}
                onClick={() => { setFilter(s); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  filter === s ? "border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-900/30" : "border-slate-200 dark:border-slate-700 text-slate-500"
                }`}
              >
                {s || "All"}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading community data..." />
        ) : tab === "map" ? (
          <div className="space-y-4">
            <ReportsMap reports={mapData} height="560px" onMarkerClick={(r) => navigate(`/community/${r._id}`)} />
            <p className="text-xs text-slate-500 text-center flex items-center justify-center gap-1">
              <Globe size={12} /> {mapData.length} reports on map · Click markers for details
            </p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-4">
              {feed.map((r) => (
                <Link key={r._id} to={`/community/${r._id}`} className="governance-card p-5 hover:shadow-lg transition-all group">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-semibold group-hover:text-teal-600 transition-colors">{r.type}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{r.location}</p>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <SeverityBadge severity={r.severity} />
                      <span className="text-xs text-slate-400">by {r.reporter}</span>
                    </div>
                    <div className="text-xs text-slate-400">
                      {r.upvoteCount > 0 && <span className="mr-2">{r.upvoteCount} supports</span>}
                      {formatDate(r.createdAt)}
                    </div>
                  </div>
                </Link>
              ))}
              {feed.length === 0 && (
                <p className="col-span-2 text-center text-slate-500 py-12">No community reports yet. Be the first to file one!</p>
              )}
            </div>
            <div className="governance-card">
              <Pagination pagination={pagination} onPageChange={setPage} />
            </div>
          </>
        )}
      </div>
    </CitizenLayout>
  );
};
