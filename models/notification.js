const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    sender: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },

    type: {
      type: String,
      enum: [
        "booking",
        "payment",
        "message",
        "review",
        "wishlist",
        "listing",
        "system",
        "coupon"
      ],
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    message: {
      type: String,
      required: true,
      trim: true
    },

    link: {
      type: String,
      default: ""
    },

    relatedListing: {
      type: Schema.Types.ObjectId,
      ref: "Listing"
    },

    relatedBooking: {
      type: Schema.Types.ObjectId,
      ref: "Booking"
    },

    relatedConversation: {
      type: Schema.Types.ObjectId,
      ref: "Conversation"
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    },

    isRead: {
      type: Boolean,
      default: false
    },

    readAt: Date
  },
  {
    timestamps: true
  }
);

notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model(
  "Notification",
  notificationSchema
);