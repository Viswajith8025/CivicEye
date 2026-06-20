import bcrypt from "bcryptjs";
import user from "../model/UserSchema.js";
import complaint from "../model/ComplaintSchema.js";
import feedback from "../model/FeedbackSchema.js";
import Notification from "../model/NotificationSchema.js";
import PasswordReset from "../model/PasswordResetSchema.js";
import { sendEmail } from "../utilies/email.js";
import { hashToken, generateResetToken } from "../utilies/authTokens.js";

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    if (!email?.trim()) {
      return res.status(400).json({ message: "Email is required" });
    }

    const userRecord = await user.findOne({ email: email.trim().toLowerCase() });
    if (userRecord && !userRecord.deletestate) {
      const token = generateResetToken();
      await PasswordReset.create({
        userId: userRecord._id,
        tokenHash: hashToken(token),
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      });

      const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      const link = `${baseUrl}/reset-password?token=${token}`;
      await sendEmail({
        to: userRecord.email,
        subject: "Reset your CivicEye password",
        text: `Use this link to reset your password (valid 1 hour): ${link}`,
        html: `<p>Reset your password:</p><p><a href="${link}">${link}</a></p><p>Link expires in 1 hour.</p>`,
      });
    }

    return res.status(200).json({
      message: "If that email is registered, you will receive a reset link shortly.",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function resetPassword(req, res) {
  try {
    const { token, password } = req.body;
    if (!token || !password || password.length < 6) {
      return res.status(400).json({ message: "Valid token and password (6+ chars) required" });
    }

    const record = await PasswordReset.findOne({
      tokenHash: hashToken(token),
      usedAt: { $exists: false },
      expiresAt: { $gt: new Date() },
    });

    if (!record) {
      return res.status(400).json({ message: "Invalid or expired reset link" });
    }

    const salt = parseInt(process.env.SALT, 10) || 10;
    const hashed = await bcrypt.hash(password, salt);
    await user.findByIdAndUpdate(record.userId, { password: hashed });
    record.usedAt = new Date();
    await record.save();

    return res.status(200).json({ message: "Password updated. You can sign in now." });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function exportMyData(req, res) {
  try {
    const userId = req.user.userid;
    const [profile, reports, feedbacks, notifications] = await Promise.all([
      user.findById(userId).select("-password"),
      complaint.find({ userId }).select("-proof"),
      feedback.find({ userId }),
      Notification.find({ userId }).sort({ createdAt: -1 }).limit(100),
    ]);

    const exportPayload = {
      exportedAt: new Date().toISOString(),
      profile,
      reports,
      feedback: feedbacks,
      notifications,
    };

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", 'attachment; filename="civiceye-my-data.json"');
    return res.status(200).send(JSON.stringify(exportPayload, null, 2));
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function requestAccountDeletion(req, res) {
  try {
    const userId = req.user.userid;
    const userRecord = await user.findById(userId);
    if (!userRecord) return res.status(404).json({ message: "User not found" });
    if (userRecord.role === "admin") {
      return res.status(403).json({ message: "Admin accounts cannot self-delete" });
    }

    userRecord.deletestate = true;
    await userRecord.save();

    await createDeletionNotification(userId);

    return res.status(200).json({
      message: "Account deactivation requested. Contact support to restore within 30 days.",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

async function createDeletionNotification(userId) {
  await Notification.create({
    userId,
    title: "Account deactivated",
    message: "Your account has been deactivated per your request.",
    type: "system",
  });
}
