import { AlertTriangle, Clock, MapPin, Shield, User } from "lucide-react";
import { formatDate } from "../../lib/utils";
import { SingleReportMap } from "../map/ReportMap";
import { CommentSection, UpvoteButton } from "./ReportSocial";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { SeverityBadge, StatusBadge } from "../ui/Badge";

export function OfficialResponseBlock({ officialResponse }) {
  if (!officialResponse?.text) return null;
  return (
    <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 mb-4">
      <p className="text-xs font-semibold text-teal-700 dark:text-teal-300 flex items-center gap-1 mb-2">
        <Shield size={14} /> Official response
        {officialResponse.respondedBy?.name && (
          <span className="font-normal text-slate-500">· {officialResponse.respondedBy.name}</span>
        )}
      </p>
      <p className="text-sm leading-relaxed">{officialResponse.text}</p>
      {officialResponse.at && (
        <p className="text-xs text-slate-400 mt-2">{formatDate(officialResponse.at)}</p>
      )}
    </div>
  );
}

export function ResolutionConfirmBanner({ complaint, reportId, onUpdated }) {
  if (complaint.status !== "Resolved" || complaint.citizenResolutionConfirmed !== null) return null;

  const handleConfirm = async (confirmed) => {
    const { default: api } = await import("../../lib/apiClient");
    const { default: toast } = await import("react-hot-toast");
    try {
      const res = await api.post(`/complaint/detail/${reportId}/confirm-resolution`, { confirmed });
      onUpdated?.(res.data.complaint);
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit");
    }
  };

  return (
    <div className="governance-card p-5 border-2 border-teal-200 dark:border-teal-800">
      <p className="font-semibold text-sm mb-1">Was this issue fixed?</p>
      <p className="text-xs text-slate-500 mb-4">Your confirmation helps the municipality improve service quality.</p>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => handleConfirm(true)} className="btn-primary !py-2 !px-4 text-sm">
          Yes, it&apos;s fixed
        </button>
        <button type="button" onClick={() => handleConfirm(false)} className="btn-secondary !py-2 !px-4 text-sm">
          No, still an issue
        </button>
      </div>
    </div>
  );
}

export function AppealBanner({ complaint, reportId, onUpdated }) {
  if (complaint.status !== "Rejected") return null;
  if (complaint.appealStatus === "pending") {
    return (
      <div className="governance-card p-5 border-2 border-amber-200 dark:border-amber-800">
        <p className="font-semibold text-sm mb-1">Appeal under review</p>
        <p className="text-xs text-slate-500">An admin will review your appeal shortly.</p>
      </div>
    );
  }
  if (complaint.appealStatus === "denied") {
    return (
      <div className="governance-card p-5 border border-slate-200 text-sm text-slate-600">
        This appeal was denied and cannot be resubmitted.
      </div>
    );
  }

  const submitAppeal = async (e) => {
    e.preventDefault();
    const note = e.target.appealNote.value.trim();
    if (note.length < 5) return;
    const { default: api } = await import("../../lib/apiClient");
    const { default: toast } = await import("react-hot-toast");
    try {
      const res = await api.post(`/complaint/detail/${reportId}/appeal`, { note });
      onUpdated?.(res.data.complaint);
      toast.success("Appeal submitted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Appeal failed");
    }
  };

  return (
    <div className="governance-card p-5 border-2 border-red-200 dark:border-red-800">
      <p className="font-semibold text-sm mb-1">Report rejected</p>
      <p className="text-xs text-slate-500 mb-4">Explain why this report should be reconsidered.</p>
      <form onSubmit={submitAppeal} className="space-y-3">
        <textarea name="appealNote" required minLength={5} rows={3} className="input-field resize-none text-sm" placeholder="Why should this be reopened?" />
        <button type="submit" className="btn-primary !py-2 !px-4 text-sm">Submit appeal</button>
      </form>
    </div>
  );
}

export function ReportDetailView({
  complaint,
  reportId,
  mode = "citizen",
  mediaUrl,
  mediaLoading,
  showUpvote = false,
  showComments = true,
  reporterInfo,
  manageSection,
  footerActions,
  onComplaintUpdated,
}) {
  const isImage = complaint?.proof && /\.(jpe?g|png|gif|webp)$/i.test(complaint.proof);
  const isVideo = complaint?.proof && /\.(mp4|mov|avi|wmv)$/i.test(complaint.proof);

  const timeline = complaint.statusHistory?.length
    ? complaint.statusHistory
    : [{ status: complaint.status, note: mode === "admin" ? "Created" : "Report created", at: complaint.createdAt || complaint.createdAtLegacy }];

  return (
    <div className="space-y-6">
      {complaint.isDuplicate && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">
          <AlertTriangle size={18} /> Possible duplicate — report is still tracked.
        </div>
      )}

      {mode === "citizen" && (
        <ResolutionConfirmBanner complaint={complaint} reportId={reportId} onUpdated={onComplaintUpdated} />
      )}

      {mode === "citizen" && (
        <AppealBanner complaint={complaint} reportId={reportId} onUpdated={onComplaintUpdated} />
      )}

      <div className="governance-card p-6">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <StatusBadge status={complaint.status} />
          <SeverityBadge severity={complaint.severity || "Medium"} />
          {showUpvote && (
            <UpvoteButton reportId={reportId} initialCount={complaint.upvoteCount} initialHasUpvoted={complaint.hasUpvoted} />
          )}
          {complaint.citizenResolutionConfirmed === true && (
            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 font-semibold">Citizen confirmed fix</span>
          )}
          {complaint.citizenResolutionConfirmed === false && (
            <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800 font-semibold">Citizen disputed fix</span>
          )}
        </div>

        {reporterInfo}

        {complaint.assignedTo?.name && (
          <p className="text-sm text-slate-500 mb-3 flex items-center gap-1">
            <User size={14} /> Assigned to: <strong>{complaint.assignedTo.name}</strong>
          </p>
        )}

        {complaint.departmentId?.name && (
          <p className="text-sm text-slate-500 mb-3 flex items-center gap-1">
            <Shield size={14} /> Department: <strong>{complaint.departmentId.name}</strong>
          </p>
        )}

        {complaint.aiSummary && mode === "admin" && (
          <div className="p-3 rounded-xl bg-primary/5 text-sm mb-4"><strong>AI Summary:</strong> {complaint.aiSummary}</div>
        )}

        <OfficialResponseBlock officialResponse={complaint.officialResponse} />

        <p className="text-sm leading-relaxed mb-4">{complaint.description}</p>

        {complaint.coordinates?.lat && (
          <div className="mb-4">
            {mode === "citizen" && (
              <p className="text-xs font-medium text-slate-500 mb-2 flex items-center gap-1"><MapPin size={12} /> Location on map</p>
            )}
            <SingleReportMap lat={complaint.coordinates.lat} lng={complaint.coordinates.lng} />
          </div>
        )}

        {complaint.proof && (
          <div className="mb-4">
            <p className="text-xs font-medium text-slate-500 mb-2">Proof</p>
            {mediaLoading && <LoadingSpinner />}
            {!mediaLoading && mediaUrl && isImage && (
              <img src={mediaUrl} alt="Proof" className="rounded-xl max-h-72 w-full object-contain border" />
            )}
            {!mediaLoading && mediaUrl && isVideo && (
              <video src={mediaUrl} controls className="rounded-xl max-h-72 w-full border" />
            )}
          </div>
        )}

        <p className="text-xs text-slate-400">Submitted {formatDate(complaint.createdAt || complaint.createdAtLegacy)}</p>
      </div>

      {manageSection}

      <div className="governance-card p-6">
        <h3 className="font-semibold flex items-center gap-2 mb-4"><Clock size={18} /> {mode === "admin" ? "Timeline" : "Status timeline"}</h3>
        <div className="space-y-4">
          {[...timeline].reverse().map((entry, i) => (
            <div key={i} className="flex gap-3 text-sm">
              <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${mode === "admin" ? "bg-primary w-2 h-2 mt-2" : "bg-teal-500"}`} />
              <div>
                <p className="font-medium">{entry.status}</p>
                {entry.note && <p className="text-xs text-slate-500">{entry.note}</p>}
                <p className="text-xs text-slate-400 mt-0.5">{formatDate(entry.at)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showComments && <CommentSection reportId={reportId} isOwner={mode === "citizen"} />}
      {footerActions}
    </div>
  );
}
