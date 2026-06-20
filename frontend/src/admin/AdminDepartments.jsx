import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, Plus } from "lucide-react";
import toast from "react-hot-toast";
import api from "../lib/apiClient";
import { AdminLayout } from "../components/layout/AdminLayout";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";

export const AdminDepartments = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    name: "",
    description: "",
    contactEmail: "",
    reportTypes: "",
  });

  const { data: departments = [], isLoading } = useQuery({
    queryKey: ["admin-departments"],
    queryFn: () => api.get("/department/admin").then((r) => r.data),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["category-flat"],
    queryFn: () => api.get("/category").then((r) => r.data.categories),
  });

  const createMutation = useMutation({
    mutationFn: (payload) => api.post("/department", payload),
    onSuccess: () => {
      toast.success("Department created");
      setForm({ name: "", description: "", contactEmail: "", reportTypes: "" });
      queryClient.invalidateQueries({ queryKey: ["admin-departments"] });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed"),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }) => api.put(`/department/${id}`, { isActive }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-departments"] }),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate({
      name: form.name,
      description: form.description,
      contactEmail: form.contactEmail,
      reportTypes: form.reportTypes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    });
  };

  return (
    <AdminLayout title="Departments" subtitle="Route reports to the right municipal team">
      <div className="grid lg:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="governance-card p-6 space-y-4 h-fit">
          <h3 className="font-semibold flex items-center gap-2"><Plus size={18} /> New department</h3>
          <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Department name" className="input-field" required />
          <input value={form.contactEmail} onChange={(e) => setForm((f) => ({ ...f, contactEmail: e.target.value }))} placeholder="Contact email" className="input-field" type="email" />
          <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Description" className="input-field resize-none" rows={2} />
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Report types (comma-separated)</label>
            <textarea
              value={form.reportTypes}
              onChange={(e) => setForm((f) => ({ ...f, reportTypes: e.target.value }))}
              placeholder={categories.slice(0, 3).join(", ") + "..."}
              className="input-field resize-none text-xs"
              rows={3}
            />
          </div>
          <button type="submit" disabled={createMutation.isPending} className="btn-primary w-full">
            {createMutation.isPending ? "Creating..." : "Create department"}
          </button>
        </form>

        <div className="lg:col-span-2 space-y-4">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            departments.map((dept) => (
              <div key={dept._id} className={`governance-card p-6 ${!dept.isActive ? "opacity-60" : ""}`}>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      <Building2 size={16} className="text-primary" /> {dept.name}
                    </h3>
                    {dept.contactEmail && <p className="text-xs text-slate-500 mt-1">{dept.contactEmail}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleMutation.mutate({ id: dept._id, isActive: !dept.isActive })}
                    className="text-xs font-medium text-primary hover:underline shrink-0"
                  >
                    {dept.isActive ? "Deactivate" : "Activate"}
                  </button>
                </div>
                {dept.description && <p className="text-sm text-slate-600 mb-3">{dept.description}</p>}
                <div className="flex flex-wrap gap-1.5">
                  {(dept.reportTypes || []).map((t) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 font-medium">{t}</span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
