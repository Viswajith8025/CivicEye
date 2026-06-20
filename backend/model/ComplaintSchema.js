import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
    index: true,
  },
  description: { type: String, required: true },
  type: { type: String, required: true },
  category: { type: String, default: "Other" },
  severity: {
    type: String,
    enum: ["Low", "Medium", "High", "Critical"],
    default: "Medium",
    index: true,
  },
  location: { type: String, required: true },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number },
  },
  geo: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number] },
  },
  proof: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Resolved", "Rejected"],
    default: "Pending",
    index: true,
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "department" },
  statusHistory: [
    {
      status: String,
      note: String,
      changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
      at: { type: Date, default: Date.now },
    },
  ],
  aiSummary: { type: String },
  isDuplicate: { type: Boolean, default: false },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  viewCount: { type: Number, default: 0 },
  isPublic: { type: Boolean, default: true },
  isAnonymous: { type: Boolean, default: false },
  citizenResolutionConfirmed: { type: Boolean, default: null },
  appealStatus: {
    type: String,
    enum: ["none", "pending", "accepted", "denied"],
    default: "none",
  },
  appealNote: { type: String },
  appealedAt: { type: Date },
  officialResponse: {
    text: { type: String },
    respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    at: { type: Date },
  },
  createdAt: { type: Date, default: Date.now, index: true },
  createdAtLegacy: { type: String },
  resolvedAt: { type: Date },
});

complaintSchema.index({ "coordinates.lat": 1, "coordinates.lng": 1 });
complaintSchema.index({ geo: "2dsphere" });

const complaint = mongoose.model("complaint", complaintSchema);
export default complaint;
