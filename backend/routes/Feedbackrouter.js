import express from "express";
import {
  addFeedback,
  getAllFeedback,
  getFeedbackByStatus,
  getFeedbackCountByStatus,
  updateFeedbackStatus
} from "../controllers/Feedbackcontroller.js";
import auth from "../middleware/auth.js";

const feedbackrouter = express.Router();

// Route to add feedback
feedbackrouter.post("/add", auth, addFeedback);

// Route to get all feedback
feedbackrouter.get("/all", auth, getAllFeedback);

// Route to update feedback status
feedbackrouter.put("/updatestatus", auth, updateFeedbackStatus);

// ✅ Correct GET route to get feedbacks by status
feedbackrouter.get("/status/:status", (req, res, next) => {
  console.log("✅ Route hit:", req.originalUrl);
  next();
}, getFeedbackByStatus);

// Route to get feedback count by status
feedbackrouter.get("/countbystatus", auth, getFeedbackCountByStatus);

export default feedbackrouter;
