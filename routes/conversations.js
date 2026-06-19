const express = require("express");
const router = express.Router();

const conversationController = require("../controllers/conversationController");
const { isLoggedIn } = require("../middleware/auth");

/* =========================
   CONVERSATIONS
========================= */

// All User Conversations
router.get(
  "/conversations",
  isLoggedIn,
  conversationController.getUserConversations
);

// Create New Conversation
router.post(
  "/conversations",
  isLoggedIn,
  conversationController.createConversation
);

// Single Conversation Chat
router.get(
  "/conversations/:id",
  isLoggedIn,
  conversationController.getConversation
);

// Delete Conversation
router.delete(
  "/conversations/:id",
  isLoggedIn,
  conversationController.deleteConversation
);

module.exports = router;