import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../lib/apiClient";
import { extractPaginatedData } from "../lib/pagination";
import { AdminLayout } from "../components/layout/AdminLayout";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { EmptyState } from "../components/ui/EmptyState";
import { Pagination } from "../components/ui/Pagination";

export const CivicEyeUserManagement = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", page],
    queryFn: () => api.get("/user/allusers", { params: { page, limit: 20 } }),
  });

  const { data: users, pagination } = extractPaginatedData(data);
  const activeUsers = users.filter((u) => !u.deletestate);

  const handleDelete = async (id) => {
    if (!window.confirm("Deactivate this user?")) return;
    try {
      await api.put(`/user/deleted/${id}`);
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    }
  };

  return (
    <AdminLayout title="User Management" subtitle="Manage registered citizens">
      {isLoading ? (
        <LoadingSpinner />
      ) : activeUsers.length === 0 ? (
        <EmptyState title="No users" description="No active users found" />
      ) : (
        <div className="governance-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-left">
                <th className="px-6 py-4 font-semibold text-slate-500">Name</th>
                <th className="px-6 py-4 font-semibold text-slate-500">Email</th>
                <th className="px-6 py-4 font-semibold text-slate-500">Reports</th>
                <th className="px-6 py-4 font-semibold text-slate-500">Points</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {activeUsers.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="px-6 py-4 font-medium">{u.name}</td>
                  <td className="px-6 py-4 text-slate-500">{u.email}</td>
                  <td className="px-6 py-4">{u.reports || 0}</td>
                  <td className="px-6 py-4 text-primary font-semibold">{u.points || 0}</td>
                  <td className="px-6 py-4 flex gap-3">
                    <Link to={`/user/details/${u._id}`} className="text-primary text-sm font-medium hover:underline">View</Link>
                    <button onClick={() => handleDelete(u._id)} className="text-red-500 text-sm font-medium hover:underline">Deactivate</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination pagination={pagination} onPageChange={setPage} />
        </div>
      )}
    </AdminLayout>
  );
};
