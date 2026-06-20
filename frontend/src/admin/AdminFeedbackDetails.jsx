import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import api from "../lib/apiClient";
import { AdminLayout } from "../components/layout/AdminLayout";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";

export const AdminFeedbackDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  const { data: feedback, isLoading } = useQuery({
    queryKey: ["feedback", id],
    queryFn: () => api.get(`/feedback/${id}`).then((r) => r.data),
  });

  useEffect(() => {
    if (feedback?.status) setStatus(feedback.status);
  }, [feedback?.status]);

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      await api.put("/feedback/updatestatus", { feedbackId: id, status });
      toast.success("Status updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  if (isLoading) return <AdminLayout title="Feedback"><LoadingSpinner /></AdminLayout>;
  if (!feedback) return <AdminLayout title="Feedback"><p className="text-center text-slate-500">Not found</p></AdminLayout>;

  return (
    <AdminLayout title="Review Feedback" subtitle={feedback.userId?.name}>
      <div className="max-w-lg mx-auto space-y-6">
        <button onClick={() => navigate(-1)} className="text-sm text-primary font-medium hover:underline">← Back</button>
        <div className="governance-card p-6">
          <p className="text-sm leading-relaxed mb-4">{feedback.description}</p>
          <p className="text-xs text-slate-500">{feedback.userId?.email} · {new Date(feedback.timestamp).toLocaleDateString()}</p>
        </div>
        <div className="governance-card p-6 flex gap-3">
          <select value={status || feedback.status} onChange={(e) => setStatus(e.target.value)} className="input-field flex-1">
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
          <button onClick={handleUpdate} disabled={updating} className="btn-primary shrink-0">Update</button>
        </div>
      </div>
    </AdminLayout>
  );
};
