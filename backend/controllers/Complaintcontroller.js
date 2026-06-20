import complaint from "../model/ComplaintSchema.js";
import user from "../model/UserSchema.js";
import upload from "../multer.js";
import fs from "fs";
import { createNotification } from "../utilies/notifications.js";
import { sanitizeUploadedImage } from "../utilies/imageProcessor.js";
import { isS3Enabled, uploadProofFile, buildProofPath } from "../utilies/storage.js";
import { parsePagination, paginatedResponse } from "../utilies/pagination.js";
import { buildSearchFilter } from "../utilies/search.js";
import { coordsToGeoPoint } from "../utilies/geo.js";
import { getGroupedCategories } from "../utilies/categorySeed.js";
import {
  VALID_STATUSES,
  POINTS_RESOLVED,
  haversineDistance,
  awardPoints,
  registerComplaintFlow,
} from "../services/complaintService.js";
import { canSubmitAppeal, notifyAdminsOfAppeal } from "../services/appealService.js";

export const uploadProof = upload.single("proof");

export async function registerComplaint(req, res) {
  try {
    let proof = null;

    if (req.file?.path) {
      await sanitizeUploadedImage(req.file.path);

      if (isS3Enabled()) {
        const buffer = await fs.promises.readFile(req.file.path);
        proof = await uploadProofFile({
          filename: req.file.filename,
          buffer,
          contentType: req.file.mimetype,
        });
        await fs.promises.unlink(req.file.path).catch(() => {});
      } else {
        proof = buildProofPath(req.file.filename);
      }
    }

    const newComplaint = await registerComplaintFlow({
      userId: req.user.userid,
      body: req.body,
      proofPath: proof,
    });

    return res.status(201).json({
      message: "Report submitted successfully",
      complaint: newComplaint,
    });
  } catch (error) {
    const status = error.status || 500;
    if (status >= 500) console.error("Error registering complaint:", error);
    return res.status(status).json({
      message: error.message || "Server error",
      error: status >= 500 ? error.message : undefined,
    });
  }
}

export async function getUserComplaints(req, res) {
  try {
    const { status, search, severity } = req.query;
    const { page, limit, skip } = parsePagination(req.query);
    const filter = { userId: req.user.userid };
    if (status) filter.status = status;
    if (severity) filter.severity = severity;
    const searchFilter = buildSearchFilter(search, ["description", "location", "type"]);
    if (searchFilter) Object.assign(filter, searchFilter);

    const [complaints, total] = await Promise.all([
      complaint.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      complaint.countDocuments(filter),
    ]);
    return res.status(200).json(paginatedResponse(complaints, total, page, limit));
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function getAllComplaints(req, res) {
  try {
    const { status, search, severity, type } = req.query;
    const { page, limit, skip } = parsePagination(req.query, { defaultLimit: 25 });
    const filter = {};
    if (status) filter.status = status;
    if (severity) filter.severity = severity;
    if (type) filter.type = type;
    const searchFilter = buildSearchFilter(search, ["description", "location", "type"]);
    if (searchFilter) Object.assign(filter, searchFilter);

    const [complaints, total] = await Promise.all([
      complaint
        .find(filter)
        .populate("userId", "name email")
        .populate("assignedTo", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      complaint.countDocuments(filter),
    ]);
    return res.status(200).json(paginatedResponse(complaints, total, page, limit));
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function getComplaintById(req, res) {
  try {
    const complaintDetails = await complaint
      .findOne({ _id: req.params.id, userId: req.user.userid })
      .populate("assignedTo", "name")
      .populate("departmentId", "name contactEmail")
      .populate("statusHistory.changedBy", "name role");
    if (!complaintDetails) {
      return res.status(404).json({ message: "Report not found" });
    }
    const obj = complaintDetails.toObject();
    obj.upvoteCount = complaintDetails.upvotes?.length || 0;
    obj.hasUpvoted = complaintDetails.upvotes?.some((id) => id.toString() === req.user.userid);
    return res.status(200).json(obj);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function getAnyComplaintById(req, res) {
  try {
    const complaintDetails = await complaint
      .findById(req.params.id)
      .populate("userId", "name email mobile")
      .populate("assignedTo", "name email")
      .populate("departmentId", "name contactEmail")
      .populate("statusHistory.changedBy", "name role");
    if (!complaintDetails) {
      return res.status(404).json({ message: "Report not found" });
    }
    return res.status(200).json(complaintDetails);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function updateComplaintStatus(req, res) {
  try {
    const { status, note, assignedTo, officialResponse, departmentId, appealAction } = req.body;
    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const complaintToUpdate = await complaint.findById(req.params.id);
    if (!complaintToUpdate) {
      return res.status(404).json({ message: "Report not found" });
    }

    const updateData = {};
    if (status) {
      updateData.status = status;
      updateData.$push = {
        statusHistory: {
          status,
          note: note || `Status changed to ${status}`,
          changedBy: req.user.userid,
          at: new Date(),
        },
      };
      if (status === "Resolved") {
        updateData.resolvedAt = new Date();
        updateData.citizenResolutionConfirmed = null;
      }
      if (status === "Rejected") {
        updateData.appealStatus = "none";
        updateData.appealNote = null;
        updateData.appealedAt = null;
      }
    }
    if (assignedTo !== undefined) {
      updateData.assignedTo = assignedTo || null;
    }
    if (departmentId !== undefined) {
      updateData.departmentId = departmentId || null;
    }
    if (officialResponse !== undefined && officialResponse.trim()) {
      updateData.officialResponse = {
        text: officialResponse.trim(),
        respondedBy: req.user.userid,
        at: new Date(),
      };
      if (!status) {
        updateData.$push = {
          statusHistory: {
            status: complaintToUpdate.status,
            note: `Official response: ${officialResponse.trim().slice(0, 100)}`,
            changedBy: req.user.userid,
            at: new Date(),
          },
        };
      }
    }

    if (appealAction === "accept" && complaintToUpdate.appealStatus === "pending") {
      updateData.status = "Pending";
      updateData.appealStatus = "accepted";
      updateData.resolvedAt = null;
      updateData.$push = {
        statusHistory: {
          status: "Pending",
          note: note || "Appeal accepted — report reopened for review",
          changedBy: req.user.userid,
          at: new Date(),
        },
      };
    } else if (appealAction === "deny" && complaintToUpdate.appealStatus === "pending") {
      updateData.appealStatus = "denied";
      updateData.$push = {
        statusHistory: {
          status: complaintToUpdate.status,
          note: note || "Appeal denied",
          changedBy: req.user.userid,
          at: new Date(),
        },
      };
    }

    const updatedComplaint = await complaint.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate("officialResponse.respondedBy", "name role");

    if (status) {
      await createNotification({
        userId: complaintToUpdate.userId,
        title: "Report Status Updated",
        message: `Your report is now: ${status}`,
        type: "status",
        link: `/complaintdetail/${complaintToUpdate._id}`,
      });
      if (status === "Resolved" && complaintToUpdate.status !== "Resolved") {
        await awardPoints(complaintToUpdate.userId, POINTS_RESOLVED, "Report resolved");
        await createNotification({
          userId: complaintToUpdate.userId,
          title: "Was this issue fixed?",
          message: "Please confirm whether your report was resolved satisfactorily.",
          type: "system",
          link: `/complaintdetail/${complaintToUpdate._id}`,
        });
      }
    }

    if (officialResponse?.trim()) {
      await createNotification({
        userId: complaintToUpdate.userId,
        title: "Official Response",
        message: officialResponse.trim().slice(0, 120),
        type: "status",
        link: `/complaintdetail/${complaintToUpdate._id}`,
      });
    }

    if (appealAction === "accept" && complaintToUpdate.appealStatus === "pending") {
      await createNotification({
        userId: complaintToUpdate.userId,
        title: "Appeal accepted",
        message: "Your appeal was accepted. Your report is back under review.",
        type: "status",
        link: `/complaintdetail/${complaintToUpdate._id}`,
      });
    } else if (appealAction === "deny" && complaintToUpdate.appealStatus === "pending") {
      await createNotification({
        userId: complaintToUpdate.userId,
        title: "Appeal denied",
        message: "Your appeal was reviewed and cannot be resubmitted.",
        type: "status",
        link: `/complaintdetail/${complaintToUpdate._id}`,
      });
    }

    return res.status(200).json({
      message: "Report updated successfully",
      complaint: updatedComplaint,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function confirmResolution(req, res) {
  try {
    const { confirmed, note } = req.body;
    const report = await complaint.findOne({ _id: req.params.id, userId: req.user.userid });
    if (!report) return res.status(404).json({ message: "Report not found" });
    if (report.status !== "Resolved") {
      return res.status(400).json({ message: "Report is not marked as resolved" });
    }

    report.citizenResolutionConfirmed = confirmed;
    report.statusHistory.push({
      status: report.status,
      note: confirmed
        ? note || "Citizen confirmed resolution"
        : note || "Citizen reported issue not fixed",
      changedBy: req.user.userid,
      at: new Date(),
    });

    if (!confirmed) {
      report.status = "In Progress";
      report.resolvedAt = null;
    }

    await report.save();

    await createNotification({
      userId: report.userId,
      title: confirmed ? "Thanks for confirming" : "Report reopened",
      message: confirmed
        ? "Your confirmation helps improve civic services."
        : "Your report has been moved back to In Progress.",
      type: "system",
      link: `/complaintdetail/${report._id}`,
    });

    return res.status(200).json({
      message: confirmed ? "Resolution confirmed" : "Report reopened for follow-up",
      complaint: report,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function submitAppeal(req, res) {
  try {
    const { note } = req.body;
    const report = await complaint.findOne({ _id: req.params.id, userId: req.user.userid });
    if (!report) return res.status(404).json({ message: "Report not found" });

    const eligibility = canSubmitAppeal({
      status: report.status,
      appealStatus: report.appealStatus,
    });
    if (!eligibility.ok) {
      return res.status(400).json({ message: eligibility.message });
    }

    report.appealStatus = "pending";
    report.appealNote = note?.trim() || "Citizen requested reconsideration";
    report.appealedAt = new Date();
    report.statusHistory.push({
      status: report.status,
      note: `Appeal submitted: ${report.appealNote}`,
      changedBy: req.user.userid,
      at: new Date(),
    });
    await report.save();

    await notifyAdminsOfAppeal(report);

    return res.status(200).json({ message: "Appeal submitted for admin review", complaint: report });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function deleteComplaint(req, res) {
  try {
    const complaintToDelete = await complaint.findById(req.params.id);
    if (!complaintToDelete) {
      return res.status(404).json({ message: "Report not found" });
    }

    const isOwner = complaintToDelete.userId.toString() === req.user.userid;
    const isAdmin = req.user.role === "admin";

    if (!isAdmin && (!isOwner || complaintToDelete.status !== "Pending")) {
      return res.status(403).json({ message: "Cannot delete this report" });
    }

    await user.findByIdAndUpdate(complaintToDelete.userId, { $inc: { reports: -1 } });
    await complaint.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function getComplaintStats(req, res) {
  try {
    const userId = req.user.role === "admin" ? null : req.user.userid;
    const match = userId ? { userId } : {};

    const [statusAgg, categoryAgg, total, severityAgg, slaAgg, pendingConfirm] = await Promise.all([
      complaint.aggregate([{ $match: match }, { $group: { _id: "$status", count: { $sum: 1 } } }]),
      complaint.aggregate([{ $match: match }, { $group: { _id: "$type", count: { $sum: 1 } } }]),
      complaint.countDocuments(match),
      complaint.aggregate([{ $match: match }, { $group: { _id: "$severity", count: { $sum: 1 } } }]),
      complaint.aggregate([
        { $match: { ...match, status: "Resolved", resolvedAt: { $exists: true }, createdAt: { $exists: true } } },
        {
          $project: {
            hours: {
              $divide: [{ $subtract: ["$resolvedAt", "$createdAt"] }, 1000 * 60 * 60],
            },
          },
        },
        {
          $group: {
            _id: null,
            avgHours: { $avg: "$hours" },
            count: { $sum: 1 },
          },
        },
      ]),
      complaint.countDocuments({ ...match, status: "Resolved", citizenResolutionConfirmed: null }),
    ]);

    const statusCounts = { Pending: 0, "In Progress": 0, Resolved: 0, Rejected: 0 };
    statusAgg.forEach((s) => {
      if (statusCounts[s._id] !== undefined) statusCounts[s._id] = s.count;
    });

    const categoryCounts = {};
    categoryAgg.forEach((c) => {
      categoryCounts[c._id || "Other"] = c.count;
    });

    const severityCounts = {};
    severityAgg.forEach((s) => {
      severityCounts[s._id || "Medium"] = s.count;
    });

    const sla = slaAgg[0] || { avgHours: 0, count: 0 };

    return res.status(200).json({
      stats: {
        totalComplaints: total,
        statusCounts,
        categoryCounts,
        severityCounts,
        sla: {
          avgResolutionHours: Math.round((sla.avgHours || 0) * 10) / 10,
          resolvedWithSla: sla.count || 0,
          pendingCitizenConfirmation: pendingConfirm,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function getHeatmapData(req, res) {
  try {
    const reports = await complaint
      .find({ "coordinates.lat": { $exists: true }, "coordinates.lng": { $exists: true } })
      .select("coordinates type severity status");
    return res.status(200).json(reports);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function exportComplaints(req, res) {
  try {
    const complaints = await complaint
      .find({})
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    const header = "ID,Type,Severity,Status,Location,Description,Reporter,CreatedAt,ResolvedAt\n";
    const rows = complaints
      .map((c) => {
        const esc = (v) => `"${String(v || "").replace(/"/g, '""')}"`;
        return [
          c._id,
          c.type,
          c.severity,
          c.status,
          c.location,
          c.description,
          c.userId?.name,
          c.createdAt,
          c.resolvedAt,
        ]
          .map(esc)
          .join(",");
      })
      .join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=civiceye-reports.csv");
    return res.status(200).send(header + rows);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function getCategories(req, res) {
  try {
    const { grouped, flat } = await getGroupedCategories({ activeOnly: true });
    return res.status(200).json({ grouped, categories: flat });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function getUserDashboard(req, res) {
  try {
    const userId = req.user.userid;
    const [userData, myComplaints, recent, resolved, pending, inProgress] = await Promise.all([
      user.findById(userId).select("-password"),
      complaint.countDocuments({ userId }),
      complaint.find({ userId }).sort({ createdAt: -1 }).limit(5),
      complaint.countDocuments({ userId, status: "Resolved" }),
      complaint.countDocuments({ userId, status: "Pending" }),
      complaint.countDocuments({ userId, status: "In Progress" }),
    ]);

    const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    const trendAgg = await complaint.aggregate([
      { $match: { userId: userData._id, createdAt: { $gte: fourteenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return res.status(200).json({
      user: userData,
      stats: {
        total: myComplaints,
        resolved,
        pending,
        inProgress,
        points: userData?.points || 0,
        resolutionRate: myComplaints > 0 ? Math.round((resolved / myComplaints) * 100) : 0,
      },
      recentReports: recent,
      trends: trendAgg,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function getPublicStats(_req, res) {
  try {
    const [total, resolved, citizens, critical] = await Promise.all([
      complaint.countDocuments(),
      complaint.countDocuments({ status: "Resolved" }),
      user.countDocuments({ role: "user", deletestate: { $ne: true } }),
      complaint.countDocuments({ severity: "Critical", status: { $ne: "Resolved" } }),
    ]);
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;
    return res.status(200).json({ total, resolved, citizens, critical, resolutionRate });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function getCommunityFeed(req, res) {
  try {
    const { status, type } = req.query;
    const { page, limit, skip } = parsePagination(req.query, { defaultLimit: 20 });
    const filter = { status: { $ne: "Rejected" }, isPublic: { $ne: false } };
    if (status) filter.status = status;
    if (type) filter.type = type;

    const [reports, total] = await Promise.all([
      complaint
        .find(filter)
        .populate("userId", "name")
        .select("-description")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      complaint.countDocuments(filter),
    ]);

    const enriched = reports.map((r) => ({
      _id: r._id,
      type: r.type,
      severity: r.severity,
      status: r.status,
      location: r.location,
      coordinates: r.coordinates,
      createdAt: r.createdAt,
      resolvedAt: r.resolvedAt,
      upvoteCount: r.upvotes?.length || 0,
      reporter: r.isAnonymous ? "Anonymous" : `${(r.userId?.name?.split(" ")[0] || "Citizen")}.`,
    }));

    return res.status(200).json(paginatedResponse(enriched, total, page, limit));
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function getCommunityReport(req, res) {
  try {
    const report = await complaint.findOne({ _id: req.params.id, status: { $ne: "Rejected" } })
      .populate("userId", "name")
      .populate("assignedTo", "name")
      .populate("statusHistory.changedBy", "name");

    if (!report) return res.status(404).json({ message: "Report not found" });

    const userId = req.user?.userid;
    const isOwner = userId && report.userId._id.toString() === userId;
    const isAdmin = req.user?.role === "admin";

    if (report.isPublic === false && !isOwner && !isAdmin) {
      return res.status(404).json({ message: "Report not found" });
    }

    await complaint.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } });

    const hasUpvoted = userId ? report.upvotes?.some((id) => id.toString() === userId) : false;

    const obj = report.toObject();
    if (report.isAnonymous && !isOwner) {
      obj.userId = { name: "Anonymous" };
    }

    return res.status(200).json({
      ...obj,
      upvoteCount: report.upvotes?.length || 0,
      hasUpvoted,
      isOwner,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function getNearbyReports(req, res) {
  try {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
    const radiusKm = parseFloat(req.query.radius) || 2;

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return res.status(400).json({ message: "lat and lng required" });
    }

    const geo = coordsToGeoPoint({ lat, lng });
    const radiusMeters = radiusKm * 1000;
    const baseFilter = { status: { $in: ["Pending", "In Progress"] } };

    let nearby = [];
    if (geo) {
      try {
        nearby = await complaint
          .find({
            ...baseFilter,
            geo: { $near: { $geometry: geo, $maxDistance: radiusMeters } },
          })
          .select("type severity status location coordinates createdAt")
          .limit(20);
      } catch {
        nearby = [];
      }
    }

    if (nearby.length === 0) {
      const all = await complaint
        .find({
          ...baseFilter,
          "coordinates.lat": { $exists: true },
          "coordinates.lng": { $exists: true },
        })
        .select("type severity status location coordinates createdAt")
        .limit(200);

      nearby = all
        .filter((r) => {
          const d = haversineDistance(lat, lng, r.coordinates.lat, r.coordinates.lng);
          return d <= radiusMeters;
        })
        .slice(0, 20);
    }

    return res.status(200).json(nearby);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function getTrends(req, res) {
  try {
    const days = parseInt(req.query.days, 10) || 14;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const match = req.user.role === "admin" ? { createdAt: { $gte: since } } : { userId: req.user.userid, createdAt: { $gte: since } };

    const trends = await complaint.aggregate([
      { $match: match },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    return res.status(200).json(trends);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function toggleUpvote(req, res) {
  try {
    const report = await complaint.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    const userId = req.user.userid;
    const hasUpvoted = report.upvotes?.some((id) => id.toString() === userId);

    if (hasUpvoted) {
      await complaint.findByIdAndUpdate(req.params.id, { $pull: { upvotes: userId } });
    } else {
      await complaint.findByIdAndUpdate(req.params.id, { $addToSet: { upvotes: userId } });
      if (report.userId.toString() !== userId) {
        await createNotification({
          userId: report.userId,
          title: "Someone supported your report",
          message: `Your ${report.type} report received a new upvote`,
          type: "system",
          link: `/complaintdetail/${report._id}`,
        });
      }
    }

    const updated = await complaint.findById(req.params.id);
    return res.status(200).json({
      upvoteCount: updated.upvotes?.length || 0,
      hasUpvoted: !hasUpvoted,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function getMapReports(req, res) {
  try {
    const filter = { "coordinates.lat": { $exists: true }, status: { $ne: "Rejected" } };
    if (req.user.role !== "admin") {
      filter.isPublic = { $ne: false };
    }
    const reports = await complaint
      .find(filter)
      .select("type severity status location coordinates createdAt upvotes")
      .limit(500);
    return res.status(200).json(
      reports.map((r) => ({
        _id: r._id,
        type: r.type,
        severity: r.severity,
        status: r.status,
        location: r.location,
        coordinates: r.coordinates,
        upvoteCount: r.upvotes?.length || 0,
      }))
    );
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function getAdminStaff(req, res) {
  try {
    const staff = await user.find({ role: "admin" }).select("name email");
    return res.status(200).json(staff);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

