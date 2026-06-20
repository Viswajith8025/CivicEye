import Notification from "../model/NotificationSchema.js";
import user from "../model/UserSchema.js";
import { sendEmail } from "./email.js";
import logger from "./logger.js";

export async function createNotification({ userId, title, message, type = "system", link }) {
  try {
    await Notification.create({ userId, title, message, type, link });

    const recipient = await user.findById(userId).select("email name");
    if (recipient?.email) {
      const appUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      const fullLink = link ? `${appUrl}${link}` : appUrl;
      await sendEmail({
        to: recipient.email,
        subject: `[CivicEye] ${title}`,
        text: `${message}\n\nView: ${fullLink}`,
        html: `<p>${message}</p><p><a href="${fullLink}">Open in CivicEye</a></p>`,
      });
    }
  } catch (err) {
    logger.error({ err: err.message, userId }, "Failed to create notification");
  }
}
