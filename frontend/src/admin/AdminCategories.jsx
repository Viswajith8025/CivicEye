import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Tag } from "lucide-react";
import toast from "react-hot-toast";
import api from "../lib/apiClient";
import { AdminLayout } from "../components/layout/AdminLayout";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { EmptyState } from "../components/ui/EmptyState";

export const AdminCategories = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: "", group: "" });

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: () => api.get("/category/admin").then((r) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (payload) => api.post("/category", payload),
    onSuccess: () => {
      toast.success("Category added");
      setForm({ name: "", group: "" });
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed"),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }) => api.put(`/category/${id}`, { isActive }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-categories"] }),
  });

  const grouped = categories.reduce((acc, cat) => {
    if (!acc[cat.group]) acc[cat.group] = [];
    acc[cat.group].push(cat);
    return acc;
  }, {});

  return (
    <AdminLayout title="Report Categories" subtitle="Manage issue types citizens can report">
      <div className="grid lg:grid-cols-3 gap-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate(form);
          }}
          className="governance-card p-6 space-y-4 h-fit"
        >
          <h3 className="font-semibold flex items-center gap-2"><Plus size={18} /> Add category</h3>
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Category name (e.g. Pothole)"
            className="input-field"
            required
          />
          <input
            value={form.group}
            onChange={(e) => setForm((f) => ({ ...f, group: e.target.value }))}
            placeholder="Group (e.g. Road & Infrastructure)"
            className="input-field"
            required
          />
          <button type="submit" disabled={createMutation.isPending} className="btn-primary w-full">
            {createMutation.isPending ? "Saving..." : "Add category"}
          </button>
        </form>

        <div className="lg:col-span-2 space-y-4">
          {isLoading ? (
            <LoadingSpinner />
          ) : categories.length === 0 ? (
            <EmptyState title="No categories" description="Categories will seed on first server start" />
          ) : (
            Object.entries(grouped).map(([group, items]) => (
              <div key={group} className="governance-card p-6">
                <h3 className="font-semibold text-sm text-slate-500 mb-3 flex items-center gap-2">
                  <Tag size={14} /> {group}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((cat) => (
                    <button
                      key={cat._id}
                      type="button"
                      onClick={() => toggleMutation.mutate({ id: cat._id, isActive: !cat.isActive })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        cat.isActive
                          ? "border-teal-300 bg-teal-50 text-teal-800"
                          : "border-slate-200 bg-slate-100 text-slate-400 line-through"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 mt-3">Click to toggle active/inactive</p>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
