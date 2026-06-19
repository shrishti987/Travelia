const Notification = require("../models/notification");

module.exports.getNotifications =
async (req, res) => {

  try {

    const notifications =
      await Notification.find({
        user: req.user._id
      })
      .sort({
        createdAt: -1
      });

    res.render(
      "notifications/index",
      { notifications }
    );

  } catch (err) {

    console.log(err);

    req.flash(
      "error",
      "Unable to load notifications"
    );

    res.redirect("/");
  }
};

module.exports.createNotification =
async ({
  userId,
  title,
  message,
  type = "system",
  link = ""
}) => {

  try {

    const notification =
      new Notification({
        user: userId,
        title,
        message,
        type,
        link
      });

    await notification.save();

    return notification;

  } catch (err) {

    console.log(err);
  }
};

module.exports.markAsRead =
async (req, res) => {

  try {

    await Notification.findByIdAndUpdate(
      req.params.id,
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

module.exports.markAllRead =
async (req, res) => {

  try {

    await Notification.updateMany(
      {
        user: req.user._id,
        isRead: false
      },
      {
        isRead: true
      }
    );

    req.flash(
      "success",
      "All notifications marked read"
    );

    res.redirect("/notifications");

  } catch (err) {

    console.log(err);

    req.flash(
      "error",
      "Unable to update notifications"
    );

    res.redirect("/notifications");
  }
};

module.exports.deleteNotification =
async (req, res) => {

  try {

    await Notification.findByIdAndDelete(
      req.params.id
    );

    req.flash(
      "success",
      "Notification deleted"
    );

    res.redirect("/notifications");

  } catch (err) {

    console.log(err);

    req.flash(
      "error",
      "Unable to delete notification"
    );

    res.redirect("/notifications");
  }
};

module.exports.getUnreadCount =
async (req, res) => {

  try {

    const count =
      await Notification.countDocuments({
        user: req.user._id,
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

module.exports.bookingNotification =
async (
  userId,
  listingTitle
) => {

  return await module.exports.createNotification({
    userId,
    title: "Booking Confirmed",
    message:
      `Your booking for ${listingTitle} has been confirmed.`,
    type: "booking"
  });
};

module.exports.paymentNotification =
async (
  userId,
  amount
) => {

  return await module.exports.createNotification({
    userId,
    title: "Payment Successful",
    message:
      `Payment of ₹${amount} completed successfully.`,
    type: "payment"
  });
};

module.exports.messageNotification =
async (
  userId,
  senderName
) => {

  return await module.exports.createNotification({
    userId,
    title: "New Message",
    message:
      `${senderName} sent you a message.`,
    type: "message"
  });
};

module.exports.adminNotification =
async (
  userId,
  message
) => {

  return await module.exports.createNotification({
    userId,
    title: "Admin Alert",
    message,
    type: "admin"
  });
};