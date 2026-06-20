import Notification from "../model/NotificationSchema.js";

export async function getNotifications(req, res) {
  try {
    const notifications = await Notification.find({ userId: req.user.userid })
      .sort({ createdAt: -1 })
      .limit(50);
    const unreadCount = await Notification.countDocuments({
      userId: req.user.userid,
      read: false,
    });
    return res.status(200).json({ notifications, unreadCount });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function markNotificationRead(req, res) {
  try {
    const { id } = req.params;
    await Notification.findOneAndUpdate(
      { _id: id, userId: req.user.userid },
      { read: true }
    );
    return res.status(200).json({ message: "Marked as read" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function markAllNotificationsRead(req, res) {
  try {
    await Notification.updateMany(
      { userId: req.user.userid, read: false },
      { read: true }
    );
    return res.status(200).json({ message: "All marked as read" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}
