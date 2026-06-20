import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, CheckCheck } from "lucide-react";
import api from "./lib/apiClient";
import { formatDate } from "./lib/utils";
import { CitizenLayout } from "./components/layout/CitizenLayout";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";
import { EmptyState } from "./components/ui/EmptyState";

const typeIcons = {
  status: "📋",
  reward: "🏆",
  system: "🔔",
  assignment: "👤",
};

export const CivicEyeNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api.get("/notifications").then((res) => setNotifications(res.data.notifications || [])).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const markAll = async () => {
    await api.put("/notifications/read-all");
    setNotifications((n) => n.map((x) => ({ ...x, read: true })));
  };

  const markOne = async (id) => {
    await api.put(`/notifications/read/${id}`);
    setNotifications((n) => n.map((x) => (x._id === id ? { ...x, read: true } : x)));
  };

  return (
    <CitizenLayout title="Notifications" subtitle="Stay updated on your reports and rewards">
      <div className="max-w-2xl mx-auto">
        {notifications.some((n) => !n.read) && (
          <button onClick={markAll} className="flex items-center gap-2 text-sm text-teal-600 font-medium mb-4 hover:underline">
            <CheckCheck size={16} /> Mark all as read
          </button>
        )}
        {loading ? (
          <LoadingSpinner />
        ) : notifications.length === 0 ? (
          <EmptyState title="All caught up" description="You'll see updates here when your reports change status or earn rewards." />
        ) : (
          <div className="space-y-2">
            {notifications.map((n) => (
              <div
                key={n._id}
                onClick={() => !n.read && markOne(n._id)}
                className={`governance-card p-4 flex gap-4 cursor-pointer transition-all ${!n.read ? "border-teal-200 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-900/10" : ""}`}
              >
                <span className="text-2xl">{typeIcons[n.type] || "🔔"}</span>
                <div className="flex-1">
                  <div className="flex justify-between gap-2">
                    <p className="font-semibold text-sm">{n.title}</p>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0 mt-1.5" />}
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5">{n.message}</p>
                  <p className="text-xs text-slate-400 mt-2">{formatDate(n.createdAt)}</p>
                  {n.link && (
                    <Link to={n.link} className="text-xs text-teal-600 font-medium mt-2 inline-block hover:underline">
                      View details →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </CitizenLayout>
  );
};
