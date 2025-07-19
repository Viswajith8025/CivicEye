import express from "express";
import { addFeedback, getAllFeedback, getFeedbackByStatus, getFeedbackCountByStatus, updateFeedbackStatus } from "../controllers/Feedbackcontroller.js";
import auth from "../middleware/auth.js";

const feedbackrouter = express.Router();

// Route to add feedback
feedbackrouter.post("/add",auth, addFeedback);

// Route to get all feedback
feedbackrouter.get("/all",auth, getAllFeedback);

feedbackrouter.put("/updatestatus",auth,updateFeedbackStatus)
// ✅ Change this in Feedbackrouter.js
feedbackrouter.get("/status/:status", auth, getFeedbackByStatus);
feedbackrouter.get("/status/:status", auth, getFeedbackByStatus);
export default feedbackrouter;
