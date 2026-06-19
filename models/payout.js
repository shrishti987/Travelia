const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const payoutSchema = new Schema(
  {
    host: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    listing: {
      type: Schema.Types.ObjectId,
      ref: "Listing",
      required: true
    },

    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true
    },

    transaction: {
      type: Schema.Types.ObjectId,
      ref: "Transaction"
    },

    grossAmount: {
      type: Number,
      required: true
    },

    platformFee: {
      type: Number,
      default: 0
    },

    taxAmount: {
      type: Number,
      default: 0
    },

    payoutAmount: {
      type: Number,
      required: true
    },

    currency: {
      type: String,
      default: "INR"
    },

    payoutMethod: {
      type: String,
      enum: [
        "bank_transfer",
        "upi",
        "paypal",
        "manual"
      ],
      default: "bank_transfer"
    },

    payoutReference: {
      type: String,
      default: ""
    },

    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "paid",
        "failed",
        "cancelled"
      ],
      default: "pending"
    },

    payoutDate: Date,

    notes: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

payoutSchema.index({ host: 1, createdAt: -1 });
payoutSchema.index({ booking: 1 });
payoutSchema.index({ status: 1 });

module.exports = mongoose.model("Payout", payoutSchema);