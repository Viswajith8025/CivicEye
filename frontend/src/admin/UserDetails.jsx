import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/apiClient";
import { AdminLayout } from "../components/layout/AdminLayout";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";

export const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/user/details/${id}`)
      .then((res) => setUser(res.data))
      .catch(() => toast.error("Failed to load user"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <AdminLayout title="User Details"><LoadingSpinner /></AdminLayout>;
  if (!user) return <AdminLayout title="User Details"><p className="text-center text-slate-500">User not found</p></AdminLayout>;

  return (
    <AdminLayout title={user.name} subtitle="User profile details">
      <div className="max-w-lg mx-auto">
        <button onClick={() => navigate(-1)} className="text-sm text-primary font-medium hover:underline mb-6">← Back</button>
        <div className="governance-card p-8 space-y-4 text-sm">
          {[
            ["Email", user.email],
            ["Mobile", user.mobile],
            ["Reports", user.reports || 0],
            ["Points", user.points || 0],
            ["State", user.state || "—"],
            ["Address", user.address || "—"],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-slate-500">{label}</span>
              <span className="font-medium">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};
