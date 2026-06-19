const Report = require("../models/report");
const Listing = require("../models/listing");
const User = require("../models/user");

/*
|--------------------------------------------------------------------------
| Create Report
|--------------------------------------------------------------------------
*/

module.exports.createReport = async (req, res) => {
  try {
    const {
      targetType,
      targetId,
      reason,
      description
    } = req.body;

    const report = new Report({
      reporter: req.user._id,
      targetType,
      targetId,
      reason,
      description
    });

    await report.save();

    req.flash("success", "Report submitted successfully.");
    res.redirect("back");

  } catch (err) {
    console.error(err);

    req.flash("error", "Unable to submit report.");
    res.redirect("back");
  }
};

/*
|--------------------------------------------------------------------------
| Get All Reports (Admin)
|--------------------------------------------------------------------------
*/

module.exports.getAllReports = async (req, res) => {
  try {

    const reports = await Report.find({})
      .populate("reporter")
      .sort({ createdAt: -1 });

    res.render("admin/reports/index", {
      reports
    });

  } catch (err) {
    console.error(err);

    req.flash("error", "Unable to fetch reports.");
    res.redirect("/");
  }
};

/*
|--------------------------------------------------------------------------
| Get Single Report
|--------------------------------------------------------------------------
*/

module.exports.getReport = async (req, res) => {
  try {

    const report = await Report.findById(req.params.id)
      .populate("reporter");

    if (!report) {
      req.flash("error", "Report not found.");
      return res.redirect("/admin/reports");
    }

    res.render("admin/reports/show", {
      report
    });

  } catch (err) {
    console.error(err);

    req.flash("error", "Unable to fetch report.");
    res.redirect("/admin/reports");
  }
};

/*
|--------------------------------------------------------------------------
| Resolve Report
|--------------------------------------------------------------------------
*/

module.exports.resolveReport = async (req, res) => {
  try {

    const report = await Report.findById(req.params.id);

    if (!report) {
      req.flash("error", "Report not found.");
      return res.redirect("/admin/reports");
    }

    report.status = "resolved";
    report.resolvedAt = new Date();

    await report.save();

    req.flash("success", "Report resolved successfully.");
    res.redirect("/admin/reports");

  } catch (err) {
    console.error(err);

    req.flash("error", "Unable to resolve report.");
    res.redirect("/admin/reports");
  }
};

/*
|--------------------------------------------------------------------------
| Reject Report
|--------------------------------------------------------------------------
*/

module.exports.rejectReport = async (req, res) => {
  try {

    const report = await Report.findById(req.params.id);

    if (!report) {
      req.flash("error", "Report not found.");
      return res.redirect("/admin/reports");
    }

    report.status = "rejected";
    report.resolvedAt = new Date();

    await report.save();

    req.flash("success", "Report rejected.");
    res.redirect("/admin/reports");

  } catch (err) {
    console.error(err);

    req.flash("error", "Unable to update report.");
    res.redirect("/admin/reports");
  }
};

/*
|--------------------------------------------------------------------------
| Delete Report
|--------------------------------------------------------------------------
*/

module.exports.deleteReport = async (req, res) => {
  try {

    await Report.findByIdAndDelete(req.params.id);

    req.flash("success", "Report deleted.");
    res.redirect("/admin/reports");

  } catch (err) {
    console.error(err);

    req.flash("error", "Unable to delete report.");
    res.redirect("/admin/reports");
  }
};