const express = require("express");
const router = express.Router();

const notificationController = require("../controllers/notificationController");
const { isLoggedIn } = require("../middleware/auth");

/* =========================
   NOTIFICATIONS
========================= */

// All Notifications
router.get(
  "/notifications",
  isLoggedIn,
  notificationController.getNotifications
);

// Mark Single Notification Read
router.put(
  "/notifications/:id/read",
  isLoggedIn,
  notificationController.markAsRead
);

// Mark All Notifications Read
router.put(
  "/notifications/read-all",
  isLoggedIn,
  notificationController.markAllRead
);

// Delete Notification
router.delete(
  "/notifications/:id",
  isLoggedIn,
  notificationController.deleteNotification
);

// Unread Count API
router.get(
  "/notifications/unread/count",
  isLoggedIn,
  notificationController.getUnreadCount
);

module.exports = router;