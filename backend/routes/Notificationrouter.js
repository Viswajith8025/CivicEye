import express from "express";
import auth from "../middleware/auth.js";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../controllers/Notificationcontroller.js";

const NotificationRouter = express.Router();

NotificationRouter.get("/", auth, getNotifications);
NotificationRouter.put("/read/:id", auth, markNotificationRead);
NotificationRouter.put("/read-all", auth, markAllNotificationsRead);

export default NotificationRouter;
