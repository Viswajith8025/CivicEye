import Comment from "../model/CommentSchema.js";
import complaint from "../model/ComplaintSchema.js";
import { createNotification } from "../utilies/notifications.js";

async function canAccessReport(report, userId, role) {
  if (!report) return false;
  if (role === "admin") return true;
  if (report.userId.toString() === userId) return true;
  if (report.isPublic !== false && report.status !== "Rejected") return true;
  return false;
}

export async function getComments(req, res) {
  try {
    const report = await complaint.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });
    if (!(await canAccessReport(report, req.user.userid, req.user.role))) {
      return res.status(403).json({ message: "Access denied" });
    }

    const comments = await Comment.find({ complaintId: req.params.id })
      .populate("userId", "name role")
      .sort({ createdAt: -1 });
    return res.status(200).json(comments);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function addComment(req, res) {
  try {
    const { text } = req.body;
    if (!text?.trim()) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const report = await complaint.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    if (!(await canAccessReport(report, req.user.userid, req.user.role))) {
      return res.status(403).json({ message: "Access denied" });
    }

    const isOwner = report.userId.toString() === req.user.userid;

    const newComment = await Comment.create({
      complaintId: req.params.id,
      userId: req.user.userid,
      text: text.trim(),
    });

    const populated = await Comment.findById(newComment._id).populate("userId", "name");

    if (!isOwner && report.userId.toString() !== req.user.userid) {
      await createNotification({
        userId: report.userId,
        title: "New comment on your report",
        message: text.trim().slice(0, 80),
        type: "system",
        link: `/complaintdetail/${report._id}`,
      });
    }

    return res.status(201).json(populated);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}
