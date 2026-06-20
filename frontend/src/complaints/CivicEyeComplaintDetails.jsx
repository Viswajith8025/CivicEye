import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Loader2, MapPin, Trash2 } from "lucide-react";
import api from "../lib/apiClient";
import { CitizenLayout } from "../components/layout/CitizenLayout";
import { ReportDetailView } from "../components/reports/ReportDetailView";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { useAuthMedia } from "../hooks/useAuthMedia";

export const CivicEyeComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

  const { data: complaint, isLoading, refetch } = useQuery({
    queryKey: ["complaint", id],
    queryFn: () => api.get(`/complaint/detail/${id}`).then((r) => r.data),
  });

  const { blobUrl: mediaUrl, loading: mediaLoading } = useAuthMedia(complaint?.proof);

  const handleDelete = async () => {
    if (!window.confirm("Delete this report?")) return;
    setDeleting(true);
    try {
      await api.delete(`/complaint/delete/${id}`);
      toast.success("Report deleted");
      navigate("/complaintlist");
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
      setDeleting(false);
    }
  };

  if (isLoading) return <CitizenLayout title="Report Details"><LoadingSpinner /></CitizenLayout>;
  if (!complaint) return <CitizenLayout title="Report Details"><p className="text-center text-slate-500">Not found</p></CitizenLayout>;

  return (
    <CitizenLayout title={complaint.type} subtitle={complaint.location}>
      <div className="max-w-3xl mx-auto">
        <ReportDetailView
          complaint={complaint}
          reportId={id}
          mode="citizen"
          mediaUrl={mediaUrl}
          mediaLoading={mediaLoading}
          showUpvote
          onComplaintUpdated={() => refetch()}
          footerActions={
            complaint.status === "Pending" ? (
              <button onClick={handleDelete} disabled={deleting} className="flex items-center gap-2 text-red-600 text-sm font-medium ml-auto">
                {deleting ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />} Delete report
              </button>
            ) : null
          }
        />
      </div>
    </CitizenLayout>
  );
};
