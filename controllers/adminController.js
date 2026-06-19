const User = require("../models/user");
const Listing = require("../models/listing");
const Booking = require("../models/booking");
const Transaction = require("../models/transaction");
const Report = require("../models/report");
const Payout = require("../models/payout");
const Notification = require("../models/notification");
const AuditLog = require("../models/auditLog");

/* =========================
   ADMIN DASHBOARD
========================= */

module.exports.dashboard = async (req, res) => {
  try {
    const [
      totalUsers,
      totalListings,
      totalBookings,
      totalReports,
      totalRevenue,
      pendingReports,
      recentUsers,
      recentBookings
    ] = await Promise.all([
      User.countDocuments(),
      Listing.countDocuments(),
      Booking.countDocuments(),
      Report.countDocuments(),
      Transaction.aggregate([
        {
          $match: { status: "paid" }
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" }
          }
        }
      ]),
      Report.countDocuments({ status: "open" }),
      User.find({})
        .sort({ createdAt: -1 })
        .limit(5),
      Booking.find({})
        .populate("user")
        .populate("listing")
        .sort({ createdAt: -1 })
        .limit(5)
    ]);

    res.render("admin/dashboard", {
      totalUsers,
      totalListings,
      totalBookings,
      totalReports,
      pendingReports,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentUsers,
      recentBookings
    });
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to load admin dashboard");
    res.redirect("/");
  }
};

/* =========================
   USER MANAGEMENT
========================= */

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .sort({ createdAt: -1 });

    res.render("admin/users", { users });
  } catch (err) {
    console.error(err);
    req.flash("error", "Unable to fetch users");
    res.redirect("/admin");
  }
};

module.exports.userDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .populate("wishlist")
      .populate("viewedListings");

    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/admin/users");
    }

    res.render("admin/userDetails", { user });
  } catch (err) {
    console.error(err);
    req.flash("error", "Unable to fetch user");
    res.redirect("/admin/users");
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await User.findByIdAndDelete(id);

    req.flash("success", "User deleted successfully");
    res.redirect("/admin/users");
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to delete user");
    res.redirect("/admin/users");
  }
};

/* =========================
   LISTING MANAGEMENT
========================= */

module.exports.getListings = async (req, res) => {
  try {
    const listings = await Listing.find({})
      .populate("owner")
      .sort({ createdAt: -1 });

    res.render("admin/listings", { listings });
  } catch (err) {
    console.error(err);
    req.flash("error", "Unable to fetch listings");
    res.redirect("/admin");
  }
};

module.exports.markFraud = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    await Listing.findByIdAndUpdate(id, {
      isFraud: true,
      fraudReason: reason
    });

    req.flash("success", "Listing marked as fraudulent");
    res.redirect("/admin/listings");
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to update listing");
    res.redirect("/admin/listings");
  }
};

module.exports.unmarkFraud = async (req, res) => {
  try {
    const { id } = req.params;

    await Listing.findByIdAndUpdate(id, {
      isFraud: false,
      fraudReason: ""
    });

    req.flash("success", "Fraud flag removed");
    res.redirect("/admin/listings");
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to update listing");
    res.redirect("/admin/listings");
  }
};

module.exports.deleteListing = async (req, res) => {
  try {
    const { id } = req.params;

    await Listing.findByIdAndDelete(id);

    req.flash("success", "Listing deleted");
    res.redirect("/admin/listings");
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to delete listing");
    res.redirect("/admin/listings");
  }
};

/* =========================
   REPORT MANAGEMENT
========================= */

module.exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find({})
      .populate("reporter")
      .populate("reportedUser")
      .populate("listing")
      .sort({ createdAt: -1 });

    res.render("admin/reports", { reports });
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to load reports");
    res.redirect("/admin");
  }
};

module.exports.resolveReport = async (req, res) => {
  try {
    const { id } = req.params;

    await Report.findByIdAndUpdate(id, {
      status: "resolved",
      resolvedAt: new Date()
    });

    req.flash("success", "Report resolved");
    res.redirect("/admin/reports");
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to update report");
    res.redirect("/admin/reports");
  }
};

module.exports.rejectReport = async (req, res) => {
  try {
    const { id } = req.params;

    await Report.findByIdAndUpdate(id, {
      status: "rejected"
    });

    req.flash("success", "Report rejected");
    res.redirect("/admin/reports");
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to update report");
    res.redirect("/admin/reports");
  }
};

/* =========================
   PAYOUT MANAGEMENT
========================= */

module.exports.getPayouts = async (req, res) => {
  try {
    const payouts = await Payout.find({})
      .populate("host")
      .populate("listing")
      .populate("booking")
      .sort({ createdAt: -1 });

    res.render("admin/payouts", { payouts });
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to fetch payouts");
    res.redirect("/admin");
  }
};

module.exports.markPayoutPaid = async (req, res) => {
  try {
    const { id } = req.params;

    await Payout.findByIdAndUpdate(id, {
      status: "paid",
      payoutDate: new Date()
    });

    req.flash("success", "Payout marked as paid");
    res.redirect("/admin/payouts");
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to update payout");
    res.redirect("/admin/payouts");
  }
};

/* =========================
   NOTIFICATIONS
========================= */

module.exports.sendNotification = async (req, res) => {
  try {
    const { recipient, title, message } = req.body;

    await Notification.create({
      recipient,
      title,
      message,
      type: "system"
    });

    req.flash("success", "Notification sent");
    res.redirect("/admin");
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to send notification");
    res.redirect("/admin");
  }
};

/* =========================
   AUDIT LOGS
========================= */

module.exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find({})
      .populate("user")
      .sort({ createdAt: -1 })
      .limit(500);

    res.render("admin/auditLogs", { logs });
  } catch (err) {
    console.error(err);
    req.flash("error", "Unable to fetch audit logs");
    res.redirect("/admin");
  }
};