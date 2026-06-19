const Message = require("../models/message");
const Conversation = require("../models/conversation");

module.exports.getMessages = async (req, res) => {

  try {

    const conversation =
      await Conversation.findById(
        req.params.conversationId
      );

    if (!conversation) {

      req.flash(
        "error",
        "Conversation not found"
      );

      return res.redirect("/");
    }

    const messages =
      await Message.find({
        conversation:
          req.params.conversationId
      })
      .populate(
        "sender",
        "username"
      )
      .sort({
        createdAt: 1
      });

    res.render(
      "messages/chat",
      {
        conversation,
        messages
      }
    );

  } catch (err) {

    console.log(err);

    req.flash(
      "error",
      "Unable to load messages"
    );

    res.redirect("/");
  }
};

module.exports.sendMessage =
async (req, res) => {

  try {

    const conversation =
      await Conversation.findById(
        req.params.conversationId
      );

    if (!conversation) {

      req.flash(
        "error",
        "Conversation not found"
      );

      return res.redirect("/");
    }

    const message =
      new Message({
        conversation:
          conversation._id,

        sender:
          req.user._id,

        text:
          req.body.text
      });

    await message.save();

    conversation.lastMessage =
      req.body.text;

    conversation.lastMessageAt =
      new Date();

    await conversation.save();

    res.redirect(
      `/conversations/${conversation._id}`
    );

  } catch (err) {

    console.log(err);

    req.flash(
      "error",
      "Unable to send message"
    );

    res.redirect("back");
  }
};

module.exports.markAsRead =
async (req, res) => {

  try {

    await Message.findByIdAndUpdate(
      req.params.messageId,
      {
        isRead: true
      }
    );

    res.json({
      success: true
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false
    });
  }
};

module.exports.deleteMessage =
async (req, res) => {

  try {

    const message =
      await Message.findById(
        req.params.messageId
      );

    if (!message) {

      req.flash(
        "error",
        "Message not found"
      );

      return res.redirect("back");
    }

    if (
      message.sender.toString() !==
      req.user._id.toString()
    ) {

      req.flash(
        "error",
        "Unauthorized"
      );

      return res.redirect("back");
    }

    await Message.findByIdAndDelete(
      req.params.messageId
    );

    req.flash(
      "success",
      "Message deleted"
    );

    res.redirect("back");

  } catch (err) {

    console.log(err);

    req.flash(
      "error",
      "Unable to delete message"
    );

    res.redirect("back");
  }
};

module.exports.getUnreadCount =
async (req, res) => {

  try {

    const count =
      await Message.countDocuments({
        receiver: req.user._id,
        isRead: false
      });

    res.json({
      unread: count
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      unread: 0
    });
  }
};