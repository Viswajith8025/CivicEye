import Department from "../model/DepartmentSchema.js";
import logger from "../utilies/logger.js";

const DEFAULT_DEPARTMENTS = [
  {
    name: "Public Works",
    description: "Roads, footpaths, bridges, and infrastructure",
    contactEmail: "publicworks@municipality.gov",
    reportTypes: ["Pothole", "Damaged Road", "Broken Footpath", "Missing Road Sign", "Damaged Bridge"],
  },
  {
    name: "Water & Sewer",
    description: "Water supply, leaks, and sewage systems",
    contactEmail: "water@municipality.gov",
    reportTypes: ["Water Leakage", "Sewage Overflow", "Damaged Drainage"],
  },
  {
    name: "Electrical Services",
    description: "Streetlights and power infrastructure",
    contactEmail: "electrical@municipality.gov",
    reportTypes: ["Streetlight Failure", "Power Outage"],
  },
  {
    name: "Sanitation",
    description: "Waste management and environmental cleanup",
    contactEmail: "sanitation@municipality.gov",
    reportTypes: ["Waste Dumping", "Overflowing Bin", "Illegal Burning", "Tree Hazard", "Pollution"],
  },
  {
    name: "Traffic & Safety",
    description: "Traffic enforcement and road safety",
    contactEmail: "traffic@municipality.gov",
    reportTypes: ["Traffic Violation", "Reckless Driving", "Signal Malfunction", "Parking Violation", "Road Blockage"],
  },
  {
    name: "General Affairs",
    description: "Public order and miscellaneous civic issues",
    contactEmail: "general@municipality.gov",
    reportTypes: ["Public Nuisance", "Vandalism", "Illegal Construction", "Noise Complaint", "Other"],
  },
];

export async function seedDepartmentsIfEmpty() {
  const count = await Department.countDocuments();
  if (count > 0) return;
  await Department.insertMany(DEFAULT_DEPARTMENTS);
  logger.info({ count: DEFAULT_DEPARTMENTS.length }, "Seeded default departments");
}

export async function resolveDepartmentForType(reportType) {
  if (!reportType) return null;
  const dept = await Department.findOne({
    isActive: true,
    reportTypes: reportType,
  });
  return dept?._id || null;
}
