export const REPORT_CATEGORIES = [
  {
    group: "Road & Infrastructure",
    items: ["Pothole", "Damaged Road", "Broken Footpath", "Missing Road Sign", "Damaged Bridge"],
  },
  {
    group: "Utilities",
    items: ["Water Leakage", "Sewage Overflow", "Streetlight Failure", "Power Outage", "Damaged Drainage"],
  },
  {
    group: "Sanitation & Environment",
    items: ["Waste Dumping", "Overflowing Bin", "Illegal Burning", "Tree Hazard", "Pollution"],
  },
  {
    group: "Traffic & Safety",
    items: ["Traffic Violation", "Reckless Driving", "Signal Malfunction", "Parking Violation", "Road Blockage"],
  },
  {
    group: "Public Order",
    items: ["Public Nuisance", "Vandalism", "Illegal Construction", "Noise Complaint", "Other"],
  },
];

export const SEVERITY_LEVELS = ["Low", "Medium", "High", "Critical"];

export const STATUS_OPTIONS = ["Pending", "In Progress", "Resolved", "Rejected"];

export const SEVERITY_COLORS = {
  Low: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  Medium: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  High: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  Critical: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
};

export const STATUS_COLORS = {
  Pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  "In Progress": "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  Resolved: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  Rejected: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
};
