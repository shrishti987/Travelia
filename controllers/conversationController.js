const Conversation = require("../models/conversation");
const User = require("../models/user");

module.exports.getUserConversations = async (req, res) => {
  try {

    const conversations =
      await Conversation.find({
        participants: req.user._id
      })
      .populate(
        "participants",
        "username email"
      )
      .sort({
        lastMessageAt: -1
      });

    res.render(
      "messages/conversations",
      { conversations }
    );

  } catch (err) {

    console.log(err);

    req.flash(
      "error",
      "Unable to load conversations"
    );

    res.redirect("/");
  }
};

module.exports.createConversation = async (req, res) => {

  try {

    const { receiverId } = req.body;

    if (
      receiverId ===
      req.user._id.toString()
    ) {
      req.flash(
        "error",
        "You cannot message yourself"
      );

      return res.redirect("back");
    }

    let conversation =
      await Conversation.findOne({
        participants: {
          $all: [
            req.user._id,
            receiverId
          ]
        }
      });

    if (!conversation) {

      conversation =
        new Conversation({
          participants: [
            req.user._id,
            receiverId
          ]
        });

      await conversation.save();
    }

    res.redirect(
      `/conversations/${conversation._id}`
    );

  } catch (err) {

    console.log(err);

    req.flash(
      "error",
      "Unable to create conversation"
    );

    res.redirect("back");
  }
};

module.exports.getConversation = async (req, res) => {

  try {

    const conversation =
      await Conversation.findById(
        req.params.id
      )
      .populate(
        "participants",
        "username email"
      );

    if (!conversation) {

      req.flash(
        "error",
        "Conversation not found"
      );

      return res.redirect("/messages");
    }

    const isParticipant =
      conversation.participants.some(
        participant =>
          participant._id.toString() ===
          req.user._id.toString()
      );

    if (!isParticipant) {

      req.flash(
        "error",
        "Unauthorized"
      );

      return res.redirect("/");
    }

    res.render(
      "messages/chat",
      { conversation }
    );

  } catch (err) {

    console.log(err);

    req.flash(
      "error",
      "Unable to load chat"
    );

    res.redirect("/");
  }
};

module.exports.deleteConversation =
async (req, res) => {

  try {

    const conversation =
      await Conversation.findById(
        req.params.id
      );

    if (!conversation) {

      req.flash(
        "error",
        "Conversation not found"
      );

      return res.redirect("/messages");
    }

    const allowed =
      conversation.participants.some(
        participant =>
          participant.toString() ===
          req.user._id.toString()
      );

    if (!allowed) {

      req.flash(
        "error",
        "Unauthorized"
      );

      return res.redirect("/");
    }

    await Conversation.findByIdAndDelete(
      req.params.id
    );

    req.flash(
      "success",
      "Conversation deleted"
    );

    res.redirect("/messages");

  } catch (err) {

    console.log(err);

    req.flash(
      "error",
      "Unable to delete conversation"
    );

    res.redirect("/messages");
  }
};