const express = require("express");
const router = express.Router();

const messageController = require("../controllers/messageController");
const { isLoggedIn } = require("../middleware/auth");

/* =========================
   MESSAGES
========================= */

// Get all messages of a conversation
router.get(
  "/conversations/:conversationId/messages",
  isLoggedIn,
  messageController.getMessages
);

// Send Message
router.post(
  "/conversations/:conversationId/messages",
  isLoggedIn,
  messageController.sendMessage
);

// Mark Message as Read
router.put(
  "/messages/:messageId/read",
  isLoggedIn,
  messageController.markAsRead
);

// Delete Message
router.delete(
  "/messages/:messageId",
  isLoggedIn,
  messageController.deleteMessage
);

// Unread Messages Count
router.get(
  "/messages/unread/count",
  isLoggedIn,
  messageController.getUnreadCount
);

module.exports = router;