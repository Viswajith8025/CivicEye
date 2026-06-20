import express from "express";
import {
  addFeedback,
  getAllFeedback,
  getFeedbackById,
  getFeedbackByStatus,
  getFeedbackCountByStatus,
  updateFeedbackStatus,
} from "../controllers/Feedbackcontroller.js";
import auth from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";
import { validate } from "../middleware/validate.js";
import { feedbackSchema } from "../validators/schemas.js";

const FeedbackRouter = express.Router();

FeedbackRouter.post("/add", auth, validate(feedbackSchema), addFeedback);
FeedbackRouter.get("/all", auth, requireRole("admin"), getAllFeedback);
FeedbackRouter.put("/updatestatus", auth, requireRole("admin"), updateFeedbackStatus);
FeedbackRouter.get("/status/:status", auth, requireRole("admin"), getFeedbackByStatus);
FeedbackRouter.get("/countbystatus", auth, requireRole("admin"), getFeedbackCountByStatus);
FeedbackRouter.get("/:id", auth, requireRole("admin"), getFeedbackById);

export default FeedbackRouter;
