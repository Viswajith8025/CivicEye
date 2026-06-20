export const REPORT_CATEGORIES = [
  {
    group: "Road & Infrastructure",
    items: [
      "Pothole",
      "Damaged Road",
      "Broken Footpath",
      "Missing Road Sign",
      "Damaged Bridge",
    ],
  },
  {
    group: "Utilities",
    items: [
      "Water Leakage",
      "Sewage Overflow",
      "Streetlight Failure",
      "Power Outage",
      "Damaged Drainage",
    ],
  },
  {
    group: "Sanitation & Environment",
    items: [
      "Waste Dumping",
      "Overflowing Bin",
      "Illegal Burning",
      "Tree Hazard",
      "Pollution",
    ],
  },
  {
    group: "Traffic & Safety",
    items: [
      "Traffic Violation",
      "Reckless Driving",
      "Signal Malfunction",
      "Parking Violation",
      "Road Blockage",
    ],
  },
  {
    group: "Public Order",
    items: [
      "Public Nuisance",
      "Vandalism",
      "Illegal Construction",
      "Noise Complaint",
      "Other",
    ],
  },
];

export const ALL_CATEGORIES = REPORT_CATEGORIES.flatMap((c) => c.items);
