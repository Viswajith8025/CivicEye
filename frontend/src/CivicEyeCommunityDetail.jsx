import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "./lib/apiClient";
import { formatDate } from "./lib/utils";
import { CitizenLayout } from "./components/layout/CitizenLayout";
import { SingleReportMap } from "./components/map/ReportMap";
import { CommentSection, UpvoteButton } from "./components/reports/ReportSocial";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";
import { SeverityBadge, StatusBadge } from "./components/ui/Badge";

export const CivicEyeCommunityDetail = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/complaint/community/${id}`)
      .then((res) => setReport(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <CitizenLayout title="Report"><LoadingSpinner /></CitizenLayout>;
  if (!report) return <CitizenLayout title="Report"><p className="text-center text-slate-500">Not found</p></CitizenLayout>;

  return (
    <CitizenLayout title={report.type} subtitle={report.location}>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="governance-card p-6">
          <div className="flex flex-wrap gap-3 mb-4">
            <StatusBadge status={report.status} />
            <SeverityBadge severity={report.severity} />
            <UpvoteButton reportId={id} initialCount={report.upvoteCount} initialHasUpvoted={report.hasUpvoted} />
          </div>
          <p className="text-sm leading-relaxed mb-4">{report.description}</p>
          <p className="text-xs text-slate-500">Reported by {report.userId?.name} · {formatDate(report.createdAt)} · {report.viewCount || 0} views</p>
          {report.coordinates?.lat && (
            <div className="mt-4">
              <SingleReportMap lat={report.coordinates.lat} lng={report.coordinates.lng} />
            </div>
          )}
        </div>
        <CommentSection reportId={id} isOwner={report.isOwner} />
      </div>
    </CitizenLayout>
  );
};
