import feedback from "../model/FeedbackSchema.js";
import { parsePagination, paginatedResponse } from "../utilies/pagination.js";

// Add Feedback
export const addFeedback = async (req, res) => {
    try {
        const { description } = req.body;
        const userId = req.user.userid;

        if (!description || !description.trim()) {
            return res.status(400).json({ message: "Description is required" });
        }

        const newFeedback = new feedback({
            userId,
            description: description.trim(),
            timestamp: new Date().toISOString(),
            status: "pending",
        });

        await newFeedback.save();
        res.status(201).json({ message: "Feedback submitted successfully", feedback: newFeedback });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error submitting feedback", error });
    }
};

// Get All Feedback
export const getAllFeedback = async (req, res) => {
    try {
        const { page, limit, skip } = parsePagination(req.query, { defaultLimit: 25 });
        const [feedbacks, total] = await Promise.all([
            feedback.find().populate("userId", "name email").sort({ timestamp: -1 }).skip(skip).limit(limit),
            feedback.countDocuments(),
        ]);
        res.status(200).json(paginatedResponse(feedbacks, total, page, limit));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving feedback", error });
    }
};

export const getFeedbackById = async (req, res) => {
    try {
        const item = await feedback.findById(req.params.id).populate("userId", "name email");
        if (!item) return res.status(404).json({ message: "Feedback not found" });
        return res.status(200).json(item);
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving feedback", error: error.message });
    }
};
// Update Feedback Status
export const updateFeedbackStatus = async (req, res) => {
    try {
        const { feedbackId, status } = req.body;

        if (!feedbackId || !status) {
            return res.status(400).json({ message: "Feedback ID and status are required" });
        }

        if (!["pending", "accepted", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const updatedFeedback = await feedback.findByIdAndUpdate(
            feedbackId,
            { status },
            { new: true }
        );

        if (!updatedFeedback) {
            return res.status(404).json({ message: "Feedback not found" });
        }

        res.status(200).json({
            message: "Feedback status updated successfully",
            feedback: updatedFeedback
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating feedback status", error });
    }
};

// Get Feedback by Status
// In Feedbackcontroller.js, update getFeedbackByStatus
export const getFeedbackByStatus = async (req, res) => {
    try {
        const { status } = req.params;
        console.log(`Fetching feedback with status: ${status}`); // Add logging

        if (!["pending", "accepted", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const feedbacks = await feedback.find({ status }).populate("userId", "name email");
        console.log(`Found ${feedbacks.length} feedbacks with status ${status}`); // Add logging
        res.status(200).json(feedbacks);
    } catch (error) {
        console.error("Detailed error:", error); // More detailed error logging
        res.status(500).json({ 
            message: "Error retrieving feedback", 
            error: error.message, // Include error message
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
        });
    }
};
export async function getFeedbackCountByStatus(req, res) {
    try {
        const feedbackList = await feedback.find({}); // Assuming `feedback` is your Feedback model
        const statusCounts = {
            pending: 0,
            accepted: 0,
            rejected: 0,
        };

        feedbackList.forEach((fb) => {
            if (statusCounts.hasOwnProperty(fb.status)) {
                statusCounts[fb.status]++;
            }
        });

        return res.status(200).json(statusCounts);
    } catch (error) {
        console.error("Error fetching feedback stats:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}