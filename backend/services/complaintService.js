import complaint from "../model/ComplaintSchema.js";
import user from "../model/UserSchema.js";
import Category from "../model/CategorySchema.js";
import { ALL_CATEGORIES } from "../constants/categories.js";
import { createNotification } from "../utilies/notifications.js";
import { coordsToGeoPoint } from "../utilies/geo.js";
import { resolveDepartmentForType } from "../services/departmentService.js";

export const VALID_STATUSES = ["Pending", "In Progress", "Resolved", "Rejected"];
export const POINTS_REPORT = 10;
export const POINTS_RESOLVED = 25;

export function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371e3;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

import { ruleBasedSummary, generateReportSummary } from "./aiService.js";

export async function isValidReportType(type) {
  const count = await Category.countDocuments({ name: type, isActive: true });
  if (count > 0) return true;
  return ALL_CATEGORIES.includes(type);
}

export async function checkDuplicate({ type, coordinates, userId }) {
  if (!coordinates?.lat || !coordinates?.lng) return false;
  const geo = coordsToGeoPoint(coordinates);
  if (!geo) return false;

  const since = new Date(Date.now() - 48 * 60 * 60 * 1000);
  try {
    const nearby = await complaint
      .find({
        type,
        createdAt: { $gte: since },
        userId: { $ne: userId },
        geo: { $near: { $geometry: geo, $maxDistance: 150 } },
      })
      .limit(1);
    if (nearby.length > 0) return true;
  } catch {
    // fallback below
  }

  const legacy = await complaint.find({
    type,
    createdAt: { $gte: since },
    "coordinates.lat": { $exists: true },
    "coordinates.lng": { $exists: true },
  });
  return legacy.some(
    (c) =>
      c.userId.toString() !== userId &&
      haversineDistance(coordinates.lat, coordinates.lng, c.coordinates.lat, c.coordinates.lng) < 150
  );
}

export async function awardPoints(userId, amount, reason) {
  const updated = await user.findByIdAndUpdate(userId, { $inc: { points: amount } }, { new: true });
  if (!updated) return;
  const achievements = [...(updated.achievements || [])];
  const unlock = (id, title) => {
    if (!achievements.find((a) => a.id === id)) {
      achievements.push({ id, title, unlockedAt: new Date() });
    }
  };
  if (updated.reports >= 1) unlock("first_report", "First Reporter");
  if (updated.reports >= 5) unlock("active_citizen", "Active Citizen");
  if (updated.reports >= 10) unlock("civic_champion", "Civic Champion");
  if (updated.points >= 100) unlock("century", "Century Club");
  await user.findByIdAndUpdate(userId, { achievements });
  await createNotification({
    userId,
    title: "Points Earned",
    message: `+${amount} points: ${reason}`,
    type: "reward",
  });
}

export async function createComplaintRecord({
  userId,
  description,
  type,
  location,
  severity,
  category,
  coordinates,
  geo,
  proof,
  isDuplicate,
  aiSummary,
  departmentId,
  isAnonymous,
}) {
  return complaint.create({
    userId,
    description,
    type,
    category: category || type,
    severity: severity || "Medium",
    location,
    coordinates,
    geo,
    proof,
    departmentId,
    isAnonymous: Boolean(isAnonymous),
    status: "Pending",
    statusHistory: [
      { status: "Pending", note: "Report submitted", changedBy: userId, at: new Date() },
    ],
    aiSummary,
    isDuplicate,
    createdAt: new Date(),
  });
}

export async function registerComplaintFlow({ userId, body, proofPath }) {
  const { description, type, location, severity, category, lat, lng, isAnonymous } = body;

  if (!description || !type || !location || !proofPath) {
    throw Object.assign(new Error("All fields are required"), { status: 400 });
  }

  if (!(await isValidReportType(type))) {
    throw Object.assign(new Error("Invalid report category"), { status: 400 });
  }

  const coordinates =
    lat && lng ? { lat: parseFloat(lat), lng: parseFloat(lng) } : undefined;
  const geo = coordsToGeoPoint(coordinates);
  const isDuplicate = await checkDuplicate({ type, coordinates, userId });
  const severityLevel = severity || "Medium";
  const aiSummary = ruleBasedSummary(description, type, severityLevel);
  const departmentId = await resolveDepartmentForType(type);
  const anonymous =
    isAnonymous === true || isAnonymous === "true" || isAnonymous === "1";

  const newComplaint = await createComplaintRecord({
    userId,
    description,
    type,
    location,
    severity,
    category,
    coordinates,
    geo,
    proof: proofPath,
    isDuplicate,
    aiSummary,
    departmentId,
    isAnonymous: anonymous,
  });

  generateReportSummary({
    description,
    type,
    severity: severityLevel,
    location,
  })
    .then((summary) => complaint.findByIdAndUpdate(newComplaint._id, { aiSummary: summary }))
    .catch(() => {});

  await user.findByIdAndUpdate(userId, { $inc: { reports: 1 } });
  await awardPoints(userId, POINTS_REPORT, "Report submitted");

  if (isDuplicate) {
    await createNotification({
      userId,
      title: "Possible Duplicate",
      message: "A similar report exists nearby. Your report is still logged.",
      type: "system",
      link: `/complaintdetail/${newComplaint._id}`,
    });
  }

  if (departmentId) {
    await createNotification({
      userId,
      title: "Report routed",
      message: `Your report was routed to the responsible department for ${type}.`,
      type: "system",
      link: `/complaintdetail/${newComplaint._id}`,
    });
  }

  return newComplaint;
}
