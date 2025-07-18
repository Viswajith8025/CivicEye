import complaint from "../model/ComplaintSchema.js";
import user from "../model/UserSchema.js";
import { format } from 'date-fns';
import upload from '../multer.js';
import fs from 'fs';
import path from 'path';

// Register a new complaint (without multer - you'll use this in your route)
export const uploadProof = upload.single('proof');

// Register a new complaint
export async function registerComplaint(req, res) {
    try {
      const { description, type, location } = req.body;
      const userId = req.user.userid; // From auth middleware
const proof = req.file ? `/uploads/${req.file.filename}` : null;
      
  
      if (!description || !type || !location || !proof) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      
      const newComplaint = await complaint.create({
        userId,
        description,
        type,
        location,
        proof,
        status: "Pending",
        createdAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      });
  
      
  
      return res.status(201).json({ message: "Complaint registered successfully", complaint: newComplaint });
    } catch (error) {
      console.error("Error registering complaint:", error);
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  }


export async function getUserComplaints(req, res) {
    try {
        const userId = req.user.userid;
        
        const complaints = await complaint.find({ userId })
            .sort({ createdAt: -1 });
        
        return res.status(200).json(complaints);
    } catch (error) {
        console.error("Error fetching complaints:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

export async function getAllComplaints(req, res) {
    try {
        const complaints = await complaint.find({}).populate('userId', 'name');
        
        return res.status(200).json(complaints);
    } catch (error) {
        console.error("Error fetching complaints:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

export async function getComplaintById(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user.userid;
        
        const complaintDetails = await complaint.findOne({ 
            _id: id,
            userId 
        });
        
        if (!complaintDetails) {
            return res.status(404).json({ message: "Complaint not found" });
        }
        
        return res.status(200).json(complaintDetails);
    } catch (error) {
        console.error("Error fetching complaint details:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

export async function updateComplaintStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        if (!status || !['Pending','In Progress', 'Resolved', 'Rejected'].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }
        
        const complaintToUpdate = await complaint.findById(id);
        
        if (!complaintToUpdate) {
            return res.status(404).json({ message: "Complaint not found" });
        }
        
        const updateData = { status };
        
        if (status === 'Resolved') {
            updateData.resolvedAt = format(new Date(), "yyyy-MM-dd HH:mm:ss");
        }
        
        const updatedComplaint = await complaint.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        );
        
        return res.status(200).json({ 
            message: "Complaint status updated successfully",
            complaint: updatedComplaint
        });
    } catch (error) {
        console.error("Error updating complaint status:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

export async function getAnyComplaintById(req, res) {
    try {
      const { id } = req.params;
      const complaintDetails = await complaint.findById(id).populate('userId', 'name');
      if (!complaintDetails) {
        return res.status(404).json({ message: "Complaint not found" });
      }
      return res.status(200).json(complaintDetails);
    } catch (error) {
      console.error("Error fetching complaint details:", error);
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  export async function deleteComplaint(req, res) {
  try {
    const { id } = req.params;
    const complaintToDelete = await complaint.findById(id);

    if (!complaintToDelete) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Decrement the user's reports count
    

    await complaint.findByIdAndDelete(id);
    return res.status(200).json({ message: "Complaint deleted successfully" });
  } catch (error) {
    console.error("Error deleting complaint:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function getComplaintStats(req, res) {
  try {
    const complaints = await complaint.find({});
    const statusCounts = {
      Pending: 0,
      "In Progress": 0,
      Resolved: 0,
      Rejected: 0,
    };
    const categoryCounts = {};

    complaints.forEach((complaint) => {
      if (statusCounts.hasOwnProperty(complaint.status)) {
        statusCounts[complaint.status]++;
      }
      const category = complaint.type || "Other";
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    const stats = {
      totalComplaints: complaints.length,
      statusCounts,
      categoryCounts,
    };

    return res.status(200).json({ stats });
  } catch (error) {
    console.error("Error fetching complaint stats:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}