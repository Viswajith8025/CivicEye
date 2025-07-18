import express from "express";
import { deleteComplaint, getAllComplaints, getAnyComplaintById, getComplaintById, getComplaintStats, getUserComplaints, registerComplaint, updateComplaintStatus, uploadProof } from "../controllers/Complaintcontroller.js";
import auth from "../middleware/auth.js";

const ComplaintRouter = express.Router();

// Add the uploadProof middleware before registerComplaint
ComplaintRouter.post("/register", auth, uploadProof, registerComplaint);
ComplaintRouter.get("/list", auth, getUserComplaints);
ComplaintRouter.get("/detail/:id", auth, getComplaintById);
ComplaintRouter.get("/alllist", getAllComplaints);
ComplaintRouter.get("/stats",auth, getComplaintStats);
ComplaintRouter.get("/admin/detail/:id", auth, getAnyComplaintById);
ComplaintRouter.put("/update/:id", auth, updateComplaintStatus);
ComplaintRouter.delete("/delete/:id", auth, deleteComplaint);

export default ComplaintRouter;