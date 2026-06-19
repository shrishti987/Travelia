const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reportSchema = new Schema(
  {
    reporter: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    reportedUser: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },

    listing: {
      type: Schema.Types.ObjectId,
      ref: "Listing"
    },

    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking"
    },

    category: {
      type: String,
      enum: [
        "fake_listing",
        "fraud",
        "spam",
        "inappropriate_content",
        "copyright",
        "host_misconduct",
        "guest_misconduct",
        "payment_issue",
        "safety_issue",
        "other"
      ],
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    evidence: [
      {
        filename: String,
        url: String
      }
    ],

    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium"
    },

    status: {
      type: String,
      enum: [
        "open",
        "under_review",
        "resolved",
        "rejected"
      ],
      default: "open"
    },

    assignedAdmin: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },

    adminRemarks: {
      type: String,
      default: ""
    },

    resolvedAt: Date
  },
  {
    timestamps: true
  }
);

reportSchema.index({ reporter: 1 });
reportSchema.index({ status: 1 });
reportSchema.index({ category: 1 });
reportSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Report", reportSchema);