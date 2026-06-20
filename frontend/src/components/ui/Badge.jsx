import { STATUS_COLORS, SEVERITY_COLORS } from "../../constants/categories";

export function StatusBadge({ status }) {
  return (
    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[status] || STATUS_COLORS.Pending}`}>
      {status}
    </span>
  );
}

export function SeverityBadge({ severity }) {
  return (
    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${SEVERITY_COLORS[severity] || SEVERITY_COLORS.Medium}`}>
      {severity}
    </span>
  );
}
