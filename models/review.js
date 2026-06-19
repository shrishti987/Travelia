const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },

  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
    required: true
  },

  verifiedStay: {
    type: Boolean,
    default: false
  },

  helpfulCount: {
    type: Number,
    default: 0
  },

  reportCount: {
    type: Number,
    default: 0
  },

  isHidden: {
    type: Boolean,
    default: false
  },

  hostReply: {
    message: String,
    repliedAt: Date
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
});

/* Indexes */

reviewSchema.index({ listing: 1, createdAt: -1 });
reviewSchema.index({ author: 1 });
reviewSchema.index({ rating: 1 });

module.exports = mongoose.model("Review", reviewSchema);