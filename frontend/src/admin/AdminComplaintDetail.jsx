import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Loader2, MapPin, User } from "lucide-react";
import api from "../lib/apiClient";
import { formatDate } from "../lib/utils";
import { STATUS_OPTIONS } from "../constants/categories";
import { AdminLayout } from "../components/layout/AdminLayout";
import { ReportDetailView } from "../components/reports/ReportDetailView";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { useAuthMedia } from "../hooks/useAuthMedia";

export const AdminComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [newStatus, setNewStatus] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [note, setNote] = useState("");
  const [officialResponse, setOfficialResponse] = useState("");
  const [updating, setUpdating] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-complaint", id],
    queryFn: async () => {
      const [reportRes, staffRes, deptRes] = await Promise.all([
        api.get(`/complaint/admin/detail/${id}`),
        api.get("/complaint/staff"),
        api.get("/department/admin"),
      ]);
      return { complaint: reportRes.data, staff: staffRes.data, departments: deptRes.data };
    },
  });

  const complaint = data?.complaint;
  const staff = data?.staff || [];
  const departments = (data?.departments || []).filter((d) => d.isActive);

  useEffect(() => {
    if (complaint) {
      setNewStatus(complaint.status);
      setAssignedTo(complaint.assignedTo?._id || "");
      setDepartmentId(complaint.departmentId?._id || "");
      setOfficialResponse(complaint.officialResponse?.text || "");
    }
  }, [complaint?._id, complaint?.status]);

  const { blobUrl: mediaUrl, loading: mediaLoading } = useAuthMedia(complaint?.proof);

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const res = await api.put(`/complaint/update/${id}`, {
        status: newStatus,
        note: note || undefined,
        assignedTo: assignedTo || null,
        departmentId: departmentId || null,
        officialResponse: officialResponse.trim() || undefined,
      });
      queryClient.setQueryData(["admin-complaint", id], (old) => ({
        ...old,
        complaint: res.data.complaint,
      }));
      toast.success("Report updated");
      setNote("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  const handleAppeal = async (action) => {
    setUpdating(true);
    try {
      const res = await api.put(`/complaint/update/${id}`, {
        appealAction: action,
        note: note || undefined,
      });
      queryClient.setQueryData(["admin-complaint", id], (old) => ({
        ...old,
        complaint: res.data.complaint,
      }));
      toast.success(action === "accept" ? "Appeal accepted" : "Appeal denied");
      setNote("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Appeal action failed");
    } finally {
      setUpdating(false);
    }
  };

  if (isLoading) {
    return <AdminLayout title="Report Details"><LoadingSpinner /></AdminLayout>;
  }

  if (!complaint) {
    return <AdminLayout title="Report Details"><p className="text-center text-slate-500">Not found</p></AdminLayout>;
  }

  return (
    <AdminLayout title="Manage Report" subtitle={complaint.type}>
      <div className="max-w-3xl mx-auto space-y-4">
        <button onClick={() => navigate(-1)} className="text-sm text-primary font-medium hover:underline">← Back</button>

        <ReportDetailView
          complaint={complaint}
          reportId={id}
          mode="admin"
          mediaUrl={mediaUrl}
          mediaLoading={mediaLoading}
          showComments
          reporterInfo={
            <div className="grid sm:grid-cols-2 gap-4 mb-4 text-sm">
              <div><span className="text-slate-500">Reporter:</span> <span className="font-medium">{complaint.userId?.name}</span></div>
              <div><span className="text-slate-500">Email:</span> <span className="font-medium">{complaint.userId?.email}</span></div>
              <div className="flex items-center gap-1"><MapPin size={14} className="text-primary" />{complaint.location}</div>
              <div><span className="text-slate-500">Submitted:</span> {formatDate(complaint.createdAt || complaint.createdAtLegacy)}</div>
            </div>
          }
          manageSection={
            <>
              {complaint.appealStatus === "pending" && (
                <div className="governance-card p-6 border-2 border-amber-300 dark:border-amber-700">
                  <h3 className="font-semibold mb-2">Pending appeal</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{complaint.appealNote}</p>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => handleAppeal("accept")} disabled={updating} className="btn-primary !py-2 !px-4 text-sm">
                      Accept appeal
                    </button>
                    <button type="button" onClick={() => handleAppeal("deny")} disabled={updating} className="btn-secondary !py-2 !px-4 text-sm">
                      Deny appeal
                    </button>
                  </div>
                </div>
              )}
            <div className="governance-card p-6">
              <h3 className="font-semibold mb-4">Manage report</h3>
              <div className="grid sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">Status</label>
                  <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="input-field">
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1"><User size={12} /> Assign to</label>
                  <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className="input-field">
                    <option value="">Unassigned</option>
                    {staff.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">Department</label>
                  <select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} className="input-field">
                    <option value="">Auto / none</option>
                    {departments.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
                  </select>
                </div>
              </div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Official public response</label>
              <textarea
                value={officialResponse}
                onChange={(e) => setOfficialResponse(e.target.value)}
                rows={3}
                placeholder="Publish an official update visible to the citizen..."
                className="input-field mb-3 resize-none"
              />
              <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Internal timeline note..." className="input-field mb-3" />
              <button onClick={handleUpdate} disabled={updating} className="btn-primary">
                {updating ? <Loader2 className="animate-spin" size={18} /> : "Save changes"}
              </button>
            </div>
            </>
          }
        />
      </div>
    </AdminLayout>
  );
};
