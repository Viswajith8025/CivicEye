import express from "express";
import {
  deleteComplaint,
  exportComplaints,
  confirmResolution,
  submitAppeal,
  getAdminStaff,
  getAllComplaints,
  getAnyComplaintById,
  getCategories,
  getCommunityFeed,
  getCommunityReport,
  getComplaintById,
  getComplaintStats,
  getHeatmapData,
  getMapReports,
  getNearbyReports,
  getPublicStats,
  getTrends,
  getUserComplaints,
  getUserDashboard,
  registerComplaint,
  toggleUpvote,
  updateComplaintStatus,
  uploadProof,
} from "../controllers/Complaintcontroller.js";
import { addComment, getComments } from "../controllers/Commentcontroller.js";
import auth from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";
import { uploadLimiter } from "../middleware/rateLimit.js";
import { validate } from "../middleware/validate.js";
import {
  commentSchema,
  complaintListSchema,
  complaintRegisterSchema,
  complaintUpdateSchema,
  nearbySchema,
  resolutionConfirmSchema,
  appealSchema,
} from "../validators/schemas.js";

const ComplaintRouter = express.Router();

ComplaintRouter.get("/categories", getCategories);
ComplaintRouter.get("/public-stats", getPublicStats);
ComplaintRouter.post("/register", auth, uploadLimiter, uploadProof, validate(complaintRegisterSchema), registerComplaint);
ComplaintRouter.get("/dashboard", auth, getUserDashboard);
ComplaintRouter.get("/list", auth, validate(complaintListSchema), getUserComplaints);
ComplaintRouter.get("/community", auth, getCommunityFeed);
ComplaintRouter.get("/community/:id", auth, getCommunityReport);
ComplaintRouter.get("/map", auth, getMapReports);
ComplaintRouter.get("/nearby", auth, validate(nearbySchema), getNearbyReports);
ComplaintRouter.get("/trends", auth, getTrends);
ComplaintRouter.get("/detail/:id", auth, getComplaintById);
ComplaintRouter.post("/detail/:id/confirm-resolution", auth, validate(resolutionConfirmSchema), confirmResolution);
ComplaintRouter.post("/detail/:id/appeal", auth, validate(appealSchema), submitAppeal);
ComplaintRouter.get("/detail/:id/comments", auth, getComments);
ComplaintRouter.post("/detail/:id/comments", auth, validate(commentSchema), addComment);
ComplaintRouter.post("/:id/upvote", auth, toggleUpvote);
ComplaintRouter.get("/stats", auth, getComplaintStats);
ComplaintRouter.get("/staff", auth, requireRole("admin"), getAdminStaff);
ComplaintRouter.get("/alllist", auth, requireRole("admin"), validate(complaintListSchema), getAllComplaints);
ComplaintRouter.get("/heatmap", auth, requireRole("admin"), getHeatmapData);
ComplaintRouter.get("/export", auth, requireRole("admin"), exportComplaints);
ComplaintRouter.get("/admin/detail/:id", auth, requireRole("admin"), getAnyComplaintById);
ComplaintRouter.put("/update/:id", auth, requireRole("admin"), validate(complaintUpdateSchema), updateComplaintStatus);
ComplaintRouter.delete("/delete/:id", auth, deleteComplaint);

export default ComplaintRouter;
